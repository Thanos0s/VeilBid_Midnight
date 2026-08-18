import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
}

import { useState, useCallback, useEffect } from 'react';

// ── Network Configurations (Preprod + Preview) ──
type NetworkName = 'preprod' | 'preview';

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
    // Live VeilBid contract deployed on Preprod via 1AM wallet (2026-08-18)
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

// ── Types ──
export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  unshieldedAddress: string | null;
  shieldedAddress: string | null;
  walletName: string | null;
  error: string | null;
  contract: any | null;
  balances: {
    unshieldedNight: bigint;
    shieldedNight: bigint;
    dust: bigint;
  } | null;
}

// ── Browser-native ZkConfigProvider ──
class BrowserZkConfigProvider {
  async getZKIR(circuitId: string): Promise<any> {
    const res = await fetch(`/managed/zkir/${circuitId}.bzkir`);
    if (!res.ok) throw new Error(`Failed to fetch ZKIR for ${circuitId}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getProverKey(circuitId: string): Promise<any> {
    const res = await fetch(`/managed/keys/${circuitId}.prover`);
    if (!res.ok) throw new Error(`Failed to fetch prover key for ${circuitId}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getVerifierKey(circuitId: string): Promise<any> {
    const res = await fetch(`/managed/keys/${circuitId}.verifier`);
    if (!res.ok) throw new Error(`Failed to fetch verifier key for ${circuitId}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getVerifierKeys(circuitIds: string[]): Promise<[string, any][]> {
    return Promise.all(circuitIds.map(async (id): Promise<[string, any]> => [id, await this.getVerifierKey(id)]));
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
  setContractAddress: function(address: any) {
    this.contractAddress = address;
  },
  get: async function(key: string) {
    const val = localStorage.getItem(`veilbid_state_${this.contractAddress || 'default'}_${key}`);
    if (!val) return null;
    return JSON.parse(val, (k, v) => {
      if (v && typeof v === 'object' && v.type === 'BigInt') return BigInt(v.value);
      if (k === 'bidAmount' && (typeof v === 'string' || typeof v === 'number')) return BigInt(v);
      return v;
    });
  },
  set: async function(key: string, val: any) {
    const serialized = JSON.stringify(val, (_k, v) => {
      if (typeof v === 'bigint') return { type: 'BigInt', value: v.toString() };
      return v;
    });
    localStorage.setItem(`veilbid_state_${this.contractAddress || 'default'}_${key}`, serialized);
  },
  remove: async function(key: string) {
    localStorage.removeItem(`veilbid_state_${this.contractAddress || 'default'}_${key}`);
  },
  clear: async function() {
    const prefix = `veilbid_state_${this.contractAddress || 'default'}_`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) keysToRemove.push(key);
    }
    for (const key of keysToRemove) localStorage.removeItem(key);
  },
  setSigningKey: async function(address: any, signingKey: any) {
    localStorage.setItem(`veilbid_signing_key_${address}`, signingKey);
  },
  getSigningKey: async function(address: any) {
    return localStorage.getItem(`veilbid_signing_key_${address}`);
  },
  removeSigningKey: async function(address: any) {
    localStorage.removeItem(`veilbid_signing_key_${address}`);
  },
};

// ── Build contract providers from wallet API ──
async function buildProviders(api: any, networkConfig: typeof NETWORK_CONFIGS['preprod']) {
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

  const zkConfigProvider = new BrowserZkConfigProvider();
  const publicDataProvider = indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS);
  const proofProvider = (typeof api.getProvingProvider === 'function')
    ? createProofProvider(await api.getProvingProvider(zkConfigProvider.asKeyMaterialProvider()))
    : httpClientProofProvider(networkConfig.proofServer, zkConfigProvider);

  const shieldedAddresses = await api.getShieldedAddresses();

  return {
    privateStateProvider: browserPrivateStateProvider,
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider: {
      getCoinPublicKey: () => shieldedAddresses.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => shieldedAddresses.shieldedEncryptionPublicKey,
      balanceTx: async (tx: any) => {
        const txHex = toHex(tx.serialize());
        const balanced = await api.balanceUnsealedTransaction(txHex);
        return ledger.Transaction.deserialize('signature', 'proof', 'binding', fromHex(balanced.tx));
      }
    },
    midnightProvider: {
      submitTx: async (tx: any) => {
        await api.submitTransaction(toHex(tx.serialize()));
        return tx.identifiers()[0];
      }
    },
  };
}

// ── Main Hook ──
export const useMidnight = () => {
  const [networkName, setNetworkNameState] = useState<NetworkName>(getStoredNetwork);
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
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
    setState({
      isConnected: false, isConnecting: false, unshieldedAddress: null,
      shieldedAddress: null, walletName: null, error: null, contract: null, balances: null,
    });
    localStorage.removeItem('veilbid_wallet_connected');
    localStorage.removeItem('veilbid_wallet_id');
  }, []);

  const setupConnection = useCallback(async (api: any, walletName: string) => {
    try {
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

        // ✅ Set network to preprod/preview dynamically
        setNetworkId(networkName);

        const providers = await buildProviders(api, activeConfig);

        // ✅ Contract name matches auction.compact compiled output
        const compiledContract = CompiledContract.make('auction', VeilBidContract.Contract as any).pipe(
          (CompiledContract.withWitnesses as any)({
            myBidAmount: (context: any) => [context.privateState, context.privateState.bidAmount],
          }),
          (CompiledContract.withCompiledFileAssets as any)('/managed')
        );

        // ✅ Use per-network stored address, fall back to hardcoded default
        const contractAddress = localStorage.getItem(`veilbid_contract_address_${networkName}`) || activeConfig.contractAddress;
        let instance: any = null;
        if (contractAddress) {
          const realInstance = await findDeployedContract(providers as any, {
            compiledContract: compiledContract as any,
            contractAddress,
            privateStateId: 'veilbid-state',
            initialPrivateState: { secretKey: new Uint8Array(32), bidAmount: 0n },
          });
          (realInstance as any).providers = providers;
          instance = realInstance;
        }

        setState(prev => ({ ...prev, contract: instance }));
      } catch (e: any) {
        console.error('Contract binding failed:', e.message);
      }
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: e.message || 'Failed to connect wallet',
      }));
    }
  }, [networkName, activeConfig]);

  // Auto-reconnect on page load
  useEffect(() => {
    const tryReconnect = async () => {
      if (localStorage.getItem('veilbid_wallet_connected') !== 'true') return;
      const walletId = localStorage.getItem('veilbid_wallet_id');
      if (!walletId) return;
      const walletEntry = (window as any).midnight?.[walletId];
      if (!walletEntry) return;
      try {
        // ✅ Connect to the currently selected network (preprod or preview)
        const api = typeof walletEntry.connect === 'function'
          ? await walletEntry.connect(networkName)
          : await walletEntry.enable();
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
      const midnightObj = (window as any).midnight;
      if (!midnightObj) throw new Error('No Midnight wallet detected. Please install the 1AM wallet extension.');

      const targetId = walletId || '1AM';
      const walletEntry = midnightObj[targetId] || Object.values(midnightObj).find(
        (w: any) => typeof w?.connect === 'function' || typeof w?.enable === 'function'
      ) as any;

      if (!walletEntry) throw new Error('No compatible Midnight wallet found. Install the 1AM wallet.');

      // ✅ Connect to the selected network (preprod or preview)
      const api = typeof walletEntry.connect === 'function'
        ? await walletEntry.connect(networkName)
        : await walletEntry.enable();

      await setupConnection(api, targetId);
    } catch (e: any) {
      setState(prev => ({ ...prev, isConnecting: false, error: e.message || 'Wallet connection failed' }));
      localStorage.removeItem('veilbid_wallet_connected');
    }
  }, [setupConnection, networkName]);

  const disconnectWallet = useCallback(() => {
    setState({
      isConnected: false, isConnecting: false, unshieldedAddress: null,
      shieldedAddress: null, walletName: null, error: null, contract: null, balances: null,
    });
    localStorage.removeItem('veilbid_wallet_connected');
    localStorage.removeItem('veilbid_wallet_id');
  }, []);

  const deployVeilBid = useCallback(async (nftTokenId: string, royaltyBps: number) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    try {
      const walletId = localStorage.getItem('veilbid_wallet_id') || '1AM';
      const walletEntry = (window as any).midnight?.[walletId];
      if (!walletEntry) throw new Error('Wallet not connected');

      // ✅ Connect to selected network
      const api = typeof walletEntry.connect === 'function'
        ? await walletEntry.connect(networkName)
        : await walletEntry.enable();

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

      // ✅ Use dynamic network ID
      setNetworkId(networkName);
      const providers = await buildProviders(api, activeConfig);

      // ✅ Contract name matches auction.compact
      const compiledContract = CompiledContract.make('auction', VeilBidContract.Contract as any).pipe(
        (CompiledContract.withWitnesses as any)({
          myBidAmount: (context: any) => [context.privateState, context.privateState.bidAmount],
        }),
        (CompiledContract.withCompiledFileAssets as any)('/managed')
      );

      // Encode NFT token ID as 32 bytes
      const nftIdBytes = new Uint8Array(32);
      const encoded = new TextEncoder().encode(nftTokenId.substring(0, 32));
      nftIdBytes.set(encoded);

      // Random creator key (wallet-derived in full impl)
      const creatorKey = new Uint8Array(32);
      crypto.getRandomValues(creatorKey);

      console.log('[VeilBid Deploy] Starting deployment on', networkName, '...');

      const deployed = await deployContract(providers as any, {
        compiledContract: compiledContract as any,
        privateStateId: 'veilbid-state',
        initialPrivateState: { secretKey: new Uint8Array(32), bidAmount: 0n },
        args: [nftIdBytes],  // auction.compact constructor takes 1 arg: Bytes<32> id
      });

      const contractAddress = deployed.deployTxData.public.contractAddress;
      const txHash = deployed.deployTxData.public.txHash;

      console.log('🎉 [VeilBid Deploy] CONTRACT DEPLOYED!');
      console.log('📋 Contract Address:', contractAddress);
      console.log('🔗 TX Hash:', txHash);
      console.log('🌐 Network:', networkName);

      // ✅ Store per-network contract address
      localStorage.setItem(`veilbid_contract_address_${networkName}`, contractAddress);

      const instance = deployed;
      (instance as any).providers = providers;

      setState(prev => ({ ...prev, contract: instance, isConnecting: false, error: null }));
      return { contractAddress, txHash };
    } catch (e: any) {
      setState(prev => ({ ...prev, isConnecting: false, error: e.message || 'Deployment failed' }));
      throw e;
    }
  }, [networkName, activeConfig]);

  return {
    ...state,
    networkName,
    networkConfig: activeConfig,
    selectNetwork,
    connectWallet,
    disconnectWallet,
    deployVeilBid,
  };
};
