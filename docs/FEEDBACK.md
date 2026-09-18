# User Feedback — Level 5

## Feedback Collection Method
- **In-App Feedback Widget**: Users submit direct ratings (1-5 stars), categories (UI/UX, ZK Proving, Wallet, Bugs), and detailed notes directly within VeilBid.
- **Midnight Discord & Developer Channels**: Interactive testing sessions with developers on the Midnight Dev Discord.
- **Telegram & Direct Outreach**: One-on-one testing interviews with Cardano & Midnight testnet power users.
- **Live Tracking Spreadsheet**: [Feedback Tracking Sheet](https://docs.google.com/spreadsheets/d/1y_tVgYt2RuekzAdBN6mv2ho4w3zbedvwrlfj_IjUp04/edit?usp=sharing)

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
