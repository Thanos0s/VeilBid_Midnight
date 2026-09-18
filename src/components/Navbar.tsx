import React, { useState } from 'react';
import type { NetworkName, WalletState } from '../types/auction';

interface NavbarProps {
  networkName: NetworkName;
  onSelectNetwork: (net: NetworkName) => void;
  wallet: WalletState;
  onConnectWallet: (id?: string) => void;
  onDisconnectWallet: () => void;
  onOpenDeploy: () => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  networkName,
  onSelectNetwork,
  wallet,
  onConnectWallet,
  onDisconnectWallet,
  onOpenDeploy,
  onOpenBackup,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatAddr = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBal = (nightBal?: bigint) => {
    if (nightBal === undefined || nightBal === null) return '0.00';
    const val = Number(nightBal) / 1_000_000;
    return val.toFixed(2);
  };

  return (
    <nav>
      <a href="#" className="nav-logo">
        <div className="logo-box">
          <img src="/veilbid-logo.png" alt="VeilBid" />
        </div>
        <span>VeilBid</span>
        <span style={{
          fontSize: '10px',
          fontWeight: 800,
          padding: '2px 6px',
          borderRadius: '4px',
          background: '#dcfce7',
          color: '#15803d',
          border: '1px solid #86efac'
        }}>
          PREPROD
        </span>
      </a>

      {/* Desktop Links */}
      <div className="nav-links nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a href="#live-auction">⚡ Live Auction</a>
        <a href="#marketplace">🎨 Marketplace</a>
        <a href="#ai-agents">🤖 AI Agents</a>
        <a href="#how-it-works">📖 How It Works</a>
        
        {/* Network Selector */}
        <select
          value={networkName}
          onChange={(e) => onSelectNetwork(e.target.value as NetworkName)}
          style={{
            padding: '5px 8px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '6px',
            border: '1.5px solid #0a0a0a',
            background: '#fff',
            cursor: 'pointer'
          }}
        >
          <option value="preprod">🌙 Preprod</option>
          <option value="preview">🌌 Preview</option>
        </select>

        {/* Deploy Auction Button */}
        <button
          onClick={onOpenDeploy}
          style={{
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: 800,
            background: '#fff',
            border: '1.5px solid #0a0a0a',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ➕ Deploy Auction
        </button>

        {/* Backup Keys Button */}
        <button
          onClick={onOpenBackup}
          title="Backup your private bid commitments and witness keys"
          style={{
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 800,
            background: '#fff',
            border: '1.5px solid #0a0a0a',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🔐 Backup Keys
        </button>

        {/* Wallet Connection */}
        {wallet.isConnected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '5px 8px',
              background: '#fff',
              border: '1.5px solid #0a0a0a',
              borderRadius: '6px'
            }}>
              💰 {formatBal(wallet.balances?.unshieldedNight)} tNIGHT
            </span>
            <button
              onClick={onDisconnectWallet}
              title={wallet.unshieldedAddress || ''}
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 800,
                background: '#fee2e2',
                color: '#b91c1c',
                border: '1.5px solid #0a0a0a',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {formatAddr(wallet.unshieldedAddress)} ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => onConnectWallet('1AM')}
            disabled={wallet.isConnecting}
            className="nav-cta"
          >
            {wallet.isConnecting ? '⏳ Connecting...' : '🔑 Connect 1AM Wallet'}
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div style={{ display: 'none' }} className="mobile-nav-toggle">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '22px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '56px',
          left: 0,
          right: 0,
          background: 'var(--cream)',
          borderBottom: '2px solid #0a0a0a',
          padding: '16px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <a href="#live-auction" onClick={() => setMobileMenuOpen(false)}>⚡ Live Auction</a>
          <a href="#marketplace" onClick={() => setMobileMenuOpen(false)}>🎨 Marketplace</a>
          <a href="#ai-agents" onClick={() => setMobileMenuOpen(false)}>🤖 AI Agents</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>📖 How It Works</a>
          <button onClick={() => { onOpenDeploy(); setMobileMenuOpen(false); }}>➕ Deploy Auction</button>
          <button onClick={() => { onOpenBackup(); setMobileMenuOpen(false); }}>🔐 Backup Keys</button>
          {wallet.isConnected ? (
            <button onClick={onDisconnectWallet} style={{ background: '#fee2e2', color: '#b91c1c' }}>
              Disconnect {formatAddr(wallet.unshieldedAddress)}
            </button>
          ) : (
            <button onClick={() => { onConnectWallet('1AM'); setMobileMenuOpen(false); }} className="nav-cta">
              🔑 Connect 1AM Wallet
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
