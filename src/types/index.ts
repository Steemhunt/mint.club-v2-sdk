import { Abi, ContractFunctionArgs, ContractFunctionName, TransactionReceipt } from 'viem';
import {
  BOND_ABI,
  ContractNames,
  ERC1155_ABI,
  ERC20_ABI,
  LOCKER_ABI,
  MERKLE_ABI,
  ONEINCH_ABI,
  ZAP_ABI,
} from '../exports';

export type AbiType<T extends ContractNames> = T extends 'BOND'
  ? typeof BOND_ABI
  : T extends 'ERC20'
    ? typeof ERC20_ABI
    : T extends 'ERC1155'
      ? typeof ERC1155_ABI
      : T extends 'LOCKER'
        ? typeof LOCKER_ABI
        : T extends 'MERKLE'
          ? typeof MERKLE_ABI
          : T extends 'ZAP'
            ? typeof ZAP_ABI
            : T extends 'ONEINCH'
              ? typeof ONEINCH_ABI
              : never;

export type SupportedAbiType =
  | typeof BOND_ABI
  | typeof ERC20_ABI
  | typeof ERC1155_ABI
  | typeof LOCKER_ABI
  | typeof MERKLE_ABI
  | typeof ZAP_ABI
  | typeof ONEINCH_ABI;

type CommonWriteParams = {
  value?: bigint;
  onRequestSignature?: () => void;
  onSigned?: (tx: `0x${string}`) => void;
  onSuccess?: (receipt: TransactionReceipt) => void;
  onError?: (error: unknown) => void;
};

export type GenericWriteParams<
  A extends Abi = Abi,
  T extends ContractFunctionName<A, 'payable' | 'nonpayable'> = ContractFunctionName<A, 'payable' | 'nonpayable'>,
  R extends ContractFunctionArgs<A, 'payable' | 'nonpayable', T> = ContractFunctionArgs<A, 'payable' | 'nonpayable', T>,
  C extends ContractNames = ContractNames,
> = (C extends 'ERC20' | 'ERC1155'
  ? {
      tokenAddress: `0x${string}`;
      functionName: T;
      args: R;
    }
  : {
      functionName: T;
      args: R;
    }) &
  CommonWriteParams;

export type CurveType = 'LINEAR' | 'EXPONENTIAL' | 'LOGARITHMIC' | 'FLAT';

export type TradeType = 'buy' | 'sell';
