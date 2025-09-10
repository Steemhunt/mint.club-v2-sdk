import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'viem';
import { getTwentyFourHoursAgoTimestamp } from '../utils';
import { baseFetcher } from '../utils/api';
import { get0xSwapUsdRate as get0xSwapUsdRateFn } from '../utils/usd-rate/0xswap';
import {
  defillama24HoursPercentage as defillama24hFn,
  defillamaUsdRate as defillamaUsdRateFn,
  getDefillamaChainName,
} from '../utils/usd-rate/defillama';
import { oneinchEthRate as oneInchEthRateFn, oneinchUsdRate as oneInchUsdRateFn } from '../utils/usd-rate/oneinch';
import { Client } from './ClientHelper';

export class Utils {
  public generateMerkleRoot(wallets: `0x${string}`[]) {
    const leaves = wallets.map((address) => keccak256(address));
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });
    const merkleRoot = `0x${tree.getRoot().toString('hex')}` as const;
    return merkleRoot;
  }

  public async oneinchEthRate(params: {
    chainId: number;
    tokenAddress: `0x${string}`;
    tokenDecimals: number;
    blockNumber?: bigint | number | 'now';
    tryCount?: number;
  }): Promise<{ rate: number; nativeToken: { address: `0x${string}`; symbol: string; decimals: number } } | undefined> {
    return oneInchEthRateFn(params);
  }

  public async oneinchUsdRate(params: {
    chainId: number;
    tokenAddress: `0x${string}`;
    tokenDecimals: number;
    blockNumber?: bigint | number | 'now';
    tryCount?: number;
  }): Promise<{ rate: number; stableCoin: { address: `0x${string}`; symbol: string; decimals: bigint } } | undefined> {
    return oneInchUsdRateFn(params);
  }

  private defillamaGet<T>(url: string): Promise<T> {
    return baseFetcher.get(url, { prefixUrl: 'https://coins.llama.fi' }) as Promise<T>;
  }

  public async defillamaUsdRate(params: {
    chainId: number;
    tokenAddress: `0x${string}`;
    timestamp?: number;
  }): Promise<number | undefined> {
    return defillamaUsdRateFn(params);
  }

  public async defillama24HoursPercentage(params: {
    chainId: number;
    tokenAddress: `0x${string}`;
  }): Promise<number | undefined> {
    return defillama24hFn(params);
  }

  public async zeroXUsdRate(params: {
    chainId: number;
    tokenAddress: `0x${string}`;
    tokenDecimals: number;
    blockNumber?: bigint | number | 'now';
    tryCount?: number;
  }): Promise<{ rate: number; stableCoin: { address: `0x${string}`; symbol: string; decimals: bigint } } | undefined> {
    return get0xSwapUsdRateFn(params);
  }

  public async getBlockNumber(params: {
    chainId: number;
    timestamp: number; // unix seconds
  }): Promise<bigint | undefined> {
    const { chainId } = params;
    const prevTimeStamp = params.timestamp ?? getTwentyFourHoursAgoTimestamp();

    const chainName = getDefillamaChainName(chainId);
    try {
      const json = await this.defillamaGet<{ height: number }>(`block/${chainName}/${prevTimeStamp}`);
      if (json?.height !== undefined) return BigInt(json.height);
    } catch {}

    return undefined;
  }

  public async getTimestampFromBlock(params: {
    chainId: number;
    blockNumber: bigint | number;
  }): Promise<number | undefined> {
    const { chainId, blockNumber } = params;
    try {
      const client = new Client();
      const pc = client._getPublicClient(chainId);
      const bn = typeof blockNumber === 'number' ? BigInt(blockNumber) : blockNumber;
      const block = await pc.getBlock({ blockNumber: bn });
      return Number(block.timestamp);
    } catch {
      return undefined;
    }
  }

  // NOTE: only for kaia network
  public async getSwapscannerPrice(tokenAddress: `0x${string}`): Promise<number | undefined> {
    try {
      const data = (await baseFetcher.get('/v1/tokens/prices', { prefixUrl: 'https://api.swapscanner.io/' })) as Record<
        `0x${string}`,
        number
      >;

      const key = Object.keys(data).find((k) => k.toLowerCase() === tokenAddress.toLowerCase());
      if (key) return data[key as keyof typeof data];
      return undefined;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching Swapscanner price:', error);
      return undefined;
    }
  }
}
