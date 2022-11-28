import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';

 const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.10',
    settings: {
      optimizer: {
        enabled: true
      },
      outputSelection: {
        "*": {
          "*": [
            "evm.methodIdentifiers", "abi"
          ]
        },
      }
    },
  },
  namedAccounts: {
    deployer: 0,
    multisig: {
      mainnet: '0xA5fC0BbfcD05827ed582869b7254b6f141BA84Eb',
      optimism: '0xfB9423283EB7F65210B9aB545ecC212B5AE52b3A'
    },
    vault: {
      hardhat: '0xe5CF1558A1470cb5C166c2e8651eD0F3c5fb8F42',
      avalanche: '0xe5CF1558A1470cb5C166c2e8651eD0F3c5fb8F42',
      mainnet: '0x765277EebeCA2e31912C9946eAe1021199B39C61'
    }
  },
  networks: {
    hardhat: {
      forking: {
        enabled: false,
        url: `https://rpc.ankr.com/eth`,
      }
    },
    mainnet: {
      url: `https://rpc.ankr.com/eth`,
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined ? [] : [`0x${process.env.DEPLOY_PRIVATE_KEY}`]
    },
    fantom: {
      url: 'https://rpc.ftm.tools/',
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined ? [] : [`0x${process.env.DEPLOY_PRIVATE_KEY}`]
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined ? [] : [`0x${process.env.DEPLOY_PRIVATE_KEY}`]
    },
    testnet: {
      url: 'https://rpc.testnet.fantom.network/',
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined ? [] : [`0x${process.env.DEPLOY_PRIVATE_KEY}`]
    }
  }
};

export default config;
