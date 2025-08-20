import MerkleTree from 'merkletreejs';
import { keccak256 } from 'viem';
import { baseFetcher } from '../utils/api';
import { getTwentyFourHoursAgoTimestamp } from '../utils';
import { chainIdToViemChain, SdkSupportedChainIds } from '../exports';
import {
  apeChain,
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  cyber,
  degen,
  ham,
  hashkey,
  kaia,
  mainnet,
  optimism,
  polygon,
  sepolia,
  shibarium,
  unichain,
  zora,
} from 'viem/chains';

export class Utils {
  public generateMerkleRoot(wallets: `0x${string}`[]) {
    const leaves = wallets.map((address) => keccak256(address));
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });
    const merkleRoot = `0x${tree.getRoot().toString('hex')}` as const;
    return merkleRoot;
  }

  private getDefillamaChainName(chainId: number) {
    // Map known differences; fall back to viem chain name
    const mapping: Partial<Record<number, string>> = {
      [mainnet.id]: 'ethereum',
      [base.id]: 'base',
      [degen.id]: 'degen',
      [ham.id]: 'ham',
      [unichain.id]: 'unichain',
      [arbitrum.id]: 'arbitrum',
      [avalanche.id]: 'avax',
      [blast.id]: 'blast',
      [bsc.id]: 'bsc',
      [cyber.id]: 'cyber',
      [optimism.id]: 'optimism',
      [kaia.id]: 'klaytn',
      [polygon.id]: 'polygon',
      [shibarium.id]: 'shibarium',
      [zora.id]: 'zora',
      [sepolia.id]: 'sepolia',
      [apeChain.id]: 'apechain',
      [hashkey.id]: 'hashkey',
    } as const;

    return mapping[chainId] ?? chainIdToViemChain(chainId as SdkSupportedChainIds)?.name?.toLowerCase();
  }

  private defillamaGet<T>(url: string): Promise<T> {
    return baseFetcher.get(url, { prefixUrl: 'https://coins.llama.fi' }) as Promise<T>;
  }

  public async defillamaUsdRate(params: {
    chainId: number;
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

  public async defillama24HoursPercentage(params: {
    chainId: number;
    tokenAddress: `0x${string}`;
  }): Promise<number | undefined> {
    let { chainId, tokenAddress } = params;

    // Special-case mappings for tokens not indexed on their native chains
    if (chainId === ham.id && tokenAddress.toLowerCase() === '0xe8dd44d0791b73afe9066c3a77721f42d0844beb') {
      chainId = base.id;
      tokenAddress = '0x5B5dee44552546ECEA05EDeA01DCD7Be7aa6144A';
    }

    if (chainId === unichain.id && tokenAddress.toLowerCase() === '0x4200000000000000000000000000000000000006') {
      chainId = mainnet.id;
      tokenAddress = '0xE7C6BF469e97eEB0bFB74C8dbFF5BD47D4C1C98a';
    }

    if (chainId === degen.id && tokenAddress.toLowerCase() === '0xeb54dacb4c2ccb64f8074eceea33b5ebb38e5387') {
      chainId = base.id;
      tokenAddress = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed';
    }

    if (chainId === apeChain.id && tokenAddress.toLowerCase() === '0x48b62137edfa95a428d35c09e44256a739f6b557') {
      chainId = mainnet.id;
      tokenAddress = '0x4d224452801ACEd8B2F0aebE155379bb5D594381';
    }

    if (chainId === hashkey.id && tokenAddress.toLowerCase() === '0xb210d2120d57b758ee163cffb43e73728c471cf1') {
      chainId = mainnet.id;
      tokenAddress = '0xE7C6BF469e97eEB0bFB74C8dbFF5BD47D4C1C98a';
    }

    const chainName = this.getDefillamaChainName(chainId);
    if (!chainName) return undefined;

    type Defillama24HourPercentageResponse = { coins: { [key: string]: number } };

    try {
      const json = await this.defillamaGet<Defillama24HourPercentageResponse>(
        `percentage/${chainName}:${tokenAddress}`,
      );
      const percentage = json?.coins?.[`${chainName}:${tokenAddress}`];
      return typeof percentage === 'number' ? percentage : undefined;
    } catch {
      return undefined;
    }
  }

  public async getBlockNumber(params: {
    chainId: number;
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

  // NOTE: only for kaia network
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
