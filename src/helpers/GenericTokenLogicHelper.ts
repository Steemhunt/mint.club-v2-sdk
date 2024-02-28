import { isAddress } from 'viem';
import { ContractChainType, TokenType } from '../constants/contracts';
import { computeCreate2Address } from '../utils/addresses';
import { GenericContractLogic } from '../contracts/GenericContractLogic';
import { GenericContract, SupportedAbiType } from '../contracts/GenericContract';

export type GenericTokenLogicHelperConstructorParams = {
  symbolOrAddress: string;
  chainId: ContractChainType;
  tokenType: TokenType;
  logicInstance: any;
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

export class GenericTokenLogicHelper {
  private tokenAddress: `0x${string}`;
  private bondContract = new GenericContract('BOND');

  protected chainId: ContractChainType;
  protected logicInstance: GenericContractLogic<SupportedAbiType>;

  constructor(params: GenericTokenLogicHelperConstructorParams) {
    const { symbolOrAddress, chainId, tokenType, logicInstance } = params;

    if (isAddress(symbolOrAddress)) {
      this.tokenAddress = symbolOrAddress;
    } else {
      this.tokenAddress = computeCreate2Address(chainId, tokenType, symbolOrAddress);
    }

    this.chainId = chainId;
    this.logicInstance = logicInstance;
  }

  protected getWalletClient() {
    return this.logicInstance.getWalletClient();
  }

  protected getPublicClient() {
    return this.logicInstance.getPublicClient();
  }

  public getAddress() {
    return this.tokenAddress;
  }

  public exists() {
    return this.bondContract.network(this.chainId).read({
      functionName: 'exists',
      args: [this.tokenAddress],
    });
  }

  public getDetail() {
    return this.bondContract.network(this.chainId).read({
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
    return this.bondContract.network(this.chainId).read({
      functionName: 'tokenBond',
      args: [this.tokenAddress],
    });
  }

  public getSteps() {
    return this.bondContract.network(this.chainId).read({
      functionName: 'getSteps',
      args: [this.tokenAddress],
    });
  }

  public getMaxSupply() {
    return this.bondContract.network(this.chainId).read({
      functionName: 'maxSupply',
      args: [this.tokenAddress],
    });
  }

  public getPriceForNextMint() {
    return this.bondContract.network(this.chainId).read({
      functionName: 'priceForNextMint',
      args: [this.tokenAddress],
    });
  }

  public estimateSell(amount: bigint) {
    return this.bondContract.network(this.chainId).read({
      functionName: 'getRefundForTokens',
      args: [this.tokenAddress, amount],
    });
  }

  public estimateBuy(amount: bigint) {
    return this.bondContract.network(this.chainId).read({
      functionName: 'getReserveForToken',
      args: [this.tokenAddress, amount],
    });
  }

  public async buy(params: BuyParams) {
    const { tokensToMint, slippage = 0, recipient } = params;
    const [estimatedOutcome] = await this.estimateBuy(tokensToMint);
    const maxReserveAmount = estimatedOutcome + (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

    if (!this.getWalletClient()) {
      throw new Error('Wallet client not found');
    }

    const [connectedAddress] = (await this.getWalletClient()?.requestAddresses()) || [];

    if (!connectedAddress) {
      throw new Error('Connected address not found');
    }

    const recipientAddress = recipient || connectedAddress;

    return this.bondContract.network(this.chainId).write({
      functionName: 'mint',
      args: [this.tokenAddress, tokensToMint, maxReserveAmount, recipientAddress],
    });
  }

  public async sell(params: SellParams) {
    const { tokensToBurn, slippage = 0, recipient } = params;
    const [estimatedOutcome] = await this.estimateSell(tokensToBurn);
    const maxReserveAmount = estimatedOutcome - (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

    if (!this.getWalletClient()) {
      throw new Error('Wallet client not found');
    }

    const [connectedAddress] = (await this.getWalletClient()?.requestAddresses()) || [];

    if (!connectedAddress) {
      throw new Error('Connected address not found');
    }
    const recipientAddress = recipient || connectedAddress;

    return this.bondContract.network(this.chainId).write({
      functionName: 'burn',
      args: [this.tokenAddress, tokensToBurn, maxReserveAmount, recipientAddress],
    });
  }
}
