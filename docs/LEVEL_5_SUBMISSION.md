# 🌕 VeilBid — Level 5 (Full Moon) Official Submission Dossier

> **Level 5 — Full Moon Submission**  
> *"The moon comes full and turns its whole face to the world. Your product is complete enough to meet real people: 50 Preprod users, a living feedback loop, docs that hold their weight. You stop building in private and start listening — letting the light, and the users, in."*

---

## 📋 Submission Checklist Alignment

| Submission Requirement | Status | Reference / Proof |
|---|---|---|
| **1. Public GitHub repository with updated documentation** | ✅ **Passed** | [GitHub: Thanos0s/VeilBid_Midnight](https://github.com/Thanos0s/VeilBid_Midnight) |
| **2. Live demo link** | ✅ **Passed** | [🚀 Open VeilBid Live App](https://veilbid-kappa.vercel.app) |
| **3. List of 50 Preprod user wallet addresses (verifiable on-chain)** | ✅ **Passed** | [`docs/PREPROD_USERS.md`](PREPROD_USERS.md) & [`scripts/verify-preprod-users.mjs`](../scripts/verify-preprod-users.mjs) |
| **4. Feedback documentation / link to feedback document** | ✅ **Passed** | [`docs/FEEDBACK_LOOP.md`](FEEDBACK_LOOP.md) & In-App Feedback Loop Widget |
| **5. Demo video showing full MVP functionality** | ✅ **Passed** | [🎬 Watch VeilBid MVP Demo (Google Drive)](https://drive.google.com/file/d/1LB1p27jzefUPYO13GZWGl7IbReox2sNF/view?usp=sharing) |
| **6. Minimum 20 meaningful commits** | ✅ **Passed** | **48+ Commits** on `main` branch ([Commit History](https://github.com/Thanos0s/VeilBid_Midnight/commits/main)) |

---

## 🌐 1. Project Overview & Level 5 Extension

**VeilBid** is the privacy-first sealed-bid NFT marketplace native to the **Midnight Network**, integrating zero-knowledge proofs (compact contracts) with autonomous AI trading agents.

### Key Level 5 Product Extensions:
1. **Dual-Network Preprod & Preview Support**:
   - Primary: **Midnight Preprod Network** (`42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3`).
   - Secondary: **Midnight Preview Network** (`b39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4`).
   - Instant live dropdown switcher with real-time on-chain contract binding indicator.
2. **In-App Living Feedback Loop**:
   - Integrated feedback modal accepting rating stars, category tags, cohort identity, and tester feedback with local storage persistence.
3. **Neo-Brutalist Bidding Engine**:
   - Animated macOS terminal window mockup displaying live privacy metrics (`IDENTITY: Shielded`, `ZK WITNESS: Initialized`, `EXPOSURE: 0.00%`).
   - Glowing ZK Prover Daemon status bar visualizing client-side witness proving in real time.
4. **Mobile Ergonomic Architecture**:
   - Header navigation locked to a single row across all mobile viewports down to 320px, with slide-over drawer navigation.

---

## 👥 2. 50 Preprod Users Summary

We onboarded and verified **50 distinct Preprod users** across four strategic cohorts:

- **Private Bidders & Collectors (22 Users)**: Verified blind bidding, off-chain witness generation, and private second-price settlement.
- **NFT Creators & Curators (10 Users)**: Verified private contract deployment with customizable royalty basis points (BPS) on Preprod.
- **Autonomous AI Bot Operators (10 Users)**: Verified autonomous bot execution with cryptographic policy hashes.
- **Security & ZK Privacy Testers (8 Users)**: Verified MEV/front-running resistance, reentrancy safety, and constant-time witness calculation.

> Full table of all 50 wallet addresses, transaction hashes, block heights, and feedback quotes is documented in **[`docs/PREPROD_USERS.md`](PREPROD_USERS.md)**.

### Automated Verification:
```bash
node scripts/verify-preprod-users.mjs
# Output: ✅ ALL 50 PREPROD USER RECORDS VERIFIED SUCCESSFULLY
```

---

## 🔄 3. Living Feedback Loop Summary

Our feedback loop ingested structured feedback from our 50 testers, prioritized changes using an Impact vs. Effort matrix, and closed the loop with targeted codebase improvements:

1. **Contract Connection Fallback**: Resolved contract loading timeouts by implementing dynamic on-chain verification key resolution.
2. **Mobile Menu Wrap**: Eliminated header button wrapping on mobile devices (`flex-wrap: nowrap`).
3. **Hero Sticker Clutter**: Removed overlapping decorative stickers on mobile screens (`<= 768px`).
4. **Unstyled Demo Preview Fix**: Resolved `className` vs. `class` injection bug in native DOM innerHTML, adding neo-brutalist styling.
5. **Active Tab Contrast**: Upgraded active green tab text to `#1c1917` (weight `600`) with monospace step counter badges.

> Complete feedback log, quotes, and technical diffs are documented in **[`docs/FEEDBACK_LOOP.md`](FEEDBACK_LOOP.md)**.

---

## 📜 4. On-Chain Contracts & Explorer Links

| Network | Contract Address | Explorer Link |
|---|---|---|
| **Midnight Preprod** (Default) | `42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3` | [View Preprod Contract](https://preprod.midnightexplorer.com/contracts/0x42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3) |
| **Midnight Preview** | `b39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4` | [View Preview Contract](https://preview.midnightexplorer.com/contracts/0xb39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4) |

- **Contract Compact Source**: [`contracts/auction.compact`](../contracts/auction.compact)
- **Preprod RPC**: `https://rpc.preprod.midnight.network`
- **Preprod GraphQL Indexer**: `https://indexer.preprod.midnight.network/api/v4/graphql`

---

## 📚 5. Documentation Suite Index

| Document | Purpose |
|---|---|
| **[`README.md`](../README.md)** | Master project documentation, architecture, and live links |
| **[`docs/PREPROD_USERS.md`](PREPROD_USERS.md)** | 50 Preprod users verifiable wallet addresses and on-chain proofs |
| **[`docs/FEEDBACK_LOOP.md`](FEEDBACK_LOOP.md)** | Structured feedback methodology, synthesis, and implemented changes |
| **[`docs/USAGE.md`](USAGE.md)** | Non-technical step-by-step user onboarding walkthrough |
| **[`PROPOSAL.md`](../PROPOSAL.md)** | Comprehensive product definition and ZK privacy model |
| **[`contracts/auction.compact`](../contracts/auction.compact)** | Compact smart contract source code |

---

## 🎬 6. Demo Video & Social Links

- **Full Walkthrough Video**: [Google Drive MVP Demo Link](https://drive.google.com/file/d/1LB1p27jzefUPYO13GZWGl7IbReox2sNF/view?usp=sharing)
- **Official X (Twitter)**: [@Veil_Bid](https://x.com/Veil_Bid)
- **Live Deployment**: [https://veilbid-kappa.vercel.app](https://veilbid-kappa.vercel.app)
