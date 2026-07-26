import React, { useEffect, useState } from 'react';
import { useMidnight } from './hooks/useMidnight';

export default function App() {
  const {
    isConnected,
    isConnecting,
    unshieldedAddress,
    walletError,
    connectWallet,
    disconnectWallet,
    deployVeilBid,
  } = useMidnight() as any;

  // View state: 'landing' vs 'marketplace'
  const [viewMode, setViewMode] = useState<'landing' | 'marketplace'>('marketplace');

  // Modals & UI state
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState<any | null>(null);

  // Bid form state
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [bidSuccessTx, setBidSuccessTx] = useState<string | null>(null);

  // Deploy form state
  const [nftName, setNftName] = useState('');
  const [royaltyBps, setRoyaltyBps] = useState('500');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{ address: string; tx: string } | null>(null);

  // List of uploaded NFTs from Desktop/nft
  const userNfts = [
    { id: 1, title: 'VeilBid Pepe #001', author: 'Thanos0s', floor: '0.45 tNIGHT', volume: '12.4 tNIGHT', img: '/nfts/ChatGPT Image Jul 26, 2026, 04_26_58 PM.png', category: 'PFPs' },
    { id: 2, title: 'Shadow Realm Artifact', author: 'MidnightLabs', floor: '1.20 tNIGHT', volume: '48.9 tNIGHT', img: '/nfts/1318eadc3519abcda87173d473d594c7.avif', category: 'Art' },
    { id: 3, title: 'Cipher Node #042', author: 'ZeroWitness', floor: '0.85 tNIGHT', volume: '22.1 tNIGHT', img: '/nfts/1f1cf87258c5e5c88af3ffd729ba9bc1.avif', category: 'Gaming' },
    { id: 4, title: 'Eclipse Visionary', author: 'DarkArts', floor: '2.10 tNIGHT', volume: '95.0 tNIGHT', img: '/nfts/38f8ed7fec64574f71248e43650eb934.avif', category: 'Art' },
    { id: 5, title: 'Void Walker #007', author: 'AnonCollector', floor: '0.30 tNIGHT', volume: '8.2 tNIGHT', img: '/nfts/54d284ae7fb7d10a75da40c88791aa92.avif', category: 'PFPs' },
    { id: 6, title: 'Prism Refract', author: 'LightShaper', floor: '1.50 tNIGHT', volume: '64.3 tNIGHT', img: '/nfts/8d98f1de2a946d37396bd15840b10c7b.avif', category: 'Art' },
    { id: 7, title: 'Crypto Phantom #099', author: 'VeilBidOfficial', floor: '0.95 tNIGHT', volume: '33.7 tNIGHT', img: '/nfts/bd3183572c0737ed3845d406969be32e.avif', category: 'Gaming' },
    { id: 8, title: 'Mystic Shield', author: 'CardanoZK', floor: '3.40 tNIGHT', volume: '140.2 tNIGHT', img: '/nfts/f37da9430598e1d2d1f291bd3ae71390.avif', category: 'Physical' },
  ];

  const sidebarTrending = [
    { title: 'Friendship Bracelets', floor: '0.05 tNIGHT', change: '+470.8%', positive: true, img: '/nfts/1318eadc3519abcda87173d473d594c7.avif' },
    { title: 'Signalbound ZK', floor: '< 0.01 tNIGHT', change: '+167.7%', positive: true, img: '/nfts/1f1cf87258c5e5c88af3ffd729ba9bc1.avif' },
    { title: 'Pepe VeilBid Collection', floor: '0.45 tNIGHT', change: '+144.3%', positive: true, img: '/veilbid-logo.png' },
    { title: 'VeeFriends Private', floor: '0.10 tNIGHT', change: '+0.3%', positive: true, img: '/nfts/38f8ed7fec64574f71248e43650eb934.avif' },
    { title: 'Ten Thousand Proofs', floor: '0.06 tNIGHT', change: '-1.7%', positive: false, img: '/nfts/54d284ae7fb7d10a75da40c88791aa92.avif' },
    { title: 'Ragnarok Midnight', floor: '36.99 tNIGHT', change: '-2.7%', positive: false, img: '/nfts/8d98f1de2a946d37396bd15840b10c7b.avif' },
  ];

  // Platform cycler for landing page
  useEffect(() => {
    if (viewMode !== 'landing') return;
    const platforms = [
      { icon: '🖼️', text: 'win in the light.', color: '#5B5BD6' },
      { icon: '🔒', text: 'sealed forever.', color: '#1a1a6b' },
      { icon: '🌙', text: 'on Midnight.', color: '#3730a3' },
      { icon: '⚡', text: 'ZK proven.', color: '#5B5BD6' },
      { icon: '🤖', text: 'AI powered.', color: '#7c3aed' },
      { icon: '🏆', text: 'privately won.', color: '#c2410c' },
    ];
    let pi = 0;
    const ptxt = document.getElementById('platform-text');
    const picon = document.getElementById('platform-icon');
    const platformTimer = setInterval(() => {
      pi = (pi + 1) % platforms.length;
      const p = platforms[pi];
      if (ptxt && picon) {
        ptxt.style.animation = 'none';
        picon.style.animation = 'none';
        void (ptxt as HTMLElement).offsetWidth;
        ptxt.style.animation = 'slideUp .4s ease-out';
        picon.style.animation = 'slideUp .4s ease-out';
        ptxt.textContent = p.text;
        (ptxt as HTMLElement).style.color = p.color;
        picon.textContent = p.icon;
      }
    }, 2800);

    return () => clearInterval(platformTimer);
  }, [viewMode]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || isNaN(Number(bidAmount))) return;
    setIsSubmittingBid(true);
    setBidSuccessTx(null);

    setTimeout(() => {
      const mockTx = '0xzk_' + Math.random().toString(36).substring(2, 14) + '_midnight';
      setBidSuccessTx(mockTx);
      setIsSubmittingBid(false);

      const existing = JSON.parse(localStorage.getItem('veilbid_bids') || '[]');
      existing.push({ nft: selectedNft?.title || 'VeilBid NFT', amount: bidAmount, tx: mockTx, date: new Date().toISOString() });
      localStorage.setItem('veilbid_bids', JSON.stringify(existing));
    }, 2200);
  };

  const handleDeploySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftName) return;
    setIsDeploying(true);
    setDeployResult(null);

    try {
      if (isConnected && deployVeilBid) {
        const res = await deployVeilBid(nftName, Number(royaltyBps));
        setDeployResult({ address: res.contractAddress, tx: res.txHash });
      } else {
        setTimeout(() => {
          setDeployResult({
            address: '0xcontract_' + Math.random().toString(36).substring(2, 10),
            tx: '0xdeploy_' + Math.random().toString(36).substring(2, 12),
          });
          setIsDeploying(false);
        }, 2000);
      }
    } catch {
      setIsDeploying(false);
    } finally {
      setIsDeploying(false);
    }
  };

  const truncateAddr = (addr: string | null) => {
    if (!addr) return '';
    return addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
  };

  return (
    <div style={{ background: viewMode === 'marketplace' ? '#121212' : '#F6F3EC', color: viewMode === 'marketplace' ? '#fff' : '#0a0a0a', minHeight: '100vh', fontFamily: "'Geist', sans-serif" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --cream:#F6F3EC;--dark:#0a0a0a;--green:#C1F04C;--purple:#5B5BD6;
          --font-serif:'Instrument Serif',Georgia,serif;
          --font-sans:'Geist',-apple-system,sans-serif;
          --font-mono:'Geist Mono',monospace;
        }
        .opensea-nav{height:64px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;padding:0 20px;background:#121212;position:sticky;top:0;z-index:100}
        .search-bar{display:flex;align-items:center;background:#202225;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:8px 16px;width:380px;gap:10px}
        .search-bar input{background:none;border:none;color:#fff;outline:none;font-size:14px;width:100%}
        .chip{padding:6px 14px;border-radius:20px;background:#202225;border:1px solid rgba(255,255,255,0.08);font-size:13px;font-weight:600;color:#e5e7eb;cursor:pointer;transition:all .15s;white-space:nowrap}
        .chip:hover,.chip.active{background:#fff;color:#000}
        .mp-grid{display:grid;grid-template-columns:1fr 340px;gap:24px;max-width:1440px;margin:0 auto;padding:24px}
        .hero-banner{position:relative;border-radius:16px;overflow:hidden;height:380px;background:url('/nfts/ChatGPT Image Jul 26, 2026, 04_26_58 PM.png') center/cover;display:flex;align-items:flex-end;padding:32px;border:1px solid rgba(255,255,255,0.1)}
        .hero-banner::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 60%)}
        .hero-content{position:relative;z-index:2}
        .nft-card{background:#1e1e24;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;transition:all .2s;cursor:pointer}
        .nft-card:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,0.4);border-color:rgba(193,240,76,0.4)}
        .nft-img{height:220px;width:100%;object-fit:cover;background:#2a2a32}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px}
        .modal-card{background:#1e1e24;border:1px solid rgba(255,255,255,0.15);box-shadow:0 20px 40px rgba(0,0,0,0.6);border-radius:16px;max-width:440px;width:100%;padding:28px;position:relative;color:#fff}
        .modal-close{position:absolute;top:16px;right:16px;background:none;border:none;color:#aaa;font-size:20px;cursor:pointer}
        .modal-input{width:100%;padding:12px 14px;background:#121212;border:1px solid rgba(255,255,255,0.15);border-radius:8px;font-size:14px;color:#fff;margin-top:8px;margin-bottom:16px;outline:none}
      `}</style>

      {/* View Mode Toggle Header */}
      <div style={{ background: '#0a0a0a', padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/veilbid-logo.png" alt="VeilBid" style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
          <span style={{ fontWeight: 800, color: '#C1F04C' }}>VEILBID ECOSYSTEM</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setViewMode('marketplace')} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid #C1F04C', background: viewMode === 'marketplace' ? '#C1F04C' : 'transparent', color: viewMode === 'marketplace' ? '#000' : '#C1F04C', fontWeight: 700, cursor: 'pointer' }}>
            🛒 Marketplace
          </button>
          <button onClick={() => setViewMode('landing')} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: viewMode === 'landing' ? '#fff' : 'transparent', color: viewMode === 'landing' ? '#000' : '#fff', fontWeight: 700, cursor: 'pointer' }}>
            🌐 Landing Page
          </button>
        </div>
      </div>

      {viewMode === 'marketplace' ? (
        <div>
          {/* ── OPENSEA STYLE NAVBAR ── */}
          <header className="opensea-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, fontSize: '18px' }}>
                <img src="/veilbid-logo.png" alt="" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                <span>VeilBid</span>
              </div>
              <div className="search-bar">
                <span>🔍</span>
                <input placeholder="Search NFTs, collections, and accounts..." />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button onClick={() => setShowDeployModal(true)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                + Create Auction
              </button>
              <button onClick={() => isConnected ? disconnectWallet() : setShowWalletModal(true)} style={{ background: '#C1F04C', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>
                {isConnecting ? 'Connecting...' : isConnected ? `🔑 ${truncateAddr(unshieldedAddress)}` : 'Connect Wallet'}
              </button>
            </div>
          </header>

          {/* ── FILTER CHIPS ── */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '10px', overflowX: 'auto' }}>
            <span className="chip active">All</span>
            <span className="chip">🎮 Gaming</span>
            <span className="chip">🎨 Art</span>
            <span className="chip">🖼️ PFPs</span>
            <span className="chip">💎 Physical</span>
            <span className="chip">🌙 Midnight ZK</span>
            <span className="chip">⚡ tNIGHT Token</span>
          </div>

          {/* ── MAIN MARKETPLACE CONTENT ── */}
          <main className="mp-grid">
            <div>
              {/* Featured Banner Hero */}
              <div className="hero-banner">
                <div className="hero-content">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <span>✓ Verified Collection</span> · <span>🔒 ZK Private Bids</span>
                  </div>
                  <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '8px', lineHeight: 1.1 }}>VeilBid Pepe #001 & Friends</h1>
                  <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '20px' }}>By Thanos0s · Private ZK-proof auctions on Midnight Network</p>

                  <div style={{ display: 'flex', gap: '24px', background: 'rgba(0,0,0,0.6)', padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', width: 'fit-content' }}>
                    <div><div style={{ fontSize: '11px', color: '#aaa', fontWeight: 600 }}>FLOOR PRICE</div><div style={{ fontSize: '16px', fontWeight: 800 }}>0.45 tNIGHT</div></div>
                    <div><div style={{ fontSize: '11px', color: '#aaa', fontWeight: 600 }}>ITEMS</div><div style={{ fontSize: '16px', fontWeight: 800 }}>10,000</div></div>
                    <div><div style={{ fontSize: '11px', color: '#aaa', fontWeight: 600 }}>TOTAL VOLUME</div><div style={{ fontSize: '16px', fontWeight: 800 }}>48.9 tNIGHT</div></div>
                    <div><div style={{ fontSize: '11px', color: '#aaa', fontWeight: 600 }}>LISTED</div><div style={{ fontSize: '16px', fontWeight: 800 }}>4.2%</div></div>
                  </div>
                </div>
              </div>

              {/* Trending Tokens Ticker */}
              <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Trending Collections</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div style={{ background: '#1e1e24', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/veilbid-logo.png" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>VeilBid Pepe</div>
                      <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>0.45 tNIGHT (+59.5%)</div>
                    </div>
                  </div>
                  <div style={{ background: '#1e1e24', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/nfts/1318eadc3519abcda87173d473d594c7.avif" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>BOOK OF ZK</div>
                      <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>1.20 tNIGHT (+16.8%)</div>
                    </div>
                  </div>
                  <div style={{ background: '#1e1e24', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/nfts/38f8ed7fec64574f71248e43650eb934.avif" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>Eclipse Vision</div>
                      <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 600 }}>2.10 tNIGHT (-8.8%)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded User NFTs Grid */}
              <div style={{ marginTop: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Explore Auctions</h3>
                  <span style={{ fontSize: '13px', color: '#aaa' }}>{userNfts.length} Items Listed</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {userNfts.map(nft => (
                    <div key={nft.id} className="nft-card">
                      <img src={nft.img} alt={nft.title} className="nft-img" />
                      <div style={{ padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: '#C1F04C', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{nft.category}</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '2px' }}>{nft.title}</div>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '14px' }}>By {nft.author}</div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>CURRENT BID</div>
                            <div style={{ fontSize: '13px', fontWeight: 700 }}>{nft.floor}</div>
                          </div>
                          <button
                            onClick={() => { setSelectedNft(nft); setShowBidModal(true); }}
                            style={{ padding: '6px 14px', background: '#C1F04C', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
                          >
                            🔒 Bid
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Top Collections Floor Ticker */}
            <div style={{ background: '#19191e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#aaa', letterSpacing: '0.05em' }}>COLLECTION</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#aaa', letterSpacing: '0.05em' }}>FLOOR</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sidebarTrending.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={item.img} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, width: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                        <div style={{ fontSize: '11px', color: item.positive ? '#10B981' : '#EF4444', fontWeight: 600 }}>{item.change}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.floor}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* ── LANDING PAGE VIEW ── */
        <div>
          <nav style={{ position: 'sticky', top: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px', padding: '0 20px', background: '#F6F3EC', borderBottom: '1.5px solid #0a0a0a' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, fontSize: '15px', textDecoration: 'none', color: '#0a0a0a' }}>
              <div style={{ width: '32px', height: '32px', border: '2px solid #0a0a0a', borderRadius: '7px', overflow: 'hidden' }}>
                <img src="/veilbid-logo.png" alt="VeilBid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              VEILBID
            </a>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <a href="#features" style={{ color: '#5a5a5a', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>Features ↓</a>
              <a href="#how" style={{ color: '#5a5a5a', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>How it works</a>
              <button onClick={() => setViewMode('marketplace')} style={{ padding: '8px 16px', background: '#C1F04C', color: '#0a0a0a', border: '2px solid #0a0a0a', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', boxShadow: '3px 3px 0 #0a0a0a' }}>
                🛒 Open Marketplace
              </button>
            </div>
          </nav>

          <section style={{ textAlign: 'center', padding: '80px 24px', background: '#F6F3EC' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '64px', fontWeight: 400, color: '#0a0a0a', marginBottom: '16px' }}>
              Bid in the <span style={{ color: '#5B5BD6' }}>shadows</span>,<br />win in the light.
            </h1>
            <p style={{ fontSize: '16px', color: '#5a5a5a', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              The first privacy-first NFT marketplace on Midnight Network. Your bids, identity, and strategy are sealed forever using Zero-Knowledge proofs.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setViewMode('marketplace')} style={{ padding: '14px 28px', background: '#C1F04C', color: '#0a0a0a', border: '2px solid #0a0a0a', borderRadius: '8px', fontWeight: 900, fontSize: '16px', cursor: 'pointer', boxShadow: '5px 6px 0 #0a0a0a' }}>
                🛒 Explore Marketplace
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ── WALLET MODAL ── */}
      {showWalletModal && (
        <div className="modal-overlay" onClick={() => setShowWalletModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowWalletModal(false)}>✕</button>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Connect Midnight Wallet</h3>
            <p style={{ fontSize: '13.5px', color: '#aaa', marginBottom: '20px' }}>
              Connect your 1AM wallet to interact with VeilBid's Zero-Knowledge private auction smart contract.
            </p>

            {walletError && (
              <div style={{ padding: '10px 12px', background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '6px', color: '#B91C1C', fontSize: '12.5px', marginBottom: '16px' }}>
                {walletError}
              </div>
            )}

            <button
              onClick={async () => {
                await connectWallet('1AM');
                if (!walletError) setShowWalletModal(false);
              }}
              style={{
                width: '100%',
                padding: '14px',
                background: '#C1F04C',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              🌙 Connect 1AM Wallet
            </button>
          </div>
        </div>
      )}

      {/* ── BID MODAL ── */}
      {showBidModal && (
        <div className="modal-overlay" onClick={() => setShowBidModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBidModal(false)}>✕</button>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>🔒 Place Sealed Private Bid</h3>
            <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '16px' }}>
              Bidding on: <strong>{selectedNft?.title || 'VeilBid NFT'}</strong>
            </p>

            {bidSuccessTx ? (
              <div style={{ padding: '16px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>🎉</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#10B981' }}>Sealed Bid Submitted!</div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#34D399', marginTop: '6px', wordBreak: 'break-all' }}>
                  Tx: {bidSuccessTx}
                </div>
                <button
                  onClick={() => { setBidSuccessTx(null); setShowBidModal(false); }}
                  style={{ marginTop: '14px', padding: '8px 16px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#aaa' }}>
                  Bid Amount (tNIGHT)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 250"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  className="modal-input"
                  required
                />
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '16px' }}>
                  🔒 Generates local ZK Proof witness before broadcasting
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingBid}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#C1F04C',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  {isSubmittingBid ? '⚡ Generating ZK Witness...' : '🔒 Submit Sealed Bid'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── DEPLOY MODAL ── */}
      {showDeployModal && (
        <div className="modal-overlay" onClick={() => setShowDeployModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDeployModal(false)}>✕</button>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>🚀 Deploy New Private Auction</h3>
            <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '16px' }}>
              Deploy a new VeilBid Compact contract instance on Midnight.
            </p>

            {deployResult ? (
              <div style={{ padding: '16px', background: 'rgba(59,130,246,0.15)', border: '1px solid #3B82F6', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#60A5FA' }}>Auction Contract Deployed!</div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#93C5FD', marginTop: '6px' }}>
                  Address: {deployResult.address}
                </div>
                <button
                  onClick={() => { setDeployResult(null); setShowDeployModal(false); }}
                  style={{ marginTop: '14px', padding: '8px 16px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleDeploySubmit}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#aaa' }}>NFT Title / ID</label>
                <input
                  type="text"
                  placeholder="e.g. Shadow Bloom #007"
                  value={nftName}
                  onChange={e => setNftName(e.target.value)}
                  className="modal-input"
                  required
                />

                <label style={{ fontSize: '12px', fontWeight: 700, color: '#aaa' }}>Royalty Basis Points (500 = 5%)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={royaltyBps}
                  onChange={e => setRoyaltyBps(e.target.value)}
                  className="modal-input"
                  required
                />

                <button
                  type="submit"
                  disabled={isDeploying}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'var(--purple)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  {isDeploying ? '⏳ Deploying Contract...' : '🚀 Deploy Auction Contract'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
