# Dynamic AMM Volatility Mathematics

The `DynamicFeeAMM.sol` contract departs from the traditional XRPL flat-fee AMM model by introducing a volatility-scaled fee curve. This protects institutional RLUSD liquidity providers from impermanent loss during extreme market conditions.

## Constant Product Base

The AMM maintains the core invariant:

$$x \cdot y = k$$

Where:
* $x$ is the reserve balance of Token 0 (XRP).
* $y$ is the reserve balance of Token 1 (RLUSD).
* $k$ is the constant invariant.

## Dynamic Fee Calculation

Let $\Phi_{base}$ represent the base fee tier (e.g., 5 basis points, or 0.05%). Let $V_t$ represent the normalized Time-Weighted Average Price (TWAP) volatility index at time $t$. 

The effective fee $\Phi_{eff}$ charged on an incoming swap $\Delta x$ is calculated as:

$$\Phi_{eff} = \Phi_{base} \times \left( \frac{V_t}{100} \right)$$

The actual output amount $\Delta y$ a trader receives is therefore:

$$\Delta y = \frac{y \cdot \Delta x \cdot (1 - \Phi_{eff})}{x + \Delta x \cdot (1 - \Phi_{eff})}$$

By scaling $\Phi_{eff}$ proportionally with $V_t$, arbitrageurs are forced to pay a premium during high volatility, effectively compensating the Liquidity Providers (LPs) for the increased impermanent loss risk.
