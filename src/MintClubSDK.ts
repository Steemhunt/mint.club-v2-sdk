import { PublicClient, WalletClient } from 'viem';
import { InvalidClientError } from './errors/sdk.errors';
import { LowerCaseChainNames, SdkSupportedChainIds, chainIdToString, chainStringToId } from './exports';
import { Bond } from './helpers/BondHelper';
import { Client } from './helpers/ClientHelper';
import { ERC1155 } from './helpers/ERC1155Helper';
import { ERC20 } from './helpers/ERC20Helper';
import { Ipfs } from './helpers/IpfsHelper';
import { Airdrop } from './helpers/AirdropHelper';
import { Lockup } from './helpers/LockupHelper';
import { Stake } from './helpers/StakeHelper';
import { Utils } from './helpers/UtilsHelper';

type NetworkReturnType = Omit<
  Client,
  | '_getPublicClient'
  | '_getWalletClientForChain'
  | 'withPrivateKey'
  | 'withPublicClient'
  | 'withWalletClient'
  | 'withAccount'
  | 'withProvider'
> & {
  getPublicClient: () => PublicClient;
  withPrivateKey: (privateKey: `0x${string}`) => NetworkReturnType;
  withPublicClient: (...args: Parameters<Client['withPublicClient']>) => NetworkReturnType;
  withWalletClient: (...args: Parameters<Client['withWalletClient']>) => NetworkReturnType;
  withAccount: (...args: Parameters<Client['withAccount']>) => NetworkReturnType;
  withProvider: (...args: Parameters<Client['withProvider']>) => Promise<NetworkReturnType>;
  token: (symbolOrAddress: string) => ERC20;
  nft: (symbolOrAddress: string) => ERC1155;
  airdrop: Airdrop;
  lockup: Lockup;
  bond: Bond;
  stake: Stake;
};

export class MintClubSDK {
  // chain agnostic
  constructor(public wallet: Client = new Client()) {
    this.utils = new Utils(wallet);
  }
  public ipfs = new Ipfs();
  public utils: Utils;

  public network(id: SdkSupportedChainIds | LowerCaseChainNames): NetworkReturnType {
    let chainId: SdkSupportedChainIds;

    if (typeof id === 'string') {
      chainId = chainStringToId(id);
    } else {
      chainIdToString(id);
      chainId = id;
    }

    return this.withClientHelper(this.wallet, chainId);
  }

  private withClientHelper(clientHelper: Client, chainId: SdkSupportedChainIds) {
    let networkClient: NetworkReturnType;

    networkClient = {
      isPrivateKey: clientHelper.isPrivateKey.bind(clientHelper),
      connect: clientHelper.connect.bind(clientHelper),
      change: clientHelper.change.bind(clientHelper),
      disconnect: clientHelper.disconnect.bind(clientHelper),
      account: clientHelper.account.bind(clientHelper),
      getNativeBalance: clientHelper.getNativeBalance.bind(clientHelper),
      getWalletClient: clientHelper.getWalletClient.bind(clientHelper),
      withPublicClient(...args) {
        clientHelper.withPublicClient(...args);
        return networkClient;
      },
      withWalletClient(...args) {
        clientHelper.withWalletClient(...args);
        return networkClient;
      },
      withAccount(...args) {
        clientHelper.withAccount(...args);
        return networkClient;
      },
      async withProvider(...args) {
        await clientHelper.withProvider(...args);
        return networkClient;
      },
      getPublicClient(): PublicClient {
        return clientHelper._getPublicClient(chainId);
      },

      withPrivateKey(privateKey: `0x${string}`) {
        Client.prototype.withPrivateKey.call(clientHelper, privateKey, chainId);
        return networkClient;
      },

      token: (symbolOrAddress: string) => {
        return new ERC20(
          {
            symbolOrAddress,
            chainId,
          },
          clientHelper,
        );
      },

      nft: (symbolOrAddress: string) => {
        return new ERC1155(
          {
            symbolOrAddress,
            chainId,
          },
          clientHelper,
        );
      },

      airdrop: new Airdrop(chainId, clientHelper),
      lockup: new Lockup(chainId, clientHelper),
      bond: new Bond(chainId, clientHelper),
      stake: new Stake(chainId, clientHelper),
    };

    return networkClient;
  }

  public withPublicClient(publicClient: PublicClient): MintClubSDK {
    const chainId = publicClient.chain?.id;
    if (chainId === undefined) throw new InvalidClientError();
    this.wallet.withPublicClient(publicClient);
    return this;
  }

  public withWalletClient(walletClient: WalletClient): MintClubSDK {
    const chainId = walletClient.chain?.id;
    if (chainId === undefined) throw new InvalidClientError();
    this.wallet.withWalletClient(walletClient);
    return this;
  }
}
