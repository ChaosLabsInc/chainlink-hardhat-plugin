// tslint:disable-next-line no-implicit-dependencies
import { assert, expect } from "chai";
import { ChainlinkPriceFeedConfig } from "../src/ChainlinkPriceFeedConfigRuntimeEnvironmentField";

import { useEnvironment } from "./helpers";

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
          "ETH/USD",
          "Mainnet"
        );
        assert.instanceOf(priceFeedConfig, ChainlinkPriceFeedConfig);
      });
    });
});

describe("Set price of ETH/USD", function () {
  this.timeout(30000),
    describe("Check Oracle Price Setter", function () {
      it("Set price for ETH/USD", async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(
          "ETH/USD",
          "Mainnet"
        );
        const prevPrice = await chainlinkConfig.getPrice();
        await chainlinkConfig.setPrice(555);
        const nextPrice = await chainlinkConfig.getPrice();
        // console.log(prevPrice, nextPrice);
        assert.notEqual(prevPrice, nextPrice);
      });
    });
});

describe("Set price of AAVE/USD", function () {
  this.timeout(30000),
    describe("Check Oracle Price Setter", function () {
      it("Set price for AAVE/USD", async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(
          "AAVE/USD",
          "Mainnet"
        );
        const prevPrice = await chainlinkConfig.getPrice();
        await chainlinkConfig.setPrice(555);
        const nextPrice = await chainlinkConfig.getPrice();
        assert.notEqual(prevPrice, nextPrice);
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
  const ticker = "ETH/USD";
  this.timeout(30000),
    describe("Invalid Price Function", function () {
      it(`Set price for non existent ${ticker}`, async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        try {
          await chainlinkConfig.initChainlinkPriceFeedConfig(
            ticker,
            "Mainnet",
            { delta: 10, priceFunction: "randomString", initialPrice: 0 }
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

describe("Use price config", function () {
  const ticker = "ETH/USD";
  this.timeout(30000),
    describe("Ascending - Initial price is set", function () {
      it(`Set price for non existent ${ticker}`, async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(ticker, "Mainnet", {
          delta: 10,
          priceFunction: "ascending",
          initialPrice: 0,
        });
        const price = await chainlinkConfig.getPrice();
        assert.equal(price.toNumber(), 0);
      });
    });
});

describe("Use price config", function () {
  const ticker = "ETH/USD";
  this.timeout(30000),
    describe("Ascending - Iterator works", function () {
      it(`Set price for non existent ${ticker}`, async function () {
        const chainlinkConfig = new ChainlinkPriceFeedConfig(this.hre);
        await chainlinkConfig.initChainlinkPriceFeedConfig(ticker, "Mainnet", {
          delta: 10,
          priceFunction: "ascending",
          initialPrice: 0,
        });
        const initPrice = await chainlinkConfig.getPrice();
        assert.equal(initPrice.toNumber(), 0);
        await chainlinkConfig.nextPrice();
        const nextPrice = await chainlinkConfig.getPrice();
        assert.equal(nextPrice.toNumber(), 10);
      });
    });
});
