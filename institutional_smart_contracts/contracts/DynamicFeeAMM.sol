// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Dynamic Volatility Automated Market Maker
 * @dev A concentrated liquidity pool utilizing an internal oracle to scale swap fees.
 */
contract DynamicFeeAMM is ReentrancyGuard {
    IERC20 public immutable token0; // e.g., XRP
    IERC20 public immutable token1; // e.g., RLUSD

    uint256 public reserve0;
    uint256 public reserve1;

    // Base fee is 5 basis points (0.05%)
    uint256 public constant BASE_FEE_BPS = 5;
    uint256 public currentVolatilityIndex = 100; // Normalized 100 multiplier

    event Swap(address indexed user, uint256 amountIn, uint256 amountOut, uint256 effectiveFeeBps);

    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    /**
     * @dev Swaps tokens, applying a fee that scales with the current volatility index.
     */
    function swap(uint256 amountIn, bool zeroForOne) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "Invalid input amount");

        // Calculate dynamic fee (Base Fee * Volatility Index / 100)
        // If volatility is 300, fee becomes 15 bps.
        uint256 dynamicFeeBps = (BASE_FEE_BPS * currentVolatilityIndex) / 100;
        uint256 amountInWithFee = amountIn * (10000 - dynamicFeeBps) / 10000;

        // Standard Constant Product Math (x * y = k)
        if (zeroForOne) {
            amountOut = (reserve1 * amountInWithFee) / (reserve0 + amountInWithFee);
            require(token0.transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
            require(token1.transfer(msg.sender, amountOut), "Transfer failed");
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            amountOut = (reserve0 * amountInWithFee) / (reserve1 + amountInWithFee);
            require(token1.transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
            require(token0.transfer(msg.sender, amountOut), "Transfer failed");
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }

        emit Swap(msg.sender, amountIn, amountOut, dynamicFeeBps);
    }

    /**
     * @dev Updates the volatility index based on TWAP deviations. 
     * In production, this would be updated by a decentralized oracle.
     */
    function updateVolatilityIndex(uint256 _newIndex) external {
        // Requires Admin/Oracle Role
        currentVolatilityIndex = _newIndex;
    }
}
