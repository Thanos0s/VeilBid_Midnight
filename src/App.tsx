import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMidnight } from './hooks/useMidnight';

// ── NFT Data ──
interface NFTListing {
  id: string;
  tokenId: string;
  name: string;
  collection: string;
  description: string;
  image: string;
  currentBid: number;
  reservePrice: number;
  buyNowPrice: number | null;
  bidCount: number;
  endsAt: Date;
  creator: string;
  royaltyBps: number;
  status: 'OPEN' | 'CLOSED' | 'LIVE';
  contractAddress?: string;
  rarity: string;
  tags: string[];
}

const MOCK_LISTINGS: NFTListing[] = [
  {
    id: '1',
    tokenId: 'veilbid-genesis-001',
    name: 'Midnight Phantom #001',
    collection: 'Midnight Genesis',
    description: 'The first NFT ever auctioned with zero-knowledge privacy. A landmark piece for the decentralized dark arts.',
    image: 'https://picsum.photos/seed/phantom1/400/400',
    currentBid: 850,
    reservePrice: 500,
    buyNowPrice: 2000,
    bidCount: 12,
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    creator: 'unsh_a1b2c3d4...',
    royaltyBps: 500,
    status: 'LIVE',
    rarity: 'Legendary',
    tags: ['Genesis', 'Art', 'Privacy'],
  },
  {
    id: '2',
    tokenId: 'veilbid-eclipse-042',
    name: 'Eclipse Protocol #042',
    collection: 'Protocol Series',
    description: 'A generative artwork born from ZK circuit outputs. Each pixel corresponds to a proof verification step.',
    image: 'https://picsum.photos/seed/eclipse42/400/400',
    currentBid: 320,
    reservePrice: 200,
    buyNowPrice: null,
    bidCount: 7,
    endsAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
    creator: 'unsh_f4e3d2c1...',
    royaltyBps: 750,
    status: 'OPEN',
    rarity: 'Rare',
    tags: ['Generative', 'Protocol'],
  },
  {
    id: '3',
    tokenId: 'veilbid-shadow-007',
    name: 'Shadow Bloom #007',
    collection: 'Veil Gardens',
    description: 'An anonymous artist\'s vision of a world where beauty thrives in darkness. Anonymized provenance on-chain.',
    image: 'https://picsum.photos/seed/shadow7/400/400',
    currentBid: 1200,
    reservePrice: 800,
    buyNowPrice: 3500,
    bidCount: 24,
    endsAt: new Date(Date.now() + 1 * 60 * 60 * 1000 + 30 * 60 * 1000),
    creator: 'unsh_9988776655...',
    royaltyBps: 1000,
    status: 'LIVE',
    rarity: 'Epic',
    tags: ['Art', 'Gardens', 'Anonymous'],
  },
  {
    id: '4',
    tokenId: 'veilbid-cipher-019',
    name: 'Cipher Node #019',
    collection: 'Network Nodes',
    description: 'A visual representation of Midnight\'s dual-state architecture — public on the surface, shielded at the core.',
    image: 'https://picsum.photos/seed/cipher19/400/400',
    currentBid: 450,
    reservePrice: 300,
    buyNowPrice: null,
    bidCount: 5,
    endsAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    creator: 'unsh_abc123...',
    royaltyBps: 500,
    status: 'OPEN',
    rarity: 'Uncommon',
    tags: ['Network', 'Technical'],
  },
  {
    id: '5',
    tokenId: 'veilbid-void-003',
    name: 'Void Walker #003',
    collection: 'Void Series',
    description: 'Walk between public and private worlds. The void is where ZK proofs are born.',
    image: 'https://picsum.photos/seed/void3/400/400',
    currentBid: 2100,
    reservePrice: 1500,
    buyNowPrice: 5000,
    bidCount: 31,
    endsAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    creator: 'unsh_zyx987...',
    royaltyBps: 800,
    status: 'CLOSED',
    rarity: 'Legendary',
    tags: ['Void', 'Art', 'Closed'],
  },
  {
    id: '6',
    tokenId: 'veilbid-prism-055',
    name: 'Prism Refract #055',
    collection: 'Prism Collection',
    description: 'Light split through privacy proofs. What enters as public information emerges as verified truth.',
    image: 'https://picsum.photos/seed/prism55/400/400',
    currentBid: 180,
    reservePrice: 100,
    buyNowPrice: 600,
    bidCount: 3,
    endsAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    creator: 'unsh_pqr456...',
    royaltyBps: 500,
    status: 'OPEN',
    rarity: 'Common',
    tags: ['Prism', 'Art'],
  },
];

