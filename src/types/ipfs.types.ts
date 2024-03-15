export type IpfsHashUrl = `ipfs://${string}`;
export type HttpUrl = `http://${string}` | `https://${string}`;

export type NFTMetadata = {
  name: string;
  description: string;
  image: IpfsHashUrl | HttpUrl;
  animation_url?: string;
  external_url: string;
  attributes: { trait_type: string; value: string }[];
};

export type MediaUploadParams = {
  filebaseApiKey: string;
  media: Blob;
};

export type MetadataUploadParams = {
  filebaseApiKey: string;
  image: IpfsHashUrl | HttpUrl;
  name: string;
  description?: string;
  external_url?: string;
  attributes?: { trait_type: string; value: string }[];
  video?: IpfsHashUrl | HttpUrl;
};

export type MintClubApiIpfsUploadReturnType = { hash: string };
