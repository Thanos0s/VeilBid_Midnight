import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Platform cycler
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

    // Feature tab cycle
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
          <div class="demo-inner">
            <div class="demo-card">
              <h3>${d.title}</h3>
              <p>${d.desc}</p>
              <span class="demo-tag">${d.tag}</span>
            </div>
            <div class="zk-popup">
              Processing ZK proof<span class="cursor"></span>
              <div class="zk-popup-bar"></div>
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

    // FAQ
    document.querySelectorAll('.faq-q').forEach(el => {
      el.addEventListener('click', () => {
        const item = el.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    // Scroll reveal
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
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: `
<style>
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
.logo-box{width:30px;height:30px;border:2px solid var(--dark);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;background:var(--dark);color:var(--green)}
.nav-links{display:flex;align-items:center;gap:2px}
.nav-links a{padding:7px 12px;font-size:13px;font-weight:500;color:#5a5a5a;text-decoration:none;border-radius:6px;transition:color .15s,background .15s}
.nav-links a:hover{color:var(--dark);background:rgba(0,0,0,.05)}
.nav-cta{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;font-size:13px;font-weight:800;background:var(--green);color:var(--dark);border:var(--border);border-radius:6px;box-shadow:var(--shadow);cursor:pointer;text-decoration:none;transition:all .15s}
.nav-cta:hover{transform:translate(-1px,-1px);box-shadow:var(--shadow-lg)}
.nav-cta:active{transform:translate(2px,2px);box-shadow:none}
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
.spin-inner{width:40px;height:40px;border:2px solid var(--dark);border-radius:9px;background:var(--dark);display:flex;align-items:center;justify-content:center;font-size:20px}
@keyframes spinText{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes badgeBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.privacy-strip{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(91,91,214,.08);border:1.5px solid rgba(91,91,214,.25);border-radius:50px;font-size:12px;font-weight:600;color:var(--purple);margin-bottom:24px}
.priv-dot{width:6px;height:6px;border-radius:50%;background:var(--purple);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
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
@media(max-width:900px){.how-layout{grid-template-columns:1fr}.feat-grid,.testi-grid,.price-grid{grid-template-columns:1fr}.stats-bar{grid-template-columns:repeat(2,1fr)}.foot-in{grid-template-columns:1fr 1fr}.deco-tl,.deco-bl,.deco-tr,.spin-badge{display:none}.nav-links{display:none}}
@media(max-width:600px){.foot-in{grid-template-columns:1fr}.badge-row{flex-direction:column;align-items:center}.hero-btns{flex-direction:column;width:100%}.btn-primary,.btn-secondary{justify-content:center}}
</style>

<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>

<nav>
  <a href="#" class="nav-logo"><div class="logo-box">🎭</div>VEILBID</a>
  <div class="nav-links">
    <a href="#features">Features ↓</a>
    <a href="#how">How it works</a>
    <a href="#pricing">Pricing</a>
    <a href="https://github.com/Thanos0s/VeilBid_Midnight" target="_blank">GitHub</a>
    <a href="#">Docs</a>
  </div>
  <a href="#" class="nav-cta">🔑 Connect Wallet</a>
</nav>

<section class="hero grid-bg" id="home">
  <div class="deco deco-tl"><img src="/deco-mask.jpg" alt="" width="100%"/></div>
  <div class="deco deco-bl"><img src="/deco-vault.jpg" alt="" width="100%"/></div>
  <div class="deco deco-tr"><img src="/deco-gavel.jpg" alt="" width="100%"/></div>
  <div class="hero-inner">
    <div class="privacy-strip"><span class="priv-dot"></span>Zero-Knowledge Proofs · Midnight Preview Network</div>
    <div class="badge-row">
      <a href="#" class="badge-pill"><span style="font-size:18px">🔒</span><span><span class="badge-pill-label">Privacy</span>100% Sealed Bids</span></a>
      <a href="#" class="badge-pill"><span style="font-size:18px">🌙</span><span><span class="badge-pill-label">Built on</span>Midnight Network</span></a>
    </div>
    <h1 class="hero-heading"><span class="accent">Bid</span> in the<br>shadows,</h1>
    <div class="platform-line">
      <div class="platform-slot">
        <span class="platform-icon" id="platform-icon">🖼️</span>
        <span id="platform-text" style="color:#5B5BD6">win in the light.</span>
      </div>
    </div>
    <p class="hero-sub">The first NFT marketplace where your bids, identity, and strategy are completely private — verified by zero-knowledge proofs on Midnight Network.</p>
    <div class="hero-btns">
      <a href="#" class="btn-primary"><div class="zk-icon">🔒</div>Place Private Bid</a>
      <a href="#how" class="btn-secondary">See how it works ↓</a>
    </div>
  </div>
  <div class="spin-badge">
    <svg class="spin-text" viewBox="0 0 100 100">
      <defs><path id="circle" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"/></defs>
      <text fill="#0a0a0a" font-size="8.5" font-weight="900" font-family="Inter,sans-serif">
        <textPath href="#circle" startOffset="0%">PRIVATE BIDS · ZK PROOFS · MIDNIGHT · </textPath>
      </text>
    </svg>
    <div class="spin-inner">🎭</div>
  </div>
</section>

<div class="marquee-section">
  <div class="m-label">Every bid is sealed, every winner proven</div>
  <div class="m-row">
    <div class="m-fade-l"></div><div class="m-fade-r"></div>
    <div class="m-track">
      <span class="m-chip">🔒 Sealed Bids</span><span class="m-chip">🛡️ Zero-Knowledge Proofs</span><span class="m-chip">🎭 Anonymous Identity</span><span class="m-chip">🌙 Midnight Network</span><span class="m-chip">🤖 AI Agent Trading</span><span class="m-chip">💎 NFT Auctions</span><span class="m-chip">⚡ tNIGHT Tokens</span><span class="m-chip">🏆 Private Settlement</span><span class="m-chip">🔐 Anti-Front-Running</span><span class="m-chip">🖼️ Digital Art</span><span class="m-chip">💰 Royalties On-Chain</span>
      <span class="m-chip">🔒 Sealed Bids</span><span class="m-chip">🛡️ Zero-Knowledge Proofs</span><span class="m-chip">🎭 Anonymous Identity</span><span class="m-chip">🌙 Midnight Network</span><span class="m-chip">🤖 AI Agent Trading</span><span class="m-chip">💎 NFT Auctions</span><span class="m-chip">⚡ tNIGHT Tokens</span><span class="m-chip">🏆 Private Settlement</span><span class="m-chip">🔐 Anti-Front-Running</span><span class="m-chip">🖼️ Digital Art</span><span class="m-chip">💰 Royalties On-Chain</span>
    </div>
  </div>
</div>

<section class="how-section grid-bg" id="how">
  <h2 class="how-title">How to bid on <em>VeilBid</em></h2>
  <p class="how-sub">One wallet connection puts zero-knowledge private auctions in your hands. Your bids stay sealed forever.</p>
  <div class="how-layout">
    <div class="feature-tabs" id="feature-tabs">
      <button class="ftab active" data-idx="0"><div class="ftab-icon">🔑</div><span><span class="ftab-title">Connect your wallet</span><span class="ftab-desc">Link 1AM wallet to start bidding anonymously.</span></span><div class="ftab-progress"></div></button>
      <button class="ftab" data-idx="1"><div class="ftab-icon">🔒</div><span><span class="ftab-title">Seal your bid amount</span><span class="ftab-desc">Your bid is hidden as a ZK witness. Nobody sees it.</span></span><div class="ftab-progress"></div></button>
      <button class="ftab" data-idx="2"><div class="ftab-icon">⚡</div><span><span class="ftab-title">ZK proof generated</span><span class="ftab-desc">Proof verifies your bid is valid without revealing the amount.</span></span><div class="ftab-progress"></div></button>
      <button class="ftab" data-idx="3"><div class="ftab-icon">🏆</div><span><span class="ftab-title">Private settlement</span><span class="ftab-desc">Winner revealed. Losing bids stay sealed forever.</span></span><div class="ftab-progress"></div></button>
      <button class="ftab" data-idx="4"><div class="ftab-icon">🤖</div><span><span class="ftab-title">AI Agent trading</span><span class="ftab-desc">Let AI bid on your behalf, completely privately.</span></span><div class="ftab-progress"></div></button>
      <button class="ftab" data-idx="5"><div class="ftab-icon">👛</div><span><span class="ftab-title">My Collection</span><span class="ftab-desc">View all your purchased NFTs in your private wallet.</span></span><div class="ftab-progress"></div></button>
    </div>
    <div class="demo-preview" id="demo-preview">
      <div class="demo-inner">
        <div class="demo-card"><h3>🔑 Connect your Wallet</h3><p>Link your 1AM wallet to VeilBid. Your identity is shielded from the very first step using Midnight's dual-state privacy layer.</p><span class="demo-tag">🌙 Midnight Preview Network</span></div>
        <div class="zk-popup">Connecting 1AM wallet<span class="cursor"></span><div class="zk-popup-bar"></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section" style="background:#FBF8F1;border-top:1.5px solid var(--dark)" id="features">
  <div class="container">
    <div class="sec-eyebrow">Built Different</div>
    <h2 class="sec-title">Privacy isn't optional, <em>it's the foundation</em></h2>
    <p class="sec-sub">Every feature in VeilBid is designed around one principle: your business is yours alone.</p>
    <div class="feat-grid">
      <div class="feat-card"><div class="feat-icon">🔒</div><div class="feat-title">Sealed Bids</div><div class="feat-desc">Your bid amount is kept private using a ZK witness. Only you know what you bid — ever.</div><span class="feat-tag">ZK Witness</span></div>
      <div class="feat-card"><div class="feat-icon">🛡️</div><div class="feat-title">Anonymous Identity</div><div class="feat-desc">Your wallet address, bidding history, and portfolio are never exposed. Pure on-chain privacy.</div><span class="feat-tag">Shielded Addresses</span></div>
      <div class="feat-card"><div class="feat-icon">⚡</div><div class="feat-title">ZK Proofs On-chain</div><div class="feat-desc">Every bid is verified by a zero-knowledge proof. Valid without revealing any sensitive data.</div><span class="feat-tag">Compact Contract</span></div>
      <div class="feat-card"><div class="feat-icon">🤖</div><div class="feat-title">AI Agent Trading</div><div class="feat-desc">Autonomous agents bid on your behalf with zero exposure. Your strategy stays private even from your own agent.</div><span class="feat-tag">Autonomous + Private</span></div>
      <div class="feat-card"><div class="feat-icon">🔐</div><div class="feat-title">Anti-Front-Running</div><div class="feat-desc">No one can see pending bids to front-run you. Sealed bids make MEV attacks structurally impossible.</div><span class="feat-tag">MEV Protected</span></div>
      <div class="feat-card"><div class="feat-icon">💰</div><div class="feat-title">Creator Royalties</div><div class="feat-desc">Royalties enforced on-chain with configurable basis points. Artists always get paid what they're owed.</div><span class="night-tag">⚡ tNIGHT Tokens</span></div>
    </div>
    <div class="stats-bar">
      <div class="stat-cell"><div class="stat-val">100%</div><div class="stat-lbl">Private by design</div></div>
      <div class="stat-cell"><div class="stat-val">0</div><div class="stat-lbl">Bids ever exposed</div></div>
      <div class="stat-cell"><div class="stat-val" style="color:var(--purple)">ZK</div><div class="stat-lbl">Proof verified</div></div>
      <div class="stat-cell"><div class="stat-val">🌙</div><div class="stat-lbl">Midnight Preview Network</div></div>
    </div>
  </div>
</section>

<section class="section" style="background:var(--cream);border-top:1.5px solid var(--dark)">
  <div class="container">
    <div class="sec-eyebrow">What collectors say</div>
    <h2 class="sec-title">Serious traders <em>demand privacy</em></h2>
    <div class="testi-grid">
      <div class="testi-card"><div class="t-stars">★★★★★</div><p class="t-text">"For the first time I can bid on high-value NFTs without whales watching my wallet and front-running me. VeilBid is the only marketplace I trust."</p><div class="t-author"><div class="av" style="background:var(--green)">K</div><div><div class="a-name">KryptNight.eth</div><div class="a-role">High-Value Collector</div></div></div></div>
      <div class="testi-card"><div class="t-stars">★★★★★</div><p class="t-text">"As an artist, I finally have a platform where royalties are guaranteed and my buyers stay anonymous. This is what Web3 was supposed to be."</p><div class="t-author"><div class="av" style="background:#c4b5fd">V</div><div><div class="a-name">VoidArtist</div><div class="a-role">Digital Artist · 12 NFTs sold</div></div></div></div>
      <div class="testi-card"><div class="t-stars">★★★★★</div><p class="t-text">"The AI agent feature is mind-blowing. My bot bids autonomously with a private strategy that nobody can copy. Absolutely zero information leakage."</p><div class="t-author"><div class="av" style="background:#fde68a">A</div><div><div class="a-name">AlgoTrader_M</div><div class="a-role">Quantitative NFT Trader</div></div></div></div>
    </div>
  </div>
</section>

<section class="section" style="background:#FBF8F1;border-top:1.5px solid var(--dark)" id="pricing">
  <div class="container">
    <div class="sec-eyebrow">Pricing</div>
    <h2 class="sec-title">Start <em>free</em>, bid privately</h2>
    <p class="sec-sub">All plans include full ZK proof privacy. No plan ever exposes your bids.</p>
    <div class="price-grid">
      <div class="price-card"><div class="price-plan">Explorer</div><div class="price-amount">Free</div><div class="price-per">on Preview Network · tNIGHT tokens</div><div class="price-div"></div><ul class="price-feats"><li class="price-feat"><span class="p-ck">✓</span>Unlimited sealed bids</li><li class="price-feat"><span class="p-ck">✓</span>ZK proof verified</li><li class="price-feat"><span class="p-ck">✓</span>Anonymous identity</li><li class="price-feat"><span class="p-ck">✓</span>My Collection wallet</li></ul><button class="bpp" style="background:#fff">Explore for Free</button></div>
      <div class="price-card feat"><div class="price-plan">Collector Pro</div><div class="price-amount" style="color:#fff">$19</div><div class="price-per">/ month · Mainnet access</div><div class="price-div"></div><ul class="price-feats"><li class="price-feat"><span class="p-ck">✓</span>Everything in Explorer</li><li class="price-feat"><span class="p-ck">✓</span>Real NIGHT token bidding</li><li class="price-feat"><span class="p-ck">✓</span>AI Agent support</li><li class="price-feat"><span class="p-ck">✓</span>Priority bid settlement</li><li class="price-feat"><span class="p-ck">✓</span>Portfolio analytics (private)</li></ul><button class="bpp">Start Free Trial</button></div>
      <div class="price-card"><div class="price-plan">Institution</div><div class="price-amount">Custom</div><div class="price-per">/ month · enterprise</div><div class="price-div"></div><ul class="price-feats"><li class="price-feat"><span class="p-ck">✓</span>Everything in Pro</li><li class="price-feat"><span class="p-ck">✓</span>Custom AI agent strategies</li><li class="price-feat"><span class="p-ck">✓</span>White-label options</li><li class="price-feat"><span class="p-ck">✓</span>Dedicated support</li></ul><button class="bpp" style="background:#fff">Contact Us</button></div>
    </div>
  </div>
</section>

<section class="section" style="background:var(--cream);border-top:1.5px solid var(--dark)">
  <div class="container">
    <div class="sec-eyebrow">FAQ</div>
    <h2 class="sec-title" style="text-align:center">Common <em>questions</em></h2>
    <div class="faq-list">
      <div class="faq-item"><div class="faq-q">Are my bids really private?<span class="faq-arr">↓</span></div><div class="faq-a"><div class="faq-a-in">Yes — completely. Your bid amount is stored as a ZK witness on the Midnight Network. Nobody, including VeilBid, can read it. Only you hold the secret key.</div></div></div>
      <div class="faq-item"><div class="faq-q">What is Midnight Network?<span class="faq-arr">↓</span></div><div class="faq-a"><div class="faq-a-in">Midnight is a partner chain of Cardano built specifically for privacy-preserving smart contracts. It uses zero-knowledge proofs to verify computation without revealing data.</div></div></div>
      <div class="faq-item"><div class="faq-q">What wallet do I need?<span class="faq-arr">↓</span></div><div class="faq-a"><div class="faq-a-in">You need the 1AM wallet — a browser extension designed for Midnight Network. It handles shielded transactions and ZK proof generation automatically.</div></div></div>
      <div class="faq-item"><div class="faq-q">Can someone see who won an auction?<span class="faq-arr">↓</span></div><div class="faq-a"><div class="faq-a-in">The winning outcome is published on-chain but the winner's identity and the exact bid amounts of all other bidders remain permanently sealed.</div></div></div>
      <div class="faq-item"><div class="faq-q">Is VeilBid open source?<span class="faq-arr">↓</span></div><div class="faq-a"><div class="faq-a-in">Yes! The smart contract and frontend are fully open source on GitHub at github.com/Thanos0s/VeilBid_Midnight. Audit, fork, and build on top of it freely.</div></div></div>
    </div>
  </div>
</section>

<section class="cta-section grid-bg">
  <h2 class="cta-title">Bid in the shadows.<br><em>Win in the light.</em></h2>
  <p class="cta-sub">Join the first truly private NFT marketplace. Your bids, identity, and secrets — forever yours.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    <a href="#" class="btn-primary"><div class="zk-icon">🔒</div>Place Your First Private Bid</a>
    <a href="https://github.com/Thanos0s/VeilBid_Midnight" target="_blank" class="btn-secondary">⭐ Star on GitHub</a>
  </div>
</section>

<footer>
  <div class="foot-in">
    <div>
      <div style="display:flex;align-items:center;gap:10px;font-weight:900;font-size:15px"><div class="logo-box">🎭</div>VEILBID</div>
      <p class="foot-desc">The first privacy-first NFT marketplace on Midnight Network. Your bids, identity, and strategy are sealed forever.</p>
      <div style="margin-top:14px"><div class="midnight-badge">🌙 Built on Midnight Network</div></div>
    </div>
    <div><div class="foot-ct">Marketplace</div><ul class="foot-ls"><li><a href="#">Browse Auctions</a></li><li><a href="#">My Collection</a></li><li><a href="#">Create Auction</a></li><li><a href="#">AI Agent</a></li></ul></div>
    <div><div class="foot-ct">Developers</div><ul class="foot-ls"><li><a href="https://github.com/Thanos0s/VeilBid_Midnight" target="_blank">GitHub</a></li><li><a href="#">Documentation</a></li><li><a href="#">Contract ABI</a></li><li><a href="#">Midnight Docs</a></li></ul></div>
    <div><div class="foot-ct">Legal</div><ul class="foot-ls"><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Service</a></li><li><a href="#">Cookie Policy</a></li></ul></div>
  </div>
  <div class="foot-bot">
    <span>© 2026 VeilBid. All rights reserved. Built on <strong>Midnight Preview Network</strong>.</span>
    <span>🔒 Zero-Knowledge · 🌙 Midnight · 🤖 AI Ready</span>
  </div>
</footer>
    ` }} />
  );
}
