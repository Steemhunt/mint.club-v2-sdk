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

export class ClientHelper {
  private static instance?: ClientHelper;
  private walletClient?: WalletClient;
  // these are always defined, singleton
  private publicClients: Record<number, PublicClient<FallbackTransport> | PublicClient> = {};
  private chainId?: SdkSupportedChainIds; // last chain id used

  constructor(chainId?: SdkSupportedChainIds) {
    if (ClientHelper.instance) {
      return ClientHelper.instance;
    }

    ClientHelper.instance = this;
  }

  public async connect() {
    if (this.walletClient?.account) return this.walletClient.account.address;

    if (this.walletClient) {
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        transport: custom(this.walletClient.transport),
      });
      return address;
    } else {
      if (window.ethereum === undefined) throw new NoEthereumProviderError();
      this.walletClient = createWalletClient({
        transport: custom(window.ethereum),
      });
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        transport: custom(window.ethereum),
      });
      return address;
    }
  }

  public async disconnect() {
    this.walletClient = undefined;
  }

  public async account() {
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

  public getPublicClient(id?: number): PublicClient {
    if (id === undefined) return this.publicClients[this.chainId as number];

    if (this.publicClients[id] !== undefined) return this.publicClients[id];

    const chain: Chain | undefined = Object.values(chains).find((chain) => chain.id === id);

    if (!chain) throw new ChainNotSupportedError(id);

    this.publicClients[id] = createPublicClient({
      chain,
      transport: fallback(chainRPCFallbacks(chain), DEFAULT_RANK_OPTIONS),
    }) as PublicClient<FallbackTransport>;

    // (this.publicClients[id] as PublicClient<FallbackTransport>).transport.onResponse((response) => {
    //   const error = response.error;
    //   const errorName = error?.name;
    //   const isErrorResponse = response.status === 'error';
    //   const name = response.transport.config.name;

    //   if (isErrorResponse) {
    //     console.error(`[RPC FAILED ${errorName}] - ${name}\n${error?.stack}`);
    //   }

    //   if (!response.response && response.status === 'success') {
    //     throw new Error('Empty RPC Response');
    //   }
    // });

    return this.publicClients[id];
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

    this.walletClient = createWalletClient({
      transport: custom(provider),
    });

    return this;
  }
}
