import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-abi-exporter';
import 'hardhat-deploy';
import { HardhatUserConfig } from 'hardhat/config';
import 'solidity-coverage';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  abiExporter: {
    path: './client/src/abi',
    flat: true,
    clear: true,
  },
};

export default config;
