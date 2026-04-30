cmake_minimum_required(VERSION 3.24)
project(Rippled_PQC_Aegis_Core VERSION 2.0.0 LANGUAGES CXX)

# Enforce Modern C++ for high-performance enterprise code
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# ==============================================================================
# 1. Core Source Aggregation
# ==============================================================================
set(PQC_CORE_SOURCES
    src/crypto/PostQuantumSigner.cpp
    src/crypto/KeyDerivationPQC.cpp
    src/consensus/AvalancheSubnet.cpp
)

# Create the static library for the Aegis node upgrade
add_library(rippled_aegis_core STATIC ${PQC_CORE_SOURCES})

# ==============================================================================
# 2. Compiler Optimization & Security Hardening
# ==============================================================================
# We apply aggressive optimizations to handle the massive polynomial multiplications 
# required by crystals-dilithium without slowing down the XRPL TPS (Transactions Per Second).

if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    message(STATUS "Configuring XRPL Aegis for GCC/Clang with AVX2 instruction sets...")
    target_compile_options(rippled_aegis_core PRIVATE 
        -O3 
        -march=native 
        -mavx2             # Crucial for fast lattice cryptography matrix multiplication
        -Wall 
        -Wextra 
        -Werror
    )
elseif(CMAKE_CXX_COMPILER_ID MATCHES "MSVC")
    message(STATUS "Configuring XRPL Aegis for MSVC...")
    target_compile_options(rippled_aegis_core PRIVATE 
        /O2 
        /arch:AVX2 
        /W4 
        /WX
    )
endif()

# ==============================================================================
# 3. External Dependencies (Hypothetical PQC & Network Hooks)
# ==============================================================================
# In a full build, we would find liboqs (Open Quantum Safe) and OpenSSL here.
# find_package(OQS REQUIRED)
# find_package(OpenSSL REQUIRED)
# target_link_libraries(rippled_aegis_core PRIVATE OQS::oqs OpenSSL::Crypto)

# For the standalone compilation of this conceptual framework:
target_include_directories(rippled_aegis_core PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)

message(STATUS "=======================================================")
message(STATUS " XRPL Aegis Post-Quantum Core Configuration Complete")
message(STATUS "=======================================================")
