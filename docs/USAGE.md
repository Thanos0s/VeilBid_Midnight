# 📖 VeilBid — Usage Guide

> **Bid in the shadows. Win in the light.**

This guide walks you through every feature of VeilBid as a regular user — no developer knowledge required.

---

## Table of Contents

1. [What You Need Before You Start](#1-what-you-need-before-you-start)
2. [Connecting Your Wallet](#2-connecting-your-wallet)
3. [Browsing the Marketplace](#3-browsing-the-marketplace)
4. [Placing a Sealed ZK Bid](#4-placing-a-sealed-zk-bid)
5. [Checking Your Bids](#5-checking-your-bids)
6. [Deploying an AI Trading Agent](#6-deploying-an-ai-trading-agent)
7. [Deploying Your Own Auction](#7-deploying-your-own-auction)
8. [Frequently Asked Questions](#8-frequently-asked-questions)

---

## 1. What You Need Before You Start

| Requirement | Details |
|---|---|
| **Browser** | Chrome or Brave (desktop or mobile) |
| **1AM Wallet** | Free extension — [download at 1am.space](https://1am.space) |
| **tNIGHT tokens** | Free test tokens from the [Midnight faucet](https://faucet.midnight.network) |
| **Network** | Midnight Preview Network (selected inside the 1AM Wallet) |

> **Note**: tNIGHT tokens have no real monetary value — they are purely for testing on the Preview Network.

---

## 2. Connecting Your Wallet

1. Open **[VeilBid](https://veilbid-kappa.vercel.app)** in your browser.
2. Click the **🔑 Connect Wallet** button in the top-right corner.
3. Your **1AM Wallet** extension will pop up — click **Connect**.
4. Once connected, the button updates to show your short wallet address (e.g. `🔑 mn_addr...a62`).

You are now connected to the Midnight Preview Network and ready to bid.

---

## 3. Browsing the Marketplace

1. Click **🛒 Marketplace** in the navigation bar.
2. Use the **search bar** to find specific NFTs by name or collection.
3. Use the **filter pills** to browse by category:
   - `All` — every NFT in the marketplace
   - `🤖 AI Agents` — autonomous trading agents you can deploy
   - `Gaming`, `Art`, `PFPs`, `Physical` — NFT categories

On mobile, the filter pills scroll horizontally — swipe left/right to see all options.

---

## 4. Placing a Sealed ZK Bid

This is VeilBid's core feature. Your bid amount is **completely private** — no one can see it until the auction closes.

### Step-by-step

1. Find an NFT you want in the marketplace.
2. Click the **🔒 Bid** button on the NFT card.
3. In the modal that appears:
   - Enter your **bid amount** in tNIGHT tokens.
   - Click **🔒 Submit Sealed Bid**.
4. Watch the three-step progress bar:
   - **Local Witness** — your bid is encoded privately in your browser.
   - **ZK Proof** — a zero-knowledge proof is generated (proves your bid is valid without revealing it).
   - **Broadcast** — the proof is submitted to the Midnight blockchain.
5. Your **1AM Wallet** will ask you to sign the transaction — click **Approve**.
6. A **green success screen** shows your real on-chain transaction hash.

> **Privacy guarantee**: Nobody — not VeilBid, not the blockchain validators, not other bidders — can see your bid amount. It remains sealed until the auction owner closes the auction.

---

## 5. Checking Your Bids

1. Click **👛 My Wallet & Bids** in the navigation bar (or the button inside the hamburger menu on mobile).
2. The panel shows:
   - Your **connected wallet address**
   - Your **tNIGHT** and **DUST** token balances
   - A full history of every NFT you have bid on, including:
     - NFT thumbnail and name
     - Amount you bid
     - Date and time
     - On-chain transaction address
3. Click **📋 Copy Tx** next to any bid to copy the transaction hash.
4. Paste it into the [Midnight Explorer](https://preview.midnightexplorer.com) to verify it on-chain.

---

## 6. Deploying an AI Trading Agent

VeilBid supports **autonomous AI agents** that bid on your behalf — with your strategy kept private on-chain.

1. Click **🤖 AI Agents** in the filter pills on the Marketplace page.
2. Browse available agents (e.g. *ZK Sniper*, *Floor Hunter*, *Value Accumulator*).
3. Click **🤖 Deploy Agent** on the agent you want.
4. Configure your agent's policy:
   - **Spending Ceiling** — maximum total tNIGHT the agent can spend.
   - **Max Per Bid** — maximum the agent can bid on any single NFT.
   - **Strategy Tier** — the decision logic the agent uses.
   - **Target Collection** — restrict the agent to a specific collection, or leave as "All".
5. Click **⚡ Deploy AI Agent with ZK Policy Commitment**.
6. A cryptographic **policy hash** is generated and committed to your contract address on-chain.

> Your agent's strategy remains private. Other bidders cannot see your ceiling or logic — the blockchain only confirms that each action respects the policy you set.

---

## 7. Deploying Your Own Auction

If you are an NFT creator or seller, you can create your own auction:

1. Click **🚀 Deploy Auction** in the navigation bar.
2. Enter:
   - **NFT Token ID** — a name or identifier for your NFT.
   - **Royalty %** — the percentage you receive from every future resale.
3. Click **Deploy to Midnight Network**.
4. Sign the transaction in your **1AM Wallet**.
5. Your contract address is shown on success — save it for your buyers.

---

## 8. Frequently Asked Questions

**Q: Is my bid really private?**  
Yes. Your bid amount is stored as a ZK witness inside your browser only. It is never sent to any server or visible on-chain. Only a cryptographic commitment (a hash) is published on Midnight.

**Q: What happens if I lose the auction?**  
Your losing bid stays sealed permanently. No one will ever know what you bid — not even the auction winner.

**Q: What tokens do I need?**  
You need **tNIGHT** tokens (test tokens) available free from the [Midnight faucet](https://faucet.midnight.network). These are not real money.

**Q: Can I use VeilBid on mobile?**  
Yes. VeilBid is fully mobile-responsive. Use the **☰ hamburger menu** at the top to access all navigation options on a phone.

**Q: What is the Midnight Preview Network?**  
It is Midnight's public test network where you can build and test real ZK-proven transactions without spending real money. VeilBid's contract is deployed here.

**Q: Where can I verify my transaction?**  
Paste any transaction hash into [Midnight Explorer](https://preview.midnightexplorer.com) to see it confirmed on-chain.

---

## 🔗 Links

| Resource | Link |
|---|---|
| Live App | https://veilbid-kappa.vercel.app |
| GitHub Repo | https://github.com/Thanos0s/VeilBid_Midnight |
| Contract on Explorer | https://preview.midnightexplorer.com/contracts/0xb39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4 |
| 1AM Wallet | https://1am.space |
| Midnight Faucet | https://faucet.midnight.network |
| X / Twitter | https://x.com/VeilBid |

---

*For developer setup instructions, see [README.md](../README.md).*
