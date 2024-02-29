import { isAddress } from 'viem';
import { ContractChainType, TokenType } from '../constants/contracts';
import { GenericWriteParams } from '../types';
import { computeCreate2Address } from '../utils/addresses';
import { CreateTokenParams, generateCreateArgs } from '../utils/bond';
import { ClientHelper } from './ClientHelper';
import { bondContract } from '../contracts';

export type GenericTokenHelperConstructorParams = {
  symbolOrAddress: string;
  chainId: ContractChainType;
  tokenType: TokenType;
};

type BuySellCommonParams = {
  recipient?: `0x${string}`;
  slippage?: number;
};

type BuyParams = BuySellCommonParams & {
  tokensToMint: bigint;
};

type SellParams = BuySellCommonParams & {
  tokensToBurn: bigint;
};

export class GenericTokenHelper {
  private tokenAddress: `0x${string}`;
  private tokenType: TokenType;
  private clientHelper: ClientHelper;
  protected chainId: ContractChainType;

  constructor(params: GenericTokenHelperConstructorParams) {
    const { symbolOrAddress, chainId, tokenType } = params;

    if (isAddress(symbolOrAddress)) {
      this.tokenAddress = symbolOrAddress;
    } else {
      this.tokenAddress = computeCreate2Address(chainId, tokenType, symbolOrAddress);
    }

    this.chainId = chainId;
    this.tokenType = tokenType;
    this.clientHelper = new ClientHelper(chainId, 'GenericTokenHelper');
  }

  public getTokenAddress() {
    return this.tokenAddress;
  }

  public exists() {
    return bondContract.network(this.chainId).read({
      functionName: 'exists',
      args: [this.tokenAddress],
    });
  }

  public getDetail() {
    return bondContract.network(this.chainId).read({
      functionName: 'getDetail',
      args: [this.tokenAddress],
    });
  }

  public getTokenBond(): Promise<
    readonly [
      creator: `0x${string}`,
      mintRoyalty: number,
      burnRoyalty: number,
      createdAt: number,
      reserveToken: `0x${string}`,
      reserveBalance: bigint,
    ]
  > {
    return bondContract.network(this.chainId).read({
      functionName: 'tokenBond',
      args: [this.tokenAddress],
    });
  }

  public getSteps() {
    return bondContract.network(this.chainId).read({
      functionName: 'getSteps',
      args: [this.tokenAddress],
    });
  }

  public getMaxSupply() {
    return bondContract.network(this.chainId).read({
      functionName: 'maxSupply',
      args: [this.tokenAddress],
    });
  }

  public getPriceForNextMint() {
    return bondContract.network(this.chainId).read({
      functionName: 'priceForNextMint',
      args: [this.tokenAddress],
    });
  }

  public estimateSell(amount: bigint) {
    return bondContract.network(this.chainId).read({
      functionName: 'getRefundForTokens',
      args: [this.tokenAddress, amount],
    });
  }

  public estimateBuy(amount: bigint) {
    return bondContract.network(this.chainId).read({
      functionName: 'getReserveForToken',
      args: [this.tokenAddress, amount],
    });
  }

  public async buy(params: BuyParams) {
    const { tokensToMint, slippage = 0, recipient } = params;
    const [estimatedOutcome] = await this.estimateBuy(tokensToMint);
    const maxReserveAmount = estimatedOutcome + (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

    const connectedAddress = await this.clientHelper.getConnectedAddress();

    const recipientAddress = recipient || connectedAddress;

    return bondContract.network(this.chainId).write({
      functionName: 'mint',
      args: [this.tokenAddress, tokensToMint, maxReserveAmount, recipientAddress],
    });
  }

  public async sell(params: SellParams) {
    const { tokensToBurn, slippage = 0, recipient } = params;
    const [estimatedOutcome] = await this.estimateSell(tokensToBurn);
    const maxReserveAmount = estimatedOutcome - (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

    const connectedAddress = await this.clientHelper.getConnectedAddress();

    if (!connectedAddress) {
      throw new Error('Connected address not found');
    }
    const recipientAddress = recipient || connectedAddress;

    return bondContract.network(this.chainId).write({
      functionName: 'burn',
      args: [this.tokenAddress, tokensToBurn, maxReserveAmount, recipientAddress],
    });
  }

  public async create(
    params: Omit<CreateTokenParams, 'tokenType'> &
      Pick<GenericWriteParams, 'onError' | 'onRequestSignature' | 'onSigned' | 'onSuccess'>,
  ) {
    const args = generateCreateArgs({ ...params, tokenType: this.tokenType });
    const { onError, onRequestSignature, onSigned, onSuccess } = params;

    const fee = await bondContract.network(this.chainId).read({
      functionName: 'creationFee',
      args: [],
    });

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
