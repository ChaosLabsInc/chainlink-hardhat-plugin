![Chaos Labs - Chainlink Collab](https://github.com/ChaosLabsInc/chainlink-hardhat-plugin/blob/main/img/ChaosLabsChainlinkHardhatPlugin.jpg)

## TLDR

This repository hosts a hardhat plugin for configuring Chainlink Oracle prices in a local hardhat mainnet fork testing environment. The plugin fetches all Mainnet Chainlink Oracle addresses when invoked and makes them accessible for price modification. The only thing the user should supply is the token pair ticker. For example, the user can supply the following tickers:

### Set Prices Explicity with the following init config

```js
await chainlinkConfig.initChainlinkPriceFeedConfig("ETH/USD", "Mainnet");
await chainlinkConfig.initChainlinkPriceFeedConfig("AAVE/USD", "Mainnet");
await chainlinkConfig.initChainlinkPriceFeedConfig("ETH/BTC", "Mainnet");
```

[More on this here!](https://github.com/ChaosLabsInc/chainlink-hardhat-plugin#-usage---set-prices-explicity)

### Set Prices trends with the following config

```js
await chainlinkConfig.initChainlinkPriceFeedConfig(ticker, "Mainnet", {
  delta: 10,
  priceFunction: "volatile",
  initialPrice: 0,
});
```

Grab a config via the [Chainlink portal!](https://chainlink.chaoslabs.xyz/oracle-configuration/chainlink)

[More on this here!](https://github.com/ChaosLabsInc/chainlink-hardhat-plugin#-usage---set-prices-via-configuration)

## Why is Mocking Oracle values useful in testing?

Oracle values trigger internal state changes in web3 applications. Currently, when forking mainnent, oracle returns values are constant. This is because the Chainlink protocol only writes updated values to mainnet or public testnets. We want the ability to mock return values easily, so we can test how our contracts / applications react to different types of external data, hence this tool. Below, we provide some specific use cases for mocking oracle return values.

For a full deep dive to the project architecture please visit the [Chaos Labs blog](https://chaoslabs.xyz/blog).

## Use Cases

DeFi protocols and applications are at high risk due to volatile market conditions and a myriad of security vectors. Mocking Chainlink Oracle return values in a controlled, siloed testing environment allows us to address 2 common vectors.

**Volatile Market Conditions**

Volatility is a DeFi constant and is something that all protocols and applications should test for thoroughly. Internal application and protocol state is often a direct result of Oracle returns values. To further illustrate this let's use an example.

Imagine a lending protocol (Maker, AAVE, Benqi, Spectral.finance, etc..) that accepts Ethereum as collateral against stablecoin loans. What happens on a day like Black Thursday, when Ethereum prices cascade negatively to the tune of ~70% in a 48 hour time frame? Well, a lot of things happen 🤦.

![Black Thursday Img](https://github.com/ChaosLabsInc/chainlink-hardhat-plugin/blob/main/img/Cascading-ETH.png)

One critical aspect of responding to market volatiltiy is protocol keepers triggering liquidations and thus ensuring protocol solvency.

With the ability to control Oracle return values, simulating such scenarios in your local development environment is possible.

**Oracle Manipulation**

Oracle manipulation is an additional attack vector. With this method, malicious actors research data sources that various oracle consume as sources of truth. When actors possess the ability to manipulate the underlying data source they trigger downstream effects, manifesting in altered Oracle return values. As a result of manipulated data, actors and contracts can trigger various unwanted behaviours such as modified permissions, transaction execution, emergency pausing / shutdown and more.

With the ability to manipulate Chainlink Oracle return values, simulating such scenarios in your local development environment is possible.

## Prerequisites

We're going to need an instance of a `hardhat` mainnet fork running in a separate terminal window. For a quickstart, follow the installation steps in our [Chaos Labs demo repo](https://github.com/ChaosLabsInc/demo-plugins-repo).

## Installation

**Step 1**

```bash
npm install ChaosLabsInc/chainlink-hardhat-plugin
```

**Step 2**

Import the plugin in your `hardhat.config.js`:

```js
require("@chaos-labs/chainlink-hardhat-plugin");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@chaos-labs/chainlink-hardhat-plugin";
```

## <a name="explicitusage"></a> Usage - Set Prices Explicity

In this example we will explicitly set the return value of a Chainlink price feed.

```js
const chainlinkConfig = new hre.ChainlinkPriceFeedConfig(this.hre);
await chainlinkConfig.initChainlinkPriceFeedConfig("ETH/USD", "Mainnet");
const prevPrice = await chainlinkConfig.getPrice(); // original price at time of mainnet fork
await chainlinkConfig.setPrice("555");
const nextPrice = await chainlinkConfig.getPrice(); // 555
```

## <a name="configusage"></a> Usage - Set Prices via Configuration

Some test cases require testing trends in pricing. For example, we may want to test examples in which _TokenA_ is decreasing in a monotonic fashion. For this use case we can grab a Chainlink Configuration object and pass it to the `initChainlinkPriceFeedConfig` initializer.

```js
const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
await chainlinkConfig.initChainlinkPriceFeedConfig(ticker, "Mainnet", {
  delta: 10,
  priceFunction: "volatile",
  initialPrice: 0,
});
let price = await chainlinkConfig.getPrice(ticker); // 0
await chainlinkConfig.nextPrice(ticker);
price = await chainlinkConfig.getPrice(ticker); // -10
await chainlinkConfig.nextPrice(ticker);
price = await chainlinkConfig.getPrice(ticker); // 20
```

## Run Tests

Run tests with the following command:

```bash
npm run build && npm run test
```

![Tests output](https://github.com/ChaosLabsInc/chainlink-hardhat-plugin/blob/main/img/RunTests.png)
