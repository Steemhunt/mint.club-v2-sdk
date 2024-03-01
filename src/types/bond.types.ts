import { CurveType } from '.';
import { NFTMetadata } from './ipfs.types';

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

export type CreateERC1155TokenParams = CreateERC20TokenParams & {
  filebaseApiKey?: string;
  metadata?: {
    description: string;
    external_url: string;
    attributes?: {
      trait_type: string;
      value: string;
    }[];
  };
  image: File;
  video?: File;
};

export type CreateTokenParams = CreateERC20TokenParams & {
  tokenType: 'ERC20' | 'ERC1155';
  symbol: string;
};

export type GenerateStepArgs = CreateTokenParams & {
  curveData: CurveParameter;
};
