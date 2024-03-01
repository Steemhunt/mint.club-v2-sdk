export type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  external_url: string;
  attributes: { trait_type: string; value: string }[];
};

export type IPFSUploadERC1155MetadataParams = {
  filebaseApiKey?: string;
  name: string;
  description: string;
  external_url: string;
  attributes?: { trait_type: string; value: string }[];
  image: File;
  video?: File;
};

export type MintClubApiIPFSUploadReturnType = { hash: string };
