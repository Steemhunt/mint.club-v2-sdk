import { PublicClient, WalletClient } from 'viem';
import { SdkSupportedChainIds, LowerCaseChainNames, chainStringToId } from './exports';
import { BondHelper } from './helpers/BondHelper';
import { ClientHelper } from './helpers/ClientHelper';
import { ERC1155Helper } from './helpers/ERC1155Helper';
import { ERC20Helper } from './helpers/ERC20Helper';
import { InvalidClientError } from './errors/sdk.errors';

type NetworkReturnType = {
  token: (symbolOrAddress: string) => ERC20Helper;
  nft: (symbolOrAddress: string) => ERC1155Helper;
  bond: () => BondHelper;
} & ClientHelper;

export class MintClubSDK {
  private withClientHelper(clientHelper: ClientHelper, chainId: SdkSupportedChainIds) {
    return Object.assign(clientHelper, {
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

      bond: () => {
        return new BondHelper({
          chainId,
        });
      },
    });
  }

  public connectWallet() {
    return new ClientHelper().connectWallet;
  }

  public withPublicClient(publicClient: PublicClient) {
    const chainId = publicClient.chain?.id;
    if (chainId === undefined) throw new InvalidClientError();
    const clientHelper = new ClientHelper().withPublicClient(publicClient);
    return this.withClientHelper(clientHelper, chainId as SdkSupportedChainIds);
  }

  public withWalletClient(walletClient: WalletClient) {
    const chainId = walletClient.chain?.id;
    if (chainId === undefined) throw new InvalidClientError();
    if (walletClient.chain?.id === undefined) throw new InvalidClientError();
    const clientHelper = new ClientHelper().withWalletClient(walletClient);

    return this.withClientHelper(clientHelper, chainId as SdkSupportedChainIds);
  }

  public network(id: SdkSupportedChainIds | LowerCaseChainNames): NetworkReturnType {
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
