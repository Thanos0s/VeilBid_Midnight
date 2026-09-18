import React, { useState, useEffect } from 'react';
import type { AuctionItem } from '../types/auction';

interface AuctionCardProps {
  auction: AuctionItem;
  onSelectBid: (auction: AuctionItem) => void;
  onSelectReveal?: (auction: AuctionItem) => void;
  explorerUrl?: string;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  onSelectBid,
  onSelectReveal,
  explorerUrl = 'https://preprod.midnightexplorer.com',
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = auction.endTime - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds, isExpired: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div style={{
      background: '#fff',
      border: '2px solid #0a0a0a',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '4px 4px 0 #0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.15s, box-shadow 0.15s'
    }}>
      {/* Media Box */}
      <div style={{ position: 'relative', width: '100%', height: '240px', background: '#0a0a0a', overflow: 'hidden' }}>
        <img
          src={auction.img}
          alt={auction.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* State Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 800,
          background: auction.state === 'OPEN' && !timeLeft.isExpired ? '#22c55e' : '#ef4444',
          color: '#fff',
          border: '1.5px solid #0a0a0a',
          boxShadow: '2px 2px 0 #0a0a0a'
        }}>
          {auction.state === 'OPEN' && !timeLeft.isExpired ? '● OPEN' : '● ENDED'}
        </div>

        {/* Live Countdown Timer Badge */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          background: 'rgba(10,10,10,0.85)',
          color: '#C1F04C',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {timeLeft.isExpired ? '🏁 Auction Ended' : `⏱ ${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`}
        </div>
      </div>

      {/* Info Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0a0a0a' }}>{auction.title}</h3>
            <span style={{ fontSize: '12px', color: '#666' }}>by {auction.author}</span>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            background: 'rgba(91,91,214,0.1)',
            color: '#5B5BD6',
            borderRadius: '6px',
            border: '1px solid rgba(91,91,214,0.3)'
          }}>
            {auction.category}
          </span>
        </div>

        {/* Contract & Address details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888' }}>
          <span>Contract:</span>
          <a
            href={`${explorerUrl}/contract/${auction.contractAddress}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#5B5BD6', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
          >
            {auction.contractAddress.slice(0, 6)}...{auction.contractAddress.slice(-4)} ↗
          </a>
        </div>

        {/* Reserve & Bids Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          padding: '10px',
          background: '#F6F3EC',
          borderRadius: '8px',
          border: '1px solid rgba(10,10,10,0.1)'
        }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#777' }}>Reserve Price</div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#0a0a0a' }}>{auction.floor}</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#777' }}>Sealed Bids</div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#0a0a0a' }}>🔒 {auction.bidCount} Bids</div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
          {auction.state === 'OPEN' && !timeLeft.isExpired ? (
            <button
              onClick={() => onSelectBid(auction)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 800,
                background: '#C1F04C',
                color: '#0a0a0a',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                boxShadow: '3px 3px 0 #0a0a0a',
                cursor: 'pointer',
                transition: 'transform 0.1s'
              }}
            >
              🔒 Place Sealed Bid
            </button>
          ) : (
            <button
              onClick={() => onSelectReveal ? onSelectReveal(auction) : onSelectBid(auction)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 800,
                background: '#fff',
                color: '#0a0a0a',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                boxShadow: '3px 3px 0 #0a0a0a',
                cursor: 'pointer'
              }}
            >
              🏆 Settle & Reveal Winner
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
