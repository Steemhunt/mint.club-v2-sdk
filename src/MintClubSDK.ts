import { PublicClient, WalletClient } from 'viem';
import { InvalidClientError } from './errors/sdk.errors';
import { LowerCaseChainNames, SdkSupportedChainIds, chainStringToId } from './exports';
import { Bond } from './helpers/BondHelper';
import { Client } from './helpers/ClientHelper';
import { ERC1155 } from './helpers/ERC1155Helper';
import { ERC20 } from './helpers/ERC20Helper';
import { Ipfs } from './helpers/IpfsHelper';

export class MintClubSDK {
  public wallet = new Client();
  public ipfs = new Ipfs();

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

      bond: new Bond({
        chainId,
      }),
    });
  }

  public withPublicClient(publicClient: PublicClient): ReturnType<typeof this.network> {
    const chainId = publicClient.chain?.id;
    if (chainId === undefined) throw new InvalidClientError();
    const clientHelper = new Client().withPublicClient(publicClient);
    return this.withClientHelper(clientHelper, chainId as SdkSupportedChainIds);
  }

  public withWalletClient(walletClient: WalletClient): ReturnType<typeof this.network> {
    const chainId = walletClient.chain?.id;
    if (chainId === undefined) throw new InvalidClientError();
    if (walletClient.chain?.id === undefined) throw new InvalidClientError();
    const clientHelper = new Client().withWalletClient(walletClient);

    return this.withClientHelper(clientHelper, chainId as SdkSupportedChainIds);
  }

  public network(id: SdkSupportedChainIds | LowerCaseChainNames): Omit<
    ReturnType<typeof this.withClientHelper> & Client,
    '_getPublicClient'
  > & {
    getPublicClient: () => PublicClient;
    token: (symbolOrAddress: string) => ERC20;
    nft: (symbolOrAddress: string) => ERC1155;
    bond: Bond;
  } {
    let chainId: SdkSupportedChainIds;

    if (typeof id === 'string') {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }

    const clientHelper = new Client();

    return this.withClientHelper(clientHelper, chainId);
  }
}
