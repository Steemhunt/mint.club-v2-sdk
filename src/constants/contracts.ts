import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  klaytn,
  bsc,
  mainnet,
  optimism,
  polygon,
  sepolia,
  cyber,
  cyberTestnet,
  degen,
} from 'viem/chains';

const SDK_CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [optimism.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [arbitrum.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [avalanche.id]: '0x5DaE94e149CF2112Ec625D46670047814aA9aC2a',
    [polygon.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [bsc.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [base.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [baseSepolia.id]: '0x37F540de37afE8bDf6C722d87CB019F30e5E406a',
    [sepolia.id]: '0x749bA94344521727f55a3007c777FbeB5F52C2Eb',
    [blast.id]: '0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4',
    [blastSepolia.id]: '0x37F540de37afE8bDf6C722d87CB019F30e5E406a',
    [avalancheFuji.id]: '0xAD5a113ee65F30269f7558f96483126B1FB60c4E',
    [degen.id]: '0xaF987E88bf30581F7074E628c894A3FCbf4EE12e',
    [cyberTestnet.id]: '0x37F540de37afE8bDf6C722d87CB019F30e5E406a',
    [klaytn.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
    [cyber.id]: '0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df',
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
    [blast.id]: '0x5DaE94e149CF2112Ec625D46670047814aA9aC2a',
    [blastSepolia.id]: '0x4bF67e5C9baD43DD89dbe8fCAD3c213C868fe881',
    [baseSepolia.id]: '0x4bF67e5C9baD43DD89dbe8fCAD3c213C868fe881',
    [avalancheFuji.id]: '0xB43826E079dFB2e2b48a0a473Efc7F1fe6391763',
    [degen.id]: '0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa',
    [cyberTestnet.id]: '0x4bF67e5C9baD43DD89dbe8fCAD3c213C868fe881',
    [klaytn.id]: '0x6c61918eECcC306D35247338FDcf025af0f6120A',
    [cyber.id]: '0x6c61918eECcC306D35247338FDcf025af0f6120A',
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
    [baseSepolia.id]: '0x5dfA75b0185efBaEF286E80B847ce84ff8a62C2d',
    [blast.id]: '0x621c335b4BD8f2165E120DC70d3AfcAfc6628681',
    [blastSepolia.id]: '0x5dfA75b0185efBaEF286E80B847ce84ff8a62C2d',
    [avalancheFuji.id]: '0x20fBC8a650d75e4C2Dab8b7e85C27135f0D64e89',
    [degen.id]: '0x3bc6B601196752497a68B2625DB4f2205C3b150b',
    [cyberTestnet.id]: '0x5dfA75b0185efBaEF286E80B847ce84ff8a62C2d',
    [klaytn.id]: '0xc5a076cad94176c2996B32d8466Be1cE757FAa27',
    [cyber.id]: '0xc5a076cad94176c2996B32d8466Be1cE757FAa27',
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
    [baseSepolia.id]: '0x40c7DC399e01029a51cAb316f8Bca7D20DE31bad',
    [blast.id]: '0x06FD26c092Db44E5491abB7cDC580CE24D93030c',
    [blastSepolia.id]: '0x40c7DC399e01029a51cAb316f8Bca7D20DE31bad',
    [avalancheFuji.id]: '0x60432191893c4F742205a2C834817a1891feC435',
    [degen.id]: '0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4',
    [cyberTestnet.id]: '0x40c7DC399e01029a51cAb316f8Bca7D20DE31bad',
    [klaytn.id]: '0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa',
    [cyber.id]: '0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa',
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
    [baseSepolia.id]: '0x2c6B3fe4D6de27363cFEC95f703889EaF6b770fB',
    [blast.id]: '0x3Fd5B4DcDa968C8e22898523f5343177F94ccfd1',
    [blastSepolia.id]: '0x2c6B3fe4D6de27363cFEC95f703889EaF6b770fB',
    [avalancheFuji.id]: '0x789771E410527691729e54A84103594ee6Be6C3C',
    [degen.id]: '0xF44939c1613143ad587c79602182De7DcF593e33',
    [cyberTestnet.id]: '0x2c6B3fe4D6de27363cFEC95f703889EaF6b770fB',
    [klaytn.id]: '0xA3dCf3Ca587D9929d540868c924f208726DC9aB6',
    [cyber.id]: '0xA3dCf3Ca587D9929d540868c924f208726DC9aB6',
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
    [baseSepolia.id]: '0xCbb23973235feA43E62C41a0c67717a92a2467f2',
    [blast.id]: '0x29b0E6D2C2884aEa3FB4CB5dD1C7002A8E10c724',
    [blastSepolia.id]: '0xCbb23973235feA43E62C41a0c67717a92a2467f2',
    [avalancheFuji.id]: '0x6d1f4ecd17ddA7fb39C56Da566b66d63f06671d9',
    [degen.id]: '0x5DaE94e149CF2112Ec625D46670047814aA9aC2a',
    [cyberTestnet.id]: '0xCbb23973235feA43E62C41a0c67717a92a2467f2',
    [klaytn.id]: '0x3bc6B601196752497a68B2625DB4f2205C3b150b',
    [cyber.id]: '0x3bc6B601196752497a68B2625DB4f2205C3b150b',
  },

  ONEINCH: {
    [mainnet.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [optimism.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [arbitrum.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [avalanche.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [polygon.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [bsc.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [base.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [klaytn.id]: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    [sepolia.id]: '0x',
    [baseSepolia.id]: '0x',
    [blast.id]: '0x',
    [blastSepolia.id]: '0x',
    [avalancheFuji.id]: '0x',
    [degen.id]: '0x',
    [cyberTestnet.id]: '0x',
    [cyber.id]: '0x',
  },
} as const;

export function getMintClubContractAddress(contractName: ContractNames, chainId: SdkSupportedChainIds) {
  let contractAddress = SDK_CONTRACT_ADDRESSES[contractName][chainId];

  if (process.env.NODE_ENV === 'hardhat') {
    contractAddress = global.mcv2Hardhat?.[contractName]?.[chainId] as any;
  }

  if (!contractAddress) {
    throw new Error(`Contract address for ${contractName} on chain ${chainId} not found`);
  }
  return contractAddress;
}

type ExcludeValue<T, V> = T extends V ? never : T;
type ExtractChainIds<T> = T extends { [key: string]: infer U }
  ? U extends { [key: number]: any }
    ? keyof U
    : never
  : never;

export type ContractNames = keyof typeof SDK_CONTRACT_ADDRESSES;
export type SdkSupportedChainIds = ExtractChainIds<typeof SDK_CONTRACT_ADDRESSES>;
export type TokenType = 'ERC20' | 'ERC1155';
export type MainnetChain = ExcludeValue<
  SdkSupportedChainIds,
  typeof sepolia.id | typeof blastSepolia.id | typeof avalancheFuji.id | typeof cyberTestnet.id
>;
