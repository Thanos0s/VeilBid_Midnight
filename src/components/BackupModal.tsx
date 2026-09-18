import React, { useState, useEffect, useRef } from 'react';
import type { BidReceipt } from '../types/auction';

interface BackupModalProps {
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ onClose }) => {
  const [receipts, setReceipts] = useState<BidReceipt[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('veilbid_receipts') || '[]');
      setReceipts(stored);
    } catch {
      setReceipts([]);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(receipts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veilbid_backup_keys_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('✅ Backup file downloaded! Store it securely.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const merged = [...imported, ...receipts];
          // Deduplicate by commitmentHex
          const unique = Array.from(new Map(merged.map((r) => [r.commitmentHex, r])).values());
          localStorage.setItem('veilbid_receipts', JSON.stringify(unique));
          setReceipts(unique);
          setMessage(`✅ Successfully imported ${imported.length} bid receipt(s)!`);
        } else {
          setMessage('❌ Invalid backup format: expected an array of bid receipts.');
        }
      } catch (err) {
        setMessage('❌ Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10,10,10,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: '#fff',
        border: '3px solid #0a0a0a',
        borderRadius: '16px',
        boxShadow: '8px 8px 0 #0a0a0a',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>🔐 Bid Keys & Witness State Backup</h2>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
              Protect your secret salts & proving keys against browser cache clearing
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1.5px solid #0a0a0a',
              borderRadius: '8px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontWeight: 800
            }}
          >
            ✕
          </button>
        </div>

        {/* Informational Alert */}
        <div style={{
          background: '#eff6ff',
          color: '#1e40af',
          padding: '12px 14px',
          borderRadius: '8px',
          fontSize: '12px',
          border: '1px solid #bfdbfe',
          lineHeight: 1.5
        }}>
          🛡️ <strong>Zero-Knowledge Persistence:</strong> In a sealed-bid auction, your bid amount and random salt are never stored on public servers. If you clear your browser cache without a backup, you will not be able to generate the ZK reveal proof to claim your winnings!
        </div>

        {message && (
          <div style={{
            background: message.startsWith('✅') ? '#dcfce7' : '#fee2e2',
            color: message.startsWith('✅') ? '#15803d' : '#b91c1c',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            border: '1px solid currentColor'
          }}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExport}
            disabled={receipts.length === 0}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '13px',
              fontWeight: 800,
              background: '#C1F04C',
              color: '#0a0a0a',
              border: '2px solid #0a0a0a',
              borderRadius: '8px',
              cursor: receipts.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '3px 3px 0 #0a0a0a'
            }}
          >
            📥 Export All Bids ({receipts.length})
          </button>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImport}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '13px',
              fontWeight: 800,
              background: '#fff',
              color: '#0a0a0a',
              border: '2px solid #0a0a0a',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #0a0a0a'
            }}
          >
            📤 Import Backup (.json)
          </button>
        </div>

        {/* Receipts List */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>
            Stored Bids on this Device ({receipts.length}):
          </h4>
          {receipts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '24px',
              background: '#F6F3EC',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#777'
            }}>
              No bid receipts found. Place a sealed bid in any live auction to see your credentials here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {receipts.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: '#F6F3EC',
                    border: '1.5px solid #0a0a0a',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '11px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                    <span>Auction: {r.auctionId}</span>
                    <span style={{ color: '#15803d' }}>{r.amount} tNIGHT</span>
                  </div>
                  <div style={{ color: '#666', fontFamily: 'var(--font-mono)' }}>
                    Commitment: {r.commitmentHex.slice(0, 16)}...{r.commitmentHex.slice(-8)}
                  </div>
                  <div style={{ color: '#888', fontSize: '10px' }}>
                    {new Date(r.timestamp).toLocaleString()} · Status: {r.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
