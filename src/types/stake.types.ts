import { CommonWriteParams } from './transactions.types';

export type CreateStakePoolParams = {
  stakingToken: `0x${string}`;
  isStakingTokenERC20: boolean;
  rewardToken: `0x${string}`;
  rewardAmount: bigint;
  rewardStartsAt: number;
  rewardDuration: number;
} & CommonWriteParams;

export type StakeParams = {
  poolId: number;
  amount: bigint;
} & CommonWriteParams;

export type UnstakeParams = {
  poolId: number;
  amount: bigint;
} & CommonWriteParams;

export type ClaimParams = {
  poolId: number;
} & CommonWriteParams;

export type CancelPoolParams = {
  poolId: number;
} & CommonWriteParams;

export type EmergencyUnstakeParams = {
  poolId: number;
} & CommonWriteParams;

export type Pool = {
  stakingToken: `0x${string}`;
  isStakingTokenERC20: boolean;
  rewardToken: `0x${string}`;
  creator: `0x${string}`;
  rewardAmount: bigint;
  rewardDuration: number;
  rewardStartsAt: number;
  rewardStartedAt: number;
  cancelledAt: number;
  totalStaked: bigint;
  activeStakerCount: number;
  lastRewardUpdatedAt: number;
  accRewardPerShare: bigint;
  totalAllocatedRewards: bigint;
};

export type TokenInfo = {
  symbol: string;
  name: string;
  decimals: number;
};

export type PoolView = {
  pool: Pool;
  stakingToken: TokenInfo;
  rewardToken: TokenInfo;
};

export type UserPoolStake = readonly [bigint, bigint, bigint, bigint];

export type ClaimableReward = readonly [bigint, bigint, bigint, bigint];

export type GetPoolsParams = {
  start?: number;
  end?: number;
};

export type GetPoolsByCreatorParams = {
  creator: `0x${string}`;
  start?: number;
  end?: number;
};

export type GetClaimableRewardParams = {
  poolId: number;
  staker: `0x${string}`;
};

export type GetClaimableRewardBulkParams = {
  poolIdFrom: number;
  poolIdTo: number;
  staker: `0x${string}`;
};

export type GetUserPoolStakeParams = {
  user: `0x${string}`;
  poolId: number;
};
