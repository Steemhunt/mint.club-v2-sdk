export type IpfsHashUrl = `ipfs://${string}`;
export type HttpUrl = `http://${string}` | `https://${string}`;

export type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  external_url: string;
  attributes: { trait_type: string; value: string }[];
};

export type MetadataUploadParams = {
  filebaseApiKey?: string;
  name: string;
  description: string;
  external_url: string;
  attributes?: { trait_type: string; value: string }[];
  image: File | Blob | IpfsHashUrl | HttpUrl;
  video?: File | Blob | IpfsHashUrl | HttpUrl;
};

export type MintClubApiIpfsUploadReturnType = { hash: string };
