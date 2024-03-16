import {
  Chain,
  createPublicClient,
  createWalletClient,
  custom,
  fallback,
  FallbackTransport,
  http,
  PublicClient,
  WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as chains from 'viem/chains';
import { ChainNotSupportedError, NoEthereumProviderError, WalletNotConnectedError } from '../errors/sdk.errors';
import { chainRPCFallbacks, DEFAULT_RANK_OPTIONS, SdkSupportedChainIds } from '../exports';

const MCV2_WALLET_STATE_LOCALSTORAGE = 'mcv2_wallet_state';
type WalletState = 'connected' | 'disconnected' | 'none';

export class ClientHelper {
  private static instance?: ClientHelper;
  private walletClient?: WalletClient;
  // these are always defined, singleton
  private publicClients: Record<number, PublicClient<FallbackTransport> | PublicClient> = {};
  private chainId?: SdkSupportedChainIds; // last chain id used

  constructor() {
    if (ClientHelper.instance) {
      return ClientHelper.instance;
    }

    ClientHelper.instance = this;
  }

  public async connect(provider?: any) {
    let addressToReturn: `0x${string}` | null = null;
    if (this.walletClient?.account) addressToReturn = this.walletClient.account.address;

    if (this.walletClient) {
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        transport: custom(provider ?? this.walletClient.transport),
      });
      addressToReturn = address;
    } else {
      if (window.ethereum === undefined) throw new NoEthereumProviderError();
      this.walletClient = createWalletClient({
        transport: custom(provider ?? window.ethereum),
      });
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        transport: custom(provider ?? window.ethereum),
      });
      addressToReturn = address;
    }

    if (addressToReturn) this.walletState = 'connected';

    return addressToReturn;
  }

  private get walletState() {
    return (window?.localStorage?.getItem(MCV2_WALLET_STATE_LOCALSTORAGE) ?? 'none') as WalletState;
  }

  private set walletState(newState: WalletState) {
    window?.localStorage?.setItem(MCV2_WALLET_STATE_LOCALSTORAGE, newState);
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
      return this.getPublicClient(chainId).getBalance({ address: walletAddress });

    await this.connect();
    const address = await this.account();
    const connectedChain = this.walletClient?.chain?.id;

    if (!address || connectedChain === undefined) throw new WalletNotConnectedError();

    return this.getPublicClient(connectedChain).getBalance({
      address,
    });
  }

  public getPublicClient(_id?: number): PublicClient {
    const id: number | undefined = _id ?? this.chainId;

    if (id !== undefined && this.publicClients[id] !== undefined) return this.publicClients[id];

    const chain: Chain | undefined = Object.values(chains).find((chain) => chain.id === id);

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
      account,
      transport: http(),
    });
    return this;
  }

  public withAccount(account: `0x${string}`, provider?: any) {
    const providerToUse = provider || window.ethereum;
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
