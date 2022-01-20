import { ethers, Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BigNumber } from "@ethersproject/bignumber";
import ChainlinkDataFeeds from "./chainlink-config/chainlink-data-feeds";
import {
  ChainlinkPriceFeedApiResponse,
  EthereumNetworkType,
} from "./chainlink-config/chainlink-data-types";
import { DeploySetterContract } from "./chainlink-config/contracts";

interface PriceConfig {
  delta: number;
  priceFunction: string;
  initialPrice: number;
}

export class ChainlinkPriceFeedConfig {
  currentEthereumNetwork?: "Mainnet" | "Kovan" | "Rinkeby";
  chainlinkPriceFeeds?: ChainlinkPriceFeedApiResponse;
  currentTicker?: string;
  currentProxyAddress?: string;
  currentAggregatorContractAddress?: string;
  mockerContract?: Contract;
  provider: ethers.providers.Provider;
  priceData: any;
  hre: HardhatRuntimeEnvironment;
  priceConfig?: PriceConfig;
  steps: number;

  constructor(hre: HardhatRuntimeEnvironment, url?: string) {
    this.hre = hre;
    this.provider = ethers.getDefaultProvider(url);
    this.steps = 0;
  }

  public async initChainlinkPriceFeedConfig(
    ticker: string,
    network: EthereumNetworkType = "Mainnet",
    priceConfig?: PriceConfig
  ) {
    this.currentTicker = ticker.replace(/\s+/g, "");
    this.currentEthereumNetwork = network;
    this.chainlinkPriceFeeds = await ChainlinkDataFeeds.getAllPriceFeeds();
    this.currentProxyAddress = await this.convertTickerToProxyAddress(
      this.currentTicker
    );
    this.mockerContract = await this.deployMockerContract();
    this.currentAggregatorContractAddress = this.mockerContract.address;
    if (
      priceConfig &&
      ["ascending", "descending", "volatile"].includes(
        priceConfig.priceFunction
      ) === false
    ) {
      throw new Error("Invalid price function provided");
    }
    this.priceConfig = priceConfig;
    return this;
  }

  private async deployMockerContract(): Promise<Contract> {
    if (this.currentProxyAddress === undefined) {
      throw new Error("current proxy address is not defined");
    }

    return await DeploySetterContract(
      this.currentProxyAddress,
      this.hre,
      this.provider
    );
  }

  private async convertTickerToProxyAddress(ticker: string) {
    if (!ticker || ticker.length < 1) {
      throw new Error("Must pass a valid pair ticker...");
    }
    const trimmedTicker = ticker.trim();
    const proxies = await ChainlinkDataFeeds.getEthereumProxiesForNetwork();
    const foundProxy = proxies.find((p: { pair: string; proxy: string }) => {
      const normalizedPair = p.pair.replace(/\s+/g, "");
      return normalizedPair === trimmedTicker;
    });
    if (!foundProxy || foundProxy === undefined) {
      throw new Error(
        `Could not find valid proxy for provided ticker: ${ticker} `
      );
    }
    return foundProxy.proxy;
  }

  public getChainlinkConfig() {
    return {
      currentEthereumNetwork: this.currentEthereumNetwork,
      currentTicker: this.currentTicker,
      chainlinkPriceFeeds: this.chainlinkPriceFeeds,
      currentProxyAddress: this.currentProxyAddress,
    };
  }

  public async getPrice(): Promise<BigNumber> {
    if (this.mockerContract === undefined) {
      throw new Error("mocker contract is not defined");
    }
    const round = await this.mockerContract.latestRoundData();
    return round.answer;
  }

  public async nextPrice(): Promise<void> {
    if (this.priceConfig === undefined) {
      throw new Error("Configuration not provided");
    }

    this.steps++;
    switch (this.priceConfig.priceFunction) {
      case "asecnding":
        await this.setPrice(
          this.priceConfig.initialPrice + this.steps * this.priceConfig.delta
        );
      case "descending":
        await this.setPrice(
          this.priceConfig.initialPrice - this.steps * this.priceConfig.delta
        );
      case "volatile":
        await this.setPrice(
          this.priceConfig.initialPrice +
            -1 * (this.steps * this.priceConfig.delta)
        );
    }
  }

  public async setPrice(price: number): Promise<void> {
    if (this.mockerContract === undefined) {
      throw new Error("mocker contract is not defined");
    }
    await this.mockerContract.setAnswer(price);
  }
}
