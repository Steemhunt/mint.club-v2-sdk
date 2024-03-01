import { CurveType } from '.';
import { HttpUrl, IpfsHashUrl } from './ipfs.types';

export type ReserveToken = {
  address: `0x${string}`;
  decimals: number;
};

export type StepData = {
  rangeTo: number;
  price: number;
}[];

type CurveParameter = {
  curveType: CurveType;
  stepCount: number;
  maxSupply: number;
  initialMintingPrice: number;
  finalMintingPrice: number;
  creatorAllocation?: number;
};

type WithCurveData = {
  curveData: CurveParameter;
  stepData?: never; // Explicitly state that stepData cannot be used here
};

type WithStepData = {
  curveData?: never; // Explicitly state that curveData cannot be used here
  stepData: StepData;
};

export type CreateERC20TokenParams = {
  // required
  name: string;
  reserveToken: ReserveToken;
  buyRoyalty?: number;
  sellRoyalty?: number;
} & (WithCurveData | WithStepData);

type IpfsHashProvided = {
  filebaseApiKey?: never;
  image: IpfsHashUrl;
  video?: IpfsHashUrl;
  onIpfsUploadStart?: never;
  onIpfsUploadComplete?: never;
};

type FilebaseApiKeyProvided = {
  filebaseApiKey: string;
  image: File;
  video?: File;
  onIpfsUploadStart?: () => void;
  onIpfsUploadComplete?: () => void;
};

export type CreateERC1155TokenParams = CreateERC20TokenParams & {
  metadata?: {
    description?: string;
    external_url?: string;
    attributes?: {
      trait_type: string;
      value: string;
    }[];
  };
  image: File | IpfsHashUrl | HttpUrl;
  video?: File | IpfsHashUrl | HttpUrl;
} & (IpfsHashProvided | FilebaseApiKeyProvided);

export type CreateTokenParams = CreateERC20TokenParams & {
  tokenType: 'ERC20' | 'ERC1155';
  symbol: string;
};

export type GenerateStepArgs = CreateTokenParams & {
  curveData: CurveParameter;
};
