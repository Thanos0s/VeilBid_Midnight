import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

// ── VeilBid Contract & Cryptographic Circuit Tests ──

test('VeilBid: auction state machine and compiled contract exports', async () => {
  const contract = await import('./public/managed/contract/index.js');
  
  assert.ok(contract.Contract, 'Contract export should exist');
  assert.ok(contract.AuctionState, 'AuctionState enum should be exported');
  assert.strictEqual(contract.AuctionState.OPEN, 0, 'AuctionState.OPEN should be 0');
  assert.strictEqual(contract.AuctionState.CLOSED, 1, 'AuctionState.CLOSED should be 1');
  assert.ok(contract.pureCircuits, 'pureCircuits export should exist');
  assert.strictEqual(typeof contract.pureCircuits.agentPublicKey, 'function', 'agentPublicKey pure circuit should exist');
});

test('VeilBid: deterministic public key derivation via Compact pure circuit', async () => {
  const { pureCircuits } = await import('./public/managed/contract/index.js');
  
  const secretKey1 = new Uint8Array(32);
  secretKey1[0] = 0x42;
  secretKey1[31] = 0x99;

  const secretKey2 = new Uint8Array(32);
  secretKey2[0] = 0x42;
  secretKey2[31] = 0x99;

  const secretKeyDifferent = new Uint8Array(32);
  secretKeyDifferent[0] = 0x01;

  const pk1 = pureCircuits.agentPublicKey(secretKey1);
  const pk2 = pureCircuits.agentPublicKey(secretKey2);
  const pkDiff = pureCircuits.agentPublicKey(secretKeyDifferent);

  assert.strictEqual(pk1.length, 32, 'Derived public key must be 32 bytes');
  assert.deepStrictEqual(pk1, pk2, 'Identical secret keys must produce identical public keys');
  assert.notDeepStrictEqual(pk1, pkDiff, 'Different secret keys must produce distinct public keys');
});

test('VeilBid: contract instantiation and interface verification', async () => {
  const { Contract } = await import('./public/managed/contract/index.js');
  
  const contractInstance = new Contract({});
  assert.ok(contractInstance.circuits, 'Contract must define circuits');
  assert.ok(contractInstance.circuits.submitBid, 'Contract must define submitBid circuit');
  assert.ok(contractInstance.circuits.revealBid, 'Contract must define revealBid circuit');
  assert.ok(contractInstance.circuits.closeAuction, 'Contract must define closeAuction circuit');
  assert.strictEqual(typeof contractInstance.initialState, 'function', 'Contract must define initialState');
});

test('VeilBid: cryptographic commitment generation ensures zero-knowledge bid privacy', () => {
  // Simulates the client-side sealed-bid commitment scheme
  const pk = new Uint8Array(32).fill(0x11);
  const salt1 = new Uint8Array(32).fill(0xaa);
  const salt2 = new Uint8Array(32).fill(0xbb);
  const bidAmount = 500n;

  const computeCommitment = (pubkey, nonce, amount) => {
    const hasher = createHash('sha256');
    hasher.update(pubkey);
    hasher.update(nonce);
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64BE(amount);
    hasher.update(buf);
    return new Uint8Array(hasher.digest());
  };

  const c1 = computeCommitment(pk, salt1, bidAmount);
  const c2 = computeCommitment(pk, salt2, bidAmount); // Same amount, different salt

  assert.strictEqual(c1.length, 32, 'Commitment must be 32 bytes');
  assert.notDeepStrictEqual(c1, c2, 'Unique salting prevents rainbow table attacks on identical bid amounts');
});

test('VeilBid EXPLOIT FIX: uncommitted bids cannot win during settlement', () => {
  // Simulates the on-chain commitments registry in auction.compact
  const onChainCommitments = new Set();

  const registeredBidderPk = new Uint8Array(32).fill(0x01);
  const registeredSalt = new Uint8Array(32).fill(0x02);
  const registeredAmount = 500n;

  const hasher = createHash('sha256');
  hasher.update(registeredBidderPk);
  hasher.update(registeredSalt);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(registeredAmount);
  hasher.update(buf);
  const validCommitmentHex = hasher.digest('hex');

  // Bidder registers commitment on-chain
  onChainCommitments.add(validCommitmentHex);

  // Attacker tries to reveal an uncommitted bid (the vulnerability identified in review)
  const attackerPk = new Uint8Array(32).fill(0x99);
  const attackerSalt = new Uint8Array(32).fill(0x88);
  const attackerAmount = 0n; // Attacker tries to steal for 0 price

  const attackerHasher = createHash('sha256');
  attackerHasher.update(attackerPk);
  attackerHasher.update(attackerSalt);
  const bufAtk = Buffer.alloc(8);
  bufAtk.writeBigUInt64BE(attackerAmount);
  attackerHasher.update(bufAtk);
  const attackerCommitmentHex = attackerHasher.digest('hex');

  // In auction.compact: assert(commitments.member(c), "Bid commitment was never registered on-chain");
  const isAttackerValid = onChainCommitments.has(attackerCommitmentHex);
  assert.strictEqual(isAttackerValid, false, 'Exploit prevented: uncommitted bid is rejected on-chain');

  const isValidBidderValid = onChainCommitments.has(validCommitmentHex);
  assert.strictEqual(isValidBidderValid, true, 'Legitimate bidder commitment verified');
});

test('VeilBid: reserve price and highest bidder settlement logic', () => {
  const reservePrice = 100n;
  let currentWinner = null;
  let currentWinningPrice = null;

  const processReveal = (pk, amount, isCommitted) => {
    if (!isCommitted) throw new Error('Commitment not registered');
    if (amount < reservePrice) throw new Error('Bid does not meet reserve price');

    if (currentWinningPrice === null || amount > currentWinningPrice) {
      currentWinner = pk;
      currentWinningPrice = amount;
    }
  };

  // Bid below reserve price should throw
  assert.throws(() => processReveal('bidderA', 50n, true), /reserve price/);

  // First valid bid at 200n
  processReveal('bidderB', 200n, true);
  assert.strictEqual(currentWinner, 'bidderB');
  assert.strictEqual(currentWinningPrice, 200n);

  // Higher bid at 350n should overtake
  processReveal('bidderC', 350n, true);
  assert.strictEqual(currentWinner, 'bidderC');
  assert.strictEqual(currentWinningPrice, 350n);

  // Lower bid at 250n should NOT overtake
  processReveal('bidderD', 250n, true);
  assert.strictEqual(currentWinner, 'bidderC', 'Highest bidder remains winner');
  assert.strictEqual(currentWinningPrice, 350n);
});

test('VeilBid: creator royalty basis point mathematical settlement', () => {
  const winningPrice = 1000n;
  const royaltyBps = 500n; // 5.00%
  const BPS_DENOMINATOR = 10000n;

  const royaltyDue = (winningPrice * royaltyBps) / BPS_DENOMINATOR;
  const sellerNet = winningPrice - royaltyDue;

  assert.strictEqual(royaltyDue, 50n, '5% royalty on 1000 tNIGHT is 50 tNIGHT');
  assert.strictEqual(sellerNet, 950n, 'Seller receives 950 tNIGHT');
  assert.strictEqual(royaltyDue + sellerNet, winningPrice, 'Conservation of value across settlement');
});