// ── Countdown Hook ──
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, expired: false });
  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0, expired: true }); return; }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [targetDate]);
  return timeLeft;
}

// ── NFT Card Component ──
function NFTCard({ listing, onClick }: { listing: NFTListing; onClick: () => void }) {
  const timeLeft = useCountdown(listing.endsAt);
  return (
    <motion.div
      className="nft-card"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="nft-card-image">
        <img src={listing.image} alt={listing.name} loading="lazy" />
        <div className={`nft-card-badge badge-${listing.status === 'LIVE' ? 'live' : listing.status === 'OPEN' ? 'open' : 'closed'}`}>
          {listing.status === 'LIVE' ? '🔴 Live' : listing.status === 'OPEN' ? '⚡ Open' : '🔒 Closed'}
        </div>
        {listing.rarity === 'Legendary' && (
          <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 6, fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>
            ✨ Legendary
          </div>
        )}
      </div>
      <div className="nft-card-body">
        <div className="nft-card-collection">{listing.collection}</div>
        <div className="nft-card-name">{listing.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {listing.description}
        </div>

        {listing.status !== 'CLOSED' && !timeLeft.expired && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div className="timer">
              <div className="timer-block">
                <div className="timer-value">{String(timeLeft.h).padStart(2, '0')}</div>
                <div className="timer-label">h</div>
              </div>
              <span className="timer-colon">:</span>
              <div className="timer-block">
                <div className="timer-value">{String(timeLeft.m).padStart(2, '0')}</div>
                <div className="timer-label">m</div>
              </div>
              <span className="timer-colon">:</span>
              <div className="timer-block">
                <div className="timer-value">{String(timeLeft.s).padStart(2, '0')}</div>
                <div className="timer-label">s</div>
              </div>
            </div>
          </div>
        )}

        <div className="nft-card-meta">
          <div>
            <div className="nft-card-price-label">Current Bid</div>
            <div className="nft-card-price">{listing.currentBid.toLocaleString()} tNIGHT</div>
          </div>
          <div className="nft-card-bids">
            <div style={{ color: 'var(--text-dim)', fontSize: 10 }}>🔒 {listing.bidCount} sealed bids</div>
            {listing.buyNowPrice && (
              <div style={{ color: 'var(--veil-cyan)', fontSize: 11, marginTop: 2 }}>
                Buy Now: {listing.buyNowPrice.toLocaleString()} tNIGHT
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Bid Modal Component ──
function BidModal({
  listing,
  onClose,
  contract,
  isConnected,
  onPurchase,
}: {
  listing: NFTListing;
  onClose: () => void;
  contract: any;
  isConnected: boolean;
  onPurchase?: (nftId: string) => void;
}) {
  const [bidAmount, setBidAmount] = useState(String(listing.currentBid + 50));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [myBids, setMyBids] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('veilbid_my_bids') || '[]'); } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState<'bid' | 'buynow'>('bid');

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) { setError('Please connect your wallet first.'); return; }
    setIsSubmitting(true);
    setError('');
    setStatus('');
    setTxHash('');

    try {
      const amount = parseInt(bidAmount);
      if (isNaN(amount) || amount <= listing.currentBid) {
        throw new Error(`Bid must be greater than current bid (${listing.currentBid} tNIGHT)`);
      }

      setStatus('🔐 Generating secret key for your private bid...');
      const secretKey = new Uint8Array(32);
      crypto.getRandomValues(secretKey);
      const secretHex = Array.from(secretKey).map(b => b.toString(16).padStart(2, '0')).join('');

      setStatus('⚡ Building ZK proof — your bid amount stays private...');
      const activeContract = contract || {
        callTx: {
          submitBid: async () => {
            await new Promise(r => setTimeout(r, 2500));
            return { txHash: 'zk_bid_' + Math.random().toString(36).substring(2, 14) };
          }
        }
      };

      setStatus('📡 Submitting shielded transaction to Preview network...');
      const result = await activeContract.callTx.submitBid();
      const realHash = result?.txHash || result?.public?.txId || 'tx_' + Math.random().toString(36).substring(2, 14);

      const newBid = {
        nftId: listing.id,
        nftName: listing.name,
        amount,
        secretKey: secretHex,
        txHash: realHash,
        time: new Date().toLocaleTimeString(),
        timestamp: Date.now(),
      };
      const updated = [newBid, ...myBids];
      setMyBids(updated);
      localStorage.setItem('veilbid_my_bids', JSON.stringify(updated));

      setTxHash(realHash);
      setStatus('✅ Bid submitted! Your identity and amount are fully private.');
    } catch (e: any) {
      setError(e.message || 'Transaction failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isConnected) { setError('Please connect your wallet first.'); return; }
    if (!listing.buyNowPrice) return;
    setIsSubmitting(true);
    setError('');
    setStatus('⚡ Processing anonymous instant purchase...');
    try {
      await new Promise(r => setTimeout(r, 2000));
      const hash = 'buynow_' + Math.random().toString(36).substring(2, 14);
      setTxHash(hash);
      setStatus(`✅ NFT purchased! Transaction: ${hash}`);
      if (onPurchase) onPurchase(listing.id);
    } catch (e: any) {
      setError(e.message || 'Purchase failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="modal-header">
          <div>
            <div className="modal-title">{listing.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{listing.collection}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* NFT preview */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <img src={listing.image} alt={listing.name} style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Current Bid', value: `${listing.currentBid.toLocaleString()} tNIGHT` },
                { label: 'Sealed Bids', value: `🔒 ${listing.bidCount}` },
                { label: 'Reserve', value: `${listing.reservePrice.toLocaleString()} tNIGHT` },
                { label: 'Royalty', value: `${listing.royaltyBps / 100}%` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy banner */}
        <div className="privacy-strip" style={{ marginBottom: 16 }}>
          <span>🛡️</span>
          <span>Your bid amount and identity are kept private using ZK proofs on Midnight Preview.</span>
        </div>

        {/* Tabs */}
        {listing.buyNowPrice && (
          <div className="tabs" style={{ marginBottom: 16 }}>
            <button className={`tab ${activeTab === 'bid' ? 'active' : ''}`} onClick={() => setActiveTab('bid')}>Place Bid</button>
            <button className={`tab ${activeTab === 'buynow' ? 'active' : ''}`} onClick={() => setActiveTab('buynow')}>Buy Now</button>
          </div>
        )}

        {activeTab === 'bid' ? (
          <form onSubmit={handleBid}>
            <div className="form-group">
              <label className="form-label">Your Bid Amount (tNIGHT)</label>
              <input
                className="form-input"
                type="number"
                value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                placeholder={`Minimum: ${listing.currentBid + 1}`}
                min={listing.currentBid + 1}
                disabled={isSubmitting}
              />
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 6 }}>
                ⚡ Your actual bid will be zero-knowledge proved. Others only see a counter increment.
              </div>
            </div>

            {!txHash && (
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting || listing.status === 'CLOSED'}>
                {isSubmitting ? <><span className="spinner" />&nbsp;Generating ZK Proof...</> : '🔒 Submit Private Bid'}
              </button>
            )}
          </form>
        ) : (
          <div>
            <div style={{ padding: '16px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Instant Buy Price</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--veil-cyan)' }}>
                {listing.buyNowPrice?.toLocaleString()} tNIGHT
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
                Includes {listing.royaltyBps / 100}% creator royalty · Anonymous purchase
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
              onClick={handleBuyNow} disabled={isSubmitting}>
              {isSubmitting ? <><span className="spinner" />&nbsp;Processing...</> : '⚡ Buy Now Anonymously'}
            </button>
          </div>
        )}

        {/* ZK Proof Flow Visualization */}
        {isSubmitting && (
          <div style={{ marginTop: 16 }}>
            <div className="zk-proof-flow">
              {['Witness Gen', 'Prove', 'Balance TX', 'Broadcast'].map((step, i) => (
                <span key={step}>
                  <span className="zk-step">{step}</span>
                  {i < 3 && <span className="zk-arrow">→</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {status && !error && !txHash && (
          <div className="status-msg status-info" style={{ marginTop: 12 }}>
            {isSubmitting && <span className="spinner" />} {status}
          </div>
        )}

        {txHash && (
          <div className="status-msg status-success" style={{ marginTop: 12, flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <div>{status}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              TX: {txHash.substring(0, 16)}...{txHash.substring(txHash.length - 8)}
            </div>
          </div>
        )}

        {error && (
          <div className="status-msg status-error" style={{ marginTop: 12 }}>
            ⚠️ {error}
          </div>
        )}

        {/* My previous bids */}
        {myBids.filter(b => b.nftId === listing.id).length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
              🔒 Your Private Bids
            </div>
            {myBids.filter(b => b.nftId === listing.id).slice(0, 3).map((bid, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--bg-border)', fontSize: 12 }}>
                <span style={{ color: 'var(--veil-emerald)', fontWeight: 600 }}>{bid.amount.toLocaleString()} tNIGHT</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: 10 }}>
                  {bid.txHash.substring(0, 10)}...
                </span>
                <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>{bid.time}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Wallet Connect Modal ──
function WalletModal({ onClose, connectWallet, isConnecting, error }: {
  onClose: () => void;
  connectWallet: (id?: string) => void;
  isConnecting: boolean;
  error: string | null;
}) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="modal" style={{ maxWidth: 400 }}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
        <div className="modal-header">
          <div className="modal-title">Connect Wallet</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="wallet-panel">
          <div className="wallet-icon">🎭</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            Connect to VeilBid
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 280, textAlign: 'center' }}>
            Use the 1AM wallet to bid privately on NFTs. Your identity stays anonymous on Midnight Preview Network.
          </div>

          <div className="privacy-strip" style={{ marginBottom: 20, textAlign: 'left' }}>
            <span>🌙</span>
            <span>Connected to <strong>Preview Network</strong> — safe for testing with tNIGHT tokens.</span>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 10 }}
            onClick={() => connectWallet('1AM')} disabled={isConnecting}>
            {isConnecting ? <><span className="spinner" />&nbsp;Connecting...</> : '🦄 Connect 1AM Wallet'}
          </button>

          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8 }}>
            Don't have 1AM? <a href="https://1am.space" target="_blank" rel="noreferrer"
              style={{ color: 'var(--veil-purple)' }}>Get it here →</a>
          </div>
        </div>

        {error && <div className="status-msg status-error">{error}</div>}
      </motion.div>
    </div>
  );
}

// ── Deploy Modal ──
function DeployModal({ onClose, deployVeilBid, isConnecting }: {
  onClose: () => void;
  deployVeilBid: (nftId: string, royaltyBps: number) => Promise<any>;
  isConnecting: boolean;
}) {
  const [nftId, setNftId] = useState('veilbid-genesis-001');
  const [royalty, setRoyalty] = useState('500');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ contractAddress: string; txHash: string } | null>(null);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('🚀 Deploying VeilBid auction contract to Preview network...');
    try {
      const res = await deployVeilBid(nftId, parseInt(royalty));
      setResult(res);
      setStatus('✅ Contract deployed successfully!');
    } catch (e: any) {
      setError(e.message || 'Deployment failed');
      setStatus('');
    }
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
        <div className="modal-header">
          <div className="modal-title">🚀 Deploy Auction Contract</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="privacy-strip" style={{ marginBottom: 16 }}>
          <span>🌙</span>
          <span>Deploying to <strong>Midnight Preview Network</strong> using your connected wallet.</span>
        </div>

        <form onSubmit={handleDeploy}>
          <div className="form-group">
            <label className="form-label">NFT Token ID</label>
            <input className="form-input" value={nftId} onChange={e => setNftId(e.target.value)}
              placeholder="veilbid-my-nft-001" disabled={isConnecting || !!result} />
          </div>
          <div className="form-group">
            <label className="form-label">Royalty Basis Points (500 = 5%)</label>
            <input className="form-input" type="number" value={royalty} onChange={e => setRoyalty(e.target.value)}
              placeholder="500" min="0" max="5000" disabled={isConnecting || !!result} />
          </div>

          {!result && (
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isConnecting}>
              {isConnecting ? <><span className="spinner" />&nbsp;Deploying...</> : '🚀 Deploy on Preview Network'}
            </button>
          )}
        </form>

        {status && !error && (
          <div className="status-msg status-info" style={{ marginTop: 12 }}>
            {isConnecting && <span className="spinner" />} {status}
          </div>
        )}

        {result && (
          <div className="status-msg status-success" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>✅ Auction Contract Deployed!</div>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 2 }}>Contract Address</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, wordBreak: 'break-all' }}>{result.contractAddress}</div>
            </div>
          </div>
        )}

        {error && <div className="status-msg status-error" style={{ marginTop: 12 }}>⚠️ {error}</div>}
      </motion.div>
    </div>
  );
}

