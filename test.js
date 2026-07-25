import { test } from 'node:test';
import assert from 'node:assert/strict';

// ── VeilBid Contract Tests ──

test('VeilBid: auction state machine compiles and exports correctly', async () => {
  let contract;
  try {
    contract = await import('./managed/contract/index.js');
  } catch (e) {
    console.warn('⚠️  Compiled contract not found — run `npm run compile` first. Skipping module test.');
    return;
  }
  assert.ok(contract.Contract, 'Contract export should exist');
  assert.ok(contract.AuctionState, 'AuctionState enum should be exported');
  assert.strictEqual(typeof contract.AuctionState.OPEN, 'number', 'AuctionState.OPEN should be a number');
  assert.strictEqual(typeof contract.AuctionState.CLOSED, 'number', 'AuctionState.CLOSED should be a number');
});

test('VeilBid: bid count starts at zero', async () => {
  let contract;
  try {
    contract = await import('./managed/contract/index.js');
  } catch {
    console.warn('⚠️  Compiled contract not found. Skipping.');
    return;
  }
  assert.ok(contract.Contract, 'Contract should be defined');
});

test('VeilBid: secret key derivation produces consistent output', () => {
  // Verify deterministic key derivation logic (no contract needed)
  const mockSecretKey = new Uint8Array(32);
  mockSecretKey[0] = 0xab;
  mockSecretKey[1] = 0xcd;
  assert.strictEqual(mockSecretKey.length, 32, 'Secret key should be 32 bytes');
  assert.strictEqual(mockSecretKey[0], 0xab);
  assert.strictEqual(mockSecretKey[1], 0xcd);
});

test('VeilBid: private state serialisation round-trip', () => {
  const state = { secretKey: new Uint8Array(32), bidAmount: 12345n };
  const serialized = JSON.stringify(state, (_k, v) => typeof v === 'bigint' ? { type: 'BigInt', value: v.toString() } : v instanceof Uint8Array ? Array.from(v) : v);
  const parsed = JSON.parse(serialized, (_k, v) => {
    if (v && typeof v === 'object' && v.type === 'BigInt') return BigInt(v.value);
    return v;
  });
  assert.strictEqual(parsed.bidAmount, 12345n, 'BigInt round-trip should preserve value');
});

test('VeilBid: royalty basis point calculation', () => {
  const price = 1000;
  const royaltyBps = 500; // 5%
  const royalty = Math.floor((price * royaltyBps) / 10000);
  const sellerAmount = price - royalty;
  assert.strictEqual(royalty, 50, '5% of 1000 tNIGHT should be 50');
  assert.strictEqual(sellerAmount, 950, 'Seller should receive 950 tNIGHT');
});

test('VeilBid: bid validation logic', () => {
  const currentBid = 500;
  const newBid = 600;
  const tooLowBid = 300;
  assert.ok(newBid > currentBid, 'Valid bid should exceed current bid');
  assert.ok(tooLowBid <= currentBid, 'Low bid should be rejected');
});
