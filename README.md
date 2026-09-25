# 🎭 VeilBid — Privacy-First NFT Marketplace on Midnight Network

[![CI](https://github.com/Thanos0s/VeilBid_Midnight/actions/workflows/ci.yml/badge.svg)](https://github.com/Thanos0s/VeilBid_Midnight/actions)
[![Level 6 Launch](https://img.shields.io/badge/Midnight%20Hackathon-Level%206%20Launch-10b981?style=for-the-badge&logo=rocket)](LAUNCH_USERS.md)
[![Preprod Contract](https://img.shields.io/badge/Contract-0x2bb504ff...-8b5cf6?style=for-the-badge)](https://preprod.midnightexplorer.com/contracts/0x2bb504ffeb044d37e4fa02e0845cdafc2fa68db489c4c810457b32db7e7888e9)
[![Google Sheet Feedback](https://img.shields.io/badge/Google%20Sheet-Live%20Feedback-0F9D58?style=for-the-badge&logo=googlesheets&logoColor=white)](https://docs.google.com/spreadsheets/d/1y_tVgYt2RuekzAdBN6mv2ho4w3zbedvwrlfj_IjUp04/edit?usp=sharing)
[![X Profile](https://img.shields.io/badge/X-@Veil__Bid-1DA1F2?style=for-the-badge&logo=x)](https://x.com/Veil_Bid)

> **Bid in the shadows. Win in the light.**

VeilBid is the first NFT marketplace built on the [Midnight Network](https://midnight.network) where bids, bidder identities, and trading strategies are fully private — verified by Zero-Knowledge proofs.

---

## Live Demo

> **[🚀 Open VeilBid Live App → https://veilbid-kappa.vercel.app](https://veilbid-kappa.vercel.app)**

Connect your **1AM Wallet** or **Lace Wallet** on **Midnight Preprod Network**, browse the marketplace, deploy autonomous AI trading bots, and place real sealed ZK bids — all verifiable on-chain.

---

## Contract Address

| Network  | Address                              | Explorer Link |
|----------|--------------------------------------|---------------|
| **Preprod**  | `0x2bb504ffeb044d37e4fa02e0845cdafc2fa68db489c4c810457b32db7e7888e9` | [View Preprod Contract](https://preprod.midnightexplorer.com/contracts/0x2bb504ffeb044d37e4fa02e0845cdafc2fa68db489c4c810457b32db7e7888e9) |

- **Deployment Transaction**: [`ea858d67c8273c6b2497e9bb87e875fcd5e9502da498b7e13c34911f0cb8281e`](https://preprod.midnightexplorer.com/transactions/ea858d67c8273c6b2497e9bb87e875fcd5e9502da498b7e13c34911f0cb8281e) — Block `2604402`
- **Sealed Bid Transaction**: [`86367c284b70db5368d8f9747babb30d17dfad422023d319910d91a396dc94f9`](https://preprod.midnightexplorer.com/transactions/86367c284b70db5368d8f9747babb30d17dfad422023d319910d91a396dc94f9) — Verified on-chain sealed bid submission

---

## What This Product Does

In traditional public blockchain NFT marketplaces (such as OpenSea on Ethereum or Magic Eden on Solana), every offer and bid is fully transparent the moment it is broadcast. This transparency causes severe structural vulnerabilities: predatory MEV bots front-run honest buyers, sniper algorithms outbid users by negligible increments at the last second, and collectors are forced to leak their reserve valuations and strategic intents to the entire world.

VeilBid solves this systemic problem for digital collectors, NFT creators, and autonomous trading bots. By introducing cryptographic sealed-bid auctions natively on Midnight, bidders submit blinded zero-knowledge commitments. Valuations, identity secrets, and random salts remain safely inside the user's browser, while the smart contract enforces auction fairness and prevents front-running.

Midnight Network's dual-state architecture (shielded private state combined with transparent public state) and Compact smart contract language make this possible. By executing client-side Zero-Knowledge proof generation (ZK witnesses), VeilBid allows users to prove mathematical compliance (meeting reserve prices, valid commitment ownership, and solvency) directly on their machines before broadcasting a succinct proof to the Midnight Preprod blockchain.

---

## Privacy Model

- **What is PUBLIC:**
  - Auction state (`OPEN` / `CLOSED`) and NFT token metadata
  - Public reserve price and creator royalty percentage (basis points)
  - Total count of submitted sealed commitments
  - Winning bidder's derived public key and winning price (revealed only upon settlement)
- **What is PRIVATE:**
  - Exact bid amounts and valuations during the active auction
  - Bidder identity, seed entropy, and private secret keys
  - Cryptographic salt / nonce used to blind each commitment hash
  - Losing bid amounts (these remain sealed permanently and are NEVER revealed on-chain)
  - Autonomous AI bot trading budgets, ceiling limits, and valuation formulas
- **What the user PROVES without revealing:**
  - That their bid meets or exceeds the public reserve price
  - That the on-chain commitment was authentically derived from `SHA-256(pk || salt || amount)`
  - That the bidder controls the private secret key corresponding to the commitment without revealing the key
  - That upon reveal, the claimed amount matches the sealed commitment exactly

---

## Tech Stack

- **ZK Smart Contracts**: Compact (`contracts/auction.compact`), `@midnight-ntwrk/compact-js`, `@midnight-ntwrk/compact-runtime`
- **Blockchain & Indexer**: Midnight Preprod Network (`https://rpc.preprod.midnight.network`, GraphQL Indexer `https://indexer.preprod.midnight.network/api/v4/graphql`)
- **Frontend Framework**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Wallet Connectivity**: 1AM Wallet & Lace Wallet DApp API (`@midnight-ntwrk/dapp-connector-api`)
- **Testing & Verification**: Node.js test runner (`node --test`), automated circuit tests, strict TypeScript (`tsc --noEmit`)
- **Deployment**: Vercel Edge Network (dApp) & GitHub Actions (CI/CD)

---

## Prerequisites

- **Lace Wallet** or **1AM Wallet** extension (Chrome / Brave) configured for **Midnight Preprod**
- Testnet **tNIGHT** tokens from the [Midnight Faucet](https://faucet.midnight.network)
- **Node.js v22+** (LTS) & npm 10+

---

## Setup & Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Thanos0s/VeilBid_Midnight.git
   cd VeilBid_Midnight
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the Compact contract (generates ZKIR circuits and TypeScript bindings):
   ```bash
   npm run compile
   ```
4. Run the automated circuit & contract test suite:
   ```bash
   npm test
   ```
5. Start the local development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:5173`.

---

## Run Tests

VeilBid includes 10 automated unit and circuit tests verifying cryptographic soundness:

```bash
npm test
```

Test coverage includes:
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

---

## CI/CD

Our automated CI/CD pipeline (`.github/workflows/ci.yml`) runs on every commit to `main`:
- **Environment**: Ubuntu Latest with Node.js 22 (LTS)
- **Build & Verification**: Pinned Compact `0.31.1`, TypeScript compiler checks (`tsc --noEmit`), unit test execution (`npm test`), and production Vite bundling (`npm run build`).

---

## Usage Guide

See **[`docs/USAGE.md`](docs/USAGE.md)** for a complete non-technical user guide, including:
- **Getting Started on Preprod** (Wallet installation & faucet setup)
- **Your First Transaction** (Placing a sealed ZK bid step-by-step)
- Managing bid receipts and witness backups
- Deploying autonomous AI trading agents

---

## Feedback & Iterations

See **[`docs/FEEDBACK.md`](docs/FEEDBACK.md)** and **[`docs/FEEDBACK_LOOP.md`](docs/FEEDBACK_LOOP.md)**.

> [!IMPORTANT]
> **MANDATORY LEVEL 5 & 6 USER FEEDBACK GOOGLE SHEET**:  
> All user feedback, on-chain transaction hashes, and evaluation metrics are recorded in the official Google Sheet:  
> 👉 **[VeilBid Live Feedback Google Sheet](https://docs.google.com/spreadsheets/d/1y_tVgYt2RuekzAdBN6mv2ho4w3zbedvwrlfj_IjUp04/edit?usp=sharing)**

### Summary of Top Changes Made from User Feedback:
- **Verifier Key & 1-Click Redeployment**: Purged stale deployed contract instances lacking `revealBid` operation, reconciling circuit verifier keys and enabling 1-click on-chain deploy directly from the UI.
- **Direct Explorer Route Accuracy**: Updated all explorer links to Midnight Preprod specifications (`/contracts/0x...` & `/transactions/...`) resolving 404 navigation errors.
- **Live Countdown Timers & Ergonomics**: Added real-time ticking per-second countdown timers on auction lot cards and decoupled single-row mobile navigation down to 320px viewports.

---

## Level 6 Users

See **[`LAUNCH_USERS.md`](LAUNCH_USERS.md)** for the Level 6 Preprod user onboarding log (Target: 20 verified wallet addresses).  
*(For the 50 verified on-chain Preprod users from Level 5, see [`USERS.md`](USERS.md) and [`docs/PREPROD_USERS.md`](docs/PREPROD_USERS.md)).*

---

## Product X Profile

Follow our official project account for announcements, drops, and community demos:
- 🐦 **[Follow @Veil_Bid on X → https://x.com/Veil_Bid](https://x.com/Veil_Bid)**

---

## Brand Assets

Brand identity materials, logos, palettes, and social media assets are documented in:
- 🎨 **[Brand Brief & Identity Guide](docs/BRAND_BRIEF.md)** *(Logo, typography, color palette, and social banner specs)*
- 🖼️ Platform Logo & Icon: [`public/veilbid-logo.png`](public/veilbid-logo.png)
