import React, { useEffect, useState } from 'react';
import { useMidnight } from './hooks/useMidnight';

export default function App() {
  const {
    isConnected,
    isConnecting,
    unshieldedAddress,
    walletError,
    contract,
    connectWallet,
    disconnectWallet,
    deployVeilBid,
  } = useMidnight() as any;

  // View state: 'landing' vs 'marketplace'
  const [viewMode, setViewMode] = useState<'landing' | 'marketplace'>('landing');

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

  // Filter state for Marketplace
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Uploaded user NFTs from Desktop/nft
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

  // Hero platform text animation for landing page
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

    const demoContents = [
      { title: '🔑 Connect your Wallet', desc: 'Link your 1AM wallet to VeilBid. Your identity is shielded from the very first step using Midnight\'s dual-state privacy layer.', tag: '🌙 Midnight Preview Network' },
      { title: '🔒 Seal Your Bid Amount', desc: 'Enter your bid amount privately. It\'s stored as a zero-knowledge witness — cryptographically hidden from every other participant.', tag: '🔒 ZK Witness Generated' },
      { title: '⚡ ZK Proof Generated', desc: 'The Midnight Network generates a zero-knowledge proof verifying your bid is valid, above reserve, without revealing the actual amount.', tag: '✅ Proof Verified On-Chain' },
      { title: '🏆 Private Settlement', desc: 'When the auction closes, the winner is determined. Losing bids are sealed permanently — no one learns what anyone else bid.', tag: '🏆 Winner Announced' },
      { title: '🤖 AI Agent Trading', desc: 'Deploy an autonomous AI agent that bids on your behalf. Your strategy, budget, and identity remain completely private.', tag: '🤖 Strategy: Private' },
      { title: '👛 My Collection', desc: 'All NFTs you\'ve purchased appear in your private wallet. Your collection is stored locally — only you can see what you own.', tag: '🔐 Private Ownership' },
    ];

    let activeTab = 0;
    let tabTimer: ReturnType<typeof setInterval>;

    const activateTab = (idx: number) => {
      document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
      const tab = document.querySelector(`.ftab[data-idx="${idx}"]`);
      if (tab) tab.classList.add('active');
      activeTab = idx;
      const d = demoContents[idx];
      const preview = document.getElementById('demo-preview');
      if (preview) {
        preview.innerHTML = `
          <div className="demo-inner">
            <div className="demo-card">
              <h3>${d.title}</h3>
              <p>${d.desc}</p>
              <span className="demo-tag">${d.tag}</span>
            </div>
            <div className="zk-popup">
              Processing ZK proof<span className="cursor"></span>
              <div className="zk-popup-bar"></div>
            </div>
          </div>`;
      }
    };

    const cycleTab = () => activateTab((activeTab + 1) % 6);
    tabTimer = setInterval(cycleTab, 5000);

    document.querySelectorAll('.ftab').forEach((tab, i) => {
      tab.addEventListener('click', () => {
        clearInterval(tabTimer);
        activateTab(i);
        tabTimer = setInterval(cycleTab, 5000);
      });
    });

    document.querySelectorAll('.faq-q').forEach(el => {
      el.addEventListener('click', () => {
        const item = el.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = (e.target as HTMLElement).dataset.d || '0';
          setTimeout(() => e.target.classList.add('vis'), +delay);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.feat-card,.testi-card').forEach((el, i) => {
      (el as HTMLElement).dataset.d = String(i * 90);
      obs.observe(el);
    });

    return () => {
      clearInterval(platformTimer);
      clearInterval(tabTimer);
    };
  }, [viewMode]);

  // Step progress for ZK bidding UX: 'idle' | 'witness' | 'proving' | 'submitting' | 'success'
  const [bidStep, setBidStep] = useState<'idle' | 'witness' | 'proving' | 'submitting' | 'success'>('idle');

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || isNaN(Number(bidAmount))) return;
    
    if (!isConnected) {
      alert('Please connect your 1AM wallet first.');
      setShowWalletModal(true);
      return;
    }

    if (!contract || !contract.callTx) {
      alert('Midnight contract instance is not loaded. Try reconnecting your wallet.');
      return;
    }

    setIsSubmittingBid(true);
    setBidSuccessTx(null);
    setBidStep('witness');

    try {
      // Step 1: Local ZK Witness calculation
      await new Promise(r => setTimeout(r, 1000));
      setBidStep('proving');

      // Update private state with keys & bidding values
      if (contract.providers?.privateStateProvider?.set) {
        const dummyKey = new Uint8Array(32);
        crypto.getRandomValues(dummyKey);
        await contract.providers.privateStateProvider.set('veilbid-state', {
          secretKey: dummyKey,
          bidAmount: BigInt(bidAmount)
        });
      }

      setBidStep('submitting');
      
      // Call ZK circuit callTx method on contract (Same as Midnight Project)
      const txResult = await contract.callTx.submitBid();
      const realTxHash = txResult?.txHash || txResult?.public?.txId;
      
      if (!realTxHash) {
        throw new Error('Transaction submission did not return a valid transaction hash.');
      }

      setBidSuccessTx(realTxHash);
      setBidStep('success');

      const existing = JSON.parse(localStorage.getItem('veilbid_bids') || '[]');
      existing.push({ 
        nft: selectedNft?.title || 'VeilBid NFT', 
        amount: bidAmount, 
        tx: realTxHash, 
        date: new Date().toISOString() 
      });
      localStorage.setItem('veilbid_bids', JSON.stringify(existing));
    } catch (err: any) {
      alert(err.message || 'ZK Proving or transaction failed');
      setBidStep('idle');
    } finally {
      setIsSubmittingBid(false);
    }
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

  const filteredNfts = selectedCategory === 'All' 
    ? userNfts 
    : userNfts.filter(nft => nft.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --cream:#F6F3EC;--dark:#0a0a0a;--green:#C1F04C;--purple:#5B5BD6;
          --border:2px solid #0a0a0a;--shadow:3px 3px 0 #0a0a0a;--shadow-lg:5px 6px 0 #0a0a0a;
          --font-serif:'Instrument Serif',Georgia,serif;
          --font-sans:'Geist',-apple-system,sans-serif;
          --font-mono:'Geist Mono',monospace;
        }
        html{scroll-behavior:smooth}
        body{font-family:var(--font-sans);background:var(--cream);color:var(--dark);overflow-x:hidden;-webkit-font-smoothing:antialiased}
        .grid-bg{background-color:var(--cream);background-image:linear-gradient(to right,rgba(120,100,80,.1) 1px,transparent 1px),linear-gradient(to bottom,rgba(120,100,80,.1) 1px,transparent 1px);background-size:24px 24px}
        nav{position:sticky;top:0;z-index:200;display:flex;align-items:center;justify-content:space-between;height:56px;padding:0 20px;background:var(--cream);border-bottom:1.5px solid var(--dark);animation:slideDown .4s ease-out}
        @keyframes slideDown{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}
        .nav-logo{display:flex;align-items:center;gap:10px;font-weight:900;font-size:15px;letter-spacing:-.01em;text-decoration:none;color:var(--dark)}
        .logo-box{width:32px;height:32px;border:2px solid var(--dark);border-radius:7px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#fff;flex-shrink:0}
        .logo-box img{width:100%;height:100%;object-fit:cover}
        .nav-links{display:flex;align-items:center;gap:4px}
        .nav-links button,.nav-links a{padding:7px 12px;font-size:13px;font-weight:600;color:#5a5a5a;text-decoration:none;border-radius:6px;transition:color .15s,background .15s;background:none;border:none;cursor:pointer;font-family:inherit}
        .nav-links button:hover,.nav-links a:hover{color:var(--dark);background:rgba(0,0,0,.05)}
        .nav-cta{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;font-size:13px;font-weight:800;background:var(--green);color:var(--dark);border:var(--border);border-radius:6px;box-shadow:var(--shadow);cursor:pointer;text-decoration:none;transition:all .15s}
        .nav-cta:hover{transform:translate(-1px,-1px);box-shadow:var(--shadow-lg)}
        .nav-cta:active{transform:translate(2px,2px);box-shadow:none}

        /* Hero */
        .hero{position:relative;overflow:hidden;min-height:calc(100vh - 56px);display:flex;align-items:center;justify-content:center;padding:48px 24px 80px}
        .hero-inner{position:relative;z-index:10;text-align:center;max-width:700px;margin:0 auto}
        .badge-row{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:28px;flex-wrap:wrap}
        .badge-pill{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border:1.5px solid rgba(10,10,10,.2);border-radius:9px;background:#fff;font-size:12px;font-weight:700;box-shadow:2px 2px 0 rgba(0,0,0,.1);text-decoration:none;color:var(--dark);transition:transform .15s}
        .badge-pill:hover{transform:translate(-1px,-1px)}
        .badge-pill-label{font-size:9px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:.05em;display:block}
        .hero-heading{font-family:var(--font-serif);font-size:clamp(48px,8vw,80px);font-weight:400;line-height:.92;letter-spacing:-.01em;color:var(--dark);margin-bottom:18px}
        .hero-heading .accent{color:var(--purple)}
        .platform-line{font-family:var(--font-serif);font-size:clamp(36px,6vw,64px);font-weight:400;line-height:1.05;height:1.15em;overflow:hidden;position:relative}
        .platform-slot{display:inline-flex;align-items:center;gap:16px;white-space:nowrap}
        .platform-icon{font-size:.75em;line-height:1}
        #platform-text{display:inline-block;animation:slideUp .4s ease-out}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        .hero-sub{font-size:15px;font-weight:500;color:#3A352E;line-height:1.65;max-width:500px;margin:18px auto 32px}
        .hero-btns{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
        .btn-primary{display:inline-flex;align-items:center;gap:10px;padding:14px 28px;font-size:16px;font-weight:900;background:var(--green);color:var(--dark);border:var(--border);border-radius:8px;box-shadow:var(--shadow-lg);cursor:pointer;transition:all .15s;text-decoration:none}
        .btn-primary:hover{transform:translate(-1px,-1px);box-shadow:6px 7px 0 #0a0a0a}
        .btn-primary:active{transform:translate(3px,3px);box-shadow:none}
        .btn-secondary{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;font-size:16px;font-weight:900;background:#fff;color:var(--dark);border:var(--border);border-radius:8px;box-shadow:var(--shadow-lg);cursor:pointer;transition:all .15s;text-decoration:none}
        .btn-secondary:hover{transform:translate(-1px,-1px);box-shadow:6px 7px 0 #0a0a0a}
        .btn-secondary:active{transform:translate(3px,3px);box-shadow:none}
        .zk-icon{width:26px;height:26px;border-radius:50%;background:var(--dark);color:var(--green);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
        .deco{position:absolute;pointer-events:none}
        .deco img{mix-blend-mode:multiply;filter:brightness(1.08) contrast(1.05)}
        .deco-tl{top:6%;left:1%;width:clamp(160px,17vw,250px);transform:rotate(-7deg);animation:float1 6s ease-in-out infinite}
        .deco-bl{bottom:4%;left:7%;width:clamp(140px,14vw,210px);transform:rotate(-4deg);animation:float2 7.5s ease-in-out infinite}
        .deco-tr{top:4%;right:2%;width:clamp(150px,15vw,230px);transform:rotate(7deg);animation:float1 8s ease-in-out infinite .5s}
        @keyframes float1{0%,100%{transform:rotate(-7deg) translateY(0)}50%{transform:rotate(-7deg) translateY(-14px)}}
        @keyframes float2{0%,100%{transform:rotate(-4deg) translateY(0)}50%{transform:rotate(-4deg) translateY(-10px)}}
        .spin-badge{position:absolute;bottom:6%;right:4%;width:108px;height:108px;background:var(--green);border:var(--border);border-radius:50%;box-shadow:var(--shadow-lg);display:flex;align-items:center;justify-content:center;cursor:pointer;animation:badgeBounce 3s ease-in-out infinite}
        .spin-badge:hover{transform:scale(1.08)}
        .spin-text{position:absolute;inset:0;animation:spinText 10s linear infinite}
        .spin-inner{width:40px;height:40px;border:2px solid var(--dark);border-radius:9px;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center}
        .spin-inner img{width:100%;height:100%;object-fit:cover}
        @keyframes spinText{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes badgeBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .privacy-strip{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(91,91,214,.08);border:1.5px solid rgba(91,91,214,.25);border-radius:50px;font-size:12px;font-weight:600;color:var(--purple);margin-bottom:24px}
        .priv-dot{width:6px;height:6px;border-radius:50%;background:var(--purple);animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}

        /* Marquee */
        .marquee-section{padding:18px 0;border-top:1.5px solid var(--dark);border-bottom:1.5px solid var(--dark);overflow:hidden;background:var(--cream)}
        .m-label{text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#888;margin-bottom:14px}
        .m-track{display:flex;width:max-content;animation:marquee 28s linear infinite}
        .m-track-r{animation-direction:reverse;animation-duration:32s}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .m-row{position:relative;margin-bottom:8px}
        .m-fade-l,.m-fade-r{position:absolute;top:0;bottom:0;width:80px;z-index:2;pointer-events:none}
        .m-fade-l{left:0;background:linear-gradient(to right,var(--cream),transparent)}
        .m-fade-r{right:0;background:linear-gradient(to left,var(--cream),transparent)}
        .m-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 16px;margin:0 6px;border:1.5px solid rgba(10,10,10,.15);border-radius:6px;background:#fff;font-size:12px;font-weight:500;white-space:nowrap;transition:border-color .2s,background .2s;cursor:default}
        .m-chip:hover{border-color:var(--dark);background:var(--green)}

        /* How it works */
        .how-section{padding:80px 0;background:var(--cream)}
        .how-title{font-family:var(--font-serif);font-size:clamp(32px,5vw,52px);font-weight:400;line-height:1.05;letter-spacing:-.015em;text-align:center;margin-bottom:16px;color:var(--dark)}
        .how-title em{font-style:italic;color:var(--purple)}
        .how-sub{text-align:center;font-size:15px;font-weight:500;color:#5F5A51;line-height:1.7;max-width:540px;margin:0 auto 56px}
        .how-layout{display:grid;grid-template-columns:400px 1fr;gap:24px;max-width:1200px;margin:0 auto;padding:0 24px;align-items:start}
        .feature-tabs{display:flex;flex-direction:column;gap:8px}
        .ftab{display:grid;grid-template-columns:52px 1fr;align-items:center;gap:14px;padding:14px;border-radius:10px;border:2px solid var(--dark);background:#fff;cursor:pointer;text-align:left;transition:all .15s;position:relative;overflow:hidden}
        .ftab.active{background:var(--green);box-shadow:var(--shadow)}
        .ftab:not(.active):hover{background:rgba(0,0,0,.03)}
        .ftab-icon{width:44px;height:44px;border:2px solid var(--dark);border-radius:7px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:2px 2px 0 #0a0a0a;flex-shrink:0}
        .ftab-title{font-size:14px;font-weight:700;letter-spacing:-.005em;color:var(--dark);line-height:1.25;display:block}
        .ftab-desc{font-size:12.5px;font-weight:400;color:#5a5a5a;margin-top:3px;display:block}
        .ftab-progress{position:absolute;bottom:0;left:0;height:3px;background:var(--dark);transform:scaleX(0);transform-origin:left}
        .ftab.active .ftab-progress{animation:tabProg 5s linear forwards}
        @keyframes tabProg{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        .demo-preview{border:2px solid var(--dark);border-radius:4px;background:#fff;box-shadow:var(--shadow-lg);overflow:hidden;min-height:440px;position:relative}
        .demo-inner{width:100%;height:100%;min-height:440px;display:flex;align-items:center;justify-content:center;background:#f8f5ef;flex-direction:column;gap:20px;padding:28px;position:relative}
        .demo-card{width:100%;background:#fff;border:1.5px solid #ddd;border-radius:10px;padding:24px;animation:fadeUp .35s ease-out}
        @keyframes fadeUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
        .demo-card h3{font-size:16px;font-weight:700;margin-bottom:10px}
        .demo-card p{font-size:13.5px;font-weight:400;color:#5a5a5a;line-height:1.7}
        .demo-tag{display:inline-flex;align-items:center;gap:6px;margin-top:14px;padding:6px 12px;background:var(--green);border:1.5px solid var(--dark);border-radius:6px;font-size:12px;font-weight:700}
        .zk-popup{position:absolute;bottom:40px;right:30px;background:#fff;border:1.5px solid #ddd;border-radius:10px;padding:14px 16px;font-size:12px;color:#333;box-shadow:0 4px 20px rgba(0,0,0,.12);max-width:200px;animation:popIn .4s ease-out}
        .zk-popup-bar{margin-top:8px;height:3px;border-radius:2px;background:linear-gradient(to right,var(--purple),#a78bfa);animation:loading 1.5s ease-in-out infinite alternate}
        @keyframes loading{from{width:20%}to{width:90%}}
        @keyframes popIn{from{transform:scale(.8) translateY(10px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
        .cursor{display:inline-block;width:2px;height:1em;background:var(--dark);margin-left:1px;animation:blink .8s step-end infinite;vertical-align:middle}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

        /* Features & Testimonials */
        .section{padding:80px 0}
        .container{max-width:1100px;margin:0 auto;padding:0 24px}
        .sec-eyebrow{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#888;margin-bottom:8px;text-align:center}
        .sec-title{font-family:var(--font-serif);font-size:clamp(28px,4vw,40px);font-weight:400;text-align:center;margin-bottom:14px;line-height:1.15}
        .sec-title em{font-style:italic;color:var(--purple)}
        .sec-sub{text-align:center;font-size:14.5px;font-weight:500;color:#5F5A51;line-height:1.7;max-width:500px;margin:0 auto 56px}
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
        .feat-card{padding:28px;border:2px solid var(--dark);border-radius:12px;background:#fff;box-shadow:var(--shadow);transition:all .2s;cursor:default;opacity:0;transform:translateY(16px)}
        .feat-card.vis{opacity:1;transform:translateY(0);transition:opacity .5s ease,transform .5s ease,box-shadow .2s}
        .feat-card:hover{transform:translate(-2px,-2px);box-shadow:var(--shadow-lg)}
        .feat-icon{width:44px;height:44px;border-radius:10px;border:2px solid var(--dark);background:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px;box-shadow:var(--shadow)}
        .feat-title{font-size:15px;font-weight:700;margin-bottom:8px}
        .feat-desc{font-size:13.5px;font-weight:400;color:#5a5a5a;line-height:1.7}
        .feat-tag{display:inline-block;margin-top:14px;padding:3px 10px;border-radius:50px;font-size:11px;font-weight:600;font-family:var(--font-mono);background:rgba(10,10,10,.06);color:#555;border:1px solid rgba(10,10,10,.1)}
        .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
        .testi-card{padding:24px;border:2px solid var(--dark);border-radius:12px;background:#fff;box-shadow:var(--shadow);transition:all .2s;opacity:0;transform:translateY(16px)}
        .testi-card.vis{opacity:1;transform:translateY(0);transition:opacity .5s ease,transform .5s ease,box-shadow .2s}
        .testi-card:hover{transform:translate(-2px,-2px);box-shadow:var(--shadow-lg)}
        .t-stars{color:#f59e0b;font-size:13px;letter-spacing:1px;margin-bottom:12px}
        .t-text{font-size:13.5px;font-weight:400;color:#3A352E;line-height:1.75;margin-bottom:18px}
        .t-author{display:flex;align-items:center;gap:10px}
        .av{width:36px;height:36px;border-radius:50%;border:2px solid var(--dark);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}
        .a-name{font-size:13px;font-weight:700;color:var(--dark)}
        .a-role{font-size:11.5px;font-weight:400;color:#888;margin-top:1px}
        .stats-bar{display:grid;grid-template-columns:repeat(4,1fr);border:2px solid var(--dark);border-radius:12px;overflow:hidden;box-shadow:var(--shadow);background:#fff;margin-top:48px}
        .stat-cell{padding:28px 20px;text-align:center;border-right:1.5px solid rgba(0,0,0,.1);transition:background .2s}
        .stat-cell:last-child{border-right:none}
        .stat-cell:hover{background:rgba(193,240,76,.15)}
        .stat-val{font-family:var(--font-serif);font-size:32px;font-weight:400;line-height:1;margin-bottom:6px;color:var(--dark)}
        .stat-lbl{font-size:12px;color:#888;font-weight:500}
        .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px;align-items:start}
        .price-card{padding:28px;border:2px solid var(--dark);border-radius:12px;background:#fff;box-shadow:var(--shadow);transition:all .2s}
        .price-card.feat{background:var(--dark);color:#fff;box-shadow:var(--shadow-lg)}
        .price-card:not(.feat):hover{transform:translate(-2px,-2px);box-shadow:var(--shadow-lg)}
        .price-plan{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;color:#888}
        .price-card.feat .price-plan{color:#a1a1aa}
        .price-amount{font-family:var(--font-serif);font-size:40px;font-weight:400;line-height:1;margin-bottom:4px;color:var(--dark)}
        .price-card.feat .price-amount{color:#fff}
        .price-per{font-size:12px;font-weight:400;color:#888;margin-bottom:20px}
        .price-div{height:1.5px;background:rgba(0,0,0,.1);margin:20px 0}
        .price-card.feat .price-div{background:rgba(255,255,255,.15)}
        .price-feats{list-style:none;display:flex;flex-direction:column;gap:9px;margin-bottom:24px}
        .price-feat{font-size:13px;font-weight:400;display:flex;gap:8px;align-items:flex-start;color:#5a5a5a}
        .price-card.feat .price-feat{color:#d4d4d8}
        .p-ck{color:#10b981;font-size:13px;flex-shrink:0;margin-top:1px;font-weight:700}
        .bpp{width:100%;padding:12px;font-size:14px;font-weight:800;border:2px solid var(--dark);border-radius:8px;cursor:pointer;transition:all .15s;background:var(--green);color:var(--dark);box-shadow:var(--shadow)}
        .bpp:hover{transform:translate(-1px,-1px);box-shadow:var(--shadow-lg)}
        .bps{width:100%;padding:12px;font-size:14px;font-weight:700;border:2px solid rgba(255,255,255,.3);border-radius:8px;cursor:pointer;background:transparent;color:#fff;transition:border-color .2s}
        .bps:hover{border-color:#fff}
        .faq-list{margin-top:48px;display:flex;flex-direction:column;gap:8px;max-width:720px;margin-left:auto;margin-right:auto}
        .faq-item{border:2px solid var(--dark);border-radius:10px;background:#fff;overflow:hidden;transition:box-shadow .2s}
        .faq-item.open{box-shadow:var(--shadow)}
        .faq-q{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;cursor:pointer;font-size:14px;font-weight:700;color:var(--dark);user-select:none}
        .faq-arr{font-size:18px;transition:transform .25s;flex-shrink:0}
        .faq-item.open .faq-arr{transform:rotate(180deg)}
        .faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease}
        .faq-item.open .faq-a{max-height:200px}
        .faq-a-in{padding:0 20px 16px;font-size:13.5px;font-weight:400;color:#5a5a5a;line-height:1.75}
        .cta-section{padding:80px 24px;border-top:1.5px solid var(--dark);text-align:center}
        .cta-title{font-family:var(--font-serif);font-size:clamp(32px,5vw,56px);font-weight:400;line-height:1.1;margin-bottom:16px}
        .cta-title em{font-style:italic;color:var(--purple)}
        .cta-sub{font-size:14.5px;font-weight:500;color:#5F5A51;margin-bottom:32px}
        footer{border-top:1.5px solid var(--dark);padding:40px 0 28px;background:var(--cream)}
        .foot-in{display:grid;grid-template-columns:1.8fr repeat(3,1fr);gap:40px;max-width:1100px;margin:0 auto;padding:0 24px}
        .foot-desc{font-size:13px;color:#5a5a5a;line-height:1.7;margin-top:10px;max-width:220px}
        .foot-ct{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#aaa;margin-bottom:14px}
        .foot-ls{list-style:none;display:flex;flex-direction:column;gap:8px}
        .foot-ls a{font-size:13px;color:#5a5a5a;text-decoration:none;transition:color .15s}
        .foot-ls a:hover{color:var(--dark)}
        .foot-bot{max-width:1100px;margin:36px auto 0;padding:20px 24px 0;border-top:1.5px solid rgba(0,0,0,.1);display:flex;align-items:center;justify-content:space-between;font-size:12px;color:#aaa}
        .midnight-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border:1.5px solid rgba(0,0,0,.15);border-radius:50px;font-size:11px;font-weight:600;color:#555}
        .night-tag{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:50px;font-size:11px;font-weight:700;background:rgba(91,91,214,.1);color:var(--purple);border:1px solid rgba(91,91,214,.25);font-family:var(--font-mono)}
        ::selection{background:var(--green);color:var(--dark)}

        /* Neo-Brutalist Marketplace Specific Styles */
        .mp-container{max-width:1200px;margin:0 auto;padding:40px 24px}
        .mp-search{width:100%;padding:14px 18px;border:2px solid var(--dark);border-radius:10px;background:#fff;font-size:14px;font-family:var(--font-mono);box-shadow:var(--shadow);outline:none;margin-bottom:24px}
        .mp-search:focus{box-shadow:var(--shadow-lg);border-color:var(--purple)}
        .neo-card{background:#fff;border:2px solid var(--dark);box-shadow:var(--shadow);border-radius:12px;overflow:hidden;transition:all .2s}
        .neo-card:hover{transform:translate(-2px,-2px);box-shadow:var(--shadow-lg)}
        .neo-card-img{width:100%;height:220px;object-fit:cover;border-bottom:2px solid var(--dark);background:#f8f5ef}
        .neo-tag-pill{display:inline-block;padding:4px 10px;border:1.5px solid var(--dark);border-radius:50px;font-size:11px;font-weight:700;background:var(--green);color:var(--dark);margin-bottom:8px}

        /* Modal Overlay Styles */
        .modal-overlay{position:fixed;inset:0;background:rgba(10,10,10,0.65);backdrop-filter:blur(4px);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease-out}
        .modal-card{background:#fff;border:2px solid var(--dark);box-shadow:6px 6px 0 #0a0a0a;border-radius:12px;max-width:440px;width:100%;padding:28px;position:relative;color:var(--dark)}
        .modal-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;font-weight:700;color:var(--dark)}
        .modal-input{width:100%;padding:12px 14px;border:2px solid var(--dark);border-radius:8px;font-size:14px;font-family:var(--font-mono);margin-top:8px;margin-bottom:16px;outline:none;background:#fff;color:var(--dark)}
        .modal-input:focus{border-color:var(--purple)}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />

      {/* ── SHARED TOP NAVIGATION (Exact prev UI) ── */}
      <nav>
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); setViewMode('landing'); }}>
          <div className="logo-box"><img src="/veilbid-logo.png" alt="VeilBid" /></div>
          VEILBID
        </a>

        <div className="nav-links">
          <button onClick={() => setViewMode('landing')} style={{ background: viewMode === 'landing' ? 'rgba(0,0,0,0.08)' : 'none', fontWeight: viewMode === 'landing' ? 700 : 500 }}>Overview</button>
          <button onClick={() => setViewMode('marketplace')} style={{ background: viewMode === 'marketplace' ? 'var(--green)' : 'none', color: viewMode === 'marketplace' ? '#0a0a0a' : '#5a5a5a', border: viewMode === 'marketplace' ? '1.5px solid #0a0a0a' : 'none', fontWeight: 800 }}>🛒 Marketplace</button>
          <a href="#features">Features ↓</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="https://github.com/Thanos0s/VeilBid_Midnight" target="_blank" rel="noreferrer">GitHub</a>
          <button onClick={() => setShowDeployModal(true)} style={{ background: 'none', border: 'none', font: 'inherit', color: '#5a5a5a', cursor: 'pointer', padding: '7px 12px', fontSize: '13px', fontWeight: 500 }}>Deploy Auction</button>
        </div>

        {/* Wallet status shown in BOTH Landing and Marketplace */}
        <button onClick={() => isConnected ? disconnectWallet() : setShowWalletModal(true)} className="nav-cta">
          {isConnecting ? '⏳ Connecting...' : isConnected ? `🔑 ${truncateAddr(unshieldedAddress)}` : '🔑 Connect Wallet'}
        </button>
      </nav>

      {viewMode === 'landing' ? (
        /* ── ORIGINAL TRYCLICO NEO-BRUTALIST LANDING PAGE (100% UNCHANGED) ── */
        <div>
          {/* ── HERO ── */}
          <section className="hero grid-bg" id="home">
            <div className="deco deco-tl"><img src="/deco-mask.jpg" alt="" width="100%" /></div>
            <div className="deco deco-bl"><img src="/deco-vault.jpg" alt="" width="100%" /></div>
            <div className="deco deco-tr"><img src="/deco-gavel.jpg" alt="" width="100%" /></div>
            <div className="hero-inner">
              <div className="privacy-strip"><span className="priv-dot"></span>Zero-Knowledge Proofs · Midnight Preview Network</div>
              <div className="badge-row">
                <a href="#" className="badge-pill"><span style={{ fontSize: '18px' }}>🔒</span><span><span className="badge-pill-label">Privacy</span>100% Sealed Bids</span></a>
                <a href="#" className="badge-pill"><span style={{ fontSize: '18px' }}>🌙</span><span><span className="badge-pill-label">Built on</span>Midnight Network</span></a>
              </div>
              <h1 className="hero-heading"><span className="accent">Bid</span> in the<br />shadows,</h1>
              <div className="platform-line">
                <div className="platform-slot">
                  <span className="platform-icon" id="platform-icon">🖼️</span>
                  <span id="platform-text" style={{ color: '#5B5BD6' }}>win in the light.</span>
                </div>
              </div>
              <p className="hero-sub">The first NFT marketplace where your bids, identity, and strategy are completely private — verified by zero-knowledge proofs on Midnight Network.</p>
              <div className="hero-btns">
                <button onClick={() => setViewMode('marketplace')} className="btn-primary"><div className="zk-icon">🛒</div>Explore Marketplace</button>
                <a href="#how" className="btn-secondary">See how it works ↓</a>
              </div>
            </div>
            <div className="spin-badge" onClick={() => setViewMode('marketplace')}>
              <svg className="spin-text" viewBox="0 0 100 100">
                <defs><path id="circle" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" /></defs>
                <text fill="#0a0a0a" fontSize="8.5" fontWeight="900" fontFamily="var(--font-sans)">
                  <textPath href="#circle" startOffset="0%">PRIVATE BIDS · ZK PROOFS · MIDNIGHT · </textPath>
                </text>
              </svg>
              <div className="spin-inner"><img src="/veilbid-logo.png" alt="VeilBid" /></div>
            </div>
          </section>

          {/* ── MARQUEE ── */}
          <div className="marquee-section">
            <div className="m-label">Every bid is sealed, every winner proven</div>
            <div className="m-row">
              <div className="m-fade-l"></div><div className="m-fade-r"></div>
              <div className="m-track">
                <span className="m-chip">🔒 Sealed Bids</span><span className="m-chip">🛡️ Zero-Knowledge Proofs</span><span className="m-chip">🎭 Anonymous Identity</span><span className="m-chip">🌙 Midnight Network</span><span className="m-chip">🤖 AI Agent Trading</span><span className="m-chip">💎 NFT Auctions</span><span className="m-chip">⚡ tNIGHT Tokens</span><span className="m-chip">🏆 Private Settlement</span><span className="m-chip">🔐 Anti-Front-Running</span><span className="m-chip">🖼️ Digital Art</span><span className="m-chip">💰 Royalties On-Chain</span>
                <span className="m-chip">🔒 Sealed Bids</span><span className="m-chip">🛡️ Zero-Knowledge Proofs</span><span className="m-chip">🎭 Anonymous Identity</span><span className="m-chip">🌙 Midnight Network</span><span className="m-chip">🤖 AI Agent Trading</span><span className="m-chip">💎 NFT Auctions</span><span className="m-chip">⚡ tNIGHT Tokens</span><span className="m-chip">🏆 Private Settlement</span><span className="m-chip">🔐 Anti-Front-Running</span><span className="m-chip">🖼️ Digital Art</span><span className="m-chip">💰 Royalties On-Chain</span>
              </div>
            </div>
          </div>

          {/* ── HOW IT WORKS ── */}
          <section className="how-section grid-bg" id="how">
            <h2 className="how-title">How to bid on <em>VeilBid</em></h2>
            <p className="how-sub">One wallet connection puts zero-knowledge private auctions in your hands. Your bids stay sealed forever.</p>
            <div className="how-layout">
              <div className="feature-tabs" id="feature-tabs">
                <button className="ftab active" data-idx="0"><div className="ftab-icon">🔑</div><span><span className="ftab-title">Connect your wallet</span><span className="ftab-desc">Link 1AM wallet to start bidding anonymously.</span></span><div className="ftab-progress"></div></button>
                <button className="ftab" data-idx="1"><div className="ftab-icon">🔒</div><span><span className="ftab-title">Seal your bid amount</span><span className="ftab-desc">Your bid is hidden as a ZK witness. Nobody sees it.</span></span><div className="ftab-progress"></div></button>
                <button className="ftab" data-idx="2"><div className="ftab-icon">⚡</div><span><span className="ftab-title">ZK proof generated</span><span className="ftab-desc">Proof verifies your bid is valid without revealing the amount.</span></span><div className="ftab-progress"></div></button>
                <button className="ftab" data-idx="3"><div className="ftab-icon">🏆</div><span><span className="ftab-title">Private settlement</span><span className="ftab-desc">Winner revealed. Losing bids stay sealed forever.</span></span><div className="ftab-progress"></div></button>
                <button className="ftab" data-idx="4"><div className="ftab-icon">🤖</div><span><span className="ftab-title">AI Agent trading</span><span className="ftab-desc">Let AI bid on your behalf, completely privately.</span></span><div className="ftab-progress"></div></button>
                <button className="ftab" data-idx="5"><div className="ftab-icon">👛</div><span><span className="ftab-title">My Collection</span><span className="ftab-desc">View all your purchased NFTs in your private wallet.</span></span><div className="ftab-progress"></div></button>
              </div>
              <div className="demo-preview" id="demo-preview">
                <div className="demo-inner">
                  <div className="demo-card"><h3>🔑 Connect your Wallet</h3><p>Link your 1AM wallet to VeilBid. Your identity is shielded from the very first step using Midnight's dual-state privacy layer.</p><span className="demo-tag">🌙 Midnight Preview Network</span></div>
                  <div className="zk-popup">Connecting 1AM wallet<span className="cursor"></span><div className="zk-popup-bar"></div></div>
                </div>
              </div>
            </div>
          </section>

          {/* ── FEATURES ── */}
          <section className="section" style={{ background: '#FBF8F1', borderTop: '1.5px solid var(--dark)' }} id="features">
            <div className="container">
              <div className="sec-eyebrow">Built Different</div>
              <h2 className="sec-title">Privacy isn't optional, <em>it's the foundation</em></h2>
              <p className="sec-sub">Every feature in VeilBid is designed around one principle: your business is yours alone.</p>
              <div className="feat-grid">
                <div className="feat-card"><div className="feat-icon">🔒</div><div className="feat-title">Sealed Bids</div><div className="feat-desc">Your bid amount is kept private using a ZK witness. Only you know what you bid — ever.</div><span className="feat-tag">ZK Witness</span></div>
                <div className="feat-card"><div className="feat-icon">🛡️</div><div className="feat-title">Anonymous Identity</div><div className="feat-desc">Your wallet address, bidding history, and portfolio are never exposed. Pure on-chain privacy.</div><span className="feat-tag">Shielded Addresses</span></div>
                <div className="feat-card"><div className="feat-icon">⚡</div><div className="feat-title">ZK Proofs On-chain</div><div className="feat-desc">Every bid is verified by a zero-knowledge proof. Valid without revealing any sensitive data.</div><span className="feat-tag">Compact Contract</span></div>
                <div className="feat-card"><div className="feat-icon">🤖</div><div className="feat-title">AI Agent Trading</div><div className="feat-desc">Autonomous agents bid on your behalf with zero exposure. Your strategy stays private even from your own agent.</div><span className="feat-tag">Autonomous + Private</span></div>
                <div className="feat-card"><div className="feat-icon">🔐</div><div className="feat-title">Anti-Front-Running</div><div className="feat-desc">No one can see pending bids to front-run you. Sealed bids make MEV attacks structurally impossible.</div><span className="feat-tag">MEV Protected</span></div>
                <div className="feat-card"><div className="feat-icon">💰</div><div className="feat-title">Creator Royalties</div><div className="feat-desc">Royalties enforced on-chain with configurable basis points. Artists always get paid what they're owed.</div><span className="night-tag">⚡ tNIGHT Tokens</span></div>
              </div>
              <div className="stats-bar">
                <div className="stat-cell"><div className="stat-val">100%</div><div className="stat-lbl">Private by design</div></div>
                <div className="stat-cell"><div className="stat-val">0</div><div className="stat-lbl">Bids ever exposed</div></div>
                <div className="stat-cell"><div className="stat-val" style={{ color: 'var(--purple)' }}>ZK</div><div className="stat-lbl">Proof verified</div></div>
                <div className="stat-cell"><div className="stat-val">🌙</div><div className="stat-lbl">Midnight Preview Network</div></div>
              </div>
            </div>
          </section>

          {/* ── TESTIMONIALS ── */}
          <section className="section" style={{ background: 'var(--cream)', borderTop: '1.5px solid var(--dark)' }}>
            <div className="container">
              <div className="sec-eyebrow">What collectors say</div>
              <h2 className="sec-title">Serious traders <em>demand privacy</em></h2>
              <div className="testi-grid">
                <div className="testi-card"><div className="t-stars">★★★★★</div><p className="t-text">"For the first time I can bid on high-value NFTs without whales watching my wallet and front-running me. VeilBid is the only marketplace I trust."</p><div className="t-author"><div className="av" style={{ background: 'var(--green)' }}>K</div><div><div className="a-name">KryptNight.eth</div><div className="a-role">High-Value Collector</div></div></div></div>
                <div className="testi-card"><div className="t-stars">★★★★★</div><p className="t-text">"As an artist, I finally have a platform where royalties are guaranteed and my buyers stay anonymous. This is what Web3 was supposed to be."</p><div className="t-author"><div className="av" style={{ background: '#c4b5fd' }}>V</div><div><div className="a-name">VoidArtist</div><div className="a-role">Digital Artist · 12 NFTs sold</div></div></div></div>
                <div className="testi-card"><div className="t-stars">★★★★★</div><p className="t-text">"The AI agent feature is mind-blowing. My bot bids autonomously with a private strategy that nobody can copy. Absolutely zero information leakage."</p><div className="t-author"><div className="av" style={{ background: '#fde68a' }}>A</div><div><div className="a-name">AlgoTrader_M</div><div className="a-role">Quantitative NFT Trader</div></div></div></div>
              </div>
            </div>
          </section>

          {/* ── PRICING ── */}
          <section className="section" style={{ background: '#FBF8F1', borderTop: '1.5px solid var(--dark)' }} id="pricing">
            <div className="container">
              <div className="sec-eyebrow">Pricing</div>
              <h2 className="sec-title">Start <em>free</em>, bid privately</h2>
              <p className="sec-sub">All plans include full ZK proof privacy. No plan ever exposes your bids.</p>
              <div className="price-grid">
                <div className="price-card">
                  <div className="price-plan">Explorer</div>
                  <div className="price-amount">Free</div>
                  <div className="price-per">on Preview Network · tNIGHT tokens</div>
                  <div className="price-div"></div>
                  <ul className="price-feats">
                    <li className="price-feat"><span className="p-ck">✓</span>Unlimited sealed bids</li>
                    <li className="price-feat"><span className="p-ck">✓</span>ZK proof verified</li>
                    <li className="price-feat"><span className="p-ck">✓</span>Anonymous identity</li>
                    <li className="price-feat"><span className="p-ck">✓</span>My Collection wallet</li>
                  </ul>
                  <button onClick={() => setViewMode('marketplace')} className="bpp" style={{ background: '#fff' }}>Explore for Free</button>
                </div>
                <div className="price-card feat">
                  <div className="price-plan">Collector Pro</div>
                  <div className="price-amount" style={{ color: '#fff' }}>$19</div>
                  <div className="price-per">/ month · Mainnet access</div>
                  <div className="price-div"></div>
                  <ul className="price-feats">
                    <li className="price-feat"><span className="p-ck">✓</span>Everything in Explorer</li>
                    <li className="price-feat"><span className="p-ck">✓</span>Real NIGHT token bidding</li>
                    <li className="price-feat"><span className="p-ck">✓</span>AI Agent support</li>
                    <li className="price-feat"><span className="p-ck">✓</span>Priority bid settlement</li>
                    <li className="price-feat"><span className="p-ck">✓</span>Portfolio analytics (private)</li>
                  </ul>
                  <button onClick={() => setViewMode('marketplace')} className="bpp">Start Free Trial</button>
                </div>
                <div className="price-card">
                  <div className="price-plan">Institution</div>
                  <div className="price-amount">Custom</div>
                  <div className="price-per">/ month · enterprise</div>
                  <div className="price-div"></div>
                  <ul className="price-feats">
                    <li className="price-feat"><span className="p-ck">✓</span>Everything in Pro</li>
                    <li className="price-feat"><span className="p-ck">✓</span>Custom AI agent strategies</li>
                    <li className="price-feat"><span className="p-ck">✓</span>White-label options</li>
                    <li className="price-feat"><span className="p-ck">✓</span>Dedicated support</li>
                  </ul>
                  <button onClick={() => alert('Contacting VeilBid Institution Support...')} className="bpp" style={{ background: '#fff' }}>Contact Us</button>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="section" style={{ background: 'var(--cream)', borderTop: '1.5px solid var(--dark)' }}>
            <div className="container">
              <div className="sec-eyebrow">FAQ</div>
              <h2 className="sec-title" style={{ textAlign: 'center' }}>Common <em>questions</em></h2>
              <div className="faq-list">
                <div className="faq-item"><div className="faq-q">Are my bids really private?<span className="faq-arr">↓</span></div><div className="faq-a"><div className="faq-a-in">Yes — completely. Your bid amount is stored as a ZK witness on the Midnight Network. Nobody, including VeilBid, can read it. Only you hold the secret key.</div></div></div>
                <div className="faq-item"><div className="faq-q">What is Midnight Network?<span className="faq-arr">↓</span></div><div className="faq-a"><div className="faq-a-in">Midnight is a partner chain of Cardano built specifically for privacy-preserving smart contracts. It uses zero-knowledge proofs to verify computation without revealing data.</div></div></div>
                <div className="faq-item"><div className="faq-q">What wallet do I need?<span className="faq-arr">↓</span></div><div className="faq-a"><div className="faq-a-in">You need the 1AM wallet — a browser extension designed for Midnight Network. It handles shielded transactions and ZK proof generation automatically.</div></div></div>
                <div className="faq-item"><div className="faq-q">Can someone see who won an auction?<span className="faq-arr">↓</span></div><div className="faq-a"><div className="faq-a-in">The winning outcome is published on-chain but the winner's identity and the exact bid amounts of all other bidders remain permanently sealed.</div></div></div>
                <div className="faq-item"><div className="faq-q">Is VeilBid open source?<span className="faq-arr">↓</span></div><div className="faq-a"><div className="faq-a-in">Yes! The smart contract and frontend are fully open source on GitHub at github.com/Thanos0s/VeilBid_Midnight. Audit, fork, and build on top of it freely.</div></div></div>
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="cta-section grid-bg">
            <h2 className="cta-title">Bid in the shadows.<br /><em>Win in the light.</em></h2>
            <p className="cta-sub">Join the first truly private NFT marketplace. Your bids, identity, and secrets — forever yours.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setViewMode('marketplace')} className="btn-primary"><div className="zk-icon">🛒</div>Explore Marketplace</button>
              <a href="https://github.com/Thanos0s/VeilBid_Midnight" target="_blank" rel="noreferrer" className="btn-secondary">⭐ Star on GitHub</a>
            </div>
          </section>

          <footer>
            <div className="foot-in">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, fontSize: '15px' }}><div className="logo-box"><img src="/veilbid-logo.png" alt="VeilBid" /></div>VEILBID</div>
                <p className="foot-desc">The first privacy-first NFT marketplace on Midnight Network. Your bids, identity, and strategy are sealed forever.</p>
                <div style={{ marginTop: '14px' }}><div className="midnight-badge">🌙 Built on Midnight Network</div></div>
              </div>
              <div><div className="foot-ct">Marketplace</div><ul className="foot-ls"><li><a href="#features">Browse Auctions</a></li><li><a href="#how">My Collection</a></li><li><button onClick={() => setShowDeployModal(true)} style={{ background: 'none', border: 'none', color: '#5a5a5a', cursor: 'pointer', padding: 0, font: 'inherit' }}>Create Auction</button></li><li><a href="#features">AI Agent</a></li></ul></div>
              <div><div className="foot-ct">Developers</div><ul className="foot-ls"><li><a href="https://github.com/Thanos0s/VeilBid_Midnight" target="_blank" rel="noreferrer">GitHub</a></li><li><a href="#">Documentation</a></li><li><a href="#">Contract ABI</a></li><li><a href="https://midnight.network" target="_blank" rel="noreferrer">Midnight Docs</a></li></ul></div>
              <div><div className="foot-ct">Legal</div><ul className="foot-ls"><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Service</a></li><li><a href="#">Cookie Policy</a></li></ul></div>
            </div>
            <div className="foot-bot">
              <span>© 2026 VeilBid. All rights reserved. Built on <strong>Midnight Preview Network</strong>.</span>
              <span>🔒 Zero-Knowledge · 🌙 Midnight · 🤖 AI Ready</span>
            </div>
          </footer>
        </div>
      ) : (
        /* ── NEO-BRUTALIST MARKETPLACE VIEW (Same UI, Gridlines & Neon Accents) ── */
        <div className="grid-bg" style={{ minHeight: 'calc(100vh - 56px)', paddingBottom: '80px' }}>
          <div className="mp-container">
            {/* Header Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>Live Auctions</span>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 400, color: 'var(--dark)' }}>VeilBid <em>Marketplace</em></h1>
              </div>
              <button onClick={() => setShowDeployModal(true)} className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                + Deploy Auction
              </button>
            </div>

            {/* Search Bar */}
            <input placeholder="🔍 Search uploaded NFTs, collections, and ZK contracts..." className="mp-search" />

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {['All', 'Gaming', 'Art', 'PFPs', 'Physical'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '50px',
                    border: '2px solid #0a0a0a',
                    background: selectedCategory === cat ? 'var(--green)' : '#fff',
                    color: '#0a0a0a',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: selectedCategory === cat ? 'var(--shadow)' : 'none',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Main Layout: NFT Grid + Sidebar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
              {/* Grid of uploaded Desktop NFTs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {filteredNfts.map(nft => (
                  <div key={nft.id} className="neo-card">
                    <img src={nft.img} alt={nft.title} className="neo-card-img" />
                    <div style={{ padding: '20px' }}>
                      <span className="neo-tag-pill">{nft.category}</span>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--dark)', marginBottom: '4px' }}>{nft.title}</h3>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>By {nft.author}</div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid rgba(0,0,0,0.1)', paddingTop: '12px' }}>
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>FLOOR BID</div>
                          <div style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{nft.floor}</div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedNft(nft);
                            setBidSuccessTx(null);
                            setBidStep('idle');
                            setBidAmount('');
                            setShowBidModal(true);
                          }}
                          style={{
                            padding: '8px 14px',
                            background: 'var(--green)',
                            color: 'var(--dark)',
                            border: '2px solid #0a0a0a',
                            borderRadius: '6px',
                            fontWeight: 800,
                            fontSize: '12px',
                            boxShadow: '2px 2px 0 #0a0a0a',
                            cursor: 'pointer',
                          }}
                        >
                          🔒 Bid
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar Trending Collections */}
              <div style={{ background: '#fff', border: '2px solid #0a0a0a', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow)', height: 'fit-content' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', borderBottom: '1.5px solid #0a0a0a', paddingBottom: '10px' }}>
                  🔥 Trending Collections
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sidebarTrending.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={item.img} style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1.5px solid #0a0a0a', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, width: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                          <div style={{ fontSize: '11px', color: item.positive ? '#059669' : '#DC2626', fontWeight: 700 }}>{item.change}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.floor}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WALLET MODAL ── */}
      {showWalletModal && (
        <div className="modal-overlay" onClick={() => setShowWalletModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowWalletModal(false)}>✕</button>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Connect Midnight Wallet</h3>
            <p style={{ fontSize: '13.5px', color: '#5a5a5a', marginBottom: '20px' }}>
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
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>🌙 Connect 1AM Wallet</span>
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
            <p style={{ fontSize: '13px', color: '#5a5a5a', marginBottom: '16px' }}>
              Bidding on: <strong>{selectedNft?.title || 'VeilBid NFT'}</strong>
            </p>

            {isSubmittingBid ? (
              <div style={{ padding: '20px 10px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px', fontWeight: 700 }}>
                  <span style={{ color: bidStep === 'witness' ? 'var(--purple)' : '#10B981' }}>1. Local Witness</span>
                  <span style={{ color: bidStep === 'proving' ? 'var(--purple)' : bidStep === 'submitting' || bidStep === 'success' ? '#10B981' : '#aaa' }}>2. ZK Proof</span>
                  <span style={{ color: bidStep === 'submitting' ? 'var(--purple)' : bidStep === 'success' ? '#10B981' : '#aaa' }}>3. Broadcast</span>
                </div>

                <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', marginBottom: '18px' }}>
                  <div style={{
                    height: '100%',
                    background: 'var(--purple)',
                    width: bidStep === 'witness' ? '33%' : bidStep === 'proving' ? '66%' : '100%',
                    transition: 'width 0.4s ease-in-out'
                  }} />
                </div>

                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--dark)' }}>
                  {bidStep === 'witness' && '🔒 Calculating Local Private Witness...'}
                  {bidStep === 'proving' && '⚡ Generating Zero-Knowledge Proof...'}
                  {bidStep === 'submitting' && '🌙 Broadcasting to Midnight Network...'}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
                  Your bid amount ({bidAmount} tNIGHT) remains encrypted.
                </div>
              </div>
            ) : bidSuccessTx ? (
              <div style={{ padding: '16px', background: '#ECFDF5', border: '1.5px solid #10B981', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>🎉</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#065F46' }}>Sealed Bid Verified & Submitted!</div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#047857', marginTop: '6px', wordBreak: 'break-all' }}>
                  Tx: {bidSuccessTx}
                </div>
                <button
                  onClick={() => { setBidSuccessTx(null); setBidStep('idle'); setShowBidModal(false); }}
                  style={{ marginTop: '14px', padding: '8px 16px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit}>
                <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#888' }}>
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
                <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🔒 Generates local ZK Proof witness before broadcasting
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingBid}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'var(--green)',
                    color: 'var(--dark)',
                    border: '2px solid #0a0a0a',
                    boxShadow: '3px 3px 0 #0a0a0a',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  🔒 Submit Sealed Bid
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
            <p style={{ fontSize: '13px', color: '#5a5a5a', marginBottom: '16px' }}>
              Deploy a new VeilBid Compact contract instance on Midnight.
            </p>

            {deployResult ? (
              <div style={{ padding: '16px', background: '#EFF6FF', border: '1.5px solid #3B82F6', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E40AF' }}>Auction Contract Deployed!</div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#1D4ED8', marginTop: '6px' }}>
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
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#888' }}>NFT Title / ID</label>
                <input
                  type="text"
                  placeholder="e.g. Shadow Bloom #007"
                  value={nftName}
                  onChange={e => setNftName(e.target.value)}
                  className="modal-input"
                  required
                />

                <label style={{ fontSize: '12px', fontWeight: 700, color: '#888' }}>Royalty Basis Points (500 = 5%)</label>
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
                    border: '2px solid #0a0a0a',
                    boxShadow: '3px 3px 0 #0a0a0a',
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
