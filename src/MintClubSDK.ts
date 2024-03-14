import { PublicClient, WalletClient } from 'viem';
import { InvalidClientError } from './errors/sdk.errors';
import { LowerCaseChainNames, SdkSupportedChainIds, chainStringToId } from './exports';
import { BondHelper } from './helpers/BondHelper';
import { ClientHelper } from './helpers/ClientHelper';
import { ERC1155Helper } from './helpers/ERC1155Helper';
import { ERC20Helper } from './helpers/ERC20Helper';
import { IpfsHelper } from './helpers/IpfsHelper';
import { IpfsHashUrl, MediaUploadParams, MetadataUploadParams, NFTMetadata } from './types/ipfs.types';

type NetworkReturnType = {
  token: (symbolOrAddress: string) => ERC20Helper;
  nft: (symbolOrAddress: string) => ERC1155Helper;
  bond: () => BondHelper;
} & ClientHelper;

export class MintClubSDK {
  public wallet = new ClientHelper();

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

  public async uploadMediaToIpfs(params: MediaUploadParams) {
    const { filebaseApiKey, media } = params;
    const hash = await IpfsHelper.addWithFilebase(filebaseApiKey, media);
    return `ipfs://${hash}`;
  }

  public async uploadMetadataToIpfs(data: MetadataUploadParams): Promise<IpfsHashUrl> {
    const { filebaseApiKey, name, image, video, description, external_url, attributes } = data;

    const defaultExternalLink = `https://mint.club`;
    const defaultDescription = [
      `A Bonding Curved ERC-1155 token powered by mint.club bonding curve protocol.`,
      defaultExternalLink,
    ].join('\n\n');

    const finalMetadata: NFTMetadata = {
      name,
      description: defaultDescription,
      image,
      external_url: defaultExternalLink,
      attributes: [],
    };

    if (video) {
      finalMetadata.animation_url = video;
    }

    if (description) finalMetadata.description = description;
    if (external_url) finalMetadata.external_url = external_url;
    if (attributes) finalMetadata.attributes = attributes;

    const metadata = JSON.stringify(finalMetadata);
    const metadataBuffer = new Blob([metadata], { type: 'application/json' });
    const jsonHash = await IpfsHelper.addWithFilebase(filebaseApiKey, metadataBuffer);

    return `ipfs://${jsonHash}`;
  }
}
