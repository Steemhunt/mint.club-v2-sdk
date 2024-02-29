import { erc20Contract } from '../contracts';
import { GenericTokenHelper, GenericTokenHelperConstructorParams } from './GenericTokenHelper';

export class ERC20Helper extends GenericTokenHelper {
  constructor(params: Omit<GenericTokenHelperConstructorParams, 'tokenType'>) {
    super({
      ...params,
      tokenType: 'ERC20',
    });
  }

  public getAllowance(owner: `0x${string}`, spender: `0x${string}`) {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'allowance',
      args: [owner, spender],
    });
  }

  public getBalanceOf(walletAddress: `0x${string}`) {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'balanceOf',
      args: [walletAddress],
    });
  }

  public getGetBondAddress() {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'bond',
      args: [],
    });
  }

  public getDecimals() {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'decimals',
      args: [],
    });
  }

  public getName() {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'name',
      args: [],
    });
  }

  public getSymbol() {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'symbol',
      args: [],
    });
  }

  public getTotalSupply() {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'totalSupply',
      args: [],
    });
  }
}
