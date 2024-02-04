import { BOND_ABI } from '../constants/abis/bond';
import { ERC1155_ABI } from '../constants/abis/erc1155';
import { ERC20_ABI } from '../constants/abis/erc20';
import { LOCKER_ABI } from '../constants/abis/locker';
import { MERKLE_ABI } from '../constants/abis/merkle';
import { ONEINCH_ABI } from '../constants/abis/oneinch';
import { ZAP_ABI } from '../constants/abis/zap';
import { LowerCaseChainNames, chainStringToId } from '../constants/chains';
import { ContractChainType, ContractType } from '../constants/contracts';
import { BondContractLogic } from './BondContractLogic';
import { GenericContractLogic } from './GenericContractLogic';

declare global {
  interface Window {
    ethereum: any;
  }
}

type AbiType<T extends ContractType> = T extends 'BOND'
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

export class GenericContract<T extends ContractType> {
  private contractType: T;
  private abi: SupportedAbiType;

  constructor(type: T) {
    this.contractType = type;
    if (type === 'BOND') {
      this.abi = BOND_ABI;
    } else if (type === 'ERC20') {
      this.abi = ERC20_ABI;
    } else if (type === 'ERC1155') {
      this.abi = ERC1155_ABI;
    } else if (type === 'LOCKER') {
      this.abi = LOCKER_ABI;
    } else if (type === 'MERKLE') {
      this.abi = MERKLE_ABI;
    } else if (type === 'ZAP') {
      this.abi = ZAP_ABI;
    } else if (type === 'ONEINCH') {
      this.abi = ONEINCH_ABI;
    } else {
      throw new Error(`Contract type ${type} not supported`);
    }
  }

  public network(id: ContractChainType | LowerCaseChainNames) {
    let chainId;

    if (typeof id === 'string') {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }

    if (!chainId) {
      throw new Error(`Chain ${id} not supported`);
    }

    let logicClass = GenericContractLogic.network(chainId, this.contractType, this.abi);

    if (this.contractType === 'BOND') {
      logicClass = BondContractLogic.network(chainId, this.contractType, this.abi);
    }

    return logicClass as T extends 'BOND' ? BondContractLogic : GenericContractLogic<AbiType<T>>;
  }
}
