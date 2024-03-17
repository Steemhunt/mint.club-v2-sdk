import { airdropContract } from '../contracts';
import { SdkSupportedChainIds } from '../exports';
import { CreateAirdropParams } from '../types/airdrop.types';
import { WriteTransactionCallbacks } from '../types/transactions.types';
import { api, baseFetcher } from '../utils/api';

export const EMPTY_ROOT = '0x0000000000000000000000000000000000000000000000000000000000000000';

export class Airdrop {
  protected chainId: SdkSupportedChainIds;

  constructor(chainId: SdkSupportedChainIds) {
    this.chainId = chainId;
  }

  public getTotalAirdropCount() {
    return airdropContract.network(this.chainId).read({
      functionName: 'distributionCount',
    });
  }

  public async getAirdropById(airdropId: number) {
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
      args: [BigInt(airdropId)],
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

  public getAmountClaimed(airdropId: number) {
    return airdropContract.network(this.chainId).read({
      functionName: 'getAmountClaimed',
      args: [BigInt(airdropId)],
    });
  }

  public getAmountLeft(airdropId: number) {
    return airdropContract.network(this.chainId).read({
      functionName: 'getAmountLeft',
      args: [BigInt(airdropId)],
    });
  }

  public getAirdropIdsByOwner(params: { owner: `0x${string}`; start?: number; end?: number }) {
    const { owner, start = 0, end = 1000 } = params;
    return airdropContract.network(this.chainId).read({
      functionName: 'getDistributionIdsByOwner',
      args: [owner, BigInt(start), BigInt(end)],
    });
  }

  public getAirdropIdsByToken(params: { token: `0x${string}`; start?: number; end?: number }) {
    const { token, start = 0, end = 1000 } = params;
    return airdropContract.network(this.chainId).read({
      functionName: 'getDistributionIdsByToken',
      args: [token, BigInt(start), BigInt(end)],
    });
  }

  public getIsClaimed(airdropId: number, account: `0x${string}`) {
    return airdropContract.network(this.chainId).read({
      functionName: 'isClaimed',
      args: [BigInt(airdropId), account],
    });
  }

  public getIsWhitelistOnly(airdropId: number) {
    return airdropContract.network(this.chainId).read({
      functionName: 'isWhitelistOnly',
      args: [BigInt(airdropId)],
    });
  }

  public async getMerkleProof(airdropId: number) {
    const { ipfsCID } = await this.getAirdropById(airdropId);
    const merkleProof = await api
      .get(`ipfs/whitelist?cid=${ipfsCID}`)
      .json<`0x${string}`[]>()
      .catch(() => {
        return baseFetcher.get(`https://cf-ipfs.com/ipfs/${ipfsCID}`).json<`0x${string}`[]>();
      });
    return merkleProof;
  }

  public async getIsWhitelisted(airdropId: number, account: `0x${string}`) {
    const { merkleRoot } = await this.getAirdropById(airdropId);

    if (merkleRoot === EMPTY_ROOT) return Promise.resolve(true);

    return airdropContract.network(this.chainId).read({
      functionName: 'isWhitelisted',
      args: [BigInt(airdropId), account, await this.getMerkleProof(airdropId)],
    });
  }

  public async claimAirdrop(
    params: {
      airdropId: number;
    } & WriteTransactionCallbacks,
  ) {
    const { airdropId } = params;

    return airdropContract.network(this.chainId).write({
      ...params,
      functionName: 'claim',
      args: [BigInt(airdropId), await this.getMerkleProof(airdropId)],
    });
  }

  public createAirdrop(params: CreateAirdropParams & WriteTransactionCallbacks) {
    const { token, isERC20, amountPerClaim, walletCount, startTime, endTime, merkleRoot, title, ipfsCID } = params;

    return airdropContract.network(this.chainId).write({
      ...params,
      functionName: 'createDistribution',
      args: [token, isERC20, amountPerClaim, walletCount, startTime, endTime, merkleRoot, title, ipfsCID],
    });
  }

  public cancelAirdrop(
    params: {
      airdropId: number;
    } & WriteTransactionCallbacks,
  ) {
    const { airdropId } = params;

    return airdropContract.network(this.chainId).write({
      ...params,
      functionName: 'refund',
      args: [BigInt(airdropId)],
    });
  }
}
