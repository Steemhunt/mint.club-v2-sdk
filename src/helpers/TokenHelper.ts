import MerkleTree from 'merkletreejs';
import { Chain, isAddress, keccak256, maxUint256 } from 'viem';
import { SdkSupportedChainIds, TokenType, getMintClubContractAddress } from '../constants/contracts';
import { bondContract, erc1155Contract, erc20Contract } from '../contracts';
import {
  AirdropContainsInvalidWalletError,
  SymbolNotDefinedError,
  TokenAlreadyExistsError,
  WalletNotConnectedError,
} from '../errors/sdk.errors';
import { WRAPPED_NATIVE_TOKENS, getChain } from '../exports';
import {
  ApproveBondParams,
  BondApprovedParams,
  BuySellCommonParams,
  CreateERC1155TokenParams,
  CreateERC20TokenParams,
  TransferCommonParams,
} from '../types/bond.types';
import { TokenCreateAirdropParams, TokenHelperConstructorParams } from '../types/token.types';
import { CommonWriteParams, TradeType } from '../types/transactions.types';
import { wei } from '../utils';
import { computeCreate2Address } from '../utils/addresses';
import { generateCreateArgs } from '../utils/bond';
import { Airdrop } from './AirdropHelper';
import { Client } from './ClientHelper';
import { Ipfs } from './IpfsHelper';

export class Token<T extends TokenType> {
  private tokenAddress: `0x${string}`;
  protected clientHelper: Client;
  protected airdropHelper: Airdrop;
  protected ipfsHelper: Ipfs;
  protected symbol?: string;
  protected tokenType: T;
  protected chain: Chain;
  protected chainId: SdkSupportedChainIds;

  constructor(params: TokenHelperConstructorParams) {
    const { symbolOrAddress, chainId, tokenType } = params;

    if (isAddress(symbolOrAddress)) {
      this.tokenAddress = symbolOrAddress;
    } else {
      this.tokenAddress = computeCreate2Address(chainId, tokenType, symbolOrAddress);
      this.symbol = symbolOrAddress;
    }

    this.chain = getChain(chainId);
    this.chainId = chainId;
    this.tokenType = tokenType as T;
    this.clientHelper = new Client();
    this.ipfsHelper = new Ipfs();
    this.airdropHelper = new Airdrop(this.chainId);
  }

  protected async getConnectedWalletAddress() {
    const connectedAddress = await this.clientHelper.account();
    if (!connectedAddress) throw new WalletNotConnectedError();
    return connectedAddress;
  }

  protected async tokenToApprove(tradeType: TradeType) {
    return tradeType === 'buy' ? await this.getReserveTokenAddress() : this.getTokenAddress();
  }

  public async bondContractApproved(params: BondApprovedParams<T>) {
    const { tradeType, walletAddress } = params;
    const tokenToApprove = await this.tokenToApprove(tradeType);

    if (this.tokenType === 'ERC1155' && tradeType === 'sell') {
      return erc1155Contract.network(this.chainId).read({
        tokenAddress: this.tokenAddress,
        functionName: 'isApprovedForAll',
        args: [walletAddress, getMintClubContractAddress('BOND', this.chainId)],
      });
    }

    let amountToSpend = maxUint256;
    if ('amountToSpend' in params && params?.amountToSpend !== undefined) {
      amountToSpend = params.amountToSpend;
    }

    const allowance = await erc20Contract.network(this.chainId).read({
      tokenAddress: tokenToApprove,
      functionName: 'allowance',
      args: [walletAddress, getMintClubContractAddress('BOND', this.chainId)],
    });

    return allowance >= amountToSpend;
  }

  private async approveBond(params: ApproveBondParams<T>) {
    const { tradeType, onAllowanceSignatureRequest, onAllowanceSigned, onAllowanceSuccess } = params;
    const tokenToCheck = await this.tokenToApprove(tradeType);

    if (this.tokenType === 'ERC1155' && tradeType === 'sell') {
      return erc1155Contract.network(this.chainId).write({
        ...params,
        onSignatureRequest: onAllowanceSignatureRequest,
        onSigned: onAllowanceSigned,
        onSuccess: onAllowanceSuccess,
        tokenAddress: this.tokenAddress,
        functionName: 'setApprovalForAll',
        args: [getMintClubContractAddress('BOND', this.chainId), true],
      });
    } else {
      let amountToSpend = maxUint256;

      if ('allowanceAmount' in params && params?.allowanceAmount !== undefined) {
        amountToSpend = params.allowanceAmount;
      }

      return erc20Contract.network(this.chainId).write({
        ...params,
        onSignatureRequest: onAllowanceSignatureRequest,
        onSigned: onAllowanceSigned,
        onSuccess: onAllowanceSuccess,
        tokenAddress: tokenToCheck,
        functionName: 'approve',
        args: [getMintClubContractAddress('BOND', this.chainId), amountToSpend],
      });
    }
  }

