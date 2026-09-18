import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  (window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
}

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  NetworkName,
  WalletBalances,
  WalletState,
  ContractInstance,
  PublicDataProvider,
  BidReceipt
} from '../types/auction';

// ── Network Configurations (Preprod + Preview) ──
const NETWORK_CONFIGS: Record<NetworkName, {
  indexer: string;
  indexerWS: string;
  node: string;
  proofServer: string;
  contractAddress: string;
}> = {
  preprod: {
    indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    node: 'https://rpc.preprod.midnight.network',
    proofServer: 'http://localhost:6300',
    // Live VeilBid contract deployed on Preprod
    contractAddress: '42bb41cdbf156cccef4b9800c0c7818b1dab80655156564ebc5a18be7495c4d3',
  },
  preview: {
    indexer: 'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    node: 'https://rpc.preview.midnight.network',
    proofServer: 'http://localhost:6300',
    contractAddress: localStorage.getItem('veilbid_contract_address_preview') || 'b39e69c51dfd27d63f8e0e489b86e33669e701a7cae83f6248fb220f985924b4',
  },
};

const getStoredNetwork = (): NetworkName => {
  const val = localStorage.getItem('veilbid_network');
  return val === 'preprod' || val === 'preview' ? val : 'preprod';
};

// ── Browser-native ZkConfigProvider ──
class BrowserZkConfigProvider {
  private publicDataProvider?: PublicDataProvider;
  private contractAddress?: string | null;

  constructor(publicDataProvider?: PublicDataProvider, contractAddress?: string | null) {
    this.publicDataProvider = publicDataProvider;
    this.contractAddress = contractAddress;
  }

  setContractContext(publicDataProvider: PublicDataProvider, contractAddress: string) {
    this.publicDataProvider = publicDataProvider;
    this.contractAddress = contractAddress;
  }

