import { CIDString, FilebaseClient } from '@filebase/client';
import { FilebaseKeyNeededErrror, InvalidImageProvidedError } from '../errors/sdk.errors';
import { HttpUrl, IpfsHashUrl, MetadataUploadParams, NFTMetadata } from '../types/ipfs.types';

export class IpfsHelper {
  public static async addWithFilebase(apiKey: string, file: Blob): Promise<CIDString> {
    if (!apiKey) throw new FilebaseKeyNeededErrror();

    const client = new FilebaseClient({ token: apiKey });

    const cid = await client.storeBlob(file, 'nft.png');
    return cid;
  }

  public static isIpfsUrl(url: string) {
    return url.toLowerCase().startsWith('ipfs://');
  }

  public static isHttpUrl(url: string) {
    return url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://');
  }

  public static validateHttpUrl(url: string) {
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      throw new InvalidImageProvidedError();
    }
    const valid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    if (!valid) {
      throw new InvalidImageProvidedError();
    }
    return valid;
  }

  public static validateIpfsHash(ipfsUrl: string) {
    const hash = ipfsUrl.replace(/^ipfs:\/\//, '');

    // CIDv0, base58, starts with Qm, 46 characters
    const cidv0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;

    // CIDv1 in base32, starts with b, for simplicity assuming it's at least 50 characters
    // This is a simplified check and might not cover all cases
    const cidv1Pattern = /^b[1-9A-Za-z]{49,}$/;

    const matched = cidv0Pattern.test(hash) || cidv1Pattern.test(hash);

    // only allow ipfs://hash and not ipfs://ipfs://
    const valid = matched && hash.startsWith('ipfs://') && hash.indexOf('ipfs://', 7) === -1;

    if (!valid) {
      throw new InvalidImageProvidedError();
    }

    return valid;
  }

  public static async add(file: Blob, apiKey?: string) {
    if (!apiKey) {
      throw new FilebaseKeyNeededErrror();
    }
    if (apiKey) {
      return IpfsHelper.addWithFilebase(apiKey, file);
    }
  }

  public static async uploadERC1155Metadata(data: MetadataUploadParams): Promise<IpfsHashUrl> {
    const { name, image, video, attributes = [], filebaseApiKey, description, external_url } = data;

    let imageHash: IpfsHashUrl | HttpUrl, videoHash: IpfsHashUrl | HttpUrl;

    if (image instanceof File || image instanceof Blob) {
      const hash = await this.add(image, filebaseApiKey);
      imageHash = `ipfs://${hash}`;
    } else if (this.isHttpUrl(image)) {
      imageHash = image;
    } else {
      this.validateIpfsHash(image);
      imageHash = image;
    }

    const metadataParams: NFTMetadata = {
      name,
      description,
      image: imageHash,
      external_url,
      attributes,
    };

    if (video !== undefined) {
      if (video instanceof File || video instanceof Blob) {
        const hash = await this.add(video, filebaseApiKey);
        videoHash = `ipfs://${hash}`;
      } else if (this.isHttpUrl(video)) {
        videoHash = video;
      } else {
        this.validateIpfsHash(video);
        videoHash = video;
      }

      metadataParams.animation_url = videoHash;
    }

    const metadata = JSON.stringify(metadataParams);

    const file = new Blob([metadata]);

    const jsonHash = await this.add(file, filebaseApiKey);

    return `ipfs://${jsonHash}`;
  }
}
