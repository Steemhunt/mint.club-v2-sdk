import { describe, expect, test } from 'bun:test';
import { base } from 'viem/chains';
import { mintclub } from '../../src';

const TEST_CONFIG = {
  chain: base,
  testUser: '0x1B18D8126DDE618E994A9B4ab115B944EFC748a2' as `0x${string}`,
};

describe(`Stake Tests - ${TEST_CONFIG.chain.name}`, () => {
  const stake = mintclub.network(base.id).stake;

  describe('Read Functions', () => {
    test('getVersion should return contract version', async () => {
      const version = await stake.getVersion();
      expect(typeof version).toBe('string');
      expect(version.length).toBeGreaterThan(0);
      console.log(`Contract version: ${version}`);
    });

    test('getOwner should return owner address', async () => {
      const owner = await stake.getOwner();
      expect(owner).toMatch(/^0x[a-fA-F0-9]{40}$/);
      console.log(`Contract owner: ${owner}`);
    });

    test('getCreationFee should return creation fee', async () => {
      const creationFee = await stake.getCreationFee();
      expect(typeof creationFee).toBe('bigint');
      expect(creationFee).toBeGreaterThan(0n);
      console.log(`Creation fee: ${creationFee} wei`);
    });

    test('getClaimFee should return claim fee', async () => {
      const claimFee = await stake.getClaimFee();
      expect(typeof claimFee).toBe('bigint');
      expect(claimFee).toBeGreaterThanOrEqual(0n);
      console.log(`Claim fee: ${claimFee} wei`);
    });

    test('getPoolCount should return pool count', async () => {
      const poolCount = await stake.getPoolCount();
      expect(typeof poolCount).toBe('bigint');
      expect(poolCount).toBeGreaterThanOrEqual(0n);
      console.log(`Total pools: ${poolCount}`);
    });

    test('getMinRewardDuration should return minimum duration', async () => {
      const minDuration = await stake.getMinRewardDuration();
      expect(typeof minDuration).toBe('bigint');
      expect(minDuration).toBeGreaterThan(0n);
      console.log(`Minimum reward duration: ${minDuration} seconds`);
    });

    test('getMaxRewardDuration should return maximum duration', async () => {
      const maxDuration = await stake.getMaxRewardDuration();
      expect(typeof maxDuration).toBe('bigint');
      expect(maxDuration).toBeGreaterThan(0n);
      console.log(`Maximum reward duration: ${maxDuration} seconds`);
    });

    test('getProtocolBeneficiary should return beneficiary address', async () => {
      const beneficiary = await stake.getProtocolBeneficiary();
      expect(beneficiary).toMatch(/^0x[a-fA-F0-9]{40}$/);
      console.log(`Protocol beneficiary: ${beneficiary}`);
    });

    test('getPools should return pool list', async () => {
      const pools = await stake.getPools({ start: 0, end: 10 });
      expect(Array.isArray(pools)).toBe(true);
      console.log(`Retrieved ${pools.length} pools`);
    });

    test('getUserPoolStake should return user stake info', async () => {
      const stakeInfo = await stake.getUserPoolStake({
        user: TEST_CONFIG.testUser,
        poolId: 0,
      });

      expect(typeof stakeInfo).toBe('object');
      expect(stakeInfo).toHaveProperty('stakedAmount');
      expect(stakeInfo).toHaveProperty('claimedTotal');
      expect(stakeInfo).toHaveProperty('feeTotal');
      expect(stakeInfo).toHaveProperty('rewardDebt');

      console.log(`User stake info:`, {
        stakedAmount: stakeInfo.stakedAmount,
        claimedTotal: stakeInfo.claimedTotal,
        feeTotal: stakeInfo.feeTotal,
        rewardDebt: stakeInfo.rewardDebt,
      });
    });

    test('getClaimableReward should return claimable rewards', async () => {
      const [rewardClaimable, fee, claimedTotal, feeTotal] = await stake.getClaimableReward({
        poolId: 0,
        staker: TEST_CONFIG.testUser,
      });

      expect(typeof rewardClaimable).toBe('bigint');
      expect(typeof fee).toBe('bigint');
      expect(typeof claimedTotal).toBe('bigint');
      expect(typeof feeTotal).toBe('bigint');

      console.log(`Claimable rewards:`, {
        rewardClaimable,
        fee,
        claimedTotal,
        feeTotal,
      });
    });

    test('getClaimableRewardBulk should return bulk rewards', async () => {
      const results = await stake.getClaimableRewardBulk({
        poolIdFrom: 0,
        poolIdTo: 5,
        staker: TEST_CONFIG.testUser,
      });

      expect(Array.isArray(results)).toBe(true);
      console.log(`Bulk rewards results: ${results.length} pools`);
    });
  });

  describe('Pool Operations (Read)', () => {
    test('getPool should return pool details', async () => {
      try {
        const pool = await stake.getPool({ poolId: 0 });

        expect(typeof pool).toBe('object');
        expect(pool).toHaveProperty('poolId');
        expect(pool).toHaveProperty('pool');
        expect(pool).toHaveProperty('stakingToken');
        expect(pool).toHaveProperty('rewardToken');

        console.log(`Pool 0 details:`, {
          poolId: pool.poolId,
          creator: pool.pool.creator,
          stakingToken: pool.pool.stakingToken,
          rewardToken: pool.pool.rewardToken,
          rewardAmount: pool.pool.rewardAmount,
          totalStaked: pool.pool.totalStaked,
        });
      } catch (error) {
        console.log('Pool 0 does not exist (expected for empty test environment)');
        expect((error as Error).message).toContain('PoolNotFound');
      }
    });

    test('getPoolsByCreator should return creator pools', async () => {
      const pools = await stake.getPoolsByCreator({
        creator: TEST_CONFIG.testUser,
        start: 0,
        end: 10,
      });

      expect(Array.isArray(pools)).toBe(true);
      console.log(`Creator pools: ${pools.length} pools`);
    });
  });
});
