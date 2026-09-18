import React, { useState } from 'react';
import type { WalletState, AuctionItem } from '../types/auction';

interface DeployModalProps {
  wallet: WalletState;
  onClose: () => void;
  onDeploySuccess: (newAuction: AuctionItem) => void;
  deployVeilBid: (nftTokenId: string, reservePrice: bigint, royaltyBps: number) => Promise<{ contractAddress: string; txHash: string }>;
  networkName: string;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  wallet,
  onClose,
  onDeploySuccess,
  deployVeilBid,
  networkName,
}) => {
  const [nftTitle, setNftTitle] = useState('');
  const [reservePrice, setReservePrice] = useState('0.10');
  const [royaltyBps, setRoyaltyBps] = useState('500');
  const [isDeploying, setIsDeploying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deployResult, setDeployResult] = useState<{ address: string; tx: string } | null>(null);

  const handleDeploy = async () => {
    if (!wallet.isConnected) {
      setErrorMsg('Please connect your 1AM wallet first.');
      return;
    }
    if (!nftTitle.trim()) {
      setErrorMsg('Please provide an NFT title or token identifier.');
      return;
    }

    setIsDeploying(true);
    setErrorMsg(null);

    try {
      const minPriceBigInt = BigInt(Math.floor(Number(reservePrice || 0.1) * 1_000_000));
      const bps = Number(royaltyBps) || 500;

      const res = await deployVeilBid(nftTitle, minPriceBigInt, bps);
      setDeployResult({ address: res.contractAddress, tx: res.txHash });

      const newAuction: AuctionItem = {
        id: `deploy-${Date.now()}`,
        contractAddress: res.contractAddress,
        title: nftTitle,
        author: wallet.unshieldedAddress ? `${wallet.unshieldedAddress.slice(0, 6)}...` : 'You',
        creatorKey: wallet.unshieldedAddress || 'creator_key',
        sellerKey: wallet.unshieldedAddress || 'seller_key',
        floor: `${reservePrice} tNIGHT`,
        volume: '0 tNIGHT',
        img: '/veilbid-logo.png',
        category: 'Art',
        reservePrice: minPriceBigInt,
        royaltyBps: bps,
        bidCount: 0,
        state: 'OPEN',
        endTime: Date.now() + 24 * 60 * 60 * 1000,
      };

      onDeploySuccess(newAuction);
    } catch (err: unknown) {
      const e = err as Error;
      setErrorMsg(e.message || 'Auction deployment failed.');
    } finally {
      setIsDeploying(false);
    }
  };

  const explorerBase = networkName === 'preview'
    ? 'https://preview.midnightexplorer.com'
    : 'https://preprod.midnightexplorer.com';

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
        maxWidth: '480px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>➕ Deploy Sealed Auction</h2>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
              Deploy a new Compact ZK smart contract on Midnight {networkName}
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

        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            border: '1px solid #f87171'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {deployResult ? (
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
              <div style={{ fontWeight: 800, fontSize: '15px' }}>Contract Deployed to Midnight!</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Your sealed-bid auction contract is now live and accepting encrypted bids.
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
              <div>
                <strong>Contract Address:</strong><br />
                <a
                  href={`${explorerBase}/contracts/${deployResult.address.startsWith('0x') ? deployResult.address : '0x' + deployResult.address}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#5B5BD6', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}
                >
                  {deployResult.address} ↗
                </a>
              </div>
              <div>
                <strong>Deploy TX:</strong><br />
                <a
                  href={`${explorerBase}/transactions/${deployResult.tx}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#5B5BD6', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}
                >
                  {deployResult.tx} ↗
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                background: '#C1F04C',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '4px 4px 0 #0a0a0a'
              }}
            >
              Done & View in Marketplace
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                NFT Title / Token Identifier
              </label>
              <input
                type="text"
                placeholder="e.g. Midnight Genesis #042"
                value={nftTitle}
                onChange={(e) => setNftTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '2px solid #0a0a0a',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  Reserve Price (tNIGHT)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={reservePrice}
                  onChange={(e) => setReservePrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '2px solid #0a0a0a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  Royalty % (BPS)
                </label>
                <select
                  value={royaltyBps}
                  onChange={(e) => setRoyaltyBps(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '2px solid #0a0a0a',
                    boxSizing: 'border-box',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <option value="250">2.5% (250 BPS)</option>
                  <option value="500">5.0% (500 BPS)</option>
                  <option value="750">7.5% (750 BPS)</option>
                  <option value="1000">10.0% (1000 BPS)</option>
                </select>
              </div>
            </div>

            <div style={{
              background: '#F6F3EC',
              border: '1.5px solid #0a0a0a',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '11px',
              color: '#555',
              lineHeight: 1.5
            }}>
              💡 <strong>Zero-Knowledge Architecture:</strong> Deploying creates an on-chain ledger with a private commitment tree. All future bids will be submitted as cryptographic hashes and verified on reveal.
            </div>

            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              style={{
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                background: '#C1F04C',
                color: '#0a0a0a',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                cursor: isDeploying ? 'not-allowed' : 'pointer',
                boxShadow: '4px 4px 0 #0a0a0a'
              }}
            >
              {isDeploying ? '⏳ Compiling & Deploying on Midnight...' : '🚀 Deploy Auction Contract'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
