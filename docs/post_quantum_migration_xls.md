# XLS-99d: Post-Quantum Cryptography (PQC) Migration

**Status:** Draft / Conceptual
**Author:** XRPL Institutional Architecture Team
**Type:** Standards Track

## 1. Abstract
This proposal introduces a transition plan for the XRP Ledger to support lattice-based, quantum-resistant signature schemes. It specifically implements **CRYSTALS-Dilithium5 (ML-DSA-87)** as a primary signing algorithm, deprecating Ed25519 for high-value institutional accounts.

## 2. Motivation
Shor's algorithm, running on a sufficiently powerful quantum computer, will break the Discrete Logarithm Problem (DLP) that secures `secp256k1` and `Ed25519`. With trillions of dollars in Real-World Assets (RWA) and RLUSD stablecoins settling on the XRPL, the network must upgrade its cryptographic primitives proactively.

## 3. Specification
* **Account Addresses:** PQC addresses will utilize a new base58 prefix (`q` instead of `r`) to denote a quantum-secured account.
* **Key Derivation:** Seeds will be expanded using `SHAKE256` to generate the 4,864-byte secret key matrices.
* **Signature Payload:** Transactions signed with Dilithium will have a modified `TxnSignature` field capable of holding the 4,627-byte payload, handled by the new `PostQuantumSigner.cpp` core module.

## 4. Backwards Compatibility
Existing `secp256k1` accounts will remain valid, but the ledger will allow users to invoke a `SetRegularKey` transaction to formally migrate their signing authority to a PQC keypair.
