# VeilBid Security Architecture & Threat Model

This document specifies the cryptographic security guarantees, circuit constraints, threat model, and audit verification checklist for VeilBid on the Midnight Network.

---

## 1. Cryptographic Sealed-Bid Architecture

VeilBid implements a **two-phase cryptographic commit-reveal mechanism** compiled with Compact v0.22 targeting Midnight's Zero-Knowledge proving infrastructure.

```
┌────────────────────────────────────────────────────────┐
│ Phase 1: Sealed-Bid Commitment (Private Witness)        │
├────────────────────────────────────────────────────────┤
│ Bidder creates:                                        │
│   sk       = Private Secret Key                        │
│   pk       = persistentHash(["veilbid:pk:", sk])       │
│   nonce    = 256-bit High-Entropy Random Salt          │
│   amount   = Private Valuation (Uint<64>)              │
│                                                        │
│ Commitment:                                            │
│   c = persistentHash(BidCommitment { pk, nonce, amount })│
│                                                        │
│ On-Chain Ledger:                                       │
│   commitments.insert(disclose(c), true)                │
│   bidCount.increment(1)                                │
│   * Amount, salt, and identity remain 100% hidden *   │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ Phase 2: Settlement & Verifiable Reveal                │
├────────────────────────────────────────────────────────┤
│ Bidder submits: revealBid(sk, nonce, amount)           │
│                                                        │
│ Zero-Knowledge Circuit Constraints:                    │
│   1. Recompute: pk = agentPublicKey(sk)                │
│   2. Recompute: c  = persistentHash({pk, nonce, amount})│
│   3. Assert: commitments.member(c) == true             │
│   4. Assert: amount >= reservePrice                    │
│   5. Condition: amount > winningPrice                  │
│        => winner = pk                                  │
│        => winningPrice = amount                        │
│        => winningCommitment = c                        │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ Phase 3: Finalization & Closing                        │
├────────────────────────────────────────────────────────┤
│ Seller submits: closeAuction(sellerSk)                 │
│ Assert: agentPublicKey(sellerSk) == sellerKey          │
│ state = AuctionState.CLOSED                            │
└────────────────────────────────────────────────────────┘
```

---

## 2. Threat Model & Vulnerability Analysis

### Threat 1: Uncommitted Bid Stealing / Price Manipulation (Remediated)
- **Previous Flaw**: In earlier experimental prototypes, `closeAuction` could be invoked with an arbitrary price and key without verifying prior bid history.
- **Remediation in `auction.compact`**: 
  - `submitBid(commitment)` persists cryptographic commitments to the on-chain ledger map `commitments: Map<Bytes<32>, Boolean>`.
  - `revealBid(sk, salt, amount)` explicitly checks `assert(commitments.member(c))`.
  - An attacker attempting to reveal an uncommitted bid or fabricate a lower price fails the on-chain membership assertion. This is verified by automated test `test.js: VeilBid EXPLOIT FIX: uncommitted bids cannot win during settlement`.

### Threat 2: Front-Running & MEV Extraction
- **Risk**: On public blockchains (Ethereum, Solana), pending bids in the mempool are visible to searchers and validators who sandwich or outbid by 1 wei.
- **Protection**: Bid amounts and nonces are processed purely through private witnesses (`BidCommitment`). Only the 32-byte hash commitment is visible on the ledger. Neither block producers nor competing AI bots can ascertain bid amounts prior to the reveal window.

### Threat 3: Rainbow Table / Dictionary Attacks on Bids
- **Risk**: If commitments were `hash(amount)`, an attacker could precompute hashes for standard amounts (0.1, 0.2, 0.5 tNIGHT).
- **Protection**: Every bid incorporates a 256-bit cryptographic salt generated via `crypto.getRandomValues(new Uint8Array(32))`. Identical bid amounts yield completely distinct commitments.

### Threat 4: Unauthorized Auction Closure
- **Risk**: An unauthorized third party closing an auction prematurely.
- **Protection**: `closeAuction(sellerSk)` enforces `assert(callerPk == sellerKey)`. Only the legitimate auction creator who deployed the contract can close it.

### Threat 5: Client-Side Witness Loss
- **Risk**: Browser cache clearing deletes local storage containing the salt and private keys required to construct the ZK reveal proof.
- **Protection**: VeilBid includes an in-app **Keys & Witness Backup** utility (`src/components/BackupModal.tsx`) allowing users to export encrypted/plain JSON receipts containing their commitments and secret salts.

---

## 3. Settlement & Royalties Specification

### Basis Points Specification
VeilBid calculates creator royalties using basis points ($1 \text{ BPS} = 0.01\%$):
$$\text{Royalty} = \left\lfloor \frac{\text{WinningPrice} \times \text{RoyaltyBPS}}{10000} \right\rfloor$$
$$\text{Seller Net} = \text{WinningPrice} - \text{Royalty}$$

### On-Chain vs Off-Chain Execution
- **On-Chain Circuit**: Verifies mathematical conservation of value, asserts valid royalty basis points (up to 1000 BPS = 10%), records creator public key and winning price.
- **Settlement Execution**: Funds are distributed through Midnight's native DApp connector API (`balanceUnsealedTransaction`) with transparent settlement receipts.

---

## 4. Security Verification Checklist

- [x] **Circuit Compilation**: Verified clean compilation via Compact toolchain (`compact 0.5.1`).
- [x] **Circuit Membership Assertion**: `assert(commitments.member(c))` enforced.
- [x] **Reserve Price Floor**: `assert(revealedAmount >= reservePrice)` enforced.
- [x] **Seller Authority Enforcement**: Only seller key can transition state to `CLOSED`.
- [x] **Automated Exploit Tests**: 10 unit and circuit tests passing with 0 errors.
- [x] **Strict TypeScript Typing**: No `any` types in wallet or contract interfaces.
- [x] **Key Material Persistence**: Client-side export/import backup tool provided.
