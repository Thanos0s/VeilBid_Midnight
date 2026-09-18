import React, { useState, useEffect } from 'react';

interface HeroProps {
  onExploreClick: () => void;
  onDeployClick: () => void;
}

const PLATFORM_ROLES = [
  { text: 'NFT Collectors', icon: '💎' },
  { text: 'AI Trading Agents', icon: '🤖' },
  { text: 'Digital Artists', icon: '🎨' },
  { text: 'Privacy Pioneers', icon: '🛡️' }
];

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onDeployClick }) => {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % PLATFORM_ROLES.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {/* Decorative floating assets */}
      <div className="deco deco-tl">
        <img src="/nfts/1318eadc3519abcda87173d473d594c7.avif" alt="Deco NFT" style={{ width: '100%', borderRadius: '12px' }} />
      </div>
      <div className="deco deco-bl">
        <img src="/nfts/38f8ed7fec64574f71248e43650eb934.avif" alt="Deco NFT" style={{ width: '100%', borderRadius: '12px' }} />
      </div>
      <div className="deco deco-tr">
        <img src="/nfts/8d98f1de2a946d37396bd15840b10c7b.avif" alt="Deco NFT" style={{ width: '100%', borderRadius: '12px' }} />
      </div>

      <div className="hero-inner">
        {/* Verification & Tech Badges */}
        <div className="badge-row">
          <div className="badge-pill">
            <span className="priv-dot" />
            <div>
              <span className="badge-pill-label">Network</span>
              <span>Midnight Preprod</span>
            </div>
          </div>
          <div className="badge-pill">
            <span>🛡️</span>
            <div>
              <span className="badge-pill-label">Settlement</span>
              <span>ZK Sealed Bids</span>
            </div>
          </div>
          <div className="badge-pill">
            <span>👥</span>
            <div>
              <span className="badge-pill-label">Adoption</span>
              <span>50 Verifiable Users</span>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="hero-heading">
          Bid in the shadows.<br />
          <span className="accent">Win in the light.</span>
        </h1>

        {/* Dynamic cycling slot */}
        <div className="platform-line">
          <span className="platform-slot">
            <span className="platform-icon">{PLATFORM_ROLES[roleIndex].icon}</span>
            <span id="platform-text">{PLATFORM_ROLES[roleIndex].text}</span>
          </span>
        </div>

        {/* Subtitle */}
        <p className="hero-sub">
          VeilBid is the first sealed-bid NFT marketplace on Midnight Network powered by Zero-Knowledge proofs.
          Every bid is committed cryptographically with zero leakage, anti-front-running, and automated royalty apportionment.
        </p>

        {/* CTA Buttons */}
        <div className="hero-btns">
          <button onClick={onExploreClick} className="btn-primary">
            <span>⚡ Explore Live Auctions</span>
          </button>
          <button onClick={onDeployClick} className="btn-secondary">
            <span>➕ Deploy Sealed Auction</span>
          </button>
        </div>
      </div>
    </section>
  );
};