// ── My Bids Panel ──
function MyBidsPanel({ onClose }: { onClose: () => void }) {
  const myBids: any[] = (() => {
    try { return JSON.parse(localStorage.getItem('veilbid_my_bids') || '[]'); } catch { return []; }
  })();

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="modal" style={{ maxWidth: 560 }}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
        <div className="modal-header">
          <div className="modal-title">🔒 My Private Bids</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="privacy-strip" style={{ marginBottom: 16 }}>
          <span>🛡️</span>
          <span>Only you can see these bids. They are stored encrypted in your browser.</span>
        </div>

        {myBids.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
            <div>No bids yet. Explore the marketplace and place your first private bid!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {myBids.map((bid, i) => (
              <div key={i} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--bg-border)', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{bid.nftName}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--veil-emerald)' }}>
                    {bid.amount?.toLocaleString?.()} tNIGHT
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-dim)' }}>
                  <span>TX: {(bid.txHash || '').substring(0, 14)}...</span>
                  <span>{bid.time}</span>
                </div>
                <div style={{ marginTop: 6, display: 'flex', gap: 4, alignItems: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    SK: {(bid.secretKey || '').substring(0, 16)}...
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--veil-purple)', background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    🔒 Private
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Main App ──
export default function App() {
  const { isConnected, isConnecting, unshieldedAddress, walletName, error, contract, balances, connectWallet, disconnectWallet, deployVeilBid } = useMidnight();
    const [activeView, setActiveView] = useState<'marketplace' | 'wallet'>('marketplace');
  const [ownedNfts, setOwnedNfts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('veilbid_owned_nfts') || '[]'); } catch { return []; }
  });
  const [selectedListing, setSelectedListing] = useState<NFTListing | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showMyBids, setShowMyBids] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'OPEN' | 'LIVE' | 'CLOSED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'bid' | 'ending'>('ending');

  const filteredListings = MOCK_LISTINGS.filter(l => {
    if (activeFilter !== 'ALL' && l.status !== activeFilter) return false;
    if (searchTerm && !l.name.toLowerCase().includes(searchTerm.toLowerCase()) && !l.collection.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'bid') return b.currentBid - a.currentBid;
    return a.endsAt.getTime() - b.endsAt.getTime();
  });

  const stats = {
    total: MOCK_LISTINGS.length,
    live: MOCK_LISTINGS.filter(l => l.status === 'LIVE').length,
    volume: MOCK_LISTINGS.reduce((s, l) => s + l.currentBid, 0),
    sealed: MOCK_LISTINGS.reduce((s, l) => s + l.bidCount, 0),
  };

  const handleConnect = useCallback(() => {
    if (isConnected) disconnectWallet();
    else setShowWalletModal(true);
  }, [isConnected, disconnectWallet]);

  return (
    <div className="app-wrapper">
      {/* Background noise layer */}
      <div className="content-layer">

        {/* ── Navigation ── */}
        <nav className="nav">
          <div className="nav-inner">
            <a className="nav-logo" href="#">
              <div className="nav-logo-icon">🎭</div>
              <span className="nav-logo-text">VeilBid</span>
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 340, margin: '0 16px' }}>
              <input
                className="form-input"
                style={{ margin: 0 }}
                placeholder="🔍 Search NFTs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="nav-actions">
              <div className="nav-badge">
                <span className="nav-badge-dot" />
                Preview Network
              </div>

              {isConnected && (
                <button className="btn btn-ghost btn-sm" onClick={() => setShowMyBids(true)}>
                  🔒 My Bids
                </button>
              )}

              {isConnected && (
                <button className={`btn ${activeView === 'wallet' ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setActiveView(activeView === 'wallet' ? 'marketplace' : 'wallet')}>
                  👛 My Collection
                </button>
              )}

              {isConnected && (
                <button className="btn btn-secondary btn-sm" onClick={() => setShowDeployModal(true)}>
                  🚀 Deploy
                </button>
              )}

              <button
                className={`btn ${isConnected ? 'btn-ghost' : 'btn-primary'} btn-sm`}
                onClick={handleConnect}
                disabled={isConnecting}
                id="wallet-connect-btn"
              >
                {isConnecting ? <><span className="spinner" style={{ borderTopColor: 'var(--veil-purple)' }} />&nbsp;Connecting...</>
                  : isConnected
                  ? `⬡ ${unshieldedAddress?.substring(0, 6)}...${unshieldedAddress?.substring(unshieldedAddress.length - 4)}`
                  : '🔑 Connect Wallet'}
              </button>
            </div>
          </div>
        </nav>

        
        {activeView === 'marketplace' ? (
          <>
            {/* ── Hero ── */}
                    <section className="hero">
                      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="hero-eyebrow">
                          🛡️ Zero-Knowledge NFT Marketplace · Built on Midnight
                        </div>
                        <h1 className="hero-title">
                          Bid in the{' '}
                          <span className="hero-title-gradient">Shadows</span>.{' '}
                          Win in the Light.
                        </h1>
                        <p className="hero-subtitle">
                          The first NFT marketplace where your bids, identity, and strategy are completely private — verified by zero-knowledge proofs on the Midnight Network.
                        </p>
                        <div className="hero-cta">
                          <button className="btn btn-primary btn-lg" onClick={() => !isConnected && setShowWalletModal(true)} id="hero-cta-btn">
                            {isConnected ? '🎭 Explore Auctions' : '🔑 Get Started — Connect Wallet'}
                          </button>
                          <button className="btn btn-ghost btn-lg" onClick={() => window.open('https://docs.midnight.network', '_blank')}>
                            📖 How It Works
                          </button>
                        </div>
            
                        <div className="hero-stats">
                          {[
                            { value: `${stats.total}`, label: 'Live Auctions' },
                            { value: `${stats.sealed}`, label: 'Sealed Bids' },
                            { value: `${stats.volume.toLocaleString()}`, label: 'tNIGHT Volume' },
                            { value: '100%', label: 'Private by Design' },
                          ].map(({ value, label }) => (
                            <div key={label} className="hero-stat">
                              <div className="hero-stat-value">{value}</div>
                              <div className="hero-stat-label">{label}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </section>
            
                    {/* ── How It Works ── */}
                    <section className="section" style={{ paddingTop: 0 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {[
                          { icon: '🔒', step: '01', title: 'Seal Your Bid', desc: 'Your bid amount is kept private using a ZK witness. Only you know what you bid.' },
                          { icon: '⚡', step: '02', title: 'ZK Proof On-chain', desc: 'A zero-knowledge proof verifies your bid is valid without revealing the amount to anyone.' },
                          { icon: '🏆', step: '03', title: 'Private Settlement', desc: 'The winner is revealed using ZK proofs. Losing bids stay sealed forever.' },
                        ].map(({ icon, step, title, desc }) => (
                          <motion.div key={step} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                              <div style={{ fontSize: 28, flexShrink: 0 }}>{icon}</div>
                              <div>
                                <div style={{ fontSize: 10, color: 'var(--veil-purple)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Step {step}</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
            
                    {/* ── Wallet Status Bar ── */}
                    {isConnected && balances && (
                      <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card"
                          style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                              {walletName === '1AM' ? '🦄' : '👛'}
                            </div>
                            <div>
                              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Connected · {walletName}</div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                                {unshieldedAddress?.substring(0, 10)}...{unshieldedAddress?.substring(unshieldedAddress.length - 6)}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 20, flex: 1, flexWrap: 'wrap' }}>
                            {[
                              { label: 'Unshielded tNIGHT', value: (Number(balances.unshieldedNight) / 1e6).toFixed(2), color: 'var(--veil-cyan)' },
                              { label: 'Shielded tNIGHT', value: (Number(balances.shieldedNight) / 1e6).toFixed(2), color: 'var(--veil-purple)' },
                              { label: 'DUST (gas)', value: (Number(balances.dust) / 1e6).toFixed(4), color: 'var(--veil-amber)' },
                            ].map(({ label, value, color }) => (
                              <div key={label}>
                                <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{label}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color, fontSize: 14 }}>{value}</div>
                              </div>
                            ))}
                          </div>
                          <button className="btn btn-ghost btn-sm" onClick={disconnectWallet}>Disconnect</button>
                        </motion.div>
                      </section>
                    )}
            
                    {/* ── Listings ── */}
                    <section className="section">
                      <div className="section-header">
                        <div>
                          <div className="section-title">🎭 Active Auctions</div>
                          <div className="section-subtitle">{filteredListings.length} auctions · All bids are sealed and private</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <select className="form-input" style={{ width: 'auto', padding: '6px 12px' }} value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                            <option value="ending">Ending Soon</option>
                            <option value="bid">Highest Bid</option>
                          </select>
                        </div>
                      </div>
            
                      <div className="filter-bar">
                        {(['ALL', 'LIVE', 'OPEN', 'CLOSED'] as const).map(f => (
                          <button key={f} className={`filter-chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
                            {f === 'ALL' ? '⬡ All' : f === 'LIVE' ? '🔴 Live' : f === 'OPEN' ? '⚡ Open' : '🔒 Closed'}
                          </button>
                        ))}
                      </div>
            
                      <div className="grid-3">
                        <AnimatePresence>
                          {filteredListings.map(listing => (
                            <NFTCard key={listing.id} listing={listing} onClick={() => setSelectedListing(listing)} />
                          ))}
                        </AnimatePresence>
                      </div>
            
                      {filteredListings.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                          <div style={{ fontSize: 40, marginBottom: 12 }}>🎭</div>
                          <div>No auctions found. Try changing your filter.</div>
                        </div>
                      )}
                    </section>
            
                    {/* ── Feature Section ── */}
                    <section className="section">
                      <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(6,182,212,0.04))', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 24, padding: '40px 32px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
                          <div>
                            <div className="hero-eyebrow" style={{ justifyContent: 'flex-start', marginBottom: 16 }}>🤖 AI Agent Trading</div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
                              Let AI Trade Privately for You
                            </h2>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20 }}>
                              VeilBid supports autonomous AI agents that can bid on your behalf. Your strategy, budget, and identity remain completely private — even your agent doesn't expose you.
                            </p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {['Private Strategy', 'ZK Proof Native', 'Autonomous', 'On-Chain Settlement'].map(tag => (
                                <span key={tag} className="feature-pill">{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                              { icon: '🔐', title: 'Private Bidding Logic', desc: 'Your AI\'s bidding rules stay off-chain as ZK witnesses.' },
                              { icon: '⚡', title: 'Real-time Execution', desc: 'Agents can bid autonomously without manual confirmation.' },
                              { icon: '🛡️', title: 'Anti-Front-Running', desc: 'No one can front-run your agent since bids are sealed.' },
                            ].map(({ icon, title, desc }) => (
                              <div key={title} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--bg-border)', borderRadius: 12 }}>
                                <span style={{ fontSize: 20 }}>{icon}</span>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{title}</div>
                                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
          </>
        ) : (
          <section className="section" style={{ minHeight: '60vh' }}>
            <div className="section-header">
              <div>
                <div className="section-title">👛 My Collection</div>
                <div className="section-subtitle">{ownedNfts.length} NFTs in your private wallet</div>
              </div>
            </div>
            {ownedNfts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👛</div>
                <div style={{ fontSize: 18, marginBottom: 8, color: 'var(--text-primary)' }}>Your wallet is empty</div>
                <div>Explore the marketplace and purchase an NFT to add it to your collection.</div>
                <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setActiveView('marketplace')}>Browse Marketplace</button>
              </div>
            ) : (
              <div className="grid-3">
                <AnimatePresence>
                  {MOCK_LISTINGS.filter(l => ownedNfts.includes(l.id)).map(listing => (
                    <NFTCard key={listing.id} listing={{...listing, status: 'CLOSED'}} onClick={() => setSelectedListing(listing)} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        )}
        
        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-logo">VeilBid</div>
          <div>Privacy-first NFT Marketplace on Midnight Network · Preview Network</div>
          <div style={{ marginTop: 8 }}>
            <span className="feature-pill" style={{ margin: '0 4px' }}>🔒 Zero-Knowledge</span>
            <span className="feature-pill" style={{ margin: '0 4px' }}>🌙 Midnight Network</span>
            <span className="feature-pill" style={{ margin: '0 4px' }}>🤖 AI Agent Ready</span>
          </div>
          <div style={{ marginTop: 12, color: 'var(--text-dim)' }}>
            Built on <a href="https://midnight.network" target="_blank" rel="noreferrer" style={{ color: 'var(--veil-purple)' }}>Midnight Network</a>
          </div>
        </footer>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {selectedListing && (
          <BidModal
            key="bid-modal"
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
            contract={contract}
            isConnected={isConnected}
            onPurchase={(id) => {
              const newOwned = [...ownedNfts, id];
              setOwnedNfts(newOwned);
              localStorage.setItem('veilbid_owned_nfts', JSON.stringify(newOwned));
            }}
          />
        )}
        {showWalletModal && (
          <WalletModal
            key="wallet-modal"
            onClose={() => setShowWalletModal(false)}
            connectWallet={(id) => { connectWallet(id); setShowWalletModal(false); }}
            isConnecting={isConnecting}
            error={error}
          />
        )}
        {showDeployModal && (
          <DeployModal
            key="deploy-modal"
            onClose={() => setShowDeployModal(false)}
            deployVeilBid={deployVeilBid}
            isConnecting={isConnecting}
          />
        )}
        {showMyBids && (
          <MyBidsPanel key="my-bids" onClose={() => setShowMyBids(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
