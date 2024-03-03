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
