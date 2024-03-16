import { PublicClient, WalletClient } from 'viem';
import { InvalidClientError } from './errors/sdk.errors';
import { LowerCaseChainNames, SdkSupportedChainIds, chainStringToId } from './exports';
import { BondHelper } from './helpers/BondHelper';
import { ClientHelper } from './helpers/ClientHelper';
import { ERC1155Helper } from './helpers/ERC1155Helper';
import { ERC20Helper } from './helpers/ERC20Helper';
import { IpfsHelper } from './helpers/IpfsHelper';

export class MintClubSDK {
  public wallet = new ClientHelper();
  public ipfs = new IpfsHelper();

  private withClientHelper(clientHelper: ClientHelper, chainId: SdkSupportedChainIds) {
    return Object.assign(clientHelper, {
      getPublicClient(): PublicClient {
        return clientHelper._getPublicClient(chainId);
      },

      token: (symbolOrAddress: string) => {
        return new ERC20Helper({
          symbolOrAddress,
          chainId,
        });
      },

      nft: (symbolOrAddress: string) => {
        return new ERC1155Helper({
          symbolOrAddress,
          chainId,
        });
      },

      bond: new BondHelper({
        chainId,
      }),
    });
  }

  public withPublicClient(publicClient: PublicClient): ReturnType<typeof this.network> {
    const chainId = publicClient.chain?.id;
    if (chainId === undefined) throw new InvalidClientError();
    const clientHelper = new ClientHelper().withPublicClient(publicClient);
    return this.withClientHelper(clientHelper, chainId as SdkSupportedChainIds);
  }

  public withWalletClient(walletClient: WalletClient): ReturnType<typeof this.network> {
    const chainId = walletClient.chain?.id;
    if (chainId === undefined) throw new InvalidClientError();
    if (walletClient.chain?.id === undefined) throw new InvalidClientError();
    const clientHelper = new ClientHelper().withWalletClient(walletClient);

    return this.withClientHelper(clientHelper, chainId as SdkSupportedChainIds);
  }

  public network(
    id: SdkSupportedChainIds | LowerCaseChainNames,
  ): Omit<ReturnType<typeof this.withClientHelper> & ClientHelper, '_getPublicClient'> {
    let chainId: SdkSupportedChainIds;

    if (typeof id === 'string') {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }

    const clientHelper = new ClientHelper();

    return this.withClientHelper(clientHelper, chainId);
  }
}
