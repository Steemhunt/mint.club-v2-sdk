import { bondContract, erc20Contract } from '../contracts';
import { SymbolNotDefinedError, TokenAlreadyExistsError } from '../errors/sdk.errors';
import { CommonWriteParams } from '../types';
import { CreateERC20TokenParams } from '../types/bond.types';
import { TokenHelperConstructorParams } from '../types/token.types';
import { generateCreateArgs } from '../utils/bond';
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

  public async create(params: CreateERC20TokenParams & Omit<CommonWriteParams, 'value'>) {
    const { onError, onRequestSignature, onSigned, onSuccess } = params;
    if (!this.symbol) {
      onError?.(new SymbolNotDefinedError());
      return;
    }

    const exists = await this.exists();

    if (exists) {
      onError?.(new TokenAlreadyExistsError());
      return;
    }

    const args = generateCreateArgs({ ...params, tokenType: this.tokenType, symbol: this.symbol });

    const fee = await this.getCreationFee();

    return bondContract.network(this.chainId).write({
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
