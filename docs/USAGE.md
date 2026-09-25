# 📖 VeilBid — Usage Guide (Preprod Launch)

> **Bid in the shadows. Win in the light.**

Welcome to VeilBid! This guide walks you through using VeilBid on the **Midnight Preprod Network** as a regular user — no developer experience or coding required.

---

## 🌟 What's New (Level 5 & 6 Improvements)

Based on community testing with 50+ Preprod users, we've updated VeilBid:
- ⏱️ **Live Countdown Timers**: Real-time per-second countdown timers on every open auction lot.
- 🔗 **Direct Midnight Explorer Links**: Instantly inspect your on-chain transactions and contract records on Preprod without 404 errors (`/contracts/0x...` & `/transactions/...`).
- ⚡ **1-Click Live Auction Deploy**: Launch new verified auctions with your 1AM or Lace wallet directly from the web interface.
- 🔐 **Private Witness Backup Tool**: Easily export and restore your encrypted private bid receipts, salts, and secret keys across browser sessions.

---

## 🚀 Getting Started on Preprod

To use VeilBid on the Midnight Preprod Network, you only need three things:

### 1. Web Browser
Use **Google Chrome** or **Brave** on desktop (or mobile).

### 2. Midnight Wallet (1AM Wallet or Lace Wallet)
- Download and install the **[1AM Wallet](https://1am.space)** or **[Lace Wallet](https://www.lace.io/)** extension for Chrome/Brave.
- Create a new wallet and securely save your recovery phrase.
- Open the wallet settings and ensure your network is switched to **Midnight Preprod Network**.

### 3. Get Free Test Tokens (tNIGHT)
- Visit the official **[Midnight Faucet](https://faucet.midnight.network)**.
- Copy your unshielded wallet address (`mn_addr_preprod1...`) from your wallet extension.
- Paste it into the faucet and request test **tNIGHT** tokens.
- Wait ~30 seconds for the tokens to arrive. *(Note: tNIGHT tokens are free test tokens with no real financial value).*

---

## 🎯 Your First Transaction: Placing a Sealed ZK Bid

VeilBid uses Zero-Knowledge (ZK) cryptography. Your bid amount is **100% private** — nobody, not even the auction seller or network validators, can see how much you bid until the auction closes.

### Step-by-Step Walkthrough:

1. **Open the VeilBid App**:
   - Go to [https://veilbid-kappa.vercel.app](https://veilbid-kappa.vercel.app).
2. **Connect Your Wallet**:
   - Click the **🔑 Connect Wallet** button in the top right.
   - Select your wallet (1AM / Lace) and click **Approve** in the popup.
   - Your wallet address and tNIGHT balance will display in the navbar.
3. **Choose an NFT**:
   - Navigate to the **🛒 Marketplace** tab.
   - Browse the curated listings or use the category filters (Art, Gaming, PFPs, AI Agents).
   - Find an auction lot you like (e.g. *Midnight Sentinel #042*).
4. **Enter Your Private Bid**:
   - Click the green **🔒 Bid** button on the NFT card.
   - Enter your bid amount in tNIGHT (must meet or exceed the reserve price).
   - Click **🔒 Submit Sealed Bid**.
5. **ZK Proving & Wallet Approval**:
   - Your browser generates a zero-knowledge commitment in ~1.1 seconds.
   - Your wallet popup will ask you to sign the on-chain commitment transaction.
   - Click **Confirm / Sign**.
6. **Verify On-Chain**:
   - Once confirmed, a green success banner displays your real on-chain transaction hash.
   - Click **🔍 View on Explorer** to see the transaction confirmed on the [Midnight Preprod Explorer](https://preprod.midnightexplorer.com).
   - Notice: Only a cryptographic commitment hash is recorded on-chain — your actual bid valuation remains completely hidden!

---

## 👛 Managing Your Bids & Backups

1. Click **👛 My Wallet & Bids** in the navbar (or drawer on mobile).
2. Review your full active bidding history with on-chain transaction IDs.
3. Click **💾 Backup Witnesses** to download an encrypted backup of your secret salts and keys. If you ever clear your browser cache, you can restore your backup in one click!

---

## 🤖 Deploying Autonomous AI Trading Bots

1. Go to the **🤖 AI Agents** section in the Marketplace.
2. Select a bot profile (*ZK Sniper*, *Floor Hunter*, or *Value Accumulator*).
3. Set your private policy:
   - **Spending Ceiling**: Maximum total tNIGHT the agent may bid.
   - **Max Per Bid**: Highest single valuation.
4. Click **⚡ Deploy AI Agent**. The policy commitment is cryptographically verified on-chain without revealing your private trading thresholds!

---

## 🚀 Creating Your Own Auction

1. Click **🚀 Deploy Auction** in the top navigation.
2. Enter your NFT Title / Token Identifier, Reserve Price, and Royalty percentage (e.g., 5%).
3. Click **Deploy to Midnight Network** and sign with your wallet.
4. Your new auction contract address is generated on Preprod instantly.

---

## ❓ Frequently Asked Questions (FAQ)

**Q: Can miners or competitors front-run my bid?**  
No. Your bid is cryptographically sealed inside a Zero-Knowledge commitment hash. Competitors cannot read your valuation, making front-running impossible.

**Q: What happens if I don't win the auction?**  
Your losing bid stays sealed forever. Only the winning bid is proven and revealed at settlement.

**Q: Where can I give feedback?**  
Submit ratings and feedback directly in the app via the **💬 Feedback** button, or through our **[Official User Feedback Google Sheet](https://docs.google.com/spreadsheets/d/1y_tVgYt2RuekzAdBN6mv2ho4w3zbedvwrlfj_IjUp04/edit?usp=sharing)**.

---

## 🔗 Quick Resource Directory

| Resource | Link |
|---|---|
| **Live App** | [https://veilbid-kappa.vercel.app](https://veilbid-kappa.vercel.app) |
| **Preprod Explorer** | [https://preprod.midnightexplorer.com](https://preprod.midnightexplorer.com) |
| **Midnight Faucet** | [https://faucet.midnight.network](https://faucet.midnight.network) |
| **1AM Wallet** | [https://1am.space](https://1am.space) |
| **Lace Wallet** | [https://www.lace.io](https://www.lace.io) |
| **GitHub Repository** | [https://github.com/Thanos0s/VeilBid_Midnight](https://github.com/Thanos0s/VeilBid_Midnight) |
| **Official Feedback Sheet** | [VeilBid Google Sheet](https://docs.google.com/spreadsheets/d/1y_tVgYt2RuekzAdBN6mv2ho4w3zbedvwrlfj_IjUp04/edit?usp=sharing) |
| **X Profile** | [@Veil_Bid](https://x.com/Veil_Bid) |
