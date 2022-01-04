// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import path from "path";

import { ChainlinkPriceFeedConfig } from "../src/ChainlinkPriceFeedConfigRuntimeEnvironmentField";

import { useEnvironment } from "./helpers";

describe("Integration tests examples", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it("Should add the example field", function () {
      assert.instanceOf(
        this.hre.chainlinkPriceFeedConfig,
        ChainlinkPriceFeedConfig
      );
    });

    it("Should log ChainlinkPriceFeedConfig initialization data", function () {
      assert.equal(
        this.hre.chainlinkPriceFeedConfig.initChainlinkPriceFeedConfig(),
        "hello"
      );
    });
  });

  describe("HardhatConfig extension", function () {
    useEnvironment("hardhat-project");

    it("Should add the newPath to the config", function () {
      assert.equal(
        this.hre.config.paths.newPath,
        path.join(process.cwd(), "asd")
      );
    });
  });
});

describe("Unit tests examples", function () {
  describe("ChainlinkPriceFeedConfigRuntimeEnvironmentField", function () {
    describe("sayHello", function () {
      it("Should return ChainlinkPriceFeedConfig", function () {
        const field = new ChainlinkPriceFeedConfig();
        assert.equal(field.initChainlinkPriceFeedConfig(), "hello");
      });
    });
  });
});
