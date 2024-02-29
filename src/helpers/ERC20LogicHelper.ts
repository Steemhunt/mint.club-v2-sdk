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
      tokenAddress: this.getTokenAddress(),
      functionName: 'allowance',
      args: [owner, spender],
    });
  }

  public balanceOf(walletAddress: `0x${string}`) {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'balanceOf',
      args: [walletAddress],
    });
  }

  public getBondAddress() {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'bond',
      args: [],
    });
  }

  public decimals() {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'decimals',
      args: [],
    });
  }

  public name() {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'name',
      args: [],
    });
  }

  public symbol() {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'symbol',
      args: [],
    });
  }

  public totalSupply() {
    return this.erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'totalSupply',
      args: [],
    });
  }
}
