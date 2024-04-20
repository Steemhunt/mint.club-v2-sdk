import lodash from 'lodash';
const { cloneDeep } = lodash;
import { CreationError } from '../errors/sdk.errors';
import { wei } from '../exports';
import { CreateTokenParams } from '../types/bond.types';
import { generateSteps } from './graph';

export function generateCreateArgs(params: CreateTokenParams & { tokenType: 'ERC20' | 'ERC1155' }) {
  const {
    tokenType,
    name,
    symbol,
    curveData,
    reserveToken,
    buyRoyalty = 0.03,
    sellRoyalty = 0.03,
    stepData: _stepData,
  } = params;

  if (curveData === undefined && _stepData === undefined) {
    throw new CreationError('Either curveData or stepData is required for creation');
  }

  const stepRanges: bigint[] = [];
  const stepPrices: bigint[] = [];

  let stepData: { rangeTo: number; price: number }[] = [];
  const { creatorAllocation = 0, maxSupply = 0 } = curveData || {};

  if (curveData) {
    const { stepData: generatedSteps } = generateSteps({
      ...params,
      curveData,
    });

    if (creatorAllocation > maxSupply) {
      throw new CreationError('Generating argument for creation failed', {
        metaMessages: ['Creator allocation cannot be greater than max supply'],
      });
    }

    stepData = generatedSteps;

    // we shift the y values to the right
    const cloned = cloneDeep(generatedSteps);
    for (let i = cloned.length - 1; i > 0; i--) {
      cloned[i].price = cloned[i - 1].price;
    }
    // remove the first element as it is not needed
    cloned.shift();
    stepData = cloned;

    if (creatorAllocation > 0) {
      stepRanges.unshift(wei(creatorAllocation, tokenType === 'ERC20' ? 18 : 0));
      stepPrices.unshift(0n);
    }

    if (tokenType === 'ERC1155' && maxSupply === 1) {
      stepData = [{ rangeTo: 1, price: curveData.finalMintingPrice }];
    } else if (stepData[0].price !== curveData.initialMintingPrice) {
      throw new CreationError(`Generated step data's initial price does not match your desired value.`, {
        metaMessages: ['Please try a different step count', JSON.stringify(stepData)],
      });
    } else if (stepData[stepData.length - 1].price !== curveData.finalMintingPrice) {
      throw new CreationError(`Generated step data's final price does not match your desired value.`, {
        metaMessages: ['Please try a different step count', JSON.stringify(stepData)],
      });
    }
  } else {
    stepData = _stepData;
  }

  stepData.forEach(({ rangeTo, price }) => {
    if (isNaN(rangeTo) || isNaN(price) || rangeTo < 0 || price < 0) {
      throw new CreationError('Invalid arguments passed for creation', {
        metaMessages: ['Please double check the step data'],
      });
    }

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

  if (tokenType === 'ERC1155') {
    // merge same range points
    for (let i = 0; i < stepRanges.length; i++) {
      if (stepRanges[i] === stepRanges[i + 1]) {
        stepRanges.splice(i, 1);
        stepPrices.splice(i, 1);
        i--;
      }
    }
  }

  if (stepRanges.length === 0 || stepPrices.length === 0 || stepRanges.length !== stepPrices.length) {
    throw new CreationError('Invalid step data. Please double check the step data');
  } else if (stepData === undefined && creatorAllocation === 0 && stepPrices.some((price) => price === 0n)) {
    throw new CreationError(
      'Your parameters may be too extreme to generate a valid curve. Please change parameters, such as stepCount.',
    );
  } else if (creatorAllocation > 0) {
    const weiAllocation = wei(creatorAllocation, tokenType === 'ERC20' ? 18 : 0);
    if (stepRanges[0] !== weiAllocation) {
      throw new CreationError('Creator allocation does not match the first step range. Try different parameters');
    }
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
    mintRoyalty: buyRoyalty * 100,
    burnRoyalty: sellRoyalty * 100,
    reserveToken: reserveToken.address,
    maxSupply: stepRanges[stepRanges.length - 1],
    stepRanges,
    stepPrices,
  };

  return { tokenParams, bondParams };
}

// console.log(
//   generateCreateArgs({
//     name: 'abc',
//     reserveToken: {
//       address: '0x123',
//       decimals: 18,
//     },
//     buyRoyalty: 0.05,
//     sellRoyalty: 0.05,
//     symbol: 'abc',
//     tokenType: 'ERC20',
//     curveData: {
//       curveType: 'EXPONENTIAL',
//       finalMintingPrice: 1,
//       initialMintingPrice: 0.001,
//       maxSupply: 10000,
//       stepCount: 30,
//       creatorAllocation: 1,
//     },
//   }),
// );
