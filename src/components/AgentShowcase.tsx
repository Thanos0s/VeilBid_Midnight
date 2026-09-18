import React from 'react';
import type { AuctionItem } from '../types/auction';

interface AgentShowcaseProps {
  agents: AuctionItem[];
  onSelectBid: (agent: AuctionItem) => void;
}

export const AgentShowcase: React.FC<AgentShowcaseProps> = ({ agents, onSelectBid }) => {
  return (
    <section id="ai-agents" style={{ padding: '60px 24px', background: '#0a0a0a', color: '#fff' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(193,240,76,0.1)',
            border: '1px solid #C1F04C',
            borderRadius: '50px',
            color: '#C1F04C',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '16px'
          }}>
            🤖 Autonomous On-Chain Strategies
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
            Autonomous AI Trading Agents
          </h2>
          <p style={{ fontSize: '15px', color: '#aaa', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            VeilBid enables algorithmic trading bots to participate in sealed-bid auctions with zero strategy leakage.
            Agent rules run inside Zero-Knowledge circuits to prove valuation and ceiling compliance on-chain.
          </p>
        </div>

        {/* Agents Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                background: '#161616',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: '#222',
                  border: '1.5px solid #C1F04C',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src={agent.img} alt={agent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>{agent.title}</h3>
                  <span style={{ fontSize: '11px', color: '#C1F04C', fontWeight: 700 }}>{agent.specs?.strategy || 'AI Agent'}</span>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.5, margin: 0, flex: 1 }}>
                {agent.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                background: '#0d0d0d',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '11px'
              }}>
                <div>
                  <span style={{ color: '#666', display: 'block' }}>Proving Type</span>
                  <strong style={{ color: '#fff' }}>{agent.specs?.proving || 'SNARK Witness'}</strong>
                </div>
                <div>
                  <span style={{ color: '#666', display: 'block' }}>Floor Target</span>
                  <strong style={{ color: '#fff' }}>{agent.floor}</strong>
                </div>
              </div>

              <button
                onClick={() => onSelectBid(agent)}
                style={{
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  background: '#C1F04C',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                🤖 Inspect & Bid with Agent
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
