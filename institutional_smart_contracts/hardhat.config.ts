import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Load environment variables for private keys and RPC URLs
dotenv.config();

const config: HardhatUserConfig = {
  // Target the latest Solidity version to utilize custom errors and optimized Yul IR
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000, // Extremely high optimization for cheap institutional transaction costs
        details: {
          yul: true,
        },
      },
      viaIR: true, // Utilize the Intermediate Representation pipeline for advanced optimization
    },
  },
  networks: {
    // Standard local Hardhat node for testing
    hardhat: {
      chainId: 1337,
    },
    // The Ripple EVM Devnet/Testnet
    xrpl_evm_sidechain: {
      url: process.env.XRPL_EVM_RPC_URL || "https://rpc-evm-sidechain.xrpl.org",
      accounts: process.env.INSTITUTIONAL_DEPLOYER_KEY !== undefined ? [process.env.INSTITUTIONAL_DEPLOYER_KEY] : [],
      chainId: 1440002, // The official network ID for the EVM sidechain
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "XRP", // Report gas costs natively in XRP
  },
  etherscan: {
    apiKey: process.env.BLOCK_EXPLORER_API_KEY,
  },
};

export default config;
