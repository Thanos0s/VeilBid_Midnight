import React, { useState, useEffect } from 'react';
import type { AuctionItem, BidReceipt, WalletState } from '../types/auction';

interface BidModalProps {
  auction: AuctionItem | null;
  wallet: WalletState;
  networkName?: string;
  onClose: () => void;
  onBidSubmitted?: (receipt: BidReceipt) => void;
  submitBidToNetwork?: (contractAddress: string, commitmentBytes: Uint8Array) => Promise<{ txHash: string; blockHeight?: number }>;
  revealBidToNetwork?: (contractAddress: string, secretKeyBytes: Uint8Array, saltBytes: Uint8Array, amountBigInt: bigint) => Promise<{ txHash: string; blockHeight?: number }>;
  closeAuctionOnNetwork?: (contractAddress: string, sellerSkBytes: Uint8Array) => Promise<{ txHash: string; blockHeight?: number }>;
  deployVeilBid?: (nftTokenId: string, reservePrice: bigint, royaltyBps: number) => Promise<{ contractAddress: string; txHash: string }>;
  onAuctionDeployed?: (updatedAuction: AuctionItem) => void;
}

export const BidModal: React.FC<BidModalProps> = ({
  auction,
  wallet,
  networkName = 'preprod',
  onClose,
  onBidSubmitted,
  submitBidToNetwork,
  revealBidToNetwork,
  deployVeilBid,
  onAuctionDeployed,
}) => {
  const [tab, setTab] = useState<'commit' | 'reveal'>('commit');
  const [contractAddress, setContractAddress] = useState<string>(() => {
    if (auction?.contractAddress && auction.contractAddress !== '42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3') {
      return auction.contractAddress;
    }
    const globalStored = typeof window !== 'undefined' ? localStorage.getItem(`veilbid_contract_address_${networkName}`) : null;
    if (globalStored && globalStored !== '42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3') {
      return globalStored;
    }
    return '';
  });
  const [isDeployingContract, setIsDeployingContract] = useState(false);
  const [deploySuccessTx, setDeploySuccessTx] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [saltHex, setSaltHex] = useState('');
  const [secretKeyHex, setSecretKeyHex] = useState('');
  const [commitmentHex, setCommitmentHex] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStep, setSubmittingStep] = useState<string>('');
  const [successReceipt, setSuccessReceipt] = useState<BidReceipt | null>(null);
  const [revealSuccessTx, setRevealSuccessTx] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (auction?.contractAddress && auction.contractAddress !== '42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3') {
      setContractAddress(auction.contractAddress);
    } else {
      const globalStored = typeof window !== 'undefined' ? localStorage.getItem(`veilbid_contract_address_${networkName}`) : null;
      if (globalStored && globalStored !== '42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3') {
        setContractAddress(globalStored);
      } else {
        setContractAddress('');
      }
    }
  }, [auction, networkName]);

  // Auto-generate fresh cryptographic salt & secret key on modal open
  useEffect(() => {
    if (!saltHex) {
      const salt = new Uint8Array(32);
      crypto.getRandomValues(salt);
      setSaltHex(Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join(''));
    }
    if (!secretKeyHex) {
      const sk = new Uint8Array(32);
      crypto.getRandomValues(sk);
      setSecretKeyHex(Array.from(sk).map((b) => b.toString(16).padStart(2, '0')).join(''));
    }
  }, [saltHex, secretKeyHex]);

  // Compute cryptographic commitment whenever amount, salt, or sk change
  useEffect(() => {
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0 || !saltHex || !secretKeyHex) {
      setCommitmentHex('');
      return;
    }

    const computeCommitment = async () => {
      try {
        const saltBytes = new Uint8Array(32);
        const skBytes = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
          saltBytes[i] = parseInt(saltHex.substring(i * 2, i * 2 + 2), 16) || 0;
          skBytes[i] = parseInt(secretKeyHex.substring(i * 2, i * 2 + 2), 16) || 0;
        }

        // Pack [pk (32 bytes) || salt (32 bytes) || amount (8 bytes big-endian)]
        const amountBigInt = BigInt(Math.floor(Number(bidAmount) * 1_000_000));
        let hashHex = '';
        try {
          const { pureCircuits } = await import('../../public/managed/contract/index.js');
          const pk = pureCircuits.agentPublicKey(skBytes);
          const buffer = new Uint8Array(32 + 32 + 8);
          buffer.set(pk, 0);
          buffer.set(saltBytes, 32);
          const view = new DataView(buffer.buffer);
          view.setBigUint64(64, amountBigInt, false);
          const digest = await crypto.subtle.digest('SHA-256', buffer);
          hashHex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch {
          const buffer = new Uint8Array(32 + 32 + 8);
          buffer.set(skBytes, 0);
          buffer.set(saltBytes, 32);
          const view = new DataView(buffer.buffer);
          view.setBigUint64(64, amountBigInt, false);
          const digest = await crypto.subtle.digest('SHA-256', buffer);
          hashHex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        setCommitmentHex(hashHex);
      } catch (err) {
        console.error('Commitment computation error:', err);
      }
    };

    computeCommitment();
  }, [bidAmount, saltHex, secretKeyHex]);

  // Reveal fields
  const [revealSecretKey, setRevealSecretKey] = useState('');
  const [revealSalt, setRevealSalt] = useState('');
  const [revealAmount, setRevealAmount] = useState('');

  // Auto-populate reveal fields if receipt exists for this auction
  useEffect(() => {
    if (!auction) return;
    try {
      const receipts: BidReceipt[] = JSON.parse(localStorage.getItem('veilbid_receipts') || '[]');
      const match = receipts.find(r => r.auctionId === auction.id || r.contractAddress === auction.contractAddress);
      if (match) {
        setRevealSecretKey(match.secretKeyHex);
        setRevealSalt(match.saltHex);
        setRevealAmount(match.amount);
      }
    } catch {
      // Ignore
    }
  }, [auction]);

  if (!auction) return null;

  const explorerBase = networkName === 'preview'
    ? 'https://preview.midnightexplorer.com'
    : 'https://preprod.midnightexplorer.com';

  const handleDeployAuction = async () => {
    if (!wallet.isConnected) {
      setErrorMsg('Please connect your 1AM wallet first.');
      return;
    }
    if (!deployVeilBid) {
      setErrorMsg('Deploy functionality is not available. Please verify your wallet connection.');
      return;
    }
    setIsDeployingContract(true);
    setErrorMsg(null);
    try {
      const res = await deployVeilBid(auction.title, auction.reservePrice, auction.royaltyBps);
      setContractAddress(res.contractAddress);
      setDeploySuccessTx(res.txHash);
      if (onAuctionDeployed) {
        onAuctionDeployed({
          ...auction,
          contractAddress: res.contractAddress,
        });
      }
    } catch (err: unknown) {
      const e = err as Error;
      console.error('[VeilBid Deploy Error]', e);
      setErrorMsg(e.message || 'Failed to deploy contract to Midnight Preprod.');
    } finally {
      setIsDeployingContract(false);
    }
  };

  const handleCommitBid = async () => {
    if (!wallet.isConnected) {
      setErrorMsg('Please connect your 1AM wallet first.');
      return;
    }
    if (!contractAddress) {
      setErrorMsg('Please deploy this auction on Midnight Preprod first using the button above.');
      return;
    }
    if (!bidAmount || Number(bidAmount) <= 0) {
      setErrorMsg('Please enter a valid bid amount.');
      return;
    }
    if (!commitmentHex) {
      setErrorMsg('Commitment calculation in progress. Please wait a moment.');
      return;
    }
    if (!submitBidToNetwork) {
      setErrorMsg('On-chain network submission is not available. Please verify your wallet connection.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSubmittingStep('Requesting 1AM Wallet signature & submitting on Midnight Preprod...');

    try {
      const commitmentBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        commitmentBytes[i] = parseInt(commitmentHex.substring(i * 2, i * 2 + 2), 16) || 0;
      }

      const res = await submitBidToNetwork(contractAddress, commitmentBytes);

      const receipt: BidReceipt = {
        auctionId: auction.id,
        contractAddress: contractAddress,
        amount: bidAmount,
        amountBigInt: BigInt(Math.floor(Number(bidAmount) * 1_000_000)).toString(),
        saltHex,
        commitmentHex,
        secretKeyHex,
        timestamp: Date.now(),
        status: 'COMMITTED',
        txHash: res.txHash,
      };

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem('veilbid_receipts') || '[]');
      existing.unshift(receipt);
      localStorage.setItem('veilbid_receipts', JSON.stringify(existing));

      setSuccessReceipt(receipt);
      if (onBidSubmitted) onBidSubmitted(receipt);
    } catch (err: unknown) {
      const e = err as Error;
      console.error('[VeilBid On-Chain Error]', e);
      setErrorMsg(e.message || 'On-chain transaction failed on Midnight Preprod network.');
    } finally {
      setIsSubmitting(false);
      setSubmittingStep('');
    }
  };

  const handleRevealBid = async () => {
    if (!wallet.isConnected) {
      setErrorMsg('Please connect your 1AM wallet first.');
      return;
    }
    if (!contractAddress) {
      setErrorMsg('Please deploy this auction on Midnight Preprod first using the button above.');
      return;
    }
    if (!revealBidToNetwork) {
      setErrorMsg('On-chain reveal is not available. Please verify your wallet connection.');
      return;
    }
    if (!revealSecretKey || !revealSalt || !revealAmount) {
      setErrorMsg('Please provide your secret key, salt, and bid amount to reveal.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSubmittingStep('Generating ZK proof & submitting reveal transaction to Midnight Preprod...');

    try {
      const skBytes = new Uint8Array(32);
      const saltBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        skBytes[i] = parseInt(revealSecretKey.substring(i * 2, i * 2 + 2), 16) || 0;
        saltBytes[i] = parseInt(revealSalt.substring(i * 2, i * 2 + 2), 16) || 0;
      }
      const amountBigInt = BigInt(Math.floor(Number(revealAmount) * 1_000_000));

      const res = await revealBidToNetwork(contractAddress, skBytes, saltBytes, amountBigInt);
      setRevealSuccessTx(res.txHash);
    } catch (err: unknown) {
      const e = err as Error;
      console.error('[VeilBid Reveal Error]', e);
      setErrorMsg(e.message || 'On-chain reveal transaction failed on Midnight.');
    } finally {
      setIsSubmitting(false);
      setSubmittingStep('');
    }
  };

  const downloadReceipt = () => {
    if (!successReceipt) return;
    const blob = new Blob([JSON.stringify(successReceipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veilbid_receipt_${auction.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const numericAmount = Number(bidAmount) || 0;
  const royaltyAmount = (numericAmount * (auction.royaltyBps / 10000)).toFixed(4);
  const netSellerAmount = (numericAmount - Number(royaltyAmount)).toFixed(4);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10,10,10,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: '#fff',
        border: '3px solid #0a0a0a',
        borderRadius: '16px',
        boxShadow: '8px 8px 0 #0a0a0a',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>
              {tab === 'commit' ? '🔒 Place Sealed Bid on Midnight' : '🏆 Settle & Reveal Bid'}
            </h2>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
              Auction: {auction.title} ({auction.floor})
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1.5px solid #0a0a0a',
              borderRadius: '8px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontWeight: 800
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1.5px solid #eee', paddingBottom: '12px' }}>
          <button
            onClick={() => { setTab('commit'); setErrorMsg(null); }}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 800,
              borderRadius: '6px',
              border: '1.5px solid #0a0a0a',
              background: tab === 'commit' ? '#0a0a0a' : '#fff',
              color: tab === 'commit' ? '#fff' : '#0a0a0a',
              cursor: 'pointer'
            }}
          >
            Phase 1: Sealed Commitment
          </button>
          <button
            onClick={() => { setTab('reveal'); setErrorMsg(null); }}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 800,
              borderRadius: '6px',
              border: '1.5px solid #0a0a0a',
              background: tab === 'reveal' ? '#0a0a0a' : '#fff',
              color: tab === 'reveal' ? '#fff' : '#0a0a0a',
              cursor: 'pointer'
            }}
          >
            Phase 2: Settlement Reveal
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            border: '1px solid #f87171',
            wordBreak: 'break-word'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Contract Status & 1-Click Deployment Banner */}
        {!contractAddress ? (
          <div style={{
            background: '#fffbeb',
            border: '2px solid #f59e0b',
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#92400e' }}>
                  Deploy Contract on Midnight Preprod
                </div>
                <div style={{ fontSize: '11px', color: '#b45309' }}>
                  This auction requires an on-chain Compact contract instance to record your sealed bids.
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#78350f', lineHeight: 1.4 }}>
              Reserve Price: <strong>{auction.floor}</strong> • Royalty: <strong>{auction.royaltyBps / 100}%</strong> • Midnight {networkName}
            </div>

            <button
              onClick={handleDeployAuction}
              disabled={isDeployingContract || !wallet.isConnected}
              style={{
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 800,
                background: '#f59e0b',
                color: '#fff',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                cursor: isDeployingContract || !wallet.isConnected ? 'not-allowed' : 'pointer',
                boxShadow: '3px 3px 0 #0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isDeployingContract ? (
                '⏳ Confirming Deploy in 1AM Wallet...'
              ) : !wallet.isConnected ? (
                '🔑 Connect 1AM Wallet to Deploy'
              ) : (
                '🚀 Deploy Auction Contract to Midnight (1-Click)'
              )}
            </button>
          </div>
        ) : (
          <div style={{
            background: '#f0fdf4',
            border: '1.5px solid #86efac',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '11px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#166534', fontWeight: 700 }}>
              ● On-Chain Contract: <code style={{ fontFamily: 'var(--font-mono)' }}>{contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}</code>
            </span>
            <a
              href={`${explorerBase}/contracts/${contractAddress.startsWith('0x') ? contractAddress : '0x' + contractAddress}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#15803d', fontWeight: 800, textDecoration: 'none' }}
            >
              Explorer ↗
            </a>
          </div>
        )}

        {deploySuccessTx && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '11px',
            color: '#065f46'
          }}>
            ✅ Contract successfully deployed on Midnight Preprod!
            <br />
            <a
              href={`${explorerBase}/transactions/${deploySuccessTx}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#059669', fontWeight: 700, wordBreak: 'break-all' }}
            >
              TX: {deploySuccessTx} ↗
            </a>
          </div>
        )}

        {/* Reveal Success Screen */}
        {revealSuccessTx && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              background: '#dcfce7',
              color: '#15803d',
              padding: '14px',
              borderRadius: '8px',
              border: '1.5px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎉</div>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>Bid Revealed On-Chain!</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Your ZK reveal was verified on Midnight Preprod network.
              </div>
            </div>

            <div style={{
              background: '#F6F3EC',
              border: '1.5px solid #0a0a0a',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px'
            }}>
              <div><strong>Reveal TX Hash:</strong></div>
              <a
                href={`${explorerBase}/transactions/${revealSuccessTx}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#5B5BD6', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}
              >
                {revealSuccessTx} ↗
              </a>
            </div>

            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 800,
                background: '#C1F04C',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '3px 3px 0 #0a0a0a'
              }}
            >
              Done
            </button>
          </div>
        )}

        {/* Commit Success Screen */}
        {successReceipt && !revealSuccessTx ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              background: '#dcfce7',
              color: '#15803d',
              padding: '14px',
              borderRadius: '8px',
              border: '1.5px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎉</div>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>Sealed Bid Submitted On-Chain!</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Your bid commitment was verified and registered on Midnight Preprod.
              </div>
            </div>

            <div style={{
              background: '#F6F3EC',
              border: '1.5px solid #0a0a0a',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div><strong>Amount:</strong> {successReceipt.amount} tNIGHT</div>
              <div><strong>Commitment Hash:</strong> <code style={{ wordBreak: 'break-all' }}>{successReceipt.commitmentHex}</code></div>
              <div><strong>Salt (Keep Secret):</strong> <code style={{ wordBreak: 'break-all' }}>{successReceipt.saltHex}</code></div>
              {successReceipt.txHash && (
                <div>
                  <strong>Midnight TX Hash:</strong><br />
                  <a
                    href={`${explorerBase}/transactions/${successReceipt.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#5B5BD6', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}
                  >
                    {successReceipt.txHash} ↗
                  </a>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={downloadReceipt}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 800,
                  background: '#fff',
                  border: '2px solid #0a0a0a',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0 #0a0a0a'
                }}
              >
                📥 Download Backup Receipt (.json)
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 800,
                  background: '#C1F04C',
                  border: '2px solid #0a0a0a',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0 #0a0a0a'
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : !revealSuccessTx && tab === 'commit' ? (
          /* Commit Form */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
              Enter your bid amount. VeilBid computes a 256-bit cryptographic commitment locally. When you submit, your 1AM wallet signs and registers the commitment on the Midnight blockchain.
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                Bid Amount (tNIGHT)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 0.50"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '15px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: '2px solid #0a0a0a',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Cryptographic Preview */}
            <div style={{
              background: '#F6F3EC',
              border: '1.5px solid #0a0a0a',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '11px'
            }}>
              <div><strong>Generated 256-bit Salt:</strong></div>
              <div style={{ fontFamily: 'var(--font-mono)', wordBreak: 'break-all', color: '#555' }}>
                {saltHex || 'Generating...'}
              </div>
              <div><strong>ZK Commitment Hash (Submitted to Midnight):</strong></div>
              <div style={{ fontFamily: 'var(--font-mono)', wordBreak: 'break-all', color: '#5B5BD6' }}>
                {commitmentHex || 'Enter amount to compute...'}
              </div>
            </div>

            {/* Royalty Breakdown */}
            {numericAmount > 0 && (
              <div style={{
                background: '#fafafa',
                border: '1px dashed #bbb',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '11px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Royalty to Creator ({auction.royaltyBps / 100}%): <strong>{royaltyAmount} tNIGHT</strong></span>
                <span>Net to Seller: <strong>{netSellerAmount} tNIGHT</strong></span>
              </div>
            )}

            <button
              onClick={handleCommitBid}
              disabled={isSubmitting || !bidAmount || !contractAddress}
              style={{
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                background: !contractAddress ? '#e5e7eb' : '#C1F04C',
                color: '#0a0a0a',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                cursor: (isSubmitting || !contractAddress) ? 'not-allowed' : 'pointer',
                boxShadow: !contractAddress ? 'none' : '4px 4px 0 #0a0a0a'
              }}
            >
              {!contractAddress
                ? '⚠️ Deploy Contract Above First'
                : isSubmitting
                ? (submittingStep || '⏳ Submitting to Midnight...')
                : '🔒 Submit Sealed Bid on Midnight'}
            </button>
          </div>
        ) : !revealSuccessTx ? (
          /* Reveal Form */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
              To settle the auction, provide your private bid credentials. The ZK circuit verifies that your reveal matches your on-chain commitment and meets the reserve price.
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Secret Key (Hex)
              </label>
              <input
                type="text"
                placeholder="32-byte secret key"
                value={revealSecretKey}
                onChange={(e) => setRevealSecretKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  borderRadius: '6px',
                  border: '1.5px solid #0a0a0a',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Salt Nonce (Hex)
              </label>
              <input
                type="text"
                placeholder="32-byte salt"
                value={revealSalt}
                onChange={(e) => setRevealSalt(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  borderRadius: '6px',
                  border: '1.5px solid #0a0a0a',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Revealed Bid Amount (tNIGHT)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 0.50"
                value={revealAmount}
                onChange={(e) => setRevealAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: '1.5px solid #0a0a0a',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{
              background: '#F6F3EC',
              border: '1.5px solid #0a0a0a',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px'
            }}>
              <div><strong>Reserve Price:</strong> {auction.floor}</div>
              <div><strong>Contract:</strong> {contractAddress ? `${contractAddress.slice(0, 10)}...` : 'Not Deployed'}</div>
            </div>

            <button
              onClick={handleRevealBid}
              disabled={isSubmitting || !revealSecretKey || !revealSalt || !revealAmount || !contractAddress}
              style={{
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                background: !contractAddress ? '#e5e7eb' : '#fff',
                color: '#0a0a0a',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                cursor: (isSubmitting || !contractAddress) ? 'not-allowed' : 'pointer',
                boxShadow: !contractAddress ? 'none' : '4px 4px 0 #0a0a0a'
              }}
            >
              {!contractAddress
                ? '⚠️ Deploy Contract Above to Enable Reveal'
                : isSubmitting
                ? (submittingStep || '⏳ Submitting Reveal to Midnight...')
                : '🏆 Submit Reveal Transaction on Midnight'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
