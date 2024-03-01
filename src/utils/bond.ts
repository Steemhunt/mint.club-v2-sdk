import { WrongCreateParameterError } from '../errors/sdk.errors';
import { wei } from '../exports';
import { CreateTokenParams } from '../types/bond.types';
import { generateSteps } from './graph';

export function generateCreateArgs(params: CreateTokenParams & { tokenType: 'ERC20' | 'ERC1155' }) {
  const { tokenType, name, symbol, curveData, reserveToken, mintRoyalty, burnRoyalty, stepData: _stepData } = params;

  if (curveData === undefined && _stepData === undefined) {
    throw new WrongCreateParameterError();
  }

  const stepRanges: bigint[] = [];
  const stepPrices: bigint[] = [];

  let stepData: { rangeTo: number; price: number }[] = [];

  if (curveData) {
    const { stepData: generatedSteps } = generateSteps({
      ...params,
      curveData,
    });

    stepData = generatedSteps;
  } else {
    stepData = _stepData;
  }

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

  if (stepRanges.length === 0 || stepPrices.length === 0 || stepRanges.length !== stepPrices.length) {
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
