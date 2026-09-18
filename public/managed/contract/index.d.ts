import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum AuctionState { OPEN = 0, CLOSED = 1 }

export type BidCommitment = { pk: Uint8Array; nonce: Uint8Array; amount: bigint
                            };

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  submitBid(context: __compactRuntime.CircuitContext<PS>,
            commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealBid(context: __compactRuntime.CircuitContext<PS>,
            secretKey_0: Uint8Array,
            salt_0: Uint8Array,
            amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               sellerSk_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  submitBid(context: __compactRuntime.CircuitContext<PS>,
            commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealBid(context: __compactRuntime.CircuitContext<PS>,
            secretKey_0: Uint8Array,
            salt_0: Uint8Array,
            amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               sellerSk_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  agentPublicKey(sk_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  agentPublicKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  submitBid(context: __compactRuntime.CircuitContext<PS>,
            commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealBid(context: __compactRuntime.CircuitContext<PS>,
            secretKey_0: Uint8Array,
            salt_0: Uint8Array,
            amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               sellerSk_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly state: AuctionState;
  readonly taskId: Uint8Array;
  readonly bidCount: bigint;
  readonly reservePrice: bigint;
  readonly royaltyBps: bigint;
  readonly creatorKey: Uint8Array;
  readonly sellerKey: Uint8Array;
  readonly winner: { is_some: boolean, value: Uint8Array };
  readonly winningPrice: { is_some: boolean, value: bigint };
  readonly winningCommitment: { is_some: boolean, value: Uint8Array };
  commitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               id_0: Uint8Array,
               minPrice_0: bigint,
               royaltyBasisPoints_0: bigint,
               creator_0: Uint8Array,
               seller_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
