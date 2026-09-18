import React, { useState, useEffect } from 'react';
import { useMidnight } from './hooks/useMidnight';
import type { AuctionItem, BidReceipt } from './types/auction';
import { INITIAL_AUCTIONS } from './data/initialAuctions';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBanner } from './components/StatsBanner';
import { Marketplace } from './components/Marketplace';
import { AgentShowcase } from './components/AgentShowcase';
import { HowItWorks } from './components/HowItWorks';
import { BidModal } from './components/BidModal';
import { DeployModal } from './components/DeployModal';
import { BackupModal } from './components/BackupModal';
import { FeedbackModal } from './components/FeedbackModal';

export const App: React.FC = () => {
  const {
    networkName,
    selectNetwork,
    connectWallet,
    disconnectWallet,
    deployVeilBid,
    submitBidToNetwork,
    revealBidToNetwork,
    closeAuctionOnNetwork,
    ...walletState
  } = useMidnight();

  const [auctions, setAuctions] = useState<AuctionItem[]>(() => {
    try {
      const stored = localStorage.getItem('veilbid_custom_auctions');
      if (stored) {
        const parsed: AuctionItem[] = JSON.parse(stored);
        const cleaned = parsed.map(a => a.contractAddress === '42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3' ? { ...a, contractAddress: '' } : a);
        return [...cleaned, ...INITIAL_AUCTIONS];
      }
    } catch {
      // Ignore parse error
    }
    return INITIAL_AUCTIONS;
  });

  const [selectedBidAuction, setSelectedBidAuction] = useState<AuctionItem | null>(null);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const explorerBase = networkName === 'preview'
    ? 'https://preview.midnightexplorer.com'
    : 'https://preprod.midnightexplorer.com';

  const handleDeploySuccess = (newAuction: AuctionItem) => {
    setAuctions(prev => [newAuction, ...prev]);
    try {
      const stored = JSON.parse(localStorage.getItem('veilbid_custom_auctions') || '[]');
      stored.unshift(newAuction);
      localStorage.setItem('veilbid_custom_auctions', JSON.stringify(stored));
    } catch {
      // LocalStorage fallback
    }
  };

  const handleAuctionDeployed = (updatedAuction: AuctionItem) => {
    setAuctions(prev => prev.map(a => a.id === updatedAuction.id ? updatedAuction : a));
    try {
      const stored: AuctionItem[] = JSON.parse(localStorage.getItem('veilbid_custom_auctions') || '[]');
      const index = stored.findIndex(a => a.id === updatedAuction.id);
      if (index >= 0) {
        stored[index] = updatedAuction;
      } else {
        stored.unshift(updatedAuction);
      }
      localStorage.setItem('veilbid_custom_auctions', JSON.stringify(stored));
    } catch {
      // LocalStorage fallback
    }
  };

  const handleBidSubmitted = (receipt: BidReceipt) => {
    setAuctions(prev => prev.map(a => {
      if (a.id === receipt.auctionId || a.contractAddress === receipt.contractAddress) {
        return { ...a, bidCount: a.bidCount + 1 };
      }
      return a;
    }));
  };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar
        networkName={networkName}
        onSelectNetwork={selectNetwork}
        wallet={walletState}
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
        onOpenDeploy={() => setDeployModalOpen(true)}
        onOpenBackup={() => setBackupModalOpen(true)}
      />

      {/* Hero */}
      <Hero
        onExploreClick={() => {
          document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onDeployClick={() => setDeployModalOpen(true)}
      />

      {/* Stats Ticker */}
      <StatsBanner />

      {/* Live Sealed-Bid Marketplace */}
      <Marketplace
        auctions={auctions}
        onSelectBid={(auc) => setSelectedBidAuction(auc)}
        onSelectReveal={(auc) => setSelectedBidAuction(auc)}
        onOpenDeploy={() => setDeployModalOpen(true)}
        explorerUrl={explorerBase}
      />

      {/* AI Trading Agents */}
      <AgentShowcase
        agents={auctions.filter(a => a.category.includes('AI Agents'))}
        onSelectBid={(agent) => setSelectedBidAuction(agent)}
      />

      {/* Educational Walkthrough */}
      <HowItWorks />

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '2px solid #0a0a0a',
        background: 'var(--cream)',
        padding: '40px 24px 28px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '18px' }}>
              <span>🎭</span> VeilBid
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Privacy-First Sealed-Bid NFT Marketplace on Midnight Network
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: 700 }}>
            <a href="https://github.com/Thanos0s/VeilBid_Midnight" target="_blank" rel="noreferrer" style={{ color: '#0a0a0a', textDecoration: 'none' }}>
              📦 GitHub
            </a>
            <a href="https://preprod.midnightexplorer.com" target="_blank" rel="noreferrer" style={{ color: '#0a0a0a', textDecoration: 'none' }}>
              🌐 Midnight Explorer
            </a>
            <a href="https://twitter.com/Veil_Bid" target="_blank" rel="noreferrer" style={{ color: '#0a0a0a', textDecoration: 'none' }}>
              🐦 Twitter
            </a>
          </div>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '24px auto 0',
          paddingTop: '16px',
          borderTop: '1px solid rgba(10,10,10,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#888'
        }}>
          <div>© 2026 VeilBid. Built on Midnight Preprod Network.</div>
          <div>Contract: <code>{localStorage.getItem(`veilbid_contract_address_${networkName}`) ? `${localStorage.getItem(`veilbid_contract_address_${networkName}`)?.slice(0, 8)}...` : 'Midnight Preprod Verified'}</code></div>
        </div>
      </footer>

      {/* Floating Feedback Trigger */}
      <button
        onClick={() => setFeedbackModalOpen(true)}
        className="floating-feedback-btn"
        title="Share your feedback for Level 5"
      >
        <span>💬</span> Feedback
      </button>

      {/* Modals */}
      {selectedBidAuction && (
        <BidModal
          auction={selectedBidAuction}
          wallet={walletState}
          networkName={networkName}
          onClose={() => setSelectedBidAuction(null)}
          onBidSubmitted={handleBidSubmitted}
          submitBidToNetwork={submitBidToNetwork}
          revealBidToNetwork={revealBidToNetwork}
          closeAuctionOnNetwork={closeAuctionOnNetwork}
          deployVeilBid={deployVeilBid}
          onAuctionDeployed={handleAuctionDeployed}
        />
      )}


      {deployModalOpen && (
        <DeployModal
          wallet={walletState}
          onClose={() => setDeployModalOpen(false)}
          onDeploySuccess={handleDeploySuccess}
          deployVeilBid={deployVeilBid}
          networkName={networkName}
        />
      )}

      {backupModalOpen && (
        <BackupModal
          onClose={() => setBackupModalOpen(false)}
        />
      )}

      {feedbackModalOpen && (
        <FeedbackModal
          onClose={() => setFeedbackModalOpen(false)}
          userAddress={walletState.unshieldedAddress}
        />
      )}
    </div>
  );
};

export default App;
