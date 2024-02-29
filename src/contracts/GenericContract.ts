import {
  BOND_ABI,
  ContractChainType,
  ContractType,
  ERC1155_ABI,
  ERC20_ABI,
  LOCKER_ABI,
  LowerCaseChainNames,
  MERKLE_ABI,
  ONEINCH_ABI,
  ZAP_ABI,
  chainStringToId,
} from '../exports';
import { AbiType, SupportedAbiType } from '../types';
import { GenericContractLogic } from './GenericContractLogic';

declare global {
  interface Window {
    ethereum: any;
  }
}

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
    let chainId: ContractChainType | undefined;

    if (typeof id === 'string') {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }

    if (!chainId) {
      throw new Error(`Chain ${id} not supported`);
    }

    return GenericContractLogic.getInstance(chainId, this.contractType, this.abi as AbiType<T>) as GenericContractLogic<
      AbiType<T>,
      T
    >;
  }
}
