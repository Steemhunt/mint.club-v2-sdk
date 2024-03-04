require('@nomicfoundation/hardhat-viem');
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  // taken from mint.club-v2-contract
  paths: {
    sources: './contracts',
    artifacts: './artifacts',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          // NOTE: PUSH0 opcode is not supported on some L2s
          // - Reference: https://hardhat.org/hardhat-runner/docs/config#default-evm-version
          evmVersion: 'paris',
          optimizer: {
            enabled: true,
            runs: 50000,
          },
        },
      },
      {
        version: '0.4.18', // For WETH mock contract
      },
    ],
  },
};
