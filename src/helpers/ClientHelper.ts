import {
  Chain,
  createPublicClient,
  createWalletClient,
  custom,
  EIP1193Provider,
  fallback,
  FallbackTransport,
  PrivateKeyAccount,
  PublicClient,
  WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as chains from 'viem/chains';
import { ChainNotSupportedError, NoEthereumProviderError, WalletNotConnectedError } from '../errors/sdk.errors';
import { chainIdToViemChain, chainRPCFallbacks, DEFAULT_RANK_OPTIONS, SdkSupportedChainIds } from '../exports';

const MCV2_WALLET_STATE_LOCALSTORAGE = 'mcv2_wallet_state';
type WalletState = 'connected' | 'disconnected' | 'none';

export class Client {
  private static instance?: Client;
  private walletClient?: WalletClient;
  // these are always defined, singleton
  private publicClients: Record<number, PublicClient<FallbackTransport> | PublicClient> = {};

  constructor() {
    if (Client.instance) {
      return Client.instance;
    }

    Client.instance = this;
  }

  private getDefaultProvider() {
    // const noopProvider = { request: () => null } as unknown as EIP1193Provider;
    // const provider = typeof window !== 'undefined' ? window.ethereum! : noopProvider;
    if (typeof window.ethereum === 'undefined') throw new NoEthereumProviderError();

    return window?.ethereum;
  }

  public isPrivateKey() {
    return (this.walletClient?.account as PrivateKeyAccount)?.source === 'privateKey';
  }

  public async connect(provider?: any) {
    let addressToReturn: `0x${string}` | null = null;

    if (this.walletClient?.account || this.isPrivateKey()) {
      if (this.walletClient?.account?.address) {
        addressToReturn = this.walletClient?.account?.address!;
      }
    }

    if (this.walletClient) {
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        transport: custom(provider ?? this.walletClient.transport),
      });
      addressToReturn = address;
    } else {
      this.walletClient = createWalletClient({
        transport: custom(provider ?? this.getDefaultProvider()),
      });
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        transport: custom(provider ?? this.getDefaultProvider()),
      });
      addressToReturn = address;
    }

    if (addressToReturn) this.walletState = 'connected';

    return addressToReturn;
  }

  private get walletState() {
    if (typeof window === 'undefined') {
      return 'none' as WalletState;
    }

    return (window?.localStorage?.getItem?.(MCV2_WALLET_STATE_LOCALSTORAGE) ?? 'none') as WalletState;
  }

  private set walletState(newState: WalletState) {
    window?.localStorage?.setItem?.(MCV2_WALLET_STATE_LOCALSTORAGE, newState);
  }

  public async change() {
    await this.walletClient?.request({
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
  }

  public disconnect() {
    this.walletClient = undefined;
    this.walletState = 'disconnected';
  }

  public async account() {
    if (this.walletState === 'disconnected') return null;

    if (!this.walletClient && window?.ethereum !== undefined) {
      this.walletClient = createWalletClient({
        transport: custom(window.ethereum),
      });
    }

    const accounts = await this.walletClient?.getAddresses();
    return accounts?.[0] || null;
  }

  public async getNativeBalance(params?: { walletAddress: `0x${string}`; chainId: number }) {
    const { walletAddress, chainId } = params || {};
    if (chainId !== undefined && walletAddress)
      return this._getPublicClient(chainId).getBalance({ address: walletAddress });

    await this.connect();
    const address = await this.account();
    const connectedChain = this.walletClient?.chain?.id;

    if (!address || connectedChain === undefined) throw new WalletNotConnectedError();

    return this._getPublicClient(connectedChain).getBalance({
      address,
    });
  }

  public _getPublicClient(id: number): PublicClient {
    if (this.publicClients[id] !== undefined) return this.publicClients[id];

    const chain: Chain | undefined =
      Object.values(chains).find((chain) => chain.id === id) ?? chainIdToViemChain(id as SdkSupportedChainIds);

    if (!chain) throw new ChainNotSupportedError(id);

    this.publicClients[chain.id] = createPublicClient({
      chain,
      transport: fallback(chainRPCFallbacks(chain), DEFAULT_RANK_OPTIONS),
    }) as PublicClient<FallbackTransport>;

    (this.publicClients[chain.id] as PublicClient<FallbackTransport>).transport.onResponse((response) => {
      if (!response.response && response.status === 'success') {
        throw new Error('Empty RPC Response');
      }
    });

    return this.publicClients[chain.id];
  }

  public getWalletClient() {
    return this.walletClient;
  }

  public withPublicClient(publicClient: PublicClient) {
    if (publicClient.chain?.id === undefined) throw new ChainNotSupportedError(publicClient.chain);
    this.publicClients[publicClient.chain.id] = publicClient;
    return this;
  }

  public withWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
    return this;
  }

  public withPrivateKey(privateKey: `0x${string}`) {
    const account = privateKeyToAccount(privateKey);
    this.walletClient = createWalletClient({
      transport: fallback(chainRPCFallbacks(chains.mainnet), DEFAULT_RANK_OPTIONS),
      account,
    });
    return this;
  }

  public withAccount(account: `0x${string}`, provider?: any) {
    const providerToUse = provider || this.getDefaultProvider();
    this.walletClient = createWalletClient({
      account,
      transport: custom(providerToUse),
    });
    return this;
  }

  public async withProvider(provider: any) {
    this.walletClient = createWalletClient({
      transport: custom(provider),
    });

    return this;
  }
}
