# User Feedback — Level 5

> [!IMPORTANT]
> **MANDATORY LEVEL 5 USER FEEDBACK LINKS**:
> All user feedback for Level 5 evaluation is collected via the Google Form and maintained in the official Google Sheet:
> - 📋 **Feedback Form**: 👉 **[VeilBid Beta Testing Google Form](https://forms.gle/CqbVWfcZPZJvDoSx6)**
> - 📊 **Feedback Sheet**: 👉 **[VeilBid Level 5 User Feedback Google Sheet](https://docs.google.com/spreadsheets/d/1y_tVgYt2RuekzAdBN6mv2ho4w3zbedvwrlfj_IjUp04/edit?usp=sharing)**

## Feedback Collection Method
- **Google Form Survey (Direct Collection)**: [https://forms.gle/CqbVWfcZPZJvDoSx6](https://forms.gle/CqbVWfcZPZJvDoSx6)
- **Official Google Sheet (Mandatory Tracking)**: [VeilBid User Feedback Google Sheet](https://docs.google.com/spreadsheets/d/1y_tVgYt2RuekzAdBN6mv2ho4w3zbedvwrlfj_IjUp04/edit?usp=sharing)
- **Raw CSV Dataset**: [`../feedback_responses_90_users.csv`](../feedback_responses_90_users.csv)
- **In-App Feedback Widget**: Users submit direct ratings (1-5 stars), categories (UI/UX, ZK Proving, Wallet, Bugs), and detailed notes directly within VeilBid.
- **Midnight Discord & Developer Channels**: Interactive testing sessions with developers on the Midnight Dev Discord.
- **Telegram & Direct Outreach**: One-on-one testing interviews with Cardano & Midnight testnet power users.

## Raw Feedback Log
| # | User | Feedback Summary | Date |
|---|------|-----------------|------|
| 1 | `@CryptoPhantom_01` | Wallet connected, but older contract addresses lacked `revealBid` operation. | 2026-09-17 |
| 2 | `@AnonBidder_42` | Proving took ~1.1s, requested visible step-by-step progress indicator during ZK proving. | 2026-09-17 |
| 3 | `@MobilePenTester` | Hamburger menu wrapped awkwardly on narrow mobile viewports (<400px). | 2026-09-18 |
| 4 | `@ZkHunter_77` | Requested live countdown timers with ticking seconds on open auction lots. | 2026-09-18 |
| 5 | `@CardanoKnight_12` | Midnight Explorer links returned 404 due to `/contract/` instead of `/contracts/0x...`. | 2026-09-18 |

## What We Heard (Themes)
1. **Real On-Chain Transactions**: Users emphasized removing all mock/dummy timeouts and executing 100% real Midnight Preprod network calls with verifiable Explorer links.
2. **Contract Versioning & Verifier Keys**: Earlier deployed contracts lacked the new `revealBid` circuit, requiring inline 1-click deployment for fresh auction lots.
3. **Explorer URL Route Accuracy**: Midnight Explorer expects `/contracts/0x...` and `/transactions/...`.
4. **Mobile & UX Ergonomics**: Clean responsive navigation and real-time countdown timers for sealed bidding deadlines.

## What We Changed
| Change | Reason | Commit |
|--------|--------|--------|
| Verifier Key & 1-Click Deploy | Fixed `revealBid` verifier key mismatch by purging stale address and enabling 1-click deploy | `8ba05a3` |
| Explorer URL Routes | Updated `/contract/` to `/contracts/0x...` and `/tx/` to `/transactions/` to fix 404s | `d26d49c` |
| Live Countdown Timers | Added real-time ticking per-second countdown timers on all auction cards | `c2dc12d` |
| Monolith Refactoring | De-monolithized `App.tsx` into 9 modular React components with strict TypeScript | `a19532d` |
| 10 Circuit & Unit Tests | Added automated testing suite covering commitments, reveals, and exploit prevention | `0e031da` |

## Level 6 Improvements
| Change | User Feedback That Triggered It | Status |
|--------|--------------------------------|--------|
| Verifier Key & 1-Click Redeployment | `@CryptoPhantom_01`: Stale deployed contract instances lacked `revealBid` operation, throwing verifier key mismatch | ✅ Implemented & Verified |
| Direct Explorer Routes (`/contracts/0x...` & `/transactions/...`) | `@CardanoKnight_12`: Links to Midnight Explorer returned 404 when using legacy route schema | ✅ Implemented & Verified |
| Real-Time Ticking Countdown Timers | `@ZkHunter_77`: Wanted live ticking countdown timers with remaining hours/minutes/seconds on auction cards | ✅ Implemented & Verified |

