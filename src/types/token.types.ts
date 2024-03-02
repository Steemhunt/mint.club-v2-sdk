import { SdkSupportedChainIds, TokenType } from '../exports';

export type TokenHelperConstructorParams = {
  symbolOrAddress: string;
  chainId: SdkSupportedChainIds;
  tokenType: TokenType;
};
