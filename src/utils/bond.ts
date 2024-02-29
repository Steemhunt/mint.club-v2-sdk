import { wei } from '../exports';

export type CreateTokenParams = {
  tokenType: 'ERC20' | 'ERC1155';
  name: string;
  symbol: string;
  reserveToken: {
    address: `0x${string}`;
    decimals: number;
  };
  mintRoyalty: number;
  burnRoyalty: number;
  stepData: { rangeTo: number; price: number }[];
};

export function generateCreateArgs(params: CreateTokenParams) {
  const { tokenType, name, symbol, reserveToken, mintRoyalty, burnRoyalty, stepData } = params;

  const stepRanges: bigint[] = [];
  const stepPrices: bigint[] = [];

  stepData.forEach(({ rangeTo, price }) => {
    stepRanges.push(wei(rangeTo, tokenType === 'ERC20' ? 18 : 0));
    stepPrices.push(wei(price, reserveToken.decimals));
  });

  // merge same price points
  for (let i = 0; i < stepPrices.length; i++) {
    if (stepPrices[i] === stepPrices[i + 1]) {
      stepRanges.splice(i, 1);
      stepPrices.splice(i, 1);
      i--;
    }
  }

  if (!stepData || stepRanges.length === 0 || stepPrices.length === 0 || stepRanges.length !== stepPrices.length) {
    throw new Error('Invalid step data. Please double check the step data');
  }

  const tokenParams: {
    name: string;
    symbol: string;
    uri?: string;
  } = {
    name,
    symbol,
  };

  const bondParams = {
    mintRoyalty: mintRoyalty * 100,
    burnRoyalty: burnRoyalty * 100,
    reserveToken: reserveToken.address,
    maxSupply: stepRanges[stepRanges.length - 1],
    stepRanges,
    stepPrices,
  };

  return { tokenParams, bondParams };
}
