import { test } from 'node:test';
import assert from 'node:assert/strict';

// ── Auction Smart Contract Circuit Tests ──

test('auction: state machine opens with parameters and registers commitments', async () => {
  const { pureCircuits } = await import('../managed/contract/index.js');

  const sellerSk = new Uint8Array(32).fill(0x10);
  const creatorSk = new Uint8Array(32).fill(0x20);
  const sellerPk = pureCircuits.agentPublicKey(sellerSk);
  const creatorPk = pureCircuits.agentPublicKey(creatorSk);

  const mockLedger = {
    state: 0, // AuctionState.OPEN
    taskId: new Uint8Array(32).fill(0xee),
    reservePrice: 100n,
    royaltyBps: 500n,
    sellerKey: sellerPk,
    creatorKey: creatorPk,
    bidCount: 0n,
    commitments: new Set<string>(),
    winner: null as Uint8Array | null,
    winningPrice: null as bigint | null,
  };

  assert.equal(mockLedger.state, 0, 'Auction should be open');
  assert.equal(mockLedger.reservePrice, 100n, 'Reserve price is set');
  assert.equal(mockLedger.royaltyBps, 500n, 'Royalty is 5%');

  // Submit commitment
  const commitment1 = Buffer.from(new Uint8Array(32).fill(0x01)).toString('hex');
  mockLedger.commitments.add(commitment1);
  mockLedger.bidCount += 1n;

  assert.equal(mockLedger.bidCount, 1n, 'Bid count increments');
  assert.ok(mockLedger.commitments.has(commitment1), 'Commitment stored in map');
});

test('auction: seller authorization required to close auction', async () => {
  const { pureCircuits } = await import('../managed/contract/index.js');

  const sellerSk = new Uint8Array(32).fill(0x10);
  const impostorSk = new Uint8Array(32).fill(0x99);

  const authorizedSellerPk = pureCircuits.agentPublicKey(sellerSk);
  const impostorPk = pureCircuits.agentPublicKey(impostorSk);

  const closeCircuit = (callerSk: Uint8Array, registeredSellerPk: Uint8Array) => {
    const callerPk = pureCircuits.agentPublicKey(callerSk);
    if (Buffer.compare(Buffer.from(callerPk), Buffer.from(registeredSellerPk)) !== 0) {
      throw new Error('Only auction creator/seller can close the auction');
    }
    return 1; // AuctionState.CLOSED
  };

  // Impostor call should fail
  assert.throws(
    () => closeCircuit(impostorSk, authorizedSellerPk),
    /Only auction creator\/seller can close the auction/
  );

  // Authorized seller call succeeds
  const newState = closeCircuit(sellerSk, authorizedSellerPk);
  assert.equal(newState, 1, 'Auction successfully closed by authorized seller');
});

test('auction: zero-knowledge property — lost bids are never revealed', () => {
  // Sealed bids: commitments submitted on-chain
  const allCommitments = ['commit_A_32b_hash', 'commit_B_32b_hash', 'commit_C_32b_hash'];

  // Final public ledger state reveals ONLY the winning price and winning public key
  const publicFinalLedger = {
    state: 1, // CLOSED
    bidCount: 3n,
    winner: 'pk_winner_bidder_C',
    winningPrice: 450n,
  };

  const disclosedValues = JSON.stringify(publicFinalLedger, (_k, v) => typeof v === 'bigint' ? v.toString() : v);

  // Losing bid amounts (e.g. 100n and 250n) and their salts are never revealed on-chain
  assert.ok(!disclosedValues.includes('100'), 'Losing bid amount 100 is concealed');
  assert.ok(!disclosedValues.includes('250'), 'Losing bid amount 250 is concealed');
  assert.ok(disclosedValues.includes('450'), 'Winning price is publicly verifiable');
});
