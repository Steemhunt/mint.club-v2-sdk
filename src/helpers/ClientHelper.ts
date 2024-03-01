import {
  createPublicClient,
  createWalletClient,
  custom,
  fallback,
  FallbackTransport,
  http,
  PublicClient,
  PublicClientConfig,
  WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as chains from 'viem/chains';
import { ContractChainType, DEFAULT_RANK_OPTIONS, chainRPCFallbacks } from '../exports';

declare global {
  interface Window {
    ethereum: any;
  }
}

type SingletonKey = `${ContractChainType}-${string}`;

export class ClientHelper {
  private static instances: Partial<Record<SingletonKey, ClientHelper>> = {};
  private chain: chains.Chain;
  private walletClient?: WalletClient;
  private publicClient: PublicClient<FallbackTransport> | PublicClient;

  constructor(chainId: ContractChainType, singletonKey = 'ClientHelper') {
    const chain = Object.values(chains).find((chain) => chain.id === chainId);
    if (!chain) throw new Error('Chain not found');

    this.chain = chain;
    this.publicClient = createPublicClient({
      chain,
      transport: fallback(chainRPCFallbacks(chain), DEFAULT_RANK_OPTIONS),
    }) as PublicClient<FallbackTransport>;

    const key: SingletonKey = `${chainId}-${singletonKey}`;

    if (ClientHelper.instances[key]) {
      return ClientHelper.instances[key]!;
    }

    (this.publicClient as PublicClient<FallbackTransport>).transport.onResponse((response) => {
      const error = response.error;
      const errorName = error?.name;
      const isErrorResponse = response.status === 'error';
      const name = response.transport.config.name;

      if (isErrorResponse) {
        console.error(`[RPC FAILED ${errorName}] - ${name}\n${error?.stack}`);
      }

      if (!response.response && response.status === 'success') {
        throw new Error('Empty RPC Response');
      }
    });

    ClientHelper.instances[key] = this;
  }

  protected async initializeWallet() {
    if (this.walletClient) {
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        chain: this.chain,
        transport: custom(this.walletClient.transport),
      });
      return;
    } else if (!window.ethereum) {
      throw new Error('No Ethereum provider found');
    } else {
      this.walletClient = createWalletClient({
        chain: this.chain,
        transport: custom(window.ethereum),
      });

      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        chain: this.chain,
        transport: custom(window.ethereum),
      });
    }
  }

  public async getConnectedAddress() {
    const [address] = (await this.walletClient?.requestAddresses()) || [];
    if (!address) throw new Error('No wallet found');
    return address;
  }

  public getWalletClient() {
    return this.walletClient;
  }

  public getPublicClient() {
    return this.publicClient;
  }

  public withConfig(options: PublicClientConfig) {
    this.publicClient = createPublicClient(options);
  }

  public withPrivateKey(privateKey: `0x${string}`) {
    const account = privateKeyToAccount(privateKey);
    this.walletClient = createWalletClient({
      account,
      chain: this.chain,
      transport: http(),
    });
    return this;
  }

  public withAccount(account: `0x${string}`) {
    this.walletClient = createWalletClient({
      account,
      chain: this.chain,
      transport: custom(window.ethereum),
    });
    return this;
  }

  public async withProvider(provider: any) {
    this.walletClient = createWalletClient({
      chain: this.chain,
      transport: custom(provider),
    });

    const [address] = await this.walletClient?.requestAddresses();
    this.walletClient = createWalletClient({
      account: address,
      chain: this.chain,
      transport: custom(provider),
    });

    return this;
  }
}
