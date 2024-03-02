import { isAddress, maxUint256 } from 'viem';
import { CONTRACT_ADDRESSES, SdkSupportedChainIds, TokenType } from '../constants/contracts';
import { bondContract, erc1155Contract, erc20Contract } from '../contracts';
import { WalletNotConnectedError } from '../errors/sdk.errors';
import { WRAPPED_NATIVE_TOKENS } from '../exports';
import { TradeType } from '../types';
import { ApproveBondParams, BondApprovedParams, BuyParams, SellParams } from '../types/bond.types';
import { TokenHelperConstructorParams } from '../types/token.types';
import { computeCreate2Address } from '../utils/addresses';
import { ClientHelper } from './ClientHelper';

export class TokenHelper<T extends TokenType> {
  private tokenAddress: `0x${string}`;
  protected clientHelper: ClientHelper;
  protected symbol?: string;
  protected tokenType: T;
  protected chainId: SdkSupportedChainIds;

  constructor(params: TokenHelperConstructorParams) {
    const { symbolOrAddress, chainId, tokenType } = params;

    if (isAddress(symbolOrAddress)) {
      this.tokenAddress = symbolOrAddress;
    } else {
      this.tokenAddress = computeCreate2Address(chainId, tokenType, symbolOrAddress);
      this.symbol = symbolOrAddress;
    }

    this.chainId = chainId;
    this.tokenType = tokenType as T;
    this.clientHelper = new ClientHelper(chainId);
  }

  protected async getConnectedWalletAddress() {
    const connectedAddress = await this.clientHelper.getConnectedAddress();
    if (!connectedAddress) throw new WalletNotConnectedError();
    return connectedAddress;
  }

  protected async tokenToApprove(tradeType: TradeType) {
    return tradeType === 'buy' ? this.getTokenAddress() : await this.getReserveTokenAddress();
  }

  protected async bondContractApproved(params: BondApprovedParams<T>) {
    const { tradeType, walletAddress } = params;
    const tokenToCheck = await this.tokenToApprove(tradeType);

    if (this.tokenType === 'ERC1155') {
      return erc1155Contract.network(this.chainId).read({
        tokenAddress: tokenToCheck,
        functionName: 'isApprovedForAll',
        args: [walletAddress, CONTRACT_ADDRESSES.BOND[this.chainId]],
      });
    }

    let amountToSpend = maxUint256;
    if ('amountToSpend' in params && params?.amountToSpend !== undefined) {
      amountToSpend = params.amountToSpend;
    }

    const allowance = await erc20Contract.network(this.chainId).read({
      tokenAddress: tokenToCheck,
      functionName: 'allowance',
      args: [walletAddress, CONTRACT_ADDRESSES.BOND[this.chainId]],
    });

    return allowance >= amountToSpend;
  }

  protected async approveBondContract(params: ApproveBondParams<T>) {
    const { tradeType } = params;
    const tokenToCheck = await this.tokenToApprove(tradeType);

    if (this.tokenType === 'ERC1155') {
      return erc1155Contract.network(this.chainId).write({
        tokenAddress: tokenToCheck,
        functionName: 'setApprovalForAll',
        args: [CONTRACT_ADDRESSES.BOND[this.chainId], true],
      });
    } else {
      let amountToSpend = maxUint256;

      if ('amountToSpend' in params && params?.amountToSpend !== undefined) {
        amountToSpend = params.amountToSpend;
      }

      return erc20Contract.network(this.chainId).write({
        tokenAddress: tokenToCheck,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.BOND[this.chainId], amountToSpend],
      });
    }
  }

  protected getCreationFee() {
    return bondContract.network(this.chainId).read({
      functionName: 'creationFee',
      args: [],
    });
  }

  protected async zapAvailable() {
    const { reserveToken } = await this.getTokenBond();
    const reserveIsWrapped = WRAPPED_NATIVE_TOKENS[this.chainId].tokenAddress === reserveToken;
    return reserveIsWrapped;
  }

  public exists() {
    return bondContract.network(this.chainId).read({
      functionName: 'exists',
      args: [this.tokenAddress],
    });
  }

  public async getReserveTokenAddress() {
    const { reserveToken } = await this.getTokenBond();
    return reserveToken;
  }

  public getTokenAddress() {
    return this.tokenAddress;
  }

  public getDetail() {
    return bondContract.network(this.chainId).read({
      functionName: 'getDetail',
      args: [this.tokenAddress],
    });
  }

  public async getTokenBond() {
    const [creator, mintRoyalty, burnRoyalty, createdAt, reserveToken, reserveBalance] = await bondContract
      .network(this.chainId)
      .read({
        functionName: 'tokenBond',
        args: [this.tokenAddress],
      });

    return {
      creator,
      mintRoyalty,
      burnRoyalty,
      createdAt,
      reserveToken,
      reserveBalance,
    };
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

  public getSellEstimation(amount: bigint) {
    return bondContract.network(this.chainId).read({
      functionName: 'getRefundForTokens',
      args: [this.tokenAddress, amount],
    });
  }

  public getBuyEstimation(amount: bigint) {
    return bondContract.network(this.chainId).read({
      functionName: 'getReserveForToken',
      args: [this.tokenAddress, amount],
    });
  }

  public async buy(params: BuyParams) {
    const { tokensToMint, slippage = 0, recipient } = params;

    const connectedAddress = await this.getConnectedWalletAddress();

    const bondApproved = await this.bondContractApproved({
      walletAddress: connectedAddress,
      amountToSpend: tokensToMint,
      tradeType: 'buy',
    });

    if (!bondApproved) {
      await this.approveBondContract({
        tradeType: 'buy',
        amountToSpend: tokensToMint,
      } as ApproveBondParams<T>);
    }

    const [estimatedOutcome] = await this.getBuyEstimation(tokensToMint);
    const maxReserveAmount = estimatedOutcome + (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

    return bondContract.network(this.chainId).write({
      functionName: 'mint',
      args: [this.tokenAddress, tokensToMint, maxReserveAmount, recipient || connectedAddress],
    });
  }

  public async sell(params: SellParams) {
    const { tokensToBurn, slippage = 0, recipient } = params;

    const connectedAddress = await this.getConnectedWalletAddress();

    const bondApproved = await this.bondContractApproved({
      walletAddress: connectedAddress,
      amountToSpend: tokensToBurn,
      tradeType: 'sell',
    } as BondApprovedParams<T>);

    if (!bondApproved) {
      await this.approveBondContract({
        tradeType: 'sell',
        amountToSpend: tokensToBurn,
      } as ApproveBondParams<T>);
    }

    const [estimatedOutcome] = await this.getSellEstimation(tokensToBurn);
    const maxReserveAmount = estimatedOutcome - (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

    return bondContract.network(this.chainId).write({
      functionName: 'burn',
      args: [this.tokenAddress, tokensToBurn, maxReserveAmount, recipient || connectedAddress],
    });
  }
}
