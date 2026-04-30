# Zero-Knowledge EVM Bridge Security Model

## The PLONK Universal SNARK
The `zk_evm_bridge` utilizes a PLONK zero-knowledge proving system. This allows the Rust relayer to mathematically prove that an RLUSD "burn" transaction occurred on the XRPL mainnet without requiring the EVM sidechain to download or verify the entire XRPL state tree.

### 1. Trusted Setup
PLONK requires a one-time trusted setup (Common Reference String). Once established, the verification key is baked directly into the `QuantumMultiSigWallet.sol` and `RLUSD_YieldVault.sol` EVM contracts.

### 2. Threat Model
* **Multi-Sig Compromise:** Traditional bridges rely on 5-of-8 multisig federations. If 5 servers are hacked, the bridge is drained.
* **Aegis Mitigation:** Even if the entire Rust `SidechainRelayer` server is compromised by a state actor, they *cannot* forge a message to the EVM. The Solidity contract only accepts mathematically valid ZK-proofs. Forging a PLONK proof is computationally infeasible.

### 3. Consensus Finality
The bridge only generates a proof once the `AvalancheSubnet.cpp` has reached 100% confidence, ensuring no RLUSD is minted on the EVM sidechain from a transaction that could be orphaned on the XRPL.
