import fetch from 'cross-fetch';
import { MerkleTree } from 'merkletreejs';
import { Chain, isAddress, keccak256, maxUint256 } from 'viem';
import { kaia } from 'viem/chains';
import { ContractNames, SdkSupportedChainIds, TokenType, getMintClubContractAddress } from '../constants/contracts';
import { FALLBACK_USD_MAP } from '../constants/usd/fallbackUsdMap';
import { bondContract, erc1155Contract, erc20Contract, zapContract } from '../contracts';
import {
  AirdropContainsInvalidWalletError,
  MetadataValidationError,
  SymbolNotDefinedError,
  TokenAlreadyExistsError,
  WalletNotConnectedError,
} from '../errors/sdk.errors';
import { WRAPPED_NATIVE_TOKENS, getChain, toNumber } from '../exports';
import {
  ApproveBondParams,
  BondApprovedParams,
  BuySellCommonParams,
  CreateERC1155TokenParams,
  CreateERC20TokenParams,
  TransferCommonParams,
} from '../types/bond.types';
import { TokenCreateAirdropParams, TokenHelperConstructorParams } from '../types/token.types';
import { ApproveParams, CommonWriteParams, TradeType, WriteTransactionCallbacks } from '../types/transactions.types';
import { getTwentyFourHoursAgoTimestamp, wei } from '../utils';
import { computeCreate2Address } from '../utils/addresses';
import { generateCreateArgs } from '../utils/bond';
import { Airdrop } from './AirdropHelper';
import { Client } from './ClientHelper';
import { Ipfs } from './IpfsHelper';
import { Utils } from './UtilsHelper';

interface MetadataCommonParams {
  backgroundImage?: File | null;
  logo?: File | null;
  website?: string;
  distributionPlan?: string;
  creatorComment?: string;
}

interface CreateMintClubMetadataParams extends MetadataCommonParams {}

interface UpdateMintClubMetadataParams extends MetadataCommonParams {
  signature: string;
  message: string;
}

