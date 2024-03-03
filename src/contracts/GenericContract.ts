import {
  BOND_ABI,
  SdkSupportedChainIds,
  ContractNames,
  ERC1155_ABI,
  ERC20_ABI,
  LOCKER_ABI,
  LowerCaseChainNames,
  MERKLE_ABI,
  ONEINCH_ABI,
  ZAP_ABI,
  chainStringToId,
} from '../exports';
import { AbiType, SupportedAbiType } from '../types/abi.types';
import { GenericContractLogic } from './GenericContractLogic';

declare global {
  interface Window {
    ethereum: any;
  }
}

export class GenericContract<T extends ContractNames> {
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

  public network(id: SdkSupportedChainIds | LowerCaseChainNames) {
    let chainId: SdkSupportedChainIds;

    if (typeof id === 'string') {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }

    return new GenericContractLogic({
      chainId,
      type: this.contractType,
      abi: this.abi,
    }) as unknown as GenericContractLogic<AbiType<T>, T>;
  }
}
