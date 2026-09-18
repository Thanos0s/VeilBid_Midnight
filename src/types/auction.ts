/**
 * VeilBid Type Definitions
 */

export interface AuctionItem {
  id: string;
  contractAddress: string;
  title: string;
  author: string;
  creatorKey: string;
  sellerKey: string;
  floor: string;
  volume: string;
  img: string;
  category: string;
  reservePrice: bigint;
  royaltyBps: number;
  bidCount: number;
  state: 'OPEN' | 'CLOSED';
  endTime: number; // timestamp in ms
  description?: string;
  winner?: string | null;
  winningPrice?: bigint | null;
  specs?: {
    strategy?: string;
    proving?: string;
    privacy?: string;
  };
}

export interface BidReceipt {
  auctionId: string;
  contractAddress: string;
  amount: string;
  amountBigInt: string;
  saltHex: string;
  commitmentHex: string;
  secretKeyHex: string;
  timestamp: number;
  status: 'COMMITTED' | 'REVEALED' | 'WON' | 'LOST';
  txHash?: string;
}

export interface WalletBalances {
  unshieldedNight: bigint;
  shieldedNight: bigint;
  dust: bigint;
}

export interface ContractInstance {
  contractAddress: string;
  circuits?: Record<string, (...args: unknown[]) => Promise<unknown>>;
  callTx?: {
    submitBid: (commitment: Uint8Array) => Promise<{ txHash: string }>;
    revealBid: (secretKey: Uint8Array, salt: Uint8Array, amount: bigint) => Promise<{ txHash: string }>;
    closeAuction: (sellerSk: Uint8Array) => Promise<{ txHash: string }>;
  };
  deployTxData?: {
    public: {
      contractAddress: string;
      txHash: string;
    };
  };
}

export interface PublicDataProvider {
  queryContractState: (contractAddress: string) => Promise<{
    operation?: (circuitId: string) => { verifierKey?: Uint8Array };
    data?: unknown;
  } | null>;
}

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  isContractLoading: boolean;
  contractError: string | null;
  unshieldedAddress: string | null;
  shieldedAddress: string | null;
  walletName: string | null;
  error: string | null;
  contract: ContractInstance | null;
  balances: WalletBalances | null;
}

export type NetworkName = 'preprod' | 'preview';
