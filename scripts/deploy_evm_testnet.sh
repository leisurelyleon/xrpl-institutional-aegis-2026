#!/bin/bash
# ==============================================================================
# AEGIS PROJECT: EVM SIDECHAIN DEPLOYMENT SCRIPT
# Deploys institutional Solidity contracts to the XRPL EVM Sidechain
# ==============================================================================

set -e

echo "======================================================="
echo "  INITIATING HARDHAT DEPLOYMENT (XRPL EVM SIDECHAIN)"
echo "======================================================="

cd ../institutional_smart_contracts

# 1. Verify Dependencies
if [ ! -d "node_modules" ]; then
    echo "[!] node_modules not found. Running npm install..."
    npm install
fi

# 2. Compile Solidity Contracts with Yul IR Optimization
echo "[1/2] Compiling Solidity Contracts (1,000 Optimization Runs)..."
npx hardhat compile

# 3. Execute Deployment to the XRPL EVM Sidechain (Chain ID: 1440002)
echo "[2/2] Broadcasting to XRPL EVM Sidechain RPC..."
# Assuming a custom deployment script exists in the hardhat ignition/scripts folder
npx hardhat run scripts/deploy_aegis_suite.ts --network xrpl_evm_sidechain

echo "======================================================="
echo "  DEPLOYMENT COMPLETE. CONTRACT ADDRESSES LOGGED."
echo "======================================================="
