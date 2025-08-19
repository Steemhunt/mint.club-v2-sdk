import MerkleTree from 'merkletreejs';
import { keccak256 } from 'viem';
import { baseFetcher } from '../utils/api';
import { getTwentyFourHoursAgoTimestamp } from '../utils';
import { chainIdToViemChain, SdkSupportedChainIds } from '../exports';
import { base, degen, ham, mainnet, unichain } from 'viem/chains';

export class Utils {
  public generateMerkleRoot(wallets: `0x${string}`[]) {
    const leaves = wallets.map((address) => keccak256(address));
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });
    const merkleRoot = `0x${tree.getRoot().toString('hex')}` as const;
    return merkleRoot;
  }

  private getDefillamaChainName(chainId: SdkSupportedChainIds) {
    // Minimal mapping for known differences; fall back to viem chain name
    const mapping: Partial<Record<SdkSupportedChainIds, string>> = {
      [mainnet.id]: 'ethereum',
      [base.id]: 'base',
      [degen.id]: 'degen',
      [ham.id]: 'ham',
      [unichain.id]: 'unichain',
    } as const;

    return mapping[chainId] ?? chainIdToViemChain(chainId)?.name?.toLowerCase();
  }

  private defillamaGet<T>(url: string): Promise<T> {
    return baseFetcher.get(url, { prefixUrl: 'https://coins.llama.fi' }) as Promise<T>;
  }

  public async defillamaUsdRate(params: {
    chainId: SdkSupportedChainIds;
    tokenAddress: `0x${string}`;
    timestamp?: number;
  }): Promise<number | undefined> {
    const { chainId, tokenAddress } = params;
    const timestamp = params.timestamp ?? Math.floor(Date.now() / 1000);

    const chainName = this.getDefillamaChainName(chainId);
    if (!chainName) return undefined;

    type DefillamaResponse = { coins: { [key: string]: { price: number } } };

    try {
      const json = await this.defillamaGet<DefillamaResponse>(
        `prices/historical/${timestamp}/${chainName}:${tokenAddress}`,
      );
      const price = json?.coins?.[`${chainName}:${tokenAddress}`]?.price;
      if (price === undefined) return undefined;
      return price;
    } catch {
      return undefined;
    }
  }

  public async getBlockNumber(params: {
    chainId: SdkSupportedChainIds;
    timestamp: number; // unix seconds
  }): Promise<bigint | undefined> {
    const { chainId } = params;
    const prevTimeStamp = params.timestamp ?? getTwentyFourHoursAgoTimestamp();

    const chainName = this.getDefillamaChainName(chainId);
    try {
      const json = await this.defillamaGet<{ height: number }>(`block/${chainName}/${prevTimeStamp}`);
      if (json?.height !== undefined) return BigInt(json.height);
    } catch {}

    return undefined;
  }

  public async getSwapscannerPrice(tokenAddress: `0x${string}`): Promise<number | undefined> {
    try {
      const data = (await baseFetcher.get('https://api.swapscanner.io/v1/tokens/prices')) as Record<
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
