import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a', color: '#f3f4f6' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '0.05em' }}>🎭 VEILBID</div>
      </header>
      <main style={{ flex: 1, padding: '24px' }}>
        {children}
      </main>
      <footer style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
        © 2026 VeilBid. All rights reserved. Zero-Knowledge Secured.
      </footer>
    </div>
  );
};
