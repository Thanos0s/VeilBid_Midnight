# 🎬 VeilBid — Final Demo Video Recording Guide & Checklist

Follow this exact walkthrough to record a high-scoring, professional 2-3 minute MVP demo video for the Midnight Builder Challenge Level 6 evaluation.

---

## 📋 Pre-Recording Checklist

- [ ] Browser open to: [https://veilbid-kappa.vercel.app](https://veilbid-kappa.vercel.app)
- [ ] Tab 2 open to Midnight Preprod Explorer: [https://preprod.midnightexplorer.com/contracts/0x2bb504ffeb044d37e4fa02e0845cdafc2fa68db489c4c810457b32db7e7888e9](https://preprod.midnightexplorer.com/contracts/0x2bb504ffeb044d37e4fa02e0845cdafc2fa68db489c4c810457b32db7e7888e9)
- [ ] 1AM / Lace Wallet funded with test tNIGHT on Midnight Preprod Network.
- [ ] Screen recording software (OBS / Loom) set to 1080p with clear microphone audio.

---

## ⏱️ Video Storyboard (2 - 3 Minutes)

### 1. Introduction & Visible Preprod Contract Address (0:00 - 0:30)
- **What to Say**:  
  *"Welcome to VeilBid, the first privacy-preserving NFT marketplace built on the Midnight Network. In standard NFT marketplaces, all bids are public, which invites MEV front-running and sniper bots. VeilBid solves this using Midnight's zero-knowledge compact smart contracts."*
- **What to Show on Screen**:  
  - Show the VeilBid homepage with the tagline: *"Bid in the shadows. Win in the light."*
  - Switch to the Preprod Explorer tab showing the live contract address:  
    `0x2bb504ffeb044d37e4fa02e0845cdafc2fa68db489c4c810457b32db7e7888e9` deployed on Midnight Preprod Network.

### 2. Wallet Connection & Live Marketplace (0:30 - 1:00)
- **What to Say**:  
  *"Let's connect our wallet. We are connecting via the 1AM wallet directly on Midnight Preprod."*
- **What to Show on Screen**:  
  - Click **🔑 Connect Wallet** in the navbar.
  - Approve the popup; show the connected wallet address and live tNIGHT token balance.
  - Scroll through the marketplace to highlight the active lots, categories, and real-time ticking countdown timers.

### 3. Placing a Sealed Zero-Knowledge Bid (1:00 - 1:45)
- **What to Say**:  
  *"Now we'll place a sealed bid on an NFT. Notice that I enter 5 tNIGHT. When I click 'Submit Sealed Bid', my browser locally generates a zero-knowledge commitment. The network only sees this cryptographic hash — my actual 5 tNIGHT bid remains 100% private."*
- **What to Show on Screen**:  
  - Click **🔒 Bid** on an NFT lot (e.g. *Midnight Sentinel #042*).
  - Enter the bid amount and click **Submit Sealed Bid**.
  - Show the ZK Prover daemon generating the proof (~1.1s).
  - Confirm the transaction in the wallet popup.
  - Show the green success modal with the generated transaction hash.

### 4. Proving Privacy End-to-End on Explorer (1:45 - 2:30)
- **What to Say**:  
  *"Let's click through to the official Midnight Preprod Explorer. As you can see, the transaction was verified on-chain. But look at the state payload: only the 32-byte commitment hash is recorded! No validator, miner, or competitor can see my bid amount. When the auction closes, only the winning bid is proven."*
- **What to Show on Screen**:  
  - Click **View on Explorer** and show the confirmed transaction on `preprod.midnightexplorer.com`.
  - Point your mouse to the commitment bytes and highlight that the valuation is completely sealed.

### 5. AI Bot Showcase & Conclusion (2:30 - 3:00)
- **What to Say**:  
  *"VeilBid also supports autonomous AI trading bots with ZK policy commitments, allowing collectors to automate private bidding strategies. Thank you for watching!"*
- **What to Show on Screen**:  
  - Briefly click into the **🤖 AI Agents** section and show the policy proof configuration.
  - Conclude with the repository link and live URL.
