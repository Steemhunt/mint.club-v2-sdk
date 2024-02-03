import { ExtractAbiErrorNames } from 'abitype';
import { BOND_ABI } from '../abis/bond';
import { ERC1155_ABI } from '../abis/erc1155';
import { ERC20_ABI } from '../abis/erc20';
import { LOCKER_ABI } from '../abis/locker';
import { MERKLE_ABI } from '../abis/merkle';
import { ZAP_ABI } from '../abis/zap';

export type BondErrorNames = ExtractAbiErrorNames<typeof BOND_ABI>;
export type ERC20ErrorNames = ExtractAbiErrorNames<typeof ERC20_ABI>;
export type ERC1155ErrorNames = ExtractAbiErrorNames<typeof ERC1155_ABI>;
export type LockerErrorNames = ExtractAbiErrorNames<typeof LOCKER_ABI>;
export type MerkleErrorNames = ExtractAbiErrorNames<typeof MERKLE_ABI>;
export type ZapErrorNames = ExtractAbiErrorNames<typeof ZAP_ABI>;

export type AllContractErrorNames =
  | BondErrorNames
  | ERC20ErrorNames
  | ERC1155ErrorNames
  | LockerErrorNames
  | MerkleErrorNames
  | ZapErrorNames;
