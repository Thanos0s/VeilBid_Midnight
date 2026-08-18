# Product Proposal

## What is the product, and who uses it?
VeilBid is a privacy-first DeFi NFT auction marketplace. It allows collectors, digital artists, and institutional buyers to list assets and submit sealed bids without revealing the numeric bid amount to the public. Bidders use it to secure valuable NFTs, while creators use it to run secure auctions that protect the bids, strategies, and financial capacity of their participants from competitors and front-runners.

## Why Midnight specifically?
Transparent blockchains (like Ethereum or Cardano Mainnet) broadcast all transactions and inputs publicly. This allows snipers to copy bids in the mempool (front-running) and exposes a buyer's maximum buying capacity. Midnight specifically enables local Zero-Knowledge proving in the user's browser via the 1AM wallet. Bidders can cryptographically prove their bid is valid and meets the minimum bid threshold, without revealing the actual amount of the bid to any third party on-chain.

## Data Model
| Data Point       | Type           | Disclosed To |
|------------------|----------------|--------------|
| Active auction status | Public ledger  | Everyone     |
| Total bid count       | Public ledger  | Everyone     |
| Winning bidder address | Public ledger  | Everyone (Only after auction closes) |
| Winning bid price     | Public ledger  | Everyone (Only after auction closes) |
| Individual losing bid amounts | Private witness | No one |
| Bidder private secret keys   | Private witness | No one |

## Mainnet Feasibility
Yes, VeilBid is highly feasible for Mainnet by Level 6. The core Compact smart contracts are compiled, verified, and running on the Midnight Preprod test network. Local proof generation via the browser-native prover and integration with the 1AM wallet are fully operational. The frontend builds with zero compilation errors, making it ready to transition to Mainnet.
