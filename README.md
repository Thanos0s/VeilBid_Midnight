# 🎭 VeilBid — Privacy-First NFT Marketplace on Midnight Network

> **Bid in the shadows. Win in the light.**

VeilBid is the first NFT marketplace built on the [Midnight Network](https://midnight.network) where bids, bidder identities, and trading strategies are fully private — verified by Zero-Knowledge proofs.

[![Level 5 Full Moon](https://img.shields.io/badge/Midnight%20Hackathon-Level%205%20Full%20Moon-F59E0B?style=for-the-badge&logo=moon)](docs/LEVEL_5_SUBMISSION.md)
![Network](https://img.shields.io/badge/Network-Midnight%20Preprod-10b981?style=for-the-badge)
![Preprod Contract](https://img.shields.io/badge/Contract-42bb41cd...-8b5cf6?style=for-the-badge)
[![CI/CD](https://github.com/Thanos0s/VeilBid_Midnight/actions/workflows/ci.yml/badge.svg)](https://github.com/Thanos0s/VeilBid_Midnight/actions)
[![X Profile](https://img.shields.io/badge/X-@Veil__Bid-1DA1F2?style=for-the-badge&logo=x)](https://x.com/Veil_Bid)

---

## 🌕 Level 5 — Full Moon Submission Highlights

VeilBid has achieved the **Level 5 — Full Moon** milestone!
- 🚀 **50 Preprod Users Onboarded & Verified**: Full directory of 50 verifiable wallet addresses across 4 cohorts in [`docs/PREPROD_USERS.md`](docs/PREPROD_USERS.md).
- 🔄 **Living Feedback Loop**: Structured user feedback collection, prioritization matrix, and code iteration log in [`docs/FEEDBACK_LOOP.md`](docs/FEEDBACK_LOOP.md).
- ##Sheet having Data of Feedback
- https://docs.google.com/spreadsheets/d/1y_tVgYt2RuekzAdBN6mv2ho4w3zbedvwrlfj_IjUp04/edit?usp=sharing
- 🏆 **Submission Dossier**: Master checklist alignment and verification references in [`docs/LEVEL_5_SUBMISSION.md`](docs/LEVEL_5_SUBMISSION.md).
- 🛠️ **In-App Feedback Widget**: Users can submit live feedback and ratings directly inside the dApp.

---

## 🌐 Live Demo

> **[🚀 Open VeilBid Live App →](https://veilbid-kappa.vercel.app)**

Connect your [1AM Wallet](https://1am.space) on **Midnight Preprod Network** (or Preview), browse the marketplace, deploy autonomous AI trading bots, and place real sealed ZK bids — all verifiable on-chain.

---

## 📜 Verified Deployed Smart Contract

| Network | Contract Address | Indexer / Explorer |
|---|---|---|
| **Preprod** (Default) | `42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3` | [View on Midnight Preprod Explorer](https://preprod.midnightexplorer.com/contracts/0x42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3) |
| **Preview** | `b39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4` | [View on Midnight Preview Explorer](https://preview.midnightexplorer.com/contracts/0xb39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4) |

- **Preprod Indexer:** `https://indexer.preprod.midnight.network/api/v4/graphql`
- **Preprod Node:** `https://rpc.preprod.midnight.network`
- **Contract Source:** [`contracts/auction.compact`](contracts/auction.compact)

> **Note**: The default network is **Midnight Preprod Network**. Dual-network switching is fully supported via the network dropdown in the top-right of the web app.

---

## 📹 Demo Video

Watch the full live MVP demo:

- 🎬 **[Watch VeilBid MVP Demo on Google Drive →](https://drive.google.com/file/d/1LB1p27jzefUPYO13GZWGl7IbReox2sNF/view?usp=sharing)**
- 🐦 **[Follow @Veil_Bid on X →](https://x.com/Veil_Bid)**

---

## 📖 Documentation Suite

| Document | Description |
|---|---|
| [docs/LEVEL_5_SUBMISSION.md](docs/LEVEL_5_SUBMISSION.md) | **Master Level 5 Full Moon Submission Dossier & Checklist** |
| [docs/PREPROD_USERS.md](docs/PREPROD_USERS.md) | **Directory of 50 verified Preprod users and on-chain proofs** |
| [docs/FEEDBACK_LOOP.md](docs/FEEDBACK_LOOP.md) | **Structured user feedback loop, prioritization & iteration log** |
| [README.md](README.md) | Project overview, architecture, and developer setup |
| [docs/SECURITY.md](docs/SECURITY.md) | Security threat model, circuit proofs & audit checklist |
| [docs/USAGE.md](docs/USAGE.md) | Step-by-step user guide (non-technical) |
| [PROPOSAL.md](PROPOSAL.md) | Comprehensive product definition and ZK privacy model |
| [contracts/auction.compact](contracts/auction.compact) | ZK auction compact smart contract source |

---

## 🛡️ How It Works

1. **Cryptographic Sealed Bids** — Bidders commit a cryptographic hash of their valuation and private salt `(pk, nonce, amount)`. Only the 32-byte commitment is registered on-chain.
2. **Anti-Front-Running Auction Window** — Bid amounts remain concealed in Zero-Knowledge proofs; validators, miners, and competing bots cannot see amounts or front-run bids.
3. **Verifiable Settlement** — When bids are revealed, the Compact circuit asserts that the commitment was registered on-chain, meets the reserve price, and mathematically selects the highest bidder.
4. **Creator Royalty Apportionment** — Royalties are calculated on-chain via configurable basis points (e.g. 500 = 5%) with transparent settlement receipts and non-custodial payouts.
5. **Private State Backup** — Users can export and import their secret salts and proving keys to guard against browser cache clearing.

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

*Built with ❤️ on [Midnight Network](https://midnight.network) · Zero-Knowledge · Privacy-First · [@Veil_Bid](https://x.com/Veil_Bid)*
