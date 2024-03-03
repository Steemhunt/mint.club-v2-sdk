import { bondContract, erc20Contract } from '../contracts';
import { CreateERC20TokenParams } from '../types/bond.types';
import { TokenHelperConstructorParams } from '../types/token.types';
import { CommonWriteParams } from '../types/transactions.types';
import { TokenHelper } from './TokenHelper';

export class ERC20Helper extends TokenHelper<'ERC20'> {
  constructor(params: Omit<TokenHelperConstructorParams, 'tokenType'>) {
    super({
      ...params,
      tokenType: 'ERC20',
    });
  }

  public getAllowance(params: { owner: `0x${string}`; spender: `0x${string}` }) {
    const { owner, spender } = params;
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

  public getBondAddress() {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'bond',
    });
  }

  public getDecimals() {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'decimals',
    });
  }

  public getName() {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'name',
    });
  }

  public getSymbol() {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'symbol',
    });
  }

  public getTotalSupply() {
    return erc20Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'totalSupply',
    });
  }

  public async create(params: CreateERC20TokenParams & Omit<CommonWriteParams, 'value'>) {
    try {
      const { args, fee } = await this.checkAndPrepareCreateArgs(params);
      return bondContract.network(this.chainId).write({
        ...params,
        functionName: 'createToken',
        args: [args.tokenParams, args.bondParams],
        value: fee,
      });
    } catch (e) {
      params.onError?.(e);
    }
  }
}
