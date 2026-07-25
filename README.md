# 🎭 VeilBid — Privacy-First NFT Marketplace on Midnight Network

> **Bid in the shadows. Win in the light.**

VeilBid is the first NFT marketplace built on the [Midnight Network](https://midnight.network) where bids, bidder identities, and trading strategies are fully private — verified by Zero-Knowledge proofs.

![VeilBid](https://img.shields.io/badge/Network-Midnight%20Preview-8b5cf6?style=for-the-badge)
![ZK](https://img.shields.io/badge/Privacy-Zero--Knowledge-10b981?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%2018-61dafb?style=for-the-badge)

---

## 🛡️ How It Works

1. **Seal Your Bid** — Your bid amount is stored as a private ZK witness, never disclosed to anyone
2. **ZK Proof On-Chain** — A zero-knowledge proof verifies your bid is valid without revealing the amount
3. **Private Settlement** — The winner is determined using ZK proofs; all losing bids stay sealed forever
4. **Artist Royalties** — Creators receive royalties automatically, enforced on-chain

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22
- [1AM Wallet](https://1am.space) browser extension (for Midnight Preview Network)
- [Compact Compiler](https://github.com/midnight-ntwrk/compact) for contract compilation

### Installation

```bash
# Clone the repo
git clone https://github.com/Thanos0s/VeilBid_Midnight.git
cd VeilBid_Midnight

# Install dependencies
npm install

# Compile the auction contract (WSL/Linux only)
npm run compile

# Start dev server
npm run dev
```

### Deploying a Contract

With your 1AM wallet connected on Preview Network:

1. Click **🚀 Deploy** in the navbar
2. Enter your NFT Token ID and royalty percentage
3. Sign the transaction in your wallet
4. The contract address will be saved automatically

---

## 📁 Project Structure

```
VeilBid/
├── contracts/
│   └── auction.compact       # ZK auction contract (Compact language)
├── managed/                  # Compiled contract output (auto-generated)
├── public/
│   └── managed/              # Compiled assets served to browser
│       ├── zkir/             # Binary ZK intermediate representation
│       ├── keys/             # Prover & verifier keys
│       └── contract/         # Compiled contract JS module
├── src/
│   ├── App.tsx               # Main marketplace UI
│   ├── index.css             # Design system
│   ├── hooks/
│   │   └── useMidnight.ts    # Midnight wallet & contract hook
│   └── main.tsx              # React entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🔒 Privacy Architecture

| Data | Visibility | Storage |
|------|-----------|---------|
| Bid Amount | 🔒 Private | ZK witness in browser |
| Bidder Identity | 🔒 Private | Shielded address |
| Bid Count | 🌐 Public | On-chain ledger |
| Auction Status | 🌐 Public | On-chain ledger |
| Winner (at close) | 🌐 Public | Disclosed via ZK proof |
| Winning Price | 🌐 Public | Disclosed via ZK proof |
| Losing Bids | 🔒 Sealed | Never revealed |

---

## 🌙 Midnight Network

VeilBid is deployed on the **Preview Network** — Midnight's public test environment.

- **Network**: Preview
- **Indexer**: `https://indexer.preview.midnight.network/api/v4/graphql`
- **Node**: `https://rpc.preview.midnight.network`
- **Wallet**: [1AM Wallet](https://1am.space)

---

## 🤖 AI Agent Support

VeilBid is designed from the ground up to support **autonomous AI trading agents**:

- Agents can call `submitBid()` programmatically with a private witness
- No strategy disclosure — ZK proofs validate bids without revealing logic
- Anti-front-running by design — sealed bids cannot be observed by validators
- Full on-chain settlement with provable fairness

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

*Built with ❤️ on [Midnight Network](https://midnight.network) · Zero-Knowledge · Privacy-First*
