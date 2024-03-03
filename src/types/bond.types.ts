import { TokenType } from '../exports';
import { HttpUrl, IpfsHashUrl } from './ipfs.types';
import { CurveType, TradeType, WriteTransactionCallbacks } from './transactions.types';

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

export type ApproveBondParams<T extends TokenType> = (T extends 'ERC20'
  ? {
      tradeType: TradeType;
      amountToSpend?: bigint;
    }
  : {
      tradeType: TradeType;
    }) &
  WriteTransactionCallbacks;

export type BondApprovedParams<T extends TokenType, TT extends TradeType = TradeType> = T extends 'ERC20'
  ? {
      walletAddress: `0x${string}`;
      amountToSpend: bigint;
      tradeType: TT;
    }
  : TT extends 'buy'
    ? {
        walletAddress: `0x${string}`;
        amountToSpend: bigint;
        tradeType: TT;
      }
    : TT extends 'sell'
      ? {
          walletAddress: `0x${string}`;
          tradeType: TT;
        }
      : never;

export type BuySellCommonParams = WriteTransactionCallbacks & {
  amount: bigint;
  recipient?: `0x${string}`;
  slippage?: number;
};

export type TransferCommonParams = WriteTransactionCallbacks & {
  recipient: `0x${string}`;
  amount: bigint;
};
