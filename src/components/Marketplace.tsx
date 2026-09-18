import React, { useState, useMemo } from 'react';
import type { AuctionItem } from '../types/auction';
import { AuctionCard } from './AuctionCard';

interface MarketplaceProps {
  auctions: AuctionItem[];
  onSelectBid: (auction: AuctionItem) => void;
  onSelectReveal: (auction: AuctionItem) => void;
  explorerUrl?: string;
}

const CATEGORIES = ['All', 'Art', 'PFPs', 'Gaming', '🤖 AI Agents'];

export const Marketplace: React.FC<MarketplaceProps> = ({
  auctions,
  onSelectBid,
  onSelectReveal,
  explorerUrl,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'ending' | 'bids' | 'price'>('ending');

  const filteredAuctions = useMemo(() => {
    let list = auctions.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === '🤖 AI Agents' && item.category.includes('AI Agents'));

      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'ending') {
      list = [...list].sort((a, b) => a.endTime - b.endTime);
    } else if (sortBy === 'bids') {
      list = [...list].sort((a, b) => b.bidCount - a.bidCount);
    }

    return list;
  }, [auctions, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="marketplace" style={{ padding: '60px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
          Explore Sealed-Bid Marketplace
        </h2>
        <p style={{ fontSize: '15px', color: '#555', maxWidth: '600px', margin: '0 auto' }}>
          Browse live privacy-preserving NFT auctions and autonomous AI trading agents on the Midnight Preprod Network.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1.5px solid #0a0a0a',
                background: selectedCategory === cat ? '#0a0a0a' : '#fff',
                color: selectedCategory === cat ? '#fff' : '#0a0a0a',
                boxShadow: selectedCategory === cat ? 'none' : '2px 2px 0 #0a0a0a',
                transition: 'all 0.15s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search items, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1.5px solid #0a0a0a',
              background: '#fff',
              outline: 'none',
              width: '200px'
            }}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'ending' | 'bids' | 'price')}
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1.5px solid #0a0a0a',
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            <option value="ending">⏱ Ending Soonest</option>
            <option value="bids">🔥 Most Bids</option>
          </select>
        </div>
      </div>

      {/* Auctions Grid */}
      {filteredAuctions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#fff',
          border: '2px solid #0a0a0a',
          borderRadius: '12px',
          boxShadow: '4px 4px 0 #0a0a0a'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>No auctions found</h3>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '6px' }}>Try adjusting your search or category filters.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '24px'
        }}>
          {filteredAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onSelectBid={onSelectBid}
              onSelectReveal={onSelectReveal}
              explorerUrl={explorerUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
};
