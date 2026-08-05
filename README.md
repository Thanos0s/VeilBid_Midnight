# 🎭 VeilBid — Privacy-First NFT Marketplace on Midnight Network

> **Bid in the shadows. Win in the light.**

VeilBid is the first NFT marketplace built on the [Midnight Network](https://midnight.network) where bids, bidder identities, and trading strategies are fully private — verified by Zero-Knowledge proofs.

[![CI/CD](https://github.com/Thanos0s/VeilBid_Midnight/actions/workflows/ci.yml/badge.svg)](https://github.com/Thanos0s/VeilBid_Midnight/actions)
![Network](https://img.shields.io/badge/Network-Midnight%20Preview-8b5cf6?style=for-the-badge)
![Contract](https://img.shields.io/badge/Contract-b39e69c5...-10b981?style=for-the-badge)
[![X Profile](https://img.shields.io/badge/X-@VeilBid-1DA1F2?style=for-the-badge&logo=x)](https://x.com/VeilBid)

---

## 🌐 Live Demo

> **[🚀 Open VeilBid Live App →](https://veilbid-kappa.vercel.app)**

Connect your [1AM Wallet](https://1am.space) on **Midnight Preview Network**, browse the marketplace, and place a real sealed ZK bid — all verifiable on-chain.

---

## 📜 Verified Deployed Smart Contract

| Field | Value |
|---|---|
| **Network** | Midnight Preview Network |
| **Contract Address** | [`b39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4`](https://preview.midnightexplorer.com/contracts/0xb39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4) |
| **Explorer** | [View on Midnight Preview Explorer](https://preview.midnightexplorer.com/contracts/0xb39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4) |
| **Indexer** | `https://indexer.preview.midnight.network/api/v4/graphql` |
| **RPC Node** | `https://rpc.preview.midnight.network` |
| **Contract Source** | [`contracts/auction.compact`](contracts/auction.compact) |

> **Note**: This contract is deployed on **Midnight Preview Network** — Midnight's public test environment for developer builds. Preview is a distinct environment from Preprod, both maintained by the Midnight team as separate test stages.

---

## 📹 Demo Video

Watch the full 5-minute live MVP demo:

- 🎬 **[Watch VeilBid MVP Demo →](https://x.com/VeilBid)** *(link updates once uploaded)*

---

## 📖 Documentation

| Document | Description |
|---|---|
| [README.md](README.md) | Project overview, setup, and architecture |
| [docs/USAGE.md](docs/USAGE.md) | Step-by-step user guide (non-technical) |
| [contracts/auction.compact](contracts/auction.compact) | ZK auction smart contract source |

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
- [1AM Wallet](https://1am.space) browser extension (Midnight Preview Network)
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

Open http://localhost:5173 in your browser.

### Usage

For a full step-by-step walkthrough of every feature, see **[docs/USAGE.md](docs/USAGE.md)**.

### Deploying a Contract

With your 1AM wallet connected on Midnight Preview Network:

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
├── docs/
│   └── USAGE.md              # Non-technical user guide
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
├── .github/
│   └── workflows/
│       └── ci.yml            # CI/CD pipeline (compile + test + build)
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

## ⚙️ CI/CD Pipeline

VeilBid has a GitHub Actions pipeline that runs on every push to `main`:

1. **Compile** — Compact compiler builds `contracts/auction.compact`
2. **Test** — TypeScript type check runs with `tsc --noEmit`
3. **Build** — Vite production build via `npm run build`

[![CI/CD Status](https://github.com/Thanos0s/VeilBid_Midnight/actions/workflows/ci.yml/badge.svg)](https://github.com/Thanos0s/VeilBid_Midnight/actions)

---

## 🌙 Midnight Network

VeilBid is deployed on **Midnight Preview Network** — Midnight's public developer test environment, separate from Preprod and Mainnet.

| Environment | Purpose |
|---|---|
| **Preview** (this project) | Public developer testing, where this contract lives |
| Preprod | Pre-production staging closer to mainnet |
| Mainnet | Production (not yet live) |

- **Indexer**: `https://indexer.preview.midnight.network/api/v4/graphql`
- **Node**: `https://rpc.preview.midnight.network`
- **Explorer**: `https://preview.midnightexplorer.com`
- **Wallet**: [1AM Wallet](https://1am.space)
- **Faucet**: [faucet.midnight.network](https://faucet.midnight.network)

---

## 🤖 AI Agent Support

VeilBid is designed from the ground up to support **autonomous AI trading agents**:

- Agents can call `submitBid()` programmatically with a private witness
- No strategy disclosure — ZK proofs validate bids without revealing logic
- Anti-front-running by design — sealed bids cannot be observed by validators
- Full on-chain settlement with provable fairness
- ZK Policy Commitment: agent spending caps and rules committed on-chain as a cryptographic hash

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

*Built with ❤️ on [Midnight Network](https://midnight.network) · Zero-Knowledge · Privacy-First · [@VeilBid](https://x.com/VeilBid)*
