export type CreateLockUpParams = {
  token: `0x${string}`;
  isERC20: boolean;
  amount: bigint;
  unlockTime: number;
  receiver: `0x${string}`;
  title: string;
};
