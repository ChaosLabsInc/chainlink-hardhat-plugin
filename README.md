![Chaos Labs - Chainlink Collab](https://github.com/ChaosLabsInc/chainlink-hardhat-plugin/blob/main/img/ChaosLabsChainlinkHardhatPlugin.jpg)

This repository hosts a CLI utitlity for mocking Chainlink Oracle prices in a local hardhat mainnet fork testing environment. Navigate to our [Quickstart](#quickstart) section to get the repo up and running.

For a full deep dive to the project architecture please visit the [Chaos Labs blog](https://chaoslabs.xyz/blog).

## Why is Mocking Oracle values useful in testing?

Oracle values trigger internal state changes in web3 applications. Currently, when forking mainnent, oracle returns values are constant. This is because the Chainlink protocol only writes updated values to mainnet or public testnets. We want the ability to mock return values easily, so we can test how our contracts / applications react to different types of external data, hence this tool. Below, we provide some specific use cases for mocking oracle return values.

## Use Cases

DeFi protocols and applications are at high risk due to volatile market conditions and a myriad of security vectors. Mocking Chainlink Oracle return values in a controlled, siloed testing environment allows us to address 2 common vectors.

**Volatile Market Conditions**

Volatility is a DeFi constant and is something that all protocols and applications should test for thoroughly. Internal application and protocol state is often a direct result of Oracle returns values. To further illustrate this let's use an example.

Imagine a lending protocol (Maker, AAVE, Benqi, Spectral.finance, etc..) that accepts Ethereum as collateral against stablecoin loans. What happens on a day like Black Thursday, when Ethereum prices cascade negatively to the tune of ~70% in a 48 hour time frame? Well, a lot of things happen 🤦.

![Black Thursday Img](https://github.com/ChaosLabsInc/chainlink-hardhat-plugin/blob/master/img/Cascading-ETH.png)

One critical aspect of responding to market volatiltiy is protocol keepers triggering liquidations and thus ensuring protocol solvency.

With the ability to control Oracle return values, simulating such scenarios in your local development environment is possible.

**Oracle Manipulation**

Oracle manipulation is an additional attack vector. With this method, malicious actors research data sources that various oracle consume as sources of truth. When actors possess the ability to manipulate the underlying data source they trigger downstream effects, manifesting in altered Oracle return values. As a result of manipulated data, actors and contracts can trigger various unwanted behaviours such as modified permissions, transaction execution, emergency pausing / shutdown and more.

With the ability to manipulate Chainlink Oracle return values, simulating such scenarios in your local development environment is possible.

## Installation

<_A step-by-step guide on how to install the plugin_>

```bash
npm install @ChaosLabsInc/chainlink-hardhat-plugin
```

Import the plugin in your `hardhat.config.js`:

```js
require("@chaos-labs/chainlink-hardhat-plugin");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@chaos-labs/chainlink-hardhat-plugin";
```

## Usage

```js
const chainlinkConfig = new hre.ChainlinkPriceFeedConfig(this.hre);
await chainlinkConfig.initChainlinkPriceFeedConfig("ETH/USD", "Mainnet");
const prevPrice = await chainlinkConfig.getPrice();
console.log(`prev price is ${prevPrice}`);
await chainlinkConfig.setPrice("555");
const nextPrice = await chainlinkConfig.getPrice();
console.log(`next price is ${nextPrice}`);
```
