import { SdkSupportedChainIds, TokenType } from '../exports';
import { WriteTransactionCallbacks } from './transactions.types';

export type TokenHelperConstructorParams = {
  symbolOrAddress: string;
  chainId: SdkSupportedChainIds;
  tokenType: TokenType;
};

export type TokenCreateAirdropParams = {
  title: string;
  wallets: `0x${string}`[];
  amountPerClaim: number;
  startTime?: Date;
  endTime: Date;
  filebaseApiKey: string;
} & WriteTransactionCallbacks;
