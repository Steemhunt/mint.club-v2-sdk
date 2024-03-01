import { CIDString, FilebaseClient } from '@filebase/client';
import { api } from '../utils/api';
import { IPFSUploadERC1155MetadataParams, MintClubApiIPFSUploadReturnType, NFTMetadata } from '../types/ipfs.types';

export class IPFS {
  private static async addWithFilebase(apiKey: string, file: Blob): Promise<CIDString> {
    const client = new FilebaseClient({ token: apiKey });

    const cid = await client.storeBlob(file);
    return cid;
  }

  private static async addWithMintClubApi(formData: FormData): Promise<CIDString> {
    const { hash } = await api
      .post('ipfs/upload', {
        body: formData,
      })
      .json<MintClubApiIPFSUploadReturnType>();
    return hash;
  }

  public static async add(file: Blob, apiKey?: string): Promise<CIDString> {
    if (apiKey) {
      return IPFS.addWithFilebase(apiKey, file);
    }
    const formData = new FormData();
    formData.append('file', file);
    return IPFS.addWithMintClubApi(formData);
  }

  public static async uploadERC1155Metadata(data: IPFSUploadERC1155MetadataParams) {
    const { name, image, video, attributes = [], filebaseApiKey, description, external_url } = data;

    const imageHash = await this.add(image, filebaseApiKey);

    const metadataParams: NFTMetadata = {
      name,
      description,
      image: `ipfs://${imageHash}`,
      external_url,
      attributes,
    };

    if (video !== undefined) {
      const videoHash = await this.add(video, filebaseApiKey);
      metadataParams.animation_url = `ipfs://${videoHash}`;
    }

    const metadata = JSON.stringify(metadataParams);

    const file = new Blob([metadata]);

    const hash = await this.add(file, filebaseApiKey);
    return hash;
  }
}
