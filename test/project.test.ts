// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import path from "path";

import { ChainlinkPriceFeedConfig } from "../src/ChainlinkPriceFeedConfigRuntimeEnvironmentField";

import { useEnvironment } from "./helpers";

describe("Integration tests examples", function () {
  this.timeout(30000),
    describe("Hardhat Runtime Environment extension", function () {
      useEnvironment("hardhat-project");

      it("Should log ChainlinkPriceFeedConfig initialization data", function () {
        assert.instanceOf(
          this.hre.chainlinkPriceFeedConfig,
          ChainlinkPriceFeedConfig
        );
      });

      it("Should log ChainlinkPriceFeedConfig initialization data", async function () {
        const priceFeedConfig = await this.hre.chainlinkPriceFeedConfig.initChainlinkPriceFeedConfig(
          "ETH/USD",
          "Mainnet"
        );
        assert.equal(
          priceFeedConfig,
          "Initializing Chainlink plugin runtime..."
        );
      });
    });

  describe("HardhatConfig extension", function () {
    this.timeout(30000), useEnvironment("hardhat-project");

    it("Should add the newPath to the config", function () {
      assert.equal(
        this.hre.config.paths.newPath,
        path.join(process.cwd(), "asd")
      );
    });
  });
});

describe("Unit tests examples", function () {
  this.timeout(30000),
    describe("ChainlinkPriceFeedConfigRuntimeEnvironmentField", function () {
      describe("get ChainlinkPriceFeedConfig", function () {
        it("Should return ChainlinkPriceFeedConfig", async function () {
          const field = new ChainlinkPriceFeedConfig(this.hre);
          const priceFeedConfig = await field.initChainlinkPriceFeedConfig(
            "ETH/USD",
            "Mainnet"
          );
          assert.equal(
            priceFeedConfig,
            "Initializing Chainlink plugin runtime..."
          );
        });
      });
    });
});

describe("set price test", function () {
  this.timeout(30000),
    describe("ChainlinkPriceFeedConfigRuntimeEnvironmentField", function () {
      describe("get ChainlinkPriceFeedConfig", function () {
        it("Should return ChainlinkPriceFeedConfig", async function () {
          const field = new ChainlinkPriceFeedConfig(this.hre);
          const priceFeedConfig = await field.initChainlinkPriceFeedConfig(
            "ETH/USD",
            "Mainnet"
          );
          const prevPrice = await field.getPrice();
          await field.setPrice("555");
          const nextPrice = await field.getPrice();
          assert.notEqual(prevPrice, nextPrice);
        });
      });
    });
});
