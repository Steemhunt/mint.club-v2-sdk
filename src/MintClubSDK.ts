import { ContractChainType, LowerCaseChainNames, chainStringToId } from './exports';
import { BondHelper } from './helpers/BondHelper';
import { ClientHelper } from './helpers/ClientHelper';
import { ERC1155Helper } from './helpers/ERC1155Helper';
import { ERC20Helper } from './helpers/ERC20Helper';

type NetworkReturnType = {
  token: (symbolOrAddress: string) => ERC20Helper;
  nft: (symbolOrAddress: string) => ERC1155Helper;
  bond: () => BondHelper;
} & ClientHelper;

export class MintClubSDK {
  public network(id: ContractChainType | LowerCaseChainNames): NetworkReturnType {
    let chainId: ContractChainType;

    if (typeof id === 'string') {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }

    const clientHelper = new ClientHelper(chainId);

    return Object.assign(clientHelper, {
      token: (symbolOrAddress: string) => {
        return new ERC20Helper({
          symbolOrAddress,
          chainId,
        });
      },

      nft: (symbolOrAddress: string) => {
        return new ERC1155Helper({
          symbolOrAddress,
          chainId,
        });
      },

      bond: () => {
        return new BondHelper({
          chainId,
        });
      },
    });
  }
}
