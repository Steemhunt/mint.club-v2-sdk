import { GenericContract } from '../contracts/GenericContract';
import { GenericTokenLogicHelper, GenericTokenLogicHelperConstructorParams } from './GenericTokenLogicHelper';

export class ERC20LogicHelper extends GenericTokenLogicHelper {
  private erc20Contract = new GenericContract('ERC20');

  constructor(params: Omit<GenericTokenLogicHelperConstructorParams, 'tokenType'>) {
    super({
      ...params,
      tokenType: 'ERC20',
    });
  }

  public allowance(owner: `0x${string}`, spender: `0x${string}`) {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getAddress(),
      functionName: 'allowance',
      args: [owner, spender],
    });
  }

  public name() {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getAddress(),
      functionName: 'name',
      args: [],
    });
  }

  public symbol() {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getAddress(),
      functionName: 'symbol',
      args: [],
    });
  }

  public decimals() {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getAddress(),
      functionName: 'decimals',
      args: [],
    });
  }

  public balanceOf(walletAddress: `0x${string}`) {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getAddress(),
      functionName: 'balanceOf',
      args: [walletAddress],
    });
  }

  public totalSupply() {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getAddress(),
      functionName: 'totalSupply',
      args: [],
    });
  }
}
