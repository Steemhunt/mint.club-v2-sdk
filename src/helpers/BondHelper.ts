import { ContractChainType } from '../constants/contracts';
import { bondContract } from '../contracts';

export type BondHelperConstructorParams = {
  chainId: ContractChainType;
};

export class BondHelper {
  protected chainId: ContractChainType;

  constructor(params: BondHelperConstructorParams) {
    const { chainId } = params;

    this.chainId = chainId;
  }

  public getCreationFee() {
    return bondContract.network(this.chainId).read({
      functionName: 'creationFee',
      args: [],
    });
  }
}
