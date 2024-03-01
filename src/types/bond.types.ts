import { CurveType } from '.';

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
  uri: string;
};

export type CreateTokenParams = CreateERC20TokenParams & {
  tokenType: 'ERC20' | 'ERC1155';
  symbol: string;
};

export type GenerateStepArgs = CreateTokenParams & {
  curveData: CurveParameter;
};
