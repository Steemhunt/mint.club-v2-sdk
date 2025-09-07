// Example usage of the Stake feature
import { mintclub } from 'mint.club-v2-sdk';

// Initialize the SDK for a specific network
const network = mintclub.network('base'); // or any supported network

// Example: Reading stake pool information
async function getStakeInfo() {
  // Get creation fee for creating a new stake pool
  const creationFee = await network.stake.getCreationFee();
  console.log('Pool creation fee:', creationFee);

  // Get claim fee for claiming rewards
  const claimFee = await network.stake.getClaimFee();
  console.log('Reward claim fee:', claimFee);

  // Get total number of pools
  const poolCount = await network.stake.getPoolCount();
  console.log('Total pools:', poolCount);

  // Get specific pool info
  if (poolCount > 0n) {
    const pool = await network.stake.getPool({ poolId: 0 });
    console.log('Pool 0 info:', pool);
  }

  // Get pools list
  const pools = await network.stake.getPools({ start: 0, end: 10 });
  console.log('Pools list:', pools);
}

// Example: Creating a stake pool
async function createStakePool() {
  try {
    const result = await network.stake.createPool({
      stakingToken: '0x...', // Address of token to stake
      isStakingTokenERC20: true, // true for ERC20, false for ERC1155
      rewardToken: '0x...', // Address of reward token
      rewardAmount: BigInt('1000000000000000000'), // 1 token (18 decimals)
      rewardStartsAt: Math.floor(Date.now() / 1000) + 3600, // Start in 1 hour
      rewardDuration: 7 * 24 * 60 * 60, // 7 days in seconds
      onSuccess: (receipt) => {
        console.log('Pool created successfully!', receipt);
      },
      onError: (error) => {
        console.error('Failed to create pool:', error);
      },
    });
  } catch (error) {
    console.error('Error creating pool:', error);
  }
}

// Example: Staking tokens
async function stakeTokens() {
  try {
    const result = await network.stake.stake({
      poolId: 0,
      amount: BigInt('100000000000000000'), // 0.1 token (18 decimals)
      onSuccess: (receipt) => {
        console.log('Tokens staked successfully!', receipt);
      },
      onError: (error) => {
        console.error('Failed to stake tokens:', error);
      },
    });
  } catch (error) {
    console.error('Error staking tokens:', error);
  }
}

// Example: Claiming rewards
async function claimRewards() {
  try {
    // Check claimable rewards first
    const userAddress = '0x...'; // User's wallet address
    const claimable = await network.stake.getClaimableReward({
      poolId: 0,
      staker: userAddress,
    });
    console.log('Claimable rewards:', claimable);

    // Claim if there are rewards available
    if (claimable.rewardClaimable > 0n) {
      const result = await network.stake.claim({
        poolId: 0,
        onSuccess: (receipt) => {
          console.log('Rewards claimed successfully!', receipt);
        },
        onError: (error) => {
          console.error('Failed to claim rewards:', error);
        },
      });
    }
  } catch (error) {
    console.error('Error claiming rewards:', error);
  }
}

// Example: Unstaking tokens
async function unstakeTokens() {
  try {
    const result = await network.stake.unstake({
      poolId: 0,
      amount: BigInt('50000000000000000'), // 0.05 token (18 decimals)
      onSuccess: (receipt) => {
        console.log('Tokens unstaked successfully!', receipt);
      },
      onError: (error) => {
        console.error('Failed to unstake tokens:', error);
      },
    });
  } catch (error) {
    console.error('Error unstaking tokens:', error);
  }
}

export { getStakeInfo, createStakePool, stakeTokens, claimRewards, unstakeTokens };
