import { airdropContract } from '../contracts';
import { SdkSupportedChainIds } from '../exports';
import { CreateAirdropParams } from '../types/airdrop.types';
import { api, baseFetcher } from '../utils/api';

export const EMPTY_ROOT = '0x0000000000000000000000000000000000000000000000000000000000000000';

export class Airdrop {
  protected chainId: SdkSupportedChainIds;

  constructor(chainId: SdkSupportedChainIds) {
    this.chainId = chainId;
  }

  public getDistributionCount() {
    return airdropContract.network(this.chainId).read({
      functionName: 'distributionCount',
    });
  }

  public async getDistribution(distributionId: number) {
    const [
      token,
      isERC20,
      walletCount,
      claimCount,
      amountPerClaim,
      startTime,
      endTime,
      owner,
      refundedAt,
      merkleRoot,
      title,
      ipfsCID,
    ] = await airdropContract.network(this.chainId).read({
      functionName: 'distributions',
      args: [BigInt(distributionId)],
    });

    return {
      token,
      isERC20,
      walletCount,
      claimCount,
      amountPerClaim,
      startTime,
      endTime,
      owner,
      refundedAt,
      merkleRoot,
      title,
      ipfsCID,
    };
  }

  public getAmountClaimed(distributionId: number) {
    return airdropContract.network(this.chainId).read({
      functionName: 'getAmountClaimed',
      args: [BigInt(distributionId)],
    });
  }

  public getAmountLeft(distributionId: number) {
    return airdropContract.network(this.chainId).read({
      functionName: 'getAmountLeft',
      args: [BigInt(distributionId)],
    });
  }

  public getDistributionIdsByOwner(params: { owner: `0x${string}`; start?: bigint; end?: bigint }) {
    const { owner, start = 0n, end = 1000n } = params;
    return airdropContract.network(this.chainId).read({
      functionName: 'getDistributionIdsByOwner',
      args: [owner, start, end],
    });
  }

  public getDistributionIdsByToken(params: { token: `0x${string}`; start?: bigint; end?: bigint }) {
    const { token, start = 0n, end = 1000n } = params;
    return airdropContract.network(this.chainId).read({
      functionName: 'getDistributionIdsByToken',
      args: [token, start, end],
    });
  }

  public getIsClaimed(distributionId: number, account: `0x${string}`) {
    return airdropContract.network(this.chainId).read({
      functionName: 'isClaimed',
      args: [BigInt(distributionId), account],
    });
  }

  public getIsWhtelistOnly(distributionId: number) {
    return airdropContract.network(this.chainId).read({
      functionName: 'isWhitelistOnly',
      args: [BigInt(distributionId)],
    });
  }

  public async getMerkleProof(distributionId: number) {
    const { ipfsCID } = await this.getDistribution(distributionId);
    const merkleProof = await api
      .get(`ipfs/whitelist?cid=${ipfsCID}`)
      .json<`0x${string}`[]>()
      .catch(() => {
        return baseFetcher.get(`https://cf-ipfs.com/ipfs/${ipfsCID}`).json<`0x${string}`[]>();
      });
    return merkleProof;
  }

  public async getIsWhitelisted(params: { distributionId: number; account: `0x${string}`; merkleRoot: `0x${string}` }) {
    const { distributionId, account, merkleRoot } = params;

    if (merkleRoot === EMPTY_ROOT) return Promise.resolve(true);

    return airdropContract.network(this.chainId).read({
      functionName: 'isWhitelisted',
      args: [BigInt(distributionId), account, await this.getMerkleProof(distributionId)],
    });
  }

  public async claim(distributionId: number) {
    return airdropContract.network(this.chainId).write({
      functionName: 'claim',
      args: [BigInt(distributionId), await this.getMerkleProof(distributionId)],
    });
  }

  public createDistribution(params: CreateAirdropParams) {
    const { token, isERC20, amountPerClaim, walletCount, startTime, endTime, merkleRoot, title, ipfsCID } = params;

    return airdropContract.network(this.chainId).write({
      functionName: 'createDistribution',
      args: [token, isERC20, amountPerClaim, walletCount, startTime, endTime, merkleRoot, title, ipfsCID],
    });
  }

  public refund(distributionId: number) {
    return airdropContract.network(this.chainId).write({
      functionName: 'refund',
      args: [BigInt(distributionId)],
    });
  }
}
