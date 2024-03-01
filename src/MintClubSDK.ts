import { ContractChainType, LowerCaseChainNames, chainStringToId } from './exports';
import { BondHelper } from './helpers/BondHelper';
import { ERC1155Helper } from './helpers/ERC1155Helper';
import { ERC20Helper } from './helpers/ERC20Helper';

export class MintClubSDK {
  public network(id: ContractChainType | LowerCaseChainNames) {
    let chainId: ContractChainType;

    if (typeof id === 'string') {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }

    return {
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
    };
  }
}
