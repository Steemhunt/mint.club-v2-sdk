import { TokenType } from '../exports';
import { HttpUrl, IpfsHashUrl, MetadataUploadParams } from './ipfs.types';
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

export type CreateERC1155TokenParams = CreateERC20TokenParams & {
  metadataUrl: IpfsHashUrl | HttpUrl;
};

export type CreateTokenParams = CreateERC20TokenParams & {
  tokenType: 'ERC20' | 'ERC1155';
  symbol: string;
};

export type GenerateStepArgs = CreateTokenParams & {
  curveData: CurveParameter;
};

export type ApproveBondParams<T extends TokenType, TT extends TradeType = TradeType> = (TT extends 'buy'
  ? // for buy allowance amount can always exist
    {
      tradeType: TT;
      amountToSpend?: bigint;
      allowanceAmount?: bigint;
    }
  : T extends 'ERC20'
    ? {
        tradeType: TT;
        amountToSpend?: bigint;
        allowanceAmount?: bigint;
      }
    : {
        // for ERC1155 sell, allowance amount is either true or false
        tradeType: TT;
        amountToSpend?: bigint;
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
