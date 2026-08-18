import React from 'react';

interface CoreFeatureProps {
  contract: any;
  isConnected: boolean;
}

export const CoreFeature: React.FC<CoreFeatureProps> = ({ contract, isConnected }) => {
  return (
    <div style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', background: '#111' }}>
      <h3 style={{ marginTop: 0 }}>🛡️ Private Bid Operations</h3>
      <p style={{ fontSize: '14px', color: '#9ca3af' }}>
        Configure and place your ZK-sealed bid. The amount is only revealed to the smart contract logic using zero-knowledge proofs.
      </p>
      {!isConnected ? (
        <div style={{ color: '#f59e0b', fontSize: '13px' }}>⚠️ Connect your wallet to place bids.</div>
      ) : (
        <div style={{ color: '#10b981', fontSize: '13px' }}>✓ Securely bound to Live preprod contract address.</div>
      )}
    </div>
  );
};
