// tslint:disable-next-line no-implicit-dependencies
import { assert, expect } from "chai";
import { ChainlinkPriceFeedConfig } from "../src/ChainlinkPriceFeedConfigRuntimeEnvironmentField";

import { useEnvironment } from "./helpers";

const TICKERS = [
  "BTT/USD",
  "BUSD/ETH",
  "ETH/USD",
  "ETH/BTC",
  "BUSD/USD",
  "COMP/ETH",
  "COMP/USD",
  "ETH/BTC",
];

describe("Check typing of ChainlinkPriceFeedConfig", function () {
  this.timeout(30000),
    describe("Hardhat Runtime Environment extension", function () {
      useEnvironment("hardhat-project");

      it("HRE Runtime Extension should have field of type ChainlinkPriceFeedConfig", function () {
        assert.instanceOf(
          this.hre.chainlinkPriceFeedConfig,
          ChainlinkPriceFeedConfig
        );
      });

      it("ChainlinkPriceFeedConfig initializer should return instance of ChainlinkPriceFeedConfig", async function () {
        const priceFeedConfig = await this.hre.chainlinkPriceFeedConfig.initChainlinkPriceFeedConfig(
          "1INCH/ETH",
          "Mainnet"
        );
        assert.instanceOf(priceFeedConfig, ChainlinkPriceFeedConfig);
      });
    });
});

describe("Set price of 1INCH/USD", function () {
  const ticker = "1INCH/USD";
  this.timeout(30000),
    describe("Check Oracle Price Setter", function () {
      it("Set price for 1INCH/USD", async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(
          "1INCH/USD",
          "Mainnet"
        );
        const prevPrice = await chainlinkConfig.getPrice(ticker);
        await chainlinkConfig.setPrice(ticker, 555);
        const nextPrice = await chainlinkConfig.getPrice(ticker);
        assert.notEqual(prevPrice, nextPrice);
      });
    });
});

describe("Set price of AAVE/USD", function () {
  const ticker = "AAVE/USD";
  this.timeout(30000),
    describe("Check Oracle Price Setter", function () {
      it("Set price for AAVE/USD", async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(
          "AAVE/USD",
          "Mainnet"
        );
        const prevPrice = await chainlinkConfig.getPrice(ticker);
        await chainlinkConfig.setPrice(ticker, 555);
        const nextPrice = await chainlinkConfig.getPrice(ticker);
        assert.notEqual(prevPrice, nextPrice);
      });
    });
});

describe("Fetch AAVE/USD Ticker Config ", function () {
  const ticker = "AAVE/USD";
  this.timeout(30000),
    describe("Check Ticker Config", function () {
      it("Gets AAVE/USD Ticker Config", async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(
          ticker,
          "Mainnet"
        );
        await chainlinkConfig.getPrice(ticker);
        await chainlinkConfig.setPrice(ticker, 555);
        await chainlinkConfig.getPrice(ticker);
        const tickerConfig = chainlinkConfig.getTickerConfig(ticker)
        assert.isString(tickerConfig.ticker); // AAVE/USD
        assert.isString(tickerConfig.proxyAddress); // Chainlink price feed address
        assert.isString(tickerConfig.aggregatorContractAddress); // mocker contract address
      });
    });
});

describe("Fetch AAVE/USD Ticker MockedContractAddress ", function () {
  const ticker = "AAVE/USD";
  this.timeout(30000),
    describe("Check Ticker Config", function () {
      it("Gets AAVE/USD Ticker Config", async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(
          ticker,
          "Mainnet"
        );
        await chainlinkConfig.getPrice(ticker);
        await chainlinkConfig.setPrice(ticker, 555);
        await chainlinkConfig.getPrice(ticker);
        const mockedChainlinkContractAddress = chainlinkConfig.getMockedChainlinkAggregatorAddressForTicker(ticker)
        assert.isString(mockedChainlinkContractAddress); // mocker contract address
      });
    });
});

describe("Set price of non existent ticker ABC/USD", function () {
  const ticker = "ABC/USD";
  this.timeout(30000),
    describe("Check Oracle Price Setter", function () {
      it(`Set price for non existent ${ticker}`, async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        try {
          await chainlinkConfig.initChainlinkPriceFeedConfig(ticker, "Mainnet");
          assert.isTrue(
            false,
            "Should throw before reaching this line since ticker is not valid."
          );
        } catch (e) {
          const err = e as Error;
          expect(err.message).contains(
            `Could not find valid proxy for provided ticker: ${ticker}`,
            "Expected error message"
          );
        }
      });
    });
});

describe("Use price config", function () {
  const ticker = TICKERS[1];
  this.timeout(30000),
    describe("Invalid Price Function", function () {
      it(`Set price for ${ticker}`, async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        try {
          await chainlinkConfig.initChainlinkPriceFeedConfig(
            ticker,
            "Mainnet",
            { priceDelta: 10, priceFunction: "randomString", initialPrice: 0 }
          );
          assert.isTrue(
            false,
            "Should throw before reaching this line since ticker is not valid."
          );
        } catch (e) {
          const err = e as Error;
          expect(err.message).contains(
            "Invalid price function provided",
            "Expected error message"
          );
        }
      });
    });
});

describe("Use price config - Const", function () {
  const ticker = TICKERS[2];
  this.timeout(30000),
    describe("Initial price is set via price config", function () {
      it(`Set price for ${ticker}`, async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(ticker, "Mainnet", {
          priceDelta: 10,
          priceFunction: "ascending",
          initialPrice: 1,
        });
        const price = await chainlinkConfig.getPrice(ticker);
        assert.equal(price.toString(), "1");
      });
    });
});

describe("Use price config Ascending", function () {
  const ticker = TICKERS[3];
  this.timeout(30000),
    describe("Ascending - Iterator works", function () {
      it(`Set price for ${ticker}`, async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(ticker, "Mainnet", {
          priceDelta: 10,
          priceFunction: "ascending",
          initialPrice: 0,
        });
        const initPrice = await chainlinkConfig.getPrice(ticker);
        assert.equal(initPrice.toString(), "0");
        await chainlinkConfig.nextPrice(ticker);
        const nextPrice = await chainlinkConfig.getPrice(ticker);
        assert.equal(nextPrice.toString(), "10");
      });
    });
});

describe("Use price config Descending", function () {
  const ticker = TICKERS[4];
  this.timeout(30000),
    describe("Descending - Iterator works", function () {
      it(`Set price for ${ticker}`, async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(ticker, "Mainnet", {
          priceDelta: 10,
          priceFunction: "descending",
          initialPrice: 0,
        });
        const initPrice = await chainlinkConfig.getPrice(ticker);
        assert.equal(initPrice.toString(), "0");
        await chainlinkConfig.nextPrice(ticker);
        const nextPrice = await chainlinkConfig.getPrice(ticker);
        assert.equal(nextPrice.toString(), "-10");
      });
    });
});

describe("Use price config Volatile", function () {
  const ticker = TICKERS[5];
  this.timeout(30000),
    describe("Volatile - Iterator works", function () {
      it(`Set price for ${ticker}`, async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(ticker, "Mainnet", {
          priceDelta: 10,
          priceFunction: "volatile",
          initialPrice: 0,
        });
        let price = await chainlinkConfig.getPrice(ticker);
        assert.equal(price.toString(), "0");
        await chainlinkConfig.nextPrice(ticker);
        price = await chainlinkConfig.getPrice(ticker);
        assert.equal(price.toString(), "-10");
        await chainlinkConfig.nextPrice(ticker);
        price = await chainlinkConfig.getPrice(ticker);
        assert.equal(price.toString(), "20");
      });
    });
});
