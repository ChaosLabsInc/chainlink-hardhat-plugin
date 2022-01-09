import { ContractTransaction, ethers, Contract } from "ethers";
import ChainlinkDataFeeds from "./chainlink-data-feeds";
import {
  ChainlinkPriceFeedApiResponse,
  EthereumNetworkType,
} from "./chainlink-data-types";
import { DeploySetterContract } from "./contracts";

export class ChainlinkPriceFeedConfig {
  currentEthereumNetwork?: "Mainnet" | "Kovan" | "Rinkeby";
  chainlinkPriceFeeds?: ChainlinkPriceFeedApiResponse;
  currentTicker?: string;
  currentProxyAddress?: string;
  currentAggregatorContractAddress?: string;
  mockerContract?: Contract;
  provider?: ethers.providers.Provider; //TODO - init provider - @omer & @yhayun

  constructor() {}

  public async initChainlinkPriceFeedConfig(
    ticker: string,
    network: EthereumNetworkType = "Mainnet"
  ) {
    this.currentTicker = ticker.replace(/\s+/g, "");
    this.currentEthereumNetwork = network;
    this.chainlinkPriceFeeds = await ChainlinkDataFeeds.getAllPriceFeeds();
    this.currentProxyAddress = await this.convertTickerToProxyAddress(
      this.currentTicker
    );
    console.log(
      `ticker ${this.currentTicker}, currentProxyAddress ${this.currentProxyAddress}`
    );
    this.mockerContract = await this.deployMockerContract();
    this.currentAggregatorContractAddress = this.mockerContract.address;
    return "Initializing Chainlink plugin runtime...";
  }

  private async deployMockerContract(): Promise<Contract> {
    if (this.currentProxyAddress === undefined) {
      throw new Error("current proxy address is not defined");
    }
    if (this.provider === undefined) {
      throw new Error("provider is not defined");
    }
    return await DeploySetterContract(this.currentProxyAddress, this.provider);
  }

  private async convertTickerToProxyAddress(ticker: string) {
    // TODO: Write Ticker
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

  public async setPrice(address: string, price: string) {
    if (this.mockerContract === undefined) {
      throw new Error("mocker contract is not defined");
    }
    await this.mockerContract.setAnswer(price);
    return `Writing price: ${price} to oracle at address ${address}`;
  }

  public async getPrice(address: string): Promise<any> {
    if (this.mockerContract === undefined) {
      throw new Error("mocker contract is not defined");
    }
    const round = await this.mockerContract.latestRoundData();
    return round.answer;
  }
}
