import React, { useState } from 'react';

const STEPS = [
  {
    num: '01',
    title: 'ZK Sealed-Bid Commitment',
    icon: '🔒',
    desc: 'Bidders enter their valuation. A 256-bit cryptographic salt is generated in the browser to compute a Pedersen/SHA256 commitment hash. Only the hash is registered on Midnight.',
    metric1: { label: 'Privacy', val: '100% Shielded' },
    metric2: { label: 'State', val: 'On-Chain Hash' },
    metric3: { label: 'Audit', val: 'Verifiable' },
  },
  {
    num: '02',
    title: 'Anti-Front-Running Auction Window',
    icon: '⚡',
    desc: 'During the active auction period, miners, node runners, and competing AI bots cannot observe bid amounts. MEV sandwiching and snipe front-running are mathematically impossible.',
    metric1: { label: 'MEV Risk', val: '0.00%' },
    metric2: { label: 'Bids', val: 'Shielded Vector' },
    metric3: { label: 'Fairness', val: 'Guaranteed' },
  },
  {
    num: '03',
    title: 'Zero-Knowledge Proof Settlement',
    icon: '🏆',
    desc: 'When the auction closes, bidders reveal their secret keys. The Compact ZK circuit verifies commitment membership, enforces reserve price, and identifies the highest bidder with mathematical certainty.',
    metric1: { label: 'Proof Time', val: '~1.4s Local' },
    metric2: { label: 'Circuit', val: 'Compact v0.22' },
    metric3: { label: 'Winner', val: 'ZK-Proven' },
  },
  {
    num: '04',
    title: 'Automated Royalty Apportionment',
    icon: '💰',
    desc: 'Creator royalties are mathematically apportioned based on configurable basis points (e.g. 500 = 5%). Settlement receipts guarantee artists get paid directly.',
    metric1: { label: 'Royalty', val: 'Up to 10%' },
    metric2: { label: 'Payout', val: 'Direct Receipts' },
    metric3: { label: 'Standard', val: 'EIP-2981 Equiv' },
  },
];

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];

  return (
    <section id="how-it-works" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
          How VeilBid Enforces Sealed Bids
        </h2>
        <p style={{ fontSize: '15px', color: '#555', maxWidth: '580px', margin: '0 auto' }}>
          Zero-Knowledge cryptography replaces blind trust with mathematical verification on the Midnight Network.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Step Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {STEPS.map((s, idx) => (
            <div
              key={s.num}
              onClick={() => setActiveStep(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid #0a0a0a',
                background: activeStep === idx ? '#C1F04C' : '#fff',
                boxShadow: activeStep === idx ? '4px 4px 0 #0a0a0a' : '2px 2px 0 #0a0a0a',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#fff',
                border: '1.5px solid #0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>{s.title}</h4>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#666' }}>
                    {s.num}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#444', marginTop: '4px', lineHeight: 1.4 }}>
                  {s.desc.slice(0, 75)}...
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Step Detail Card */}
        <div style={{
          background: '#fff',
          border: '2px solid #0a0a0a',
          borderRadius: '16px',
          boxShadow: '6px 6px 0 #0a0a0a',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#C1F04C',
              border: '2px solid #0a0a0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px'
            }}>
              {step.icon}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#5B5BD6', textTransform: 'uppercase' }}>
                Step {step.num} Verification Architecture
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0' }}>{step.title}</h3>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6, margin: 0 }}>
            {step.desc}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginTop: '8px'
          }}>
            <div style={{ background: '#F6F3EC', border: '1px solid #0a0a0a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', fontWeight: 700 }}>{step.metric1.label}</div>
              <div style={{ fontSize: '13px', fontWeight: 900, marginTop: '2px' }}>{step.metric1.val}</div>
            </div>
            <div style={{ background: '#F6F3EC', border: '1px solid #0a0a0a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', fontWeight: 700 }}>{step.metric2.label}</div>
              <div style={{ fontSize: '13px', fontWeight: 900, marginTop: '2px' }}>{step.metric2.val}</div>
            </div>
            <div style={{ background: '#F6F3EC', border: '1px solid #0a0a0a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', fontWeight: 700 }}>{step.metric3.label}</div>
              <div style={{ fontSize: '13px', fontWeight: 900, marginTop: '2px' }}>{step.metric3.val}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
