import { PublicClient, WalletClient } from 'viem';
import { InvalidClientError } from './errors/sdk.errors';
import { LowerCaseChainNames, SdkSupportedChainIds, chainStringToId } from './exports';
import { Bond } from './helpers/BondHelper';
import { Client } from './helpers/ClientHelper';
import { ERC1155 } from './helpers/ERC1155Helper';
import { ERC20 } from './helpers/ERC20Helper';
import { Ipfs } from './helpers/IpfsHelper';
import { Airdrop } from './helpers/AirdropHelper';
import { Lockup } from './helpers/LockupHelper';
import { Utils } from './helpers/UtilsHelper';

type NetworkReturnType = Omit<Client, '_getPublicClient'> & {
  getPublicClient: () => PublicClient;
  token: (symbolOrAddress: string) => ERC20;
  nft: (symbolOrAddress: string) => ERC1155;
  airdrop: Airdrop;
  lockup: Lockup;
  bond: Bond;
};

export class MintClubSDK {
  // chain agnostic
  public wallet = new Client();
  public ipfs = new Ipfs();
  public utils = new Utils();

  public network(id: SdkSupportedChainIds | LowerCaseChainNames): NetworkReturnType {
    let chainId: SdkSupportedChainIds;

    if (typeof id === 'string') {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }

    const clientHelper = new Client();

    return this.withClientHelper(clientHelper, chainId);
  }

  private withClientHelper(clientHelper: Client, chainId: SdkSupportedChainIds) {
    return Object.assign(clientHelper, {
      getPublicClient(): PublicClient {
        return clientHelper._getPublicClient(chainId);
      },

      token: (symbolOrAddress: string) => {
        return new ERC20({
          symbolOrAddress,
          chainId,
        });
      },

      nft: (symbolOrAddress: string) => {
        return new ERC1155({
          symbolOrAddress,
          chainId,
        });
      },

      airdrop: new Airdrop(chainId),
      lockup: new Lockup(chainId),
      bond: new Bond(chainId),
    });
  }

  public withPublicClient(publicClient: PublicClient): MintClubSDK {
    const chainId = publicClient.chain?.id;
    if (chainId === undefined) throw new InvalidClientError();
    const clientHelper = new Client().withPublicClient(publicClient);
    return this;
  }

  public withWalletClient(walletClient: WalletClient): MintClubSDK {
    const chainId = walletClient.chain?.id;
    if (chainId === undefined) throw new InvalidClientError();
    if (walletClient.chain?.id === undefined) throw new InvalidClientError();
    const clientHelper = new Client().withWalletClient(walletClient);

    return this;
  }
}
