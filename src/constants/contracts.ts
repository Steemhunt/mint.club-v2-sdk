import { arbitrum, avalanche, base, bsc, mainnet, optimism, polygon, sepolia } from 'viem/chains';

export const CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [optimism.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [arbitrum.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [avalanche.id]: '0x5DaE94e149CF2112Ec625D46670047814aA9aC2a',
    [polygon.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [bsc.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [base.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [sepolia.id]: '0x749bA94344521727f55a3007c777FbeB5F52C2Eb',
  },

  ERC1155: {
    [mainnet.id]: '0x6c61918eECcC306D35247338FDcf025af0f6120A',
    [optimism.id]: '0x6c61918eECcC306D35247338FDcf025af0f6120A',
    [arbitrum.id]: '0x6c61918eECcC306D35247338FDcf025af0f6120A',
    [avalanche.id]: '0x621c335b4BD8f2165E120DC70d3AfcAfc6628681',
    [polygon.id]: '0x6c61918eECcC306D35247338FDcf025af0f6120A',
    [bsc.id]: '0x6c61918eECcC306D35247338FDcf025af0f6120A',
    [base.id]: '0x6c61918eECcC306D35247338FDcf025af0f6120A',
    [sepolia.id]: '0x3cABE5125C5D8922c5f38c5b779F6E96F563cdc0',
  },

  BOND: {
    [mainnet.id]: '0xc5a076cad94176c2996B32d8466Be1cE757FAa27',
    [optimism.id]: '0xc5a076cad94176c2996B32d8466Be1cE757FAa27',
    [arbitrum.id]: '0xc5a076cad94176c2996B32d8466Be1cE757FAa27',
    [avalanche.id]: '0x3Fd5B4DcDa968C8e22898523f5343177F94ccfd1',
    [polygon.id]: '0xc5a076cad94176c2996B32d8466Be1cE757FAa27',
    [bsc.id]: '0xc5a076cad94176c2996B32d8466Be1cE757FAa27',
    [base.id]: '0xc5a076cad94176c2996B32d8466Be1cE757FAa27',
    [sepolia.id]: '0x8dce343A86Aa950d539eeE0e166AFfd0Ef515C0c',
  },

  ZAP: {
    [mainnet.id]: '0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa',
    [optimism.id]: '0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa',
    [arbitrum.id]: '0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa',
    [avalanche.id]: '0x29b0E6D2C2884aEa3FB4CB5dD1C7002A8E10c724',
    [polygon.id]: '0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa',
    [bsc.id]: '0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa',
    [base.id]: '0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa',
    [sepolia.id]: '0x1Bf3183acc57571BecAea0E238d6C3A4d00633da',
  },

  LOCKER: {
    [mainnet.id]: '0xA3dCf3Ca587D9929d540868c924f208726DC9aB6',
    [optimism.id]: '0xA3dCf3Ca587D9929d540868c924f208726DC9aB6',
    [arbitrum.id]: '0xA3dCf3Ca587D9929d540868c924f208726DC9aB6',
    [avalanche.id]: '0x5b64cECC5cF3E4B1A668Abd895D16BdDC0c77a17',
    [polygon.id]: '0xA3dCf3Ca587D9929d540868c924f208726DC9aB6',
    [bsc.id]: '0xA3dCf3Ca587D9929d540868c924f208726DC9aB6',
    [base.id]: '0xA3dCf3Ca587D9929d540868c924f208726DC9aB6',
    [sepolia.id]: '0x7c204B1B03A88D24088941068f6DFC809f2fd022',
  },

  MERKLE: {
    [mainnet.id]: '0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4',
    [optimism.id]: '0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4',
    [arbitrum.id]: '0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4',
    [avalanche.id]: '0x841A2bD2fc97DCB865b4Ddb352540148Bad2dB09',
    [polygon.id]: '0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4',
    [bsc.id]: '0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4',
    [base.id]: '0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4',
    [sepolia.id]: '0x0CD940395566d509168977Cf10E5296302efA57A',
  },

  ONEINCH: {
    [mainnet.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [optimism.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [arbitrum.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [avalanche.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [polygon.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [bsc.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [base.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [sepolia.id]: '0x',
  },
} as const;

type ExcludeValue<T, V> = T extends V ? never : T;
type ExtractChainIds<T> = T extends { [key: string]: infer U }
  ? U extends { [key: number]: any }
    ? keyof U
    : never
  : never;

export type ContractType = keyof typeof CONTRACT_ADDRESSES;
export type ContractChainType = ExtractChainIds<typeof CONTRACT_ADDRESSES>;
export type MainnetChain = ExcludeValue<ContractChainType, 11155111>;
