export type CreateAirdropParams = {
  token: `0x${string}`;
  isERC20: boolean;
  amountPerClaim: bigint;
  walletCount: number;
  startTime: number;
  endTime: number;
  merkleRoot: `0x${string}`;
  title: string;
  ipfsCID: string;
};