  protected getCreationFee() {
    return bondContract.network(this.chainId).read({
      functionName: 'creationFee',
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

  public async getReserveToken() {
    const { reserveToken } = await this.getTokenBond();
    const [name, symbol, decimals] = await Promise.all([
      erc20Contract.network(this.chainId).read({ tokenAddress: reserveToken, functionName: 'name' }),
      erc20Contract.network(this.chainId).read({ tokenAddress: reserveToken, functionName: 'symbol' }),
      erc20Contract.network(this.chainId).read({ tokenAddress: reserveToken, functionName: 'decimals' }),
    ]);

    return {
      address: reserveToken,
      name,
      symbol,
      decimals,
    };
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

  protected async checkAndPrepareCreateArgs(
    params: (CreateERC20TokenParams | CreateERC1155TokenParams) & Omit<CommonWriteParams, 'value'>,
  ) {
    if (!this.symbol) {
      throw new SymbolNotDefinedError();
    }

    const exists = await this.exists();

    if (exists) {
      throw new TokenAlreadyExistsError();
    }

    const args = generateCreateArgs({ ...params, tokenType: this.tokenType, symbol: this.symbol });
    const fee = await this.getCreationFee();

    return { args, fee };
  }

  public async buy(
    params: BuySellCommonParams & {
      allowanceAmount?: bigint;
    },
  ) {
    const { amount, slippage = 0, recipient, onError } = params;
    try {
      const connectedAddress = await this.getConnectedWalletAddress();

      const [estimatedOutcome, royalty] = await this.getBuyEstimation(amount);
      const maxReserveAmount = estimatedOutcome + (estimatedOutcome * BigInt(slippage * 100)) / 10_000n + royalty;

      const bondApproved = await this.bondContractApproved({
        walletAddress: connectedAddress,
        amountToSpend: maxReserveAmount,
        tradeType: 'buy',
      });

      if (!bondApproved) {
        return this.approveBond({
          ...params,
          tradeType: 'buy',
          amountToSpend: maxReserveAmount,
        } as ApproveBondParams<T, 'buy'>);
      }

      return bondContract.network(this.chainId).write({
        ...params,
        functionName: 'mint',
        args: [this.tokenAddress, amount, maxReserveAmount, recipient || connectedAddress],
      });
    } catch (e) {
      onError?.(e);
    }
  }

  public async sell(
    params: BuySellCommonParams & {
      allowanceAmount?: T extends 'ERC20' ? bigint : never;
    },
  ) {
    const { amount, slippage = 0, recipient } = params;

    const connectedAddress = await this.getConnectedWalletAddress();

    const [estimatedOutcome, royalty] = await this.getSellEstimation(amount);
    const maxReserveAmount = estimatedOutcome - (estimatedOutcome * BigInt(slippage * 100)) / 10_000n - royalty;

    const bondApproved = await this.bondContractApproved({
      walletAddress: connectedAddress,
      amountToSpend: amount,
      tradeType: 'sell',
    } as BondApprovedParams<T>);

    if (!bondApproved) {
      return this.approveBond({
        ...params,
        tradeType: 'sell',
        amountToSpend: amount,
      } as ApproveBondParams<T, 'sell'>);
    }

    return bondContract.network(this.chainId).write({
      ...params,
      functionName: 'burn',
      args: [this.tokenAddress, amount, maxReserveAmount, recipient || connectedAddress],
    });
  }

  public async transfer(params: TransferCommonParams) {
    const { amount, recipient } = params;

    if (this.tokenType === 'ERC20') {
      return erc20Contract.network(this.chainId).write({
        ...params,
        tokenAddress: this.getTokenAddress(),
        functionName: 'transfer',
        args: [recipient, amount],
      });
    } else {
      const connectedAddress = await this.getConnectedWalletAddress();
      return erc1155Contract.network(this.chainId).write({
        ...params,
        tokenAddress: this.getTokenAddress(),
        functionName: 'safeTransferFrom',
        args: [connectedAddress, recipient, 0n, amount, '0x'],
      });
    }
  }

  public async createAirdrop(params: TokenCreateAirdropParams) {
    const { title, filebaseApiKey, wallets, amountPerClaim: _amountPerClaim, startTime, endTime } = params;

    if (wallets.some((address) => !isAddress(address))) {
      throw new AirdropContainsInvalidWalletError();
    }

    const isERC20 = this.tokenType === 'ERC20';
    const walletCount = wallets.length;
    let decimals = 0;

    if (this.tokenType === 'ERC20') {
      decimals = await erc20Contract.network(this.chainId).read({
        tokenAddress: this.getTokenAddress(),
        functionName: 'decimals',
      });
    }

    const amountPerClaim = wei(_amountPerClaim, decimals);

    const totalAmount = BigInt(amountPerClaim) * BigInt(walletCount);
    // TODO: check allowance

    const leaves = wallets.map((address) => keccak256(address));
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });
    const merkleRoot = `0x${tree.getRoot().toString('hex')}` as const;

    const json = JSON.stringify(wallets, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const ipfsCID = await this.ipfsHelper.add(filebaseApiKey, blob);

    return this.airdropHelper.createDistribution({
      token: this.tokenAddress,
      isERC20,
      amountPerClaim,
      walletCount,
      startTime: startTime ? Math.floor(startTime.getTime() / 1000) : 0,
      endTime: Math.floor(endTime.getTime() / 1000),
      merkleRoot,
      title,
      ipfsCID,
    });
  }
}
