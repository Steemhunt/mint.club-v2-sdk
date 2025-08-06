import { SdkSupportedChainIds } from '../constants/contracts';
import { stakeContract } from '../contracts';
import {
  CancelPoolParams,
  ClaimParams,
  CreateStakePoolParams,
  EmergencyUnstakeParams,
  GetClaimableRewardBulkParams,
  GetClaimableRewardParams,
  GetPoolsByCreatorParams,
  GetPoolsParams,
  GetUserPoolStakeParams,
  StakeParams,
  UnstakeParams,
} from '../types/stake.types';

export class Stake {
  protected chainId: SdkSupportedChainIds;

  constructor(chainId: SdkSupportedChainIds) {
    this.chainId = chainId;
  }

  // Read functions
  public getCreationFee() {
    return stakeContract.network(this.chainId).read({
      functionName: 'creationFee',
    });
  }

  public getClaimFee() {
    return stakeContract.network(this.chainId).read({
      functionName: 'claimFee',
    });
  }

  public getPoolCount() {
    return stakeContract.network(this.chainId).read({
      functionName: 'poolCount',
    });
  }

  public getMinRewardDuration() {
    return stakeContract.network(this.chainId).read({
      functionName: 'MIN_REWARD_DURATION',
    });
  }

  public getMaxRewardDuration() {
    return stakeContract.network(this.chainId).read({
      functionName: 'MAX_REWARD_DURATION',
    });
  }

  public getProtocolBeneficiary() {
    return stakeContract.network(this.chainId).read({
      functionName: 'protocolBeneficiary',
    });
  }

  public getPool(params: { poolId: number }) {
    const { poolId } = params;
    return stakeContract.network(this.chainId).read({
      functionName: 'getPool',
      args: [BigInt(poolId)],
    });
  }

  public getPools(params: GetPoolsParams = {}) {
    const { start = 0, end = 1000 } = params;
    return stakeContract.network(this.chainId).read({
      functionName: 'getPools',
      args: [BigInt(start), BigInt(end)],
    });
  }

  public getPoolsByCreator(params: GetPoolsByCreatorParams) {
    const { creator, start = 0, end = 1000 } = params;
    return stakeContract.network(this.chainId).read({
      functionName: 'getPoolsByCreator',
      args: [BigInt(start), BigInt(end), creator],
    });
  }

  public getUserPoolStake(params: GetUserPoolStakeParams) {
    const { user, poolId } = params;
    return stakeContract.network(this.chainId).read({
      functionName: 'userPoolStake',
      args: [user, BigInt(poolId)],
    });
  }

  public getClaimableReward(params: GetClaimableRewardParams) {
    const { poolId, staker } = params;
    return stakeContract.network(this.chainId).read({
      functionName: 'claimableReward',
      args: [BigInt(poolId), staker],
    });
  }

  public getClaimableRewardBulk(params: GetClaimableRewardBulkParams) {
    const { poolIdFrom, poolIdTo, staker } = params;
    return stakeContract.network(this.chainId).read({
      functionName: 'claimableRewardBulk',
      args: [BigInt(poolIdFrom), BigInt(poolIdTo), staker],
    });
  }

  // Write functions
  public createPool(params: CreateStakePoolParams) {
    const { stakingToken, isStakingTokenERC20, rewardToken, rewardAmount, rewardStartsAt, rewardDuration } = params;

    return stakeContract.network(this.chainId).write({
      ...params,
      functionName: 'createPool',
      args: [stakingToken, isStakingTokenERC20, rewardToken, rewardAmount, rewardStartsAt, rewardDuration],
    });
  }

  public stake(params: StakeParams) {
    const { poolId, amount } = params;

    return stakeContract.network(this.chainId).write({
      ...params,
      functionName: 'stake',
      args: [BigInt(poolId), amount],
    });
  }

  public unstake(params: UnstakeParams) {
    const { poolId, amount } = params;

    return stakeContract.network(this.chainId).write({
      ...params,
      functionName: 'unstake',
      args: [BigInt(poolId), amount],
    });
  }

  public claim(params: ClaimParams) {
    const { poolId } = params;

    return stakeContract.network(this.chainId).write({
      ...params,
      functionName: 'claim',
      args: [BigInt(poolId)],
    });
  }

  public cancelPool(params: CancelPoolParams) {
    const { poolId } = params;

    return stakeContract.network(this.chainId).write({
      ...params,
      functionName: 'cancelPool',
      args: [BigInt(poolId)],
    });
  }

  public emergencyUnstake(params: EmergencyUnstakeParams) {
    const { poolId } = params;

    return stakeContract.network(this.chainId).write({
      ...params,
      functionName: 'emergencyUnstake',
      args: [BigInt(poolId)],
    });
  }
}
