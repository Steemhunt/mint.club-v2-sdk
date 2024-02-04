import { BOND_ABI } from '../constants/abis/bond';
import { restructureStepData, wei } from '../utils';
import { GenericContractLogic, GenericWriteParams } from './GenericContractLogic';

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

export class BondContractLogic extends GenericContractLogic<typeof BOND_ABI> {
  private generateCreateArgs(params: CreateTokenParams) {
    const { tokenType, name, symbol, reserveToken, mintRoyalty, burnRoyalty, stepData } = params;

    const clonedStepData = restructureStepData(stepData);

    const stepRanges = clonedStepData.map(({ rangeTo }) => wei(rangeTo, tokenType === 'ERC20' ? 18 : 0));
    const stepPrices = clonedStepData.map(({ price }) => wei(price, reserveToken.decimals));

    // merge same price points
    for (let i = 0; i < stepPrices.length; i++) {
      if (stepPrices[i] === stepPrices[i + 1]) {
        stepRanges.splice(i, 1);
        stepPrices.splice(i, 1);
        i--;
      }
    }

    if (!stepData || stepRanges.length === 0 || stepPrices.length === 0 || stepRanges.length !== stepPrices.length) {
      throw new Error('Invalid step data. Please check your curve');
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

  public async createToken(
    params: CreateTokenParams & Pick<GenericWriteParams, 'onError' | 'onRequestSignature' | 'onSigned' | 'onSuccess'>,
  ) {
    const args = this.generateCreateArgs(params);
    const { onError, onRequestSignature, onSigned, onSuccess } = params;

    const fee = await this.read({
      functionName: 'creationFee',
      args: [],
    });

    return this.write({
      functionName: 'createToken',
      args: [args.tokenParams, args.bondParams],
      value: fee,
      onError,
      onRequestSignature,
      onSigned,
      onSuccess,
    });
  }
}