  async getZKIR(circuitId: string): Promise<Uint8Array> {
    const res = await fetch(`/managed/zkir/${circuitId}.bzkir`);
    if (!res.ok) throw new Error(`Failed to fetch ZKIR for ${circuitId}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getProverKey(circuitId: string): Promise<Uint8Array> {
    const res = await fetch(`/managed/keys/${circuitId}.prover`);
    if (!res.ok) throw new Error(`Failed to fetch prover key for ${circuitId}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getVerifierKey(circuitId: string): Promise<Uint8Array> {
    if (this.publicDataProvider && this.contractAddress) {
      try {
        const state = await this.publicDataProvider.queryContractState(this.contractAddress);
        const onChainVk = state?.operation?.(circuitId)?.verifierKey;
        if (onChainVk) return onChainVk;
      } catch (e) {
        console.warn(`Could not fetch on-chain verifier key for ${circuitId}, falling back to static file:`, e);
      }
    }
    const res = await fetch(`/managed/keys/${circuitId}.verifier`);
    if (!res.ok) throw new Error(`Failed to fetch verifier key for ${circuitId}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getVerifierKeys(circuitIds: string[]): Promise<[string, Uint8Array][]> {
    return Promise.all(circuitIds.map(async (id): Promise<[string, Uint8Array]> => {
      return [id, await this.getVerifierKey(id)];
    }));
  }

  async get(circuitId: string) {
    return {
      circuitId,
      zkir: await this.getZKIR(circuitId),
      proverKey: await this.getProverKey(circuitId),
      verifierKey: await this.getVerifierKey(circuitId),
    };
  }

  asKeyMaterialProvider() {
    return {
      getZKIR: (id: string) => this.getZKIR(id),
      getProverKey: (id: string) => this.getProverKey(id),
      getVerifierKey: (id: string) => this.getVerifierKey(id),
    };
  }
}

// ── Browser Private State Provider (localStorage) ──
const browserPrivateStateProvider = {
  contractAddress: null as string | null,
  setContractAddress: function(address: string | null) {
    this.contractAddress = address;
  },
  get: async function(key: string): Promise<unknown> {
    const val = localStorage.getItem(`veilbid_state_${this.contractAddress || 'default'}_${key}`);
    if (!val) return null;
    return JSON.parse(val, (k, v) => {
      if (v && typeof v === 'object' && v.type === 'BigInt') return BigInt(v.value);
      if (k === 'bidAmount' && (typeof v === 'string' || typeof v === 'number')) return BigInt(v);
      return v;
    });
  },
  set: async function(key: string, val: unknown): Promise<void> {
    const serialized = JSON.stringify(val, (_k, v) => {
      if (typeof v === 'bigint') return { type: 'BigInt', value: v.toString() };
      return v;
    });
    localStorage.setItem(`veilbid_state_${this.contractAddress || 'default'}_${key}`, serialized);
  },
  remove: async function(key: string): Promise<void> {
    localStorage.removeItem(`veilbid_state_${this.contractAddress || 'default'}_${key}`);
  },
  clear: async function(): Promise<void> {
    const prefix = `veilbid_state_${this.contractAddress || 'default'}_`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) keysToRemove.push(key);
    }
    for (const key of keysToRemove) localStorage.removeItem(key);
  },
  setSigningKey: async function(address: string, signingKey: string): Promise<void> {
    localStorage.setItem(`veilbid_signing_key_${address}`, signingKey);
  },
  getSigningKey: async function(address: string): Promise<string | null> {
    return localStorage.getItem(`veilbid_signing_key_${address}`);
  },
  removeSigningKey: async function(address: string): Promise<void> {
    localStorage.removeItem(`veilbid_signing_key_${address}`);
  },
};

interface WalletDAppAPI {
  getUnshieldedAddress: () => Promise<{ unshieldedAddress: string }>;
  getShieldedAddresses: () => Promise<{ shieldedAddress: string; shieldedCoinPublicKey: string; shieldedEncryptionPublicKey: string }>;
  getUnshieldedBalances: () => Promise<Record<string, bigint>>;
  getShieldedBalances: () => Promise<Record<string, bigint>>;
  getDustBalance: () => Promise<{ balance: bigint }>;
  balanceUnsealedTransaction: (txHex: string) => Promise<{ tx: string }>;
  submitTransaction: (txHex: string) => Promise<string>;
  getProvingProvider?: (keyMaterialProvider: unknown) => Promise<unknown>;
}

// ── Build contract providers from wallet API ──
async function buildProviders(api: WalletDAppAPI, networkConfig: typeof NETWORK_CONFIGS['preprod'], contractAddress?: string) {
  const [
    { indexerPublicDataProvider },
    { httpClientProofProvider },
    { createProofProvider },
    { toHex, fromHex },
    ledger,
  ] = await Promise.all([
    import('@midnight-ntwrk/midnight-js-indexer-public-data-provider'),
    import('@midnight-ntwrk/midnight-js-http-client-proof-provider'),
    import('@midnight-ntwrk/midnight-js-types'),
    import('@midnight-ntwrk/midnight-js-utils'),
    import('@midnight-ntwrk/ledger-v8'),
  ]);

  const publicDataProvider = indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS);
  const zkConfigProvider = new BrowserZkConfigProvider(publicDataProvider as unknown as PublicDataProvider, contractAddress);
  const proofProvider = (typeof api.getProvingProvider === 'function')
    ? createProofProvider(await api.getProvingProvider(zkConfigProvider.asKeyMaterialProvider()) as Parameters<typeof createProofProvider>[0])
    : httpClientProofProvider(networkConfig.proofServer, zkConfigProvider as unknown as Parameters<typeof httpClientProofProvider>[1]);

  const shieldedAddresses = await api.getShieldedAddresses();

  return {
    privateStateProvider: browserPrivateStateProvider,
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider: {
      getCoinPublicKey: () => shieldedAddresses.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => shieldedAddresses.shieldedEncryptionPublicKey,
      balanceTx: async (tx: { serialize: () => Uint8Array }) => {
        const txHex = toHex(tx.serialize());
        const balanced = await api.balanceUnsealedTransaction(txHex);
        return ledger.Transaction.deserialize('signature', 'proof', 'binding', fromHex(balanced.tx));
      }
    },
    midnightProvider: {
      submitTx: async (tx: { serialize: () => Uint8Array; identifiers: () => string[] }) => {
        await api.submitTransaction(toHex(tx.serialize()));
        return tx.identifiers()[0];
      }
    },
  };
}

// ── Main Hook ──
export const useMidnight = () => {
  const [networkName, setNetworkNameState] = useState<NetworkName>(getStoredNetwork);
  const apiRef = useRef<WalletDAppAPI | null>(null);
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    isContractLoading: false,
    contractError: null,
    unshieldedAddress: null,
    shieldedAddress: null,
    walletName: null,
    error: null,
    contract: null,
    balances: null,
  });

  const activeConfig = NETWORK_CONFIGS[networkName];

  const selectNetwork = useCallback((name: NetworkName) => {
    setNetworkNameState(name);
    localStorage.setItem('veilbid_network', name);
    apiRef.current = null;
    setState({
      isConnected: false, isConnecting: false, isContractLoading: false, contractError: null, unshieldedAddress: null,
      shieldedAddress: null, walletName: null, error: null, contract: null, balances: null,
    });
    localStorage.removeItem('veilbid_wallet_connected');
    localStorage.removeItem('veilbid_wallet_id');
  }, []);

  const setupConnection = useCallback(async (api: WalletDAppAPI, walletName: string) => {
    try {
      apiRef.current = api;
      const { unshieldedAddress: uAddr } = await api.getUnshieldedAddress();
      const { shieldedAddress: sAddr } = await api.getShieldedAddresses();

      let unshieldedNight = 0n, shieldedNight = 0n, dust = 0n;
      try {
        const [unshieldedBals, shieldedBals, dustBal] = await Promise.all([
          api.getUnshieldedBalances(),
          api.getShieldedBalances(),
          api.getDustBalance(),
        ]);
        const nightKey = '0000000000000000000000000000000000000000000000000000000000000000';
        unshieldedNight = unshieldedBals[nightKey] ?? 0n;
        shieldedNight = shieldedBals[nightKey] ?? 0n;
        dust = dustBal?.balance ?? 0n;
      } catch (e) {
        console.warn('Balance fetch failed:', e);
      }

      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        isContractLoading: true,
        contractError: null,
        unshieldedAddress: uAddr,
        shieldedAddress: sAddr,
        walletName,
        error: null,
        balances: { unshieldedNight, shieldedNight, dust },
      }));
      localStorage.setItem('veilbid_wallet_connected', 'true');
      localStorage.setItem('veilbid_wallet_id', walletName);

      // Lazy-load contract SDK and bind to deployed contract
      try {
        const [
          { CompiledContract },
          { findDeployedContract },
          { setNetworkId },
          VeilBidContract,
        ] = await Promise.all([
          import('@midnight-ntwrk/compact-js'),
          import('@midnight-ntwrk/midnight-js-contracts'),
          import('@midnight-ntwrk/midnight-js-network-id'),
          import('../../public/managed/contract/index.js'),
        ]);

        setNetworkId(networkName);

        const contractAddress = localStorage.getItem(`veilbid_contract_address_${networkName}`) || activeConfig.contractAddress;
        const providers = await buildProviders(api, activeConfig, contractAddress);

        const compiledContract = CompiledContract.make('auction', VeilBidContract.Contract).pipe(
          CompiledContract.withWitnesses({}),
          CompiledContract.withCompiledFileAssets('/managed')
        );

        let instance: ContractInstance | null = null;
        if (contractAddress) {
          const realInstance = await findDeployedContract(providers as unknown as Parameters<typeof findDeployedContract>[0], {
            compiledContract: compiledContract as unknown as Parameters<typeof findDeployedContract>[1]['compiledContract'],
            contractAddress,
            privateStateId: 'veilbid-state',
            initialPrivateState: { secretKey: new Uint8Array(32), bidAmount: 0n },
          });
          instance = realInstance as unknown as ContractInstance;
        }

        setState(prev => ({ ...prev, contract: instance, isContractLoading: false, contractError: null }));
      } catch (e: unknown) {
        const err = e as Error;
        console.error('Contract binding failed:', err);
        setState(prev => ({ ...prev, contract: null, isContractLoading: false, contractError: err.message || 'Contract binding failed' }));
      }
    } catch (e: unknown) {
      const err = e as Error;
      setState(prev => ({
        ...prev,
        isConnecting: false,
        isContractLoading: false,
        error: err.message || 'Failed to connect wallet',
      }));
    }
  }, [networkName, activeConfig]);

  // Auto-reconnect on page load
  useEffect(() => {
    const tryReconnect = async () => {
      if (localStorage.getItem('veilbid_wallet_connected') !== 'true') return;
      const walletId = localStorage.getItem('veilbid_wallet_id');
      if (!walletId) return;
      const midnightObj = (window as unknown as { midnight?: Record<string, { connect?: (net: string) => Promise<WalletDAppAPI>; enable?: () => Promise<WalletDAppAPI> }> }).midnight;
      const walletEntry = midnightObj?.[walletId];
      if (!walletEntry) return;
      try {
        const api = typeof walletEntry.connect === 'function'
          ? await walletEntry.connect(networkName)
          : await walletEntry.enable!();
        await setupConnection(api, walletId);
      } catch {
        localStorage.removeItem('veilbid_wallet_connected');
        localStorage.removeItem('veilbid_wallet_id');
      }
    };
    const timer = setTimeout(tryReconnect, 800);
    return () => clearTimeout(timer);
  }, [setupConnection, networkName]);

  const connectWallet = useCallback(async (walletId?: string) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    try {
      const midnightObj = (window as unknown as { midnight?: Record<string, { connect?: (net: string) => Promise<WalletDAppAPI>; enable?: () => Promise<WalletDAppAPI> }> }).midnight;
      if (!midnightObj) throw new Error('No Midnight wallet detected. Please install the 1AM wallet extension.');

      const targetId = walletId || '1AM';
      const walletEntry = midnightObj[targetId] || Object.values(midnightObj)[0];

      if (!walletEntry) throw new Error('No compatible Midnight wallet found. Install the 1AM wallet.');

      const api = typeof walletEntry.connect === 'function'
        ? await walletEntry.connect(networkName)
        : await walletEntry.enable!();

      await setupConnection(api, targetId);
    } catch (e: unknown) {
      const err = e as Error;
      setState(prev => ({ ...prev, isConnecting: false, error: err.message || 'Wallet connection failed' }));
      localStorage.removeItem('veilbid_wallet_connected');
    }
  }, [setupConnection, networkName]);

  const disconnectWallet = useCallback(() => {
    apiRef.current = null;
    setState({
      isConnected: false, isConnecting: false, isContractLoading: false, contractError: null, unshieldedAddress: null,
      shieldedAddress: null, walletName: null, error: null, contract: null, balances: null,
    });
    localStorage.removeItem('veilbid_wallet_connected');
    localStorage.removeItem('veilbid_wallet_id');
  }, []);

  const getActiveApi = useCallback(async (): Promise<WalletDAppAPI> => {
    if (apiRef.current) return apiRef.current;
    const walletId = localStorage.getItem('veilbid_wallet_id') || '1AM';
    const midnightObj = (window as unknown as { midnight?: Record<string, { connect?: (net: string) => Promise<WalletDAppAPI>; enable?: () => Promise<WalletDAppAPI> }> }).midnight;
    const walletEntry = midnightObj?.[walletId] || (midnightObj ? Object.values(midnightObj)[0] : undefined);
    if (!walletEntry) {
      throw new Error('1AM wallet is not connected or extension is not detected. Please install/connect your 1AM wallet.');
    }
    const api = typeof walletEntry.connect === 'function'
      ? await walletEntry.connect(networkName)
      : await walletEntry.enable!();
    apiRef.current = api;
    return api;
  }, [networkName]);

  const getContractInstance = useCallback(async (targetAddress: string): Promise<ContractInstance> => {
    const api = await getActiveApi();
    const [
      { CompiledContract },
      { findDeployedContract },
      { setNetworkId },
      VeilBidContract,
    ] = await Promise.all([
      import('@midnight-ntwrk/compact-js'),
      import('@midnight-ntwrk/midnight-js-contracts'),
      import('@midnight-ntwrk/midnight-js-network-id'),
      import('../../public/managed/contract/index.js'),
    ]);

    setNetworkId(networkName);
    const providers = await buildProviders(api, activeConfig, targetAddress);

    const compiledContract = CompiledContract.make('auction', VeilBidContract.Contract).pipe(
      CompiledContract.withWitnesses({}),
      CompiledContract.withCompiledFileAssets('/managed')
    );

    const instance = await findDeployedContract(providers as unknown as Parameters<typeof findDeployedContract>[0], {
      compiledContract: compiledContract as unknown as Parameters<typeof findDeployedContract>[1]['compiledContract'],
      contractAddress: targetAddress,
      privateStateId: `veilbid-state-${targetAddress}`,
      initialPrivateState: { secretKey: new Uint8Array(32), bidAmount: 0n },
    });

    return instance as unknown as ContractInstance;
  }, [getActiveApi, networkName, activeConfig]);

  const submitBidToNetwork = useCallback(async (contractAddress: string, commitmentBytes: Uint8Array): Promise<{ txHash: string; blockHeight?: number }> => {
    console.log(`[VeilBid Network] Submitting sealed bid to ${contractAddress} on Midnight ${networkName}...`);
    const instance = await getContractInstance(contractAddress);
    if (!instance?.callTx?.submitBid) {
      throw new Error(`Contract at ${contractAddress} does not implement submitBid or is not found on Midnight ${networkName}.`);
    }
    const result = await instance.callTx.submitBid(commitmentBytes);
    console.log('[VeilBid Network] submitBid result:', result);
    const txHash = (result as { public?: { txHash?: string; txId?: string; blockHeight?: number }; txHash?: string })?.public?.txHash
      || (result as { public?: { txHash?: string; txId?: string; blockHeight?: number }; txHash?: string })?.txHash
      || (result as { public?: { txHash?: string; txId?: string; blockHeight?: number }; txHash?: string })?.public?.txId;
    if (!txHash) {
      throw new Error('Transaction was submitted to Midnight, but no transaction hash was returned by the network.');
    }
    return {
      txHash,
      blockHeight: (result as { public?: { blockHeight?: number } })?.public?.blockHeight,
    };
  }, [getContractInstance, networkName]);

  const revealBidToNetwork = useCallback(async (
    contractAddress: string,
    secretKeyBytes: Uint8Array,
    saltBytes: Uint8Array,
    amountBigInt: bigint
  ): Promise<{ txHash: string; blockHeight?: number }> => {
    console.log(`[VeilBid Network] Submitting reveal transaction to ${contractAddress} on Midnight ${networkName}...`);
    const instance = await getContractInstance(contractAddress);
    if (!instance?.callTx?.revealBid) {
      throw new Error(`Contract at ${contractAddress} does not implement revealBid or is not found on Midnight ${networkName}.`);
    }
    const result = await instance.callTx.revealBid(secretKeyBytes, saltBytes, amountBigInt);
    console.log('[VeilBid Network] revealBid result:', result);
    const txHash = (result as { public?: { txHash?: string; txId?: string; blockHeight?: number }; txHash?: string })?.public?.txHash
      || (result as { public?: { txHash?: string; txId?: string; blockHeight?: number }; txHash?: string })?.txHash
      || (result as { public?: { txHash?: string; txId?: string; blockHeight?: number }; txHash?: string })?.public?.txId;
    if (!txHash) {
      throw new Error('Transaction was submitted to Midnight, but no transaction hash was returned by the network.');
    }
    return {
      txHash,
      blockHeight: (result as { public?: { blockHeight?: number } })?.public?.blockHeight,
    };
  }, [getContractInstance, networkName]);

  const closeAuctionOnNetwork = useCallback(async (
    contractAddress: string,
    sellerSkBytes: Uint8Array
  ): Promise<{ txHash: string; blockHeight?: number }> => {
    console.log(`[VeilBid Network] Finalizing auction on ${contractAddress} on Midnight ${networkName}...`);
    const instance = await getContractInstance(contractAddress);
    if (!instance?.callTx?.closeAuction) {
      throw new Error(`Contract at ${contractAddress} does not implement closeAuction or is not found on Midnight ${networkName}.`);
    }
    const result = await instance.callTx.closeAuction(sellerSkBytes);
    console.log('[VeilBid Network] closeAuction result:', result);
    const txHash = (result as { public?: { txHash?: string; txId?: string; blockHeight?: number }; txHash?: string })?.public?.txHash
      || (result as { public?: { txHash?: string; txId?: string; blockHeight?: number }; txHash?: string })?.txHash
      || (result as { public?: { txHash?: string; txId?: string; blockHeight?: number }; txHash?: string })?.public?.txId;
    if (!txHash) {
      throw new Error('Transaction was submitted to Midnight, but no transaction hash was returned by the network.');
    }
    return {
      txHash,
      blockHeight: (result as { public?: { blockHeight?: number } })?.public?.blockHeight,
    };
  }, [getContractInstance, networkName]);

  const deployVeilBid = useCallback(async (nftTokenId: string, reservePrice: bigint, royaltyBps: number) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    try {
      const api = await getActiveApi();

      const [
        { CompiledContract },
        { deployContract },
        { setNetworkId },
        VeilBidContract,
      ] = await Promise.all([
        import('@midnight-ntwrk/compact-js'),
        import('@midnight-ntwrk/midnight-js-contracts'),
        import('@midnight-ntwrk/midnight-js-network-id'),
        import('../../public/managed/contract/index.js'),
      ]);

      setNetworkId(networkName);
      const providers = await buildProviders(api, activeConfig);

      const compiledContract = CompiledContract.make('auction', VeilBidContract.Contract).pipe(
        CompiledContract.withWitnesses({}),
        CompiledContract.withCompiledFileAssets('/managed')
      );

      // 32-byte NFT token identifier
      const nftIdBytes = new Uint8Array(32);
      const encoded = new TextEncoder().encode(nftTokenId.substring(0, 32));
      nftIdBytes.set(encoded);

      // Creator and seller keys derived from random or wallet entropy
      const creatorKey = new Uint8Array(32);
      const sellerKey = new Uint8Array(32);
      crypto.getRandomValues(creatorKey);
      crypto.getRandomValues(sellerKey);

      console.log('[VeilBid Deploy] Starting deployment on', networkName, '...');

      // Deploy with full constructor arguments: id, minPrice, royaltyBasisPoints, creator, seller
      const deployed = await deployContract(providers as unknown as Parameters<typeof deployContract>[0], {
        compiledContract: compiledContract as unknown as Parameters<typeof deployContract>[1]['compiledContract'],
        privateStateId: 'veilbid-state',
        initialPrivateState: { secretKey: new Uint8Array(32), bidAmount: 0n },
        args: [nftIdBytes, reservePrice, BigInt(royaltyBps), creatorKey, sellerKey],
      });

      const contractAddress = deployed.deployTxData.public.contractAddress;
      const txHash = deployed.deployTxData.public.txHash;

      localStorage.setItem(`veilbid_contract_address_${networkName}`, contractAddress);

      setState(prev => ({ ...prev, contract: deployed as unknown as ContractInstance, isConnecting: false, error: null }));
      return { contractAddress, txHash };
    } catch (e: unknown) {
      const err = e as Error;
      setState(prev => ({ ...prev, isConnecting: false, error: err.message || 'Deployment failed' }));
      throw err;
    }
  }, [getActiveApi, networkName, activeConfig]);

  return {
    ...state,
    networkName,
    networkConfig: activeConfig,
    selectNetwork,
    connectWallet,
    disconnectWallet,
    deployVeilBid,
    submitBidToNetwork,
    revealBidToNetwork,
    closeAuctionOnNetwork,
  };
};

