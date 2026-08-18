import React from 'react';

interface WalletConnectProps {
  isConnected: boolean;
  isConnecting: boolean;
  unshieldedAddress: string | null;
  connectWallet: (id?: string) => Promise<void>;
  disconnectWallet: () => void;
  networkName: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected,
  isConnecting,
  unshieldedAddress,
  connectWallet,
  disconnectWallet,
  networkName,
}) => {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {isConnected ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '4px' }}>
            ● {networkName.toUpperCase()}
          </span>
          <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>
            {unshieldedAddress ? `${unshieldedAddress.slice(0, 8)}...${unshieldedAddress.slice(-8)}` : ''}
          </span>
          <button 
            onClick={disconnectWallet}
            style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => connectWallet('1AM')}
          disabled={isConnecting}
          style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isConnecting ? 'Connecting...' : '🔑 Connect 1AM Wallet'}
        </button>
      )}
    </div>
  );
};
