import React, { useState } from 'react';

interface FeedbackModalProps {
  onClose: () => void;
  userAddress?: string | null;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, userAddress }) => {
  const [role, setRole] = useState('NFT Collector');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    const feedbackEntry = {
      id: `fb-${Date.now()}`,
      address: userAddress || 'Anonymous',
      role,
      rating,
      comment: feedback,
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('veilbid_feedback_list') || '[]');
    existing.push(feedbackEntry);
    localStorage.setItem('veilbid_feedback_list', JSON.stringify(existing));

    setSubmitted(true);
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
        maxWidth: '480px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>💬 Share Feedback</h2>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
              Help shape VeilBid on the Midnight Preprod Network
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

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 900 }}>Thank you for your feedback!</h3>
            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 20px' }}>
              Your feedback is recorded in our continuous product improvement loop.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 800,
                background: '#C1F04C',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '3px 3px 0 #0a0a0a'
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Your Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #0a0a0a',
                  background: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="NFT Collector">💎 NFT Collector (Sealed Bids)</option>
                <option value="NFT Creator">🎨 NFT Creator / Artist (Deploying Royalties)</option>
                <option value="AI Bot Developer">🤖 AI Bot Developer (Automated Bidding)</option>
                <option value="Midnight Node Runner">🌙 Midnight Node Runner / SPO</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Experience Rating
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1.5px solid #0a0a0a',
                      background: rating >= star ? '#C1F04C' : '#fff',
                      fontSize: '16px',
                      cursor: 'pointer',
                      boxShadow: '2px 2px 0 #0a0a0a'
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Feedback & Suggestions
              </label>
              <textarea
                rows={4}
                required
                placeholder="What went well? Any issues with 1AM wallet signatures, proof times, or mobile UI?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  border: '2px solid #0a0a0a',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                background: '#C1F04C',
                color: '#0a0a0a',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '4px 4px 0 #0a0a0a'
              }}
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
