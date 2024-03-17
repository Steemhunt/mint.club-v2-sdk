import { lockupContract } from '../contracts';
import { SdkSupportedChainIds } from '../exports';
import { CreateLockUpParams } from '../types/lockup.types';
import { WriteTransactionCallbacks } from '../types/transactions.types';

export class Lockup {
  protected chainId: SdkSupportedChainIds;

  constructor(chainId: SdkSupportedChainIds) {
    this.chainId = chainId;
  }

  public getTotalLockUpCount() {
    return lockupContract.network(this.chainId).read({
      functionName: 'lockUpCount',
    });
  }

  public getLockUpIdsByReceiver(params: { receiver: `0x${string}`; start?: number; end?: number }) {
    const { receiver, start = 0, end = 1000 } = params;
    return lockupContract.network(this.chainId).read({
      functionName: 'getLockUpIdsByReceiver',
      args: [receiver, BigInt(start), BigInt(end)],
    });
  }

  public getLockUpIdsByToken(params: { token: `0x${string}`; start?: number; end?: number }) {
    const { token, start = 0, end = 1000 } = params;
    return lockupContract.network(this.chainId).read({
      functionName: 'getLockUpIdsByToken',
      args: [token, BigInt(start), BigInt(end)],
    });
  }

  public async getLockUpById(lockUpId: number) {
    const [token, isERC20, unlockTime, unlocked, amount, receiver, title] = await lockupContract
      .network(this.chainId)
      .read({
        functionName: 'lockUps',
        args: [BigInt(lockUpId)],
      });

    return {
      token,
      isERC20,
      unlockTime,
      unlocked,
      amount,
      receiver,
      title,
    };
  }

  public createLockUp(params: CreateLockUpParams & WriteTransactionCallbacks) {
    const { token, isERC20, amount, unlockTime, receiver, title } = params;

    return lockupContract.network(this.chainId).write({
      ...params,
      functionName: 'createLockUp',
      args: [token, isERC20, amount, unlockTime, receiver, title],
    });
  }

  public unlock(
    params: {
      lockUpId: number;
    } & WriteTransactionCallbacks,
  ) {
    const { lockUpId } = params;
    return lockupContract.network(this.chainId).write({
      ...params,
      functionName: 'unlock',
      args: [BigInt(lockUpId)],
    });
  }
}
