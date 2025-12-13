import { FilebaseKeyNeededErrror, InvalidImageProvidedError } from '../errors/sdk.errors';
import { IpfsHashUrl, MediaUploadParams, MetadataUploadParams, NFTMetadata } from '../types/ipfs.types';

type CIDString = string;

const FILEBASE_API_URL = 'https://api.filebase.io/v1/ipfs';

export class Ipfs {
  public async add(apiKey: string, data: Blob | Uint8Array): Promise<CIDString> {
    if (!apiKey) throw new FilebaseKeyNeededErrror();

    let blob: Blob;
    if (data instanceof Uint8Array) {
      blob = new Blob([data.buffer as ArrayBuffer], { type: 'application/json' });
    } else {
      blob = data;
    }

    const formData = new FormData();
    formData.append('file', blob);

    const response = await fetch(`${FILEBASE_API_URL}/pins`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Filebase upload failed: ${response.status} ${errorText}`);
    }

    const result = (await response.json()) as { cid: string };
    return result.cid;
  }

  private isIpfsUrl(url: string) {
    return url.toLowerCase().startsWith('ipfs://');
  }

  private isHttpUrl(url: string) {
    return url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://');
  }

  private validateHttpUrl(url: string) {
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

  public hashToGatewayUrl(hash: string, gateway = 'https://ipfs.io/ipfs/') {
    if (hash.includes('ipfs://')) {
      hash = hash.replace('ipfs://', '');
    }
    return `${gateway}${hash}`;
  }

  public gatewayUrlToHash(url: string): IpfsHashUrl {
    return ('ipfs://' + url.split('ipfs/').pop()) as IpfsHashUrl;
  }

  public validateIpfsHash(ipfsUrl: string) {
    const hash = ipfsUrl.replace(/^ipfs:\/\//, '');

    // CIDv0, base58, starts with Qm, 46 characters
    const cidv0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;

    // CIDv1 in base32, starts with b, for simplicity assuming it's at least 50 characters
    // This is a simplified check and might not cover all cases
    const cidv1Pattern = /^b[1-9A-Za-z]{49,}$/;

    const matched = cidv0Pattern.test(hash) || cidv1Pattern.test(hash);

    if (!matched) {
      throw new InvalidImageProvidedError();
    }

    return matched;
  }

  public async upload(params: MediaUploadParams) {
    const { filebaseApiKey, media } = params;
    const hash = await this.add(filebaseApiKey, media);
    return `ipfs://${hash}`;
  }

  public async uploadMetadata(data: MetadataUploadParams): Promise<IpfsHashUrl> {
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
    const arrayBuffer = await metadataBuffer.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const jsonHash = await this.add(filebaseApiKey, uint8Array);

    return `ipfs://${jsonHash}`;
  }
}
