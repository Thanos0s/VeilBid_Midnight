# 🎭 VeilBid — Privacy-First NFT Marketplace on Midnight Network

> **Bid in the shadows. Win in the light.**

VeilBid is the first NFT marketplace built on the [Midnight Network](https://midnight.network) where bids, bidder identities, and trading strategies are fully private — verified by Zero-Knowledge proofs.

[![Level 5 Full Moon](https://img.shields.io/badge/Midnight%20Hackathon-Level%205%20Full%20Moon-F59E0B?style=for-the-badge&logo=moon)](docs/LEVEL_5_SUBMISSION.md)
![Network](https://img.shields.io/badge/Network-Midnight%20Preprod-10b981?style=for-the-badge)
[![Preprod Contract](https://img.shields.io/badge/Contract-0x2bb504ff...-8b5cf6?style=for-the-badge)](https://preprod.midnightexplorer.com/contracts/0x2bb504ffeb044d37e4fa02e0845cdafc2fa68db489c4c810457b32db7e7888e9)
[![CI/CD](https://github.com/Thanos0s/VeilBid_Midnight/actions/workflows/ci.yml/badge.svg)](https://github.com/Thanos0s/VeilBid_Midnight/actions)
[![X Profile](https://img.shields.io/badge/X-@Veil__Bid-1DA1F2?style=for-the-badge&logo=x)](https://x.com/Veil_Bid)

---

## 🌕 Level 5 — Full Moon Submission Highlights

VeilBid has achieved the **Level 5 — Full Moon** milestone!
- 🚀 **50 Preprod Users Onboarded & Verified**: Full directory of 50 verifiable wallet addresses across 4 cohorts in [`docs/PREPROD_USERS.md`](docs/PREPROD_USERS.md).
- 🔄 **Living Feedback Loop**: Structured user feedback collection, prioritization matrix, and code iteration log in [`docs/FEEDBACK_LOOP.md`](docs/FEEDBACK_LOOP.md).
- 📊 **Feedback Data Sheet**: [Google Sheets Live Feedback Tracking](https://docs.google.com/spreadsheets/d/1y_tVgYt2RuekzAdBN6mv2ho4w3zbedvwrlfj_IjUp04/edit?usp=sharing).
- 🏆 **Submission Dossier**: Master checklist alignment and verification references in [`docs/LEVEL_5_SUBMISSION.md`](docs/LEVEL_5_SUBMISSION.md).
- 🛠️ **In-App Feedback Widget**: Users can submit live feedback and ratings directly inside the dApp.

---

## 🌐 Live Demo

> **[🚀 Open VeilBid Live App →](https://veilbid-kappa.vercel.app)**

Connect your [1AM Wallet](https://1am.space) on **Midnight Preprod Network** (or Preview), browse the marketplace, deploy autonomous AI trading bots, and place real sealed ZK bids — all verifiable on-chain.

---

## Contract Address
| Network  | Address                              |
|----------|--------------------------------------|
| Preprod  | `0x2bb504ffeb044d37e4fa02e0845cdafc2fa68db489c4c810457b32db7e7888e9` |

## Level 5 — User Validation
- Target: 50 Preprod users
- Current: 50 / 50 (See USERS.md and docs/PREPROD_USERS.md)
- See USERS.md for wallet addresses
- See docs/FEEDBACK.md for feedback log and changes

---

## 📜 Verified Deployed Smart Contracts & On-Chain Proofs

| Network | Contract Address | Indexer / Explorer |
|---|---|---|
| **Preprod** (Default) | `0x2bb504ffeb044d37e4fa02e0845cdafc2fa68db489c4c810457b32db7e7888e9` | [View on Midnight Preprod Explorer](https://preprod.midnightexplorer.com/contracts/0x2bb504ffeb044d37e4fa02e0845cdafc2fa68db489c4c810457b32db7e7888e9) |
| **Preview** | `0xb39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4` | [View on Midnight Preview Explorer](https://preview.midnightexplorer.com/contracts/0xb39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4) |

### Live Verified Preprod Transactions

- **Contract Deployment Transaction**:  
  [`ea858d67c8273c6b2497e9bb87e875fcd5e9502da498b7e13c34911f0cb8281e`](https://preprod.midnightexplorer.com/transactions/ea858d67c8273c6b2497e9bb87e875fcd5e9502da498b7e13c34911f0cb8281e) — Block `2604402`
- **Sealed Bid Commitment Transaction**:  
  [`86367c284b70db5368d8f9747babb30d17dfad422023d319910d91a396dc94f9`](https://preprod.midnightexplorer.com/transactions/86367c284b70db5368d8f9747babb30d17dfad422023d319910d91a396dc94f9) — Verified on-chain sealed bid submission

> **Network Configuration**:
> - **Preprod Indexer:** `https://indexer.preprod.midnight.network/api/v4/graphql`
> - **Preprod Node RPC:** `https://rpc.preprod.midnight.network`
> - **Contract Source:** [`contracts/auction.compact`](contracts/auction.compact) (compiled with Compact `0.31.1`)

---

## 📹 Demo Video

Watch the full live MVP demo:

- 🎬 **[Watch VeilBid MVP Demo on Google Drive →](https://drive.google.com/file/d/1LB1p27jzefUPYO13GZWGl7IbReox2sNF/view?usp=sharing)**
- 🐦 **[Follow @Veil_Bid on X →](https://x.com/Veil_Bid)**

---

## 📖 Documentation Suite

| Document | Description |
|---|---|
| [USERS.md](USERS.md) | **Level 5 verified Preprod users table** |
| [docs/FEEDBACK.md](docs/FEEDBACK.md) | **Level 5 structured feedback log, themes & changes** |
| [docs/LEVEL_5_SUBMISSION.md](docs/LEVEL_5_SUBMISSION.md) | **Master Level 5 Full Moon Submission Dossier & Checklist** |
| [docs/PREPROD_USERS.md](docs/PREPROD_USERS.md) | **Directory of 50 verified Preprod users and on-chain proofs** |
| [docs/FEEDBACK_LOOP.md](docs/FEEDBACK_LOOP.md) | **Structured user feedback loop, prioritization & iteration log** |
| [docs/SECURITY.md](docs/SECURITY.md) | **Security threat model, circuit proofs & audit checklist** |
| [docs/USAGE.md](docs/USAGE.md) | Step-by-step user guide (non-technical) |
| [PROPOSAL.md](PROPOSAL.md) | Comprehensive product definition and ZK privacy model |
| [contracts/auction.compact](contracts/auction.compact) | ZK auction compact smart contract source |

---

## 🛡️ How It Works: Cryptographic Sealed-Bid Architecture

```
+-------------------------------------------------------------------------+
| Phase 1: Sealed Commitment                                              |
|                                                                         |
|  [Bidder]                                                               |
|     |                                                                   |
|     +--> Generates private 32-byte secret key (sk) and salt nonce       |
|     +--> Computes pk = persistentHash([pad("veilbid:pk:"), sk])         |
|     +--> Packs [pk (32B) || salt (32B) || amount (8B big-endian)]       |
|     +--> Computes SHA-256 commitment hash (32 bytes)                    |
|     |                                                                   |
|     +--> Calls submitBid(commitment) on Midnight Preprod via 1AM Wallet |
|          ==> Contract registers commitment in Map<Bytes<32>, Boolean>   |
|          ==> Valuation, identity, and bid amount remain 100% PRIVATE    |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Phase 2: Verifiable Zero-Knowledge Reveal                               |
|                                                                         |
|  [Bidder]                                                               |
|     |                                                                   |
|     +--> Calls revealBid(sk, salt, amount)                              |
|     +--> Local Midnight prover generates ZK proof                       |
|     +--> Circuit asserts:                                               |
|            1. Recomputed commitment is registered in commitments Map   |
|            2. Bid amount >= reservePrice                                |
|            3. If amount > highestPrice, updates winner to pk            |
|     ==> Losing bids are NEVER disclosed or leaked                       |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Phase 3: Seller Authorization & Settlement                              |
|                                                                         |
|  [Seller]                                                               |
|     |                                                                   |
|     +--> Calls closeAuction(sellerSk)                                   |
|     +--> Circuit asserts callerPk == sellerKey                          |
|     +--> Auction transitions to CLOSED; winner & price finalized        |
|     +--> Royalty apportionment (e.g. 500 bps = 5%) settled on-chain     |
+-------------------------------------------------------------------------+
```

---

## 🚀 Key Features & Capabilities

- 🔒 **100% On-Chain Midnight Network Transactions**: Real smart contract interactions confirmed via the 1AM wallet on Midnight Preprod with live explorer links.
- ⚡ **1-Click On-Chain Deployment**: Deploy fresh Compact auction contracts directly from the UI using your connected 1AM wallet.
- ⏱️ **Live Countdown Timers**: Real-time per-second ticking countdowns on all auction lots indicating active bidding and settlement phases.
- 🎨 **Multi-Lot Catalog & Category Browsing**: Search, filter by category (PFPs, Art, Gaming, AI Agents), and view on-chain reserve prices.
- 🔐 **Client-Side Witness Backup Tool**: Export and import your private salts, secret keys, and bid receipts to prevent state loss across browser sessions.
- 🛡️ **Anti-Front-Running Security**: Bids are completely blinded until reveal; miners, validators, and bots cannot observe amounts or front-run transactions.
- 🤖 **AI Trading Agent Support**: Modular architecture supporting automated trading strategies, sniper bots, and valuation oracles with ZK policy proofs.
- 🧪 **Automated Circuit & Unit Test Suite**: 10 tests exercising compiled contract classes, key derivations, reserve prices, and exploit preventions.

---

## 💻 Getting Started

### Prerequisites
- Node.js >= 20 (Node 22 recommended)
- [1AM Wallet](https://1am.space) browser extension configured for **Midnight Preprod** (or Preview)
- Testnet tNIGHT tokens from the [Midnight Faucet](https://faucet.midnight.network)

### Installation & Local Run

```bash
# Clone the repository
git clone https://github.com/Thanos0s/VeilBid_Midnight.git
cd VeilBid_Midnight

# Install dependencies
npm install

# Run the automated test suite (10/10 tests)
npm test

# Run TypeScript typecheck
npx tsc --noEmit

# Start the Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📁 Modular Project Structure

```
VeilBid/
├── contracts/
│   └── auction.compact          # ZK sealed-bid smart contract (Compact language)
├── docs/
│   ├── LEVEL_5_SUBMISSION.md    # Master Level 5 submission dossier
│   ├── PREPROD_USERS.md         # 50 verified Preprod user addresses
│   ├── FEEDBACK_LOOP.md         # Feedback collection & iteration matrix
│   ├── SECURITY.md              # Threat model, circuit proofs & audit checklist
│   └── USAGE.md                 # User guide and walkthrough
├── public/
│   └── managed/                 # Tracked compiled contract assets, ZKIR & verifier keys
├── src/
│   ├── components/              # Modular Neo-Brutalist UI components
│   │   ├── Navbar.tsx           # Network switcher, 1AM wallet connect, balance & modal triggers
│   │   ├── Hero.tsx             # Platform hero & dynamic role cycler
│   │   ├── AuctionCard.tsx      # Live ticking countdown timer & auction status
│   │   ├── Marketplace.tsx      # Multi-lot catalog, search & 1-click deploy launcher
│   │   ├── BidModal.tsx         # 2-phase sealed-bid & reveal modal with on-chain deploy
│   │   ├── DeployModal.tsx      # Standalone contract deployment modal
│   │   ├── BackupModal.tsx      # Private witness backup & restore tool
│   │   ├── AgentShowcase.tsx    # AI trading agent strategies & policy proofs
│   │   ├── StatsBanner.tsx      # Live platform metrics ticker
│   │   └── FeedbackModal.tsx    # In-app community feedback loop
│   ├── hooks/
│   │   └── useMidnight.ts       # 1AM wallet API, providers, and on-chain RPC methods
│   ├── data/
│   │   └── initialAuctions.ts   # Catalog data with dynamic on-chain address resolution
│   ├── types/
│   │   └── auction.ts           # Strict TypeScript interfaces (0 'any' types)
│   ├── App.tsx                  # Clean root application (~200 lines)
│   ├── main.tsx                 # React entry point
│   └── index.css                # Neo-brutalist styling & responsive layouts
├── tests/
│   └── auction.test.js          # 10 automated circuit & security tests
├── test.js                      # Test runner entry point
├── scripts/
│   └── compile.js               # Compact compilation & asset synchronization script
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI pipeline (Node 22, tests & build)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🧪 Automated Test Suite

VeilBid features 10 automated unit and circuit tests verifying:
1. Auction state machine initialization and exports
2. Deterministic public key derivation via Compact pure circuit
3. Contract instantiation and interface verification
4. Cryptographic commitment generation ensuring Zero-Knowledge bid privacy
5. **Exploit Fix Verification**: Uncommitted bids cannot win during settlement
6. Reserve price enforcement and highest bidder settlement logic
7. Creator royalty mathematical settlement (conservation of value)
8. Public commitment registration in ledger state
9. Seller authorization requirement for auction closing
10. Zero-Knowledge property: losing bids are never disclosed

Run tests:
```bash
npm test
```

---

## 🔒 Privacy Architecture Matrix

| Data | Visibility | Storage | Mechanism |
|---|---|---|---|
| **Bid Amount** | 🔒 Private | Off-chain client state | Concealed in 256-bit ZK commitment |
| **Bidder Identity** | 🔒 Private | Off-chain client state | Shielded public key derivation |
| **Bid Nonce / Salt** | 🔒 Private | Client local storage / backup | Cryptographic randomness (32 bytes) |
| **Bid Count** | 🌐 Public | On-chain ledger | Incremented on `submitBid` |
| **Auction State** | 🌐 Public | On-chain ledger | `OPEN` / `CLOSED` |
| **Reserve Price** | 🌐 Public | On-chain ledger | Disclosed at contract creation |
| **Winner (at close)** | 🌐 Public | On-chain ledger | Disclosed via verified reveal |
| **Winning Price** | 🌐 Public | On-chain ledger | Disclosed via verified reveal |
| **Losing Bids** | 🔒 Sealed | Never revealed | Stays private forever |

---

## ⚙️ CI/CD Pipeline

Our GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on every commit to `main`:
- **Node Environment**: Node 22 (LTS) on `ubuntu-latest`
- **Compiler**: Pinned Compact `0.31.1` & `@midnight-ntwrk/compact-runtime 0.16.0`
- **Test Suite**: Automated execution of all 10 circuit & contract tests
- **TypeScript**: `tsc --noEmit` validation
- **Vite Build**: Production bundling and chunk optimization

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

*Built with ❤️ on [Midnight Network](https://midnight.network) · Zero-Knowledge · Privacy-First · [@Veil_Bid](https://x.com/Veil_Bid)*
