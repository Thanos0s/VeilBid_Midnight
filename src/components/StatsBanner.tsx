import React from 'react';

export const StatsBanner: React.FC = () => {
  return (
    <section style={{
      borderTop: '2px solid #0a0a0a',
      borderBottom: '2px solid #0a0a0a',
      background: '#C1F04C',
      padding: '24px 16px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#0a0a0a', fontFamily: 'var(--font-serif)' }}>50+</div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#1a1a1a', letterSpacing: '0.05em' }}>
            Verifiable Preprod Users
          </div>
        </div>

        <div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#0a0a0a', fontFamily: 'var(--font-serif)' }}>0.0%</div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#1a1a1a', letterSpacing: '0.05em' }}>
            MEV / Bid Front-Running
          </div>
        </div>

        <div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#0a0a0a', fontFamily: 'var(--font-serif)' }}>~1.4s</div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#1a1a1a', letterSpacing: '0.05em' }}>
            Median ZK Proof Generation
          </div>
        </div>

        <div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#0a0a0a', fontFamily: 'var(--font-serif)' }}>100%</div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#1a1a1a', letterSpacing: '0.05em' }}>
            Enforced Cryptographic Fairness
          </div>
        </div>
      </div>
    </section>
  );
};
