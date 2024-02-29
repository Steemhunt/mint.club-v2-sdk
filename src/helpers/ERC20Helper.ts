import { GenericTokenHelper, GenericTokenHelperConstructorParams } from './GenericTokenHelper';
import { erc20Contract } from '../contracts';

export class ERC20Helper extends GenericTokenHelper {
  private erc20Contract = erc20Contract;

  constructor(params: Omit<GenericTokenHelperConstructorParams, 'tokenType'>) {
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