export class Token<T extends TokenType> {
  private tokenAddress: `0x${string}`;
  protected clientHelper: Client;
  protected airdropHelper: Airdrop;
  protected ipfsHelper: Ipfs;
  protected symbol?: string;
  protected tokenType: T;
  protected chain: Chain;
  protected chainId: SdkSupportedChainIds;
  protected utils: Utils;

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
    this.utils = new Utils();
  }

  protected async getConnectedWalletAddress() {
    const connectedAddress = await this.clientHelper.account();
    if (!connectedAddress) throw new WalletNotConnectedError();
    return connectedAddress;
  }

  protected async tokenToApprove(tradeType: TradeType) {
    return tradeType === 'buy' ? await this.getReserveTokenAddress() : this.getTokenAddress();
  }

  private remapUsdPricingTarget(chainId: number, tokenAddress: `0x${string}`) {
    const chainFallbacks = FALLBACK_USD_MAP[chainId];
    if (chainFallbacks) {
      const key = (Object.keys(chainFallbacks) as Array<keyof typeof chainFallbacks>).find(
        (k) => (k as string).toLowerCase() === tokenAddress.toLowerCase(),
      );
      if (key) {
        const remap = chainFallbacks[key]!;
        return { chainId: remap.network, tokenAddress: remap.address as `0x${string}` } as const;
      }
    }
    return { chainId, tokenAddress } as const;
  }

  public async bondContractApproved(params: BondApprovedParams<T>) {
    const { tradeType, walletAddress, isZap } = params;
    const tokenToApprove = await this.tokenToApprove(tradeType);

    if (this.tokenType === 'ERC1155' && tradeType === 'sell') {
      return erc1155Contract.network(this.chainId).read({
        tokenAddress: this.tokenAddress,
        functionName: 'isApprovedForAll',
        args: [walletAddress, getMintClubContractAddress(isZap ? 'ZAP' : 'BOND', this.chainId)],
      });
    }

    let amountToSpend = maxUint256;
    if ('amountToSpend' in params && params?.amountToSpend !== undefined) {
      amountToSpend = params.amountToSpend;
    }

    const allowance = await erc20Contract.network(this.chainId).read({
      tokenAddress: tokenToApprove,
      functionName: 'allowance',
      args: [walletAddress, getMintClubContractAddress(isZap ? 'ZAP' : 'BOND', this.chainId)],
    });

    return allowance >= amountToSpend;
  }

  private async contractIsApproved(params: ApproveParams<T>, contract: ContractNames) {
    const connectedAddress = await this.getConnectedWalletAddress();
    if (this.tokenType === 'ERC1155') {
      return erc1155Contract.network(this.chainId).read({
        ...params,
        tokenAddress: this.tokenAddress,
        functionName: 'isApprovedForAll',
        args: [connectedAddress, getMintClubContractAddress(contract, this.chainId)],
      });
    } else {
      let amountToSpend = maxUint256;

      if ('allowanceAmount' in params && params?.allowanceAmount !== undefined) {
        amountToSpend = params.allowanceAmount;
      }

      const allowance = await erc20Contract.network(this.chainId).read({
        ...params,
        tokenAddress: this.tokenAddress,
        functionName: 'allowance',
        args: [connectedAddress, getMintClubContractAddress(contract, this.chainId)],
      });

      return BigInt(allowance) >= amountToSpend;
    }
  }

  private approveContract(params: ApproveParams<T> & WriteTransactionCallbacks, contract: ContractNames) {
    if (this.tokenType === 'ERC1155') {
      return erc1155Contract.network(this.chainId).write({
        ...params,
        tokenAddress: this.tokenAddress,
        functionName: 'setApprovalForAll',
        args: [getMintClubContractAddress(contract, this.chainId), true],
      });
    } else {
      let amountToSpend = maxUint256;

      if ('allowanceAmount' in params && params?.allowanceAmount !== undefined) {
        amountToSpend = params.allowanceAmount;
      }

      return erc20Contract.network(this.chainId).write({
        ...params,
        tokenAddress: this.tokenAddress,
        functionName: 'approve',
        args: [getMintClubContractAddress(contract, this.chainId), amountToSpend],
      });
    }
  }

  private async approveBond(params: ApproveBondParams<T>) {
    const { isZap, tradeType, onAllowanceSignatureRequest, onAllowanceSigned, onAllowanceSuccess } = params;
    const tokenToCheck = await this.tokenToApprove(tradeType);

    if (this.tokenType === 'ERC1155' && tradeType === 'sell') {
      return erc1155Contract.network(this.chainId).write({
        ...params,
        onSignatureRequest: onAllowanceSignatureRequest,
        onSigned: onAllowanceSigned,
        onSuccess: onAllowanceSuccess,
        tokenAddress: this.tokenAddress,
        functionName: 'setApprovalForAll',
        args: [getMintClubContractAddress(isZap ? 'ZAP' : 'BOND', this.chainId), true],
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
        args: [getMintClubContractAddress(isZap ? 'ZAP' : 'BOND', this.chainId), amountToSpend],
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

  public async getReserveUsdRate(params: { blockNumber?: bigint } = {}) {
    const { blockNumber } = params;
    const reserve = await this.getReserveToken();
    // If the reserve is also a Mint Club token, always expand via its bond path first
    const reserveIsMintClub = await bondContract.network(this.chainId).read({
      functionName: 'exists',
      args: [reserve.address],
    });

    if (reserveIsMintClub) {
      const nested = await this.computeUsdRateForBondToken({
        tokenAddress: reserve.address,
        visited: new Set(),
        blockNumber,
      });
      if (nested.usdRate === null) {
        // Fallback: try DefiLlama on the reserve token itself
        if (blockNumber === undefined) {
          const llama = await this.utils.defillamaUsdRate({ chainId: this.chainId, tokenAddress: reserve.address });
          if (llama !== undefined) {
            return {
              usdRate: llama,
              reserveToken: reserve,
              path: [
                {
                  address: reserve.address as `0x${string}`,
                  method: 'defillama' as const,
                  note: 'defillama api',
                  rate: llama,
                },
              ],
            } as const;
          }
        } else {
          const ts = await this.utils.getTimestampFromBlock({ chainId: this.chainId, blockNumber });
          if (ts !== undefined) {
            const llama = await this.utils.defillamaUsdRate({
              chainId: this.chainId,
              tokenAddress: reserve.address,
              timestamp: ts,
            });
            if (llama !== undefined) {
              return {
                usdRate: llama,
                reserveToken: reserve,
                path: [
                  {
                    address: reserve.address as `0x${string}`,
                    method: 'defillama' as const,
                    note: 'defillama api',
                    rate: llama,
                  },
                ],
              } as const;
            }
          }
        }
        return { usdRate: null, reserveToken: reserve, path: nested.path } as const;
      }
      return { usdRate: nested.usdRate, reserveToken: reserve, path: nested.path } as const;
    }

    // Otherwise, use direct 1inch pricing for the non-Mint Club reserve token
    const remap = this.remapUsdPricingTarget(this.chainId, reserve.address);
    let decimalsForQuote = reserve.decimals;
    if (remap.chainId !== this.chainId || remap.tokenAddress.toLowerCase() !== reserve.address.toLowerCase()) {
      decimalsForQuote = await erc20Contract
        .network(remap.chainId as SdkSupportedChainIds)
        .read({ tokenAddress: remap.tokenAddress, functionName: 'decimals' });
    }

    const rateData = await this.utils.oneinchUsdRate({
      chainId: remap.chainId,
      tokenAddress: remap.tokenAddress,
      tokenDecimals: decimalsForQuote,
      ...(remap.chainId === this.chainId && blockNumber !== undefined ? { blockNumber } : {}),
    });

    if (!rateData) {
      // Fallback to DefiLlama for reserve token
      if (blockNumber === undefined) {
        const llama = await this.utils.defillamaUsdRate({ chainId: this.chainId, tokenAddress: reserve.address });
        if (llama !== undefined) {
          return {
            usdRate: llama,
            reserveToken: reserve,
            path: [
              {
                address: reserve.address as `0x${string}`,
                method: 'defillama' as const,
                note: 'defillama api',
                rate: llama,
              },
            ],
          } as const;
        }
      } else {
        const ts = await this.utils.getTimestampFromBlock({ chainId: this.chainId, blockNumber });
        if (ts !== undefined) {
          const llama = await this.utils.defillamaUsdRate({
            chainId: this.chainId,
            tokenAddress: reserve.address,
            timestamp: ts,
          });
          if (llama !== undefined) {
            return {
              usdRate: llama,
              reserveToken: reserve,
              path: [
                {
                  address: reserve.address as `0x${string}`,
                  method: 'defillama' as const,
                  note: 'defillama api',
                  rate: llama,
                },
              ],
            } as const;
          }
        }
      }
      return { usdRate: null, reserveToken: reserve, path: [] } as const;
    }
    const { rate, stableCoin } = rateData;
    return {
      usdRate: rate,
      reserveToken: reserve,
      path: [
        { address: reserve.address as `0x${string}`, method: 'oneinch' as const, stableSymbol: stableCoin.symbol },
      ],
    } as const;
  }

  private async computeUsdRateForBondToken(params: {
    tokenAddress: `0x${string}`;
    visited: Set<string>;
    blockNumber?: bigint;
  }): Promise<{
    usdRate: number | null;
    path: Array<
      | {
          address: `0x${string}`;
          method: 'oneinch' | 'defillama';
          stableSymbol?: string;
          note?: string;
          reserveSymbol?: string;
          rate?: number;
        }
      | {
          address: `0x${string}`;
          method: 'bond';
          reservePerToken: number;
          note?: string;
          reserveSymbol?: string;
          reserveUsdRate?: number;
        }
    >;
  }> {
    const { tokenAddress, visited, blockNumber } = params;
    if (visited.has(tokenAddress.toLowerCase())) return { usdRate: null, path: [] };
    visited.add(tokenAddress.toLowerCase());

    // Check if the provided tokenAddress is a Mint Club token
    const exists = await bondContract.network(this.chainId).read({
      functionName: 'exists',
      args: [tokenAddress],
    });
    if (!exists) return { usdRate: null, path: [] };

    // Get its reserve token and price per 1 token in reserve units
    const [pricePerTokenWei, bondInfo] = await Promise.all([
      bondContract.network(this.chainId).read({ functionName: 'priceForNextMint', args: [tokenAddress] }),
      bondContract.network(this.chainId).read({ functionName: 'tokenBond', args: [tokenAddress] }),
    ]);

    const reserveTokenAddress = bondInfo[4] as `0x${string}`; // reserveToken
    const [reserveTokenDecimals, reserveTokenSymbol] = await Promise.all([
      erc20Contract.network(this.chainId).read({
        tokenAddress: reserveTokenAddress,
        functionName: 'decimals',
      }),
      erc20Contract.network(this.chainId).read({
        tokenAddress: reserveTokenAddress,
        functionName: 'symbol',
      }),
    ]);

    const reservePerToken = toNumber(pricePerTokenWei, reserveTokenDecimals);

    // Try to price the reserve token via 1inch
    const remap = this.remapUsdPricingTarget(this.chainId, reserveTokenAddress);
    let decimalsForQuote = reserveTokenDecimals;
    if (remap.chainId !== this.chainId || remap.tokenAddress.toLowerCase() !== reserveTokenAddress.toLowerCase()) {
      decimalsForQuote = await erc20Contract
        .network(remap.chainId as SdkSupportedChainIds)
        .read({ tokenAddress: remap.tokenAddress, functionName: 'decimals' });
    }
    const reserveRateData = await this.utils.oneinchUsdRate({
      chainId: remap.chainId,
      tokenAddress: remap.tokenAddress,
      tokenDecimals: decimalsForQuote,
      ...(remap.chainId === this.chainId && blockNumber !== undefined ? { blockNumber } : {}),
    });
    if (reserveRateData) {
      const { rate, stableCoin } = reserveRateData!;
      return {
        usdRate: rate * reservePerToken,
        path: [
          {
            address: tokenAddress,
            method: 'bond',
            reservePerToken,
            note: 'bond price in reserve',
            reserveSymbol: reserveTokenSymbol,
            reserveUsdRate: rate,
          },
          {
            address: reserveTokenAddress,
            method: 'oneinch',
            stableSymbol: stableCoin.symbol,
            note: 'dex quote to stable',
            reserveSymbol: reserveTokenSymbol,
            rate: rate,
          },
        ],
      };
    }

    // Fallback: try DefiLlama on the reserve token
    if (blockNumber === undefined) {
      const llama = await this.utils.defillamaUsdRate({ chainId: this.chainId, tokenAddress: reserveTokenAddress });
      if (llama !== undefined) {
        return {
          usdRate: llama * reservePerToken,
          path: [
            {
              address: tokenAddress,
              method: 'bond',
              reservePerToken,
              note: 'bond price in reserve',
              reserveSymbol: reserveTokenSymbol,
              reserveUsdRate: llama,
            },
            {
              address: reserveTokenAddress,
              method: 'defillama' as const,
              note: 'defillama api',
              rate: llama,
            },
          ],
        };
      }
    } else {
      const ts = await this.utils.getTimestampFromBlock({ chainId: this.chainId, blockNumber });
      if (ts !== undefined) {
        const llama = await this.utils.defillamaUsdRate({
          chainId: this.chainId,
          tokenAddress: reserveTokenAddress,
          timestamp: ts,
        });
        if (llama !== undefined) {
          return {
            usdRate: llama * reservePerToken,
            path: [
              {
                address: tokenAddress,
                method: 'bond',
                reservePerToken,
                note: 'bond price in reserve',
                reserveSymbol: reserveTokenSymbol,
                reserveUsdRate: llama,
              },
              {
                address: reserveTokenAddress,
                method: 'defillama' as const,
                note: 'defillama api',
                rate: llama,
              },
            ],
          };
        }
      }
    }

    // If reserve token is also a Mint Club token, recurse
    const nested = await this.computeUsdRateForBondToken({ tokenAddress: reserveTokenAddress, visited, blockNumber });
    if (nested.usdRate === null) return { usdRate: null, path: nested.path };
    return {
      usdRate: nested.usdRate * reservePerToken,
      path: [
        {
          address: tokenAddress,
          method: 'bond',
          reservePerToken,
          note: 'bond price in reserve',
          reserveSymbol: reserveTokenSymbol,
          reserveUsdRate: nested.usdRate ?? undefined,
        },
        ...nested.path,
      ],
    };
  }

  public async getUsdRate(params: { amount: number; blockNumber?: bigint } = { amount: 1 }) {
    const { amount, blockNumber } = params;

    // 1) Special handling for Kaia
    if (this.chainId === kaia.id) {
      return this.getUsdRateOnKaia({ amount, blockNumber });
    }

    const isMintClub = await this.exists();
    if (isMintClub) {
      // 2) Mint Club tokens via bond path
      const mintClubRate = await this.getUsdRateViaBond({ amount, blockNumber });
      if (!!mintClubRate.usdRate) {
        return mintClubRate;
      } // Even if Mint Club doesn't have any reserves, the token could have liquidity on other DEXes
      // So keep fallback to non-Mint Club tokens
    }

    // 3) Non-Mint Club tokens priced directly
    return this.getUsdRateForNonMintClub({ amount, blockNumber });
  }

  private async getUsdRateOnKaia(params: { amount: number; blockNumber?: bigint }) {
    const { amount, blockNumber } = params;
    const price = await this.utils.getSwapscannerPrice(this.tokenAddress);
    if (price !== undefined) {
      return { usdRate: price, reserveToken: null, path: [] } as const;
    }

    if (blockNumber === undefined) {
      const llama = await this.utils.defillamaUsdRate({ chainId: this.chainId, tokenAddress: this.tokenAddress });
      if (llama !== undefined) {
        return {
          usdRate: llama * amount,
          reserveToken: null,
          path: [{ address: this.tokenAddress, method: 'defillama' as const, note: 'defillama api', rate: llama }],
        } as const;
      }
    } else {
      const ts = await this.utils.getTimestampFromBlock({ chainId: this.chainId, blockNumber });
      if (ts !== undefined) {
        const llama = await this.utils.defillamaUsdRate({
          chainId: this.chainId,
          tokenAddress: this.tokenAddress,
          timestamp: ts,
        });
        if (llama !== undefined) {
          return {
            usdRate: llama * amount,
            reserveToken: null,
            path: [{ address: this.tokenAddress, method: 'defillama' as const, note: 'defillama api', rate: llama }],
          } as const;
        }
      }
    }

    return { usdRate: null, reserveToken: null, path: [] } as const;
  }

  private async getUsdRateForNonMintClub(params: { amount: number; blockNumber?: bigint }) {
    const { amount, blockNumber } = params;

    const tokenDecimals = await erc20Contract.network(this.chainId).read({
      tokenAddress: this.tokenAddress,
      functionName: 'decimals',
    });

    const remap = this.remapUsdPricingTarget(this.chainId, this.tokenAddress);
    let decimalsForQuote = tokenDecimals;
    if (remap.chainId !== this.chainId || remap.tokenAddress.toLowerCase() !== this.tokenAddress.toLowerCase()) {
      decimalsForQuote = await erc20Contract
        .network(remap.chainId as SdkSupportedChainIds)
        .read({ tokenAddress: remap.tokenAddress, functionName: 'decimals' });
    }

    const rateData = await this.utils.oneinchUsdRate({
      chainId: remap.chainId,
      tokenAddress: remap.tokenAddress,
      tokenDecimals: decimalsForQuote,
      ...(remap.chainId === this.chainId && blockNumber !== undefined ? { blockNumber } : {}),
    });

    if (!rateData) {
      // Fallback to DefiLlama
      if (blockNumber === undefined) {
        const llama = await this.utils.defillamaUsdRate({ chainId: this.chainId, tokenAddress: this.tokenAddress });
        if (llama !== undefined) {
          return {
            usdRate: llama * amount,
            reserveToken: null,
            path: [{ address: this.tokenAddress, method: 'defillama' as const, note: 'defillama api', rate: llama }],
          } as const;
        }

        // Last fallback: 0x Swap live quote (no historical support)
        const ox = await this.utils.zeroXUsdRate({
          chainId: remap.chainId,
          tokenAddress: remap.tokenAddress,
          tokenDecimals: decimalsForQuote,
          blockNumber,
        });

        if (ox) {
          const path = [
            {
              address: this.tokenAddress,
              method: 'oneinch' as const,
              stableSymbol: ox.stableCoin.symbol,
              note: '0x quote to stable',
              rate: ox.rate,
            },
          ];
          return { usdRate: ox.rate * amount, reserveToken: null, path } as const;
        }
      } else {
        const ts = await this.utils.getTimestampFromBlock({ chainId: this.chainId, blockNumber });
        if (ts !== undefined) {
          const llama = await this.utils.defillamaUsdRate({
            chainId: this.chainId,
            tokenAddress: this.tokenAddress,
            timestamp: ts,
          });
          if (llama !== undefined) {
            return {
              usdRate: llama * amount,
              reserveToken: null,
              path: [{ address: this.tokenAddress, method: 'defillama' as const, note: 'defillama api', rate: llama }],
            } as const;
          }
        }
      }
      return { usdRate: null, reserveToken: null, path: [] } as const;
    }

    const path = [
      {
        address: this.tokenAddress,
        method: 'oneinch' as const,
        stableSymbol: rateData.stableCoin.symbol,
        note: 'dex quote to stable',
        rate: rateData.rate,
      },
    ];

    return { usdRate: rateData.rate * amount, reserveToken: null, path } as const;
  }

  private async getUsdRateViaBond(params: { amount: number; blockNumber?: bigint }) {
    const { amount, blockNumber } = params;

    const { usdRate: reserveUsdRate, reserveToken, path: reservePath } = await this.getReserveUsdRate({ blockNumber });
    if (reserveUsdRate === null) {
      // Final fallback to DefiLlama for the token itself
      if (blockNumber === undefined) {
        const llama = await this.utils.defillamaUsdRate({ chainId: this.chainId, tokenAddress: this.tokenAddress });
        if (llama !== undefined) {
          return {
            usdRate: llama * amount,
            reserveToken: null,
            path: [{ address: this.tokenAddress, method: 'defillama' as const, note: 'defillama api', rate: llama }],
          } as const;
        }

        // Last fallback: 0x Swap live quote for token itself (ERC20 only)
        if (this.tokenType === 'ERC20') {
          const tokenDecimals = await erc20Contract.network(this.chainId).read({
            tokenAddress: this.tokenAddress,
            functionName: 'decimals',
          });
          const ox = await this.utils.zeroXUsdRate({
            chainId: this.chainId,
            tokenAddress: this.tokenAddress,
            tokenDecimals,
            blockNumber,
          });
          if (ox) {
            const path = [
              {
                address: this.tokenAddress,
                method: 'oneinch' as const,
                stableSymbol: ox.stableCoin.symbol,
                note: '0x quote to stable',
                rate: ox.rate,
              },
            ];
            return { usdRate: ox.rate * amount, reserveToken: null, path } as const;
          }
        }
      } else {
        const ts = await this.utils.getTimestampFromBlock({ chainId: this.chainId, blockNumber });
        if (ts !== undefined) {
          const llama = await this.utils.defillamaUsdRate({
            chainId: this.chainId,
            tokenAddress: this.tokenAddress,
            timestamp: ts,
          });
          if (llama !== undefined) {
            return {
              usdRate: llama * amount,
              reserveToken: null,
              path: [{ address: this.tokenAddress, method: 'defillama' as const, note: 'defillama api', rate: llama }],
            } as const;
          }
        }
      }
      return { usdRate: null, reserveToken, path: reservePath } as const;
    }

    // Reserve needed per 1 token and convert to human-readable
    const pricePerTokenWei = await this.getPriceForNextMint();
    const reservePerToken = toNumber(pricePerTokenWei, reserveToken.decimals);

    // Token USD price = reserve per token * reserve USD rate
    const path = [
      {
        address: this.tokenAddress,
        method: 'bond' as const,
        reservePerToken,
        note: 'bond price in reserve',
        reserveSymbol: reserveToken.symbol,
        reserveUsdRate: reserveUsdRate,
      },
      ...reservePath,
    ];

    return { usdRate: reserveUsdRate * reservePerToken * amount, reserveToken, path } as const;
  }

  // NOTE: use this before calling `get24HoursUsdRate` to check if client needs to re-fetch the data
  public get24HoursUsdCacheKey() {
    const prevTimeStamp = getTwentyFourHoursAgoTimestamp();
    const cacheKey = `usd-rate-${this.chainId}-${this.tokenAddress}-${prevTimeStamp}`;
    return { timestamp: prevTimeStamp, cacheKey } as const;
  }

  public async get24HoursUsdRate() {
    const { timestamp, cacheKey } = this.get24HoursUsdCacheKey();
    const amount = 1;

    // Current via unified helper
    const currentRes = await this.getUsdRate({ amount });
    const currentUsdRate = currentRes.usdRate;

    // Previous via unified helper with blockNumber when available
    const blockNumber24h = await this.utils.getBlockNumber({ chainId: this.chainId, timestamp });

    let previousUsdRate: number | null = null;
    const previousRes = await this.getUsdRate({ amount, blockNumber: blockNumber24h });
    previousUsdRate = previousRes.usdRate;

    const changePercent =
      currentUsdRate !== null && previousUsdRate !== null && previousUsdRate > 0
        ? ((currentUsdRate - previousUsdRate) / previousUsdRate) * 100
        : null;

    return { currentUsdRate, previousUsdRate, changePercent, cacheKey, timestamp } as const;
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

  public async checkAndPrepareCreateArgs(
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
      const [estimatedOutcome] = await this.getBuyEstimation(amount);
      const maxReserveAmount = estimatedOutcome + (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

      const bondApproved = await this.bondContractApproved({
        walletAddress: connectedAddress,
        amountToSpend: maxReserveAmount,
        tradeType: 'buy',
      });

      if (!bondApproved) {
        await this.approveBond({
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
    const { amount, slippage = 0, recipient, onError } = params;

    try {
      const connectedAddress = await this.getConnectedWalletAddress();
      const [estimatedOutcome] = await this.getSellEstimation(amount);
      const minReserveAmount = estimatedOutcome - (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

      const bondApproved = await this.bondContractApproved({
        walletAddress: connectedAddress,
        amountToSpend: params?.allowanceAmount ?? amount,
        tradeType: 'sell',
      } as BondApprovedParams<T>);

      if (!bondApproved) {
        await this.approveBond({
          ...params,
          tradeType: 'sell',
          amountToSpend: amount,
        } as ApproveBondParams<T, 'sell'>);
      }

      return bondContract.network(this.chainId).write({
        ...params,
        functionName: 'burn',
        args: [this.tokenAddress, amount, minReserveAmount, recipient || connectedAddress],
      });
    } catch (e) {
      onError?.(e);
    }
  }

  public async buyWithZap(params: BuySellCommonParams) {
    const { amount, slippage = 0, recipient, onError } = params;
    try {
      const connectedAddress = await this.getConnectedWalletAddress();
      const [estimatedOutcome] = await this.getBuyEstimation(amount);
      const maxReserveAmount = estimatedOutcome + (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

      return zapContract.network(this.chainId).write({
        ...params,
        functionName: 'mintWithEth',
        args: [this.tokenAddress, amount, recipient || connectedAddress],
        value: maxReserveAmount,
      });
    } catch (e) {
      onError?.(e);
    }
  }

  public async sellWithZap(
    params: BuySellCommonParams & {
      allowanceAmount?: T extends 'ERC20' ? bigint : never;
    },
  ) {
    const { amount, slippage = 0, recipient, onError } = params;
    try {
      const connectedAddress = await this.getConnectedWalletAddress();
      const [estimatedOutcome] = await this.getSellEstimation(amount);
      const minReserveAmount = estimatedOutcome - (estimatedOutcome * BigInt(slippage * 100)) / 10_000n;

      const bondApproved = await this.bondContractApproved({
        walletAddress: connectedAddress,
        amountToSpend: params?.allowanceAmount ?? amount,
        tradeType: 'sell',
        isZap: true,
      } as BondApprovedParams<T>);

      if (!bondApproved) {
        await this.approveBond({
          ...params,
          tradeType: 'sell',
          amountToSpend: amount,
          isZap: true,
        } as ApproveBondParams<T, 'sell'>);
      }

      return zapContract.network(this.chainId).write({
        ...params,
        functionName: 'burnToEth',
        args: [this.tokenAddress, amount, minReserveAmount, recipient || connectedAddress],
      });
    } catch (e) {
      onError?.(e);
    }
  }

  public async transfer(params: TransferCommonParams) {
    const { amount, recipient, onError } = params;

    try {
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
    } catch (e) {
      onError?.(e);
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

    const approved = await this.contractIsApproved(
      {
        allowanceAmount: totalAmount,
        amountToSpend: totalAmount,
      },
      'MERKLE',
    );

    if (!approved) {
      await this.approveContract(
        {
          ...params,
          allowanceAmount: totalAmount,
          amountToSpend: totalAmount,
        },
        'MERKLE',
      );
    }

    const leaves = wallets.map((address) => keccak256(address));
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });
    const merkleRoot = `0x${tree.getRoot().toString('hex')}` as const;

    const json = JSON.stringify(wallets, null, 2);
    const blob = new Blob([json], { type: 'application/json' });

    // Convert Blob to Uint8Array for better compatibility
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const ipfsCID = await this.ipfsHelper.add(filebaseApiKey, uint8Array);

    return this.airdropHelper.createAirdrop({
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

  public getTokenLogoUrl() {
    return `https://fc.hunt.town/tokens/logo/${this.chainId}/${this.tokenAddress}/image`;
  }

  public async getMintClubMetadata() {
    const response = await fetch(
      `https://mint.club/api/metadata?chainId=${this.chainId}&tokenAddress=${this.tokenAddress}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  public validateMetadataParams(params: MetadataCommonParams) {
    if (params.website && !params.website.startsWith('http')) {
      throw new MetadataValidationError('Website must be a valid URL starting with http:// or https://');
    }

    if (params.backgroundImage && !(params.backgroundImage instanceof File)) {
      throw new MetadataValidationError('backgroundImage must be a File object');
    }

    if (params.logo && !(params.logo instanceof File)) {
      throw new MetadataValidationError('logo must be a File object');
    }
  }

  public validateUpdateMetadataParams(params: UpdateMintClubMetadataParams) {
    this.validateMetadataParams(params);

    if (!params.signature || !params.message) {
      throw new MetadataValidationError('Signature and message are required for updating metadata');
    }
  }

  public async createMintClubMetadata(params: CreateMintClubMetadataParams) {
    this.validateMetadataParams(params);

    const formData = new FormData();
    formData.append('chainId', this.chainId.toString());
    formData.append('tokenAddress', this.tokenAddress);

    if (params.backgroundImage) {
      formData.append('backgroundImage', params.backgroundImage);
    }
    if (params.logo) {
      formData.append('logo', params.logo);
    }
    if (params.website) {
      formData.append('website', params.website);
    }
    if (params.distributionPlan) {
      formData.append('distributionPlan', params.distributionPlan);
    }
    if (params.creatorComment) {
      formData.append('creatorComment', params.creatorComment);
    }

    const response = await fetch('https://mint.club/api/metadata', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  public async updateMintClubMetadata(params: UpdateMintClubMetadataParams) {
    this.validateUpdateMetadataParams(params);

    const formData = new FormData();
    formData.append('chainId', this.chainId.toString());
    formData.append('tokenAddress', this.tokenAddress);
    formData.append('signature', params.signature);
    formData.append('message', params.message);

    if (params.backgroundImage) {
      formData.append('backgroundImage', params.backgroundImage);
    }
    if (params.logo) {
      formData.append('logo', params.logo);
    }
    if (params.website) {
      formData.append('website', params.website);
    }
    if (params.distributionPlan) {
      formData.append('distributionPlan', params.distributionPlan);
    }
    if (params.creatorComment) {
      formData.append('creatorComment', params.creatorComment);
    }

    const response = await fetch('https://mint.club/api/metadata', {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
