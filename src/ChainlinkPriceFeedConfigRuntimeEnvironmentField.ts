import { ethers, Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import ChainlinkDataFeeds from "./chainlink-config/chainlink-data-feeds";
import {
  ChainlinkPriceFeedApiResponse,
  EthereumNetworkType,
} from "./chainlink-config/chainlink-data-types";
import { DeploySetterContract } from "./chainlink-config/contracts";

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

  constructor(hre: HardhatRuntimeEnvironment, url?: string) {
    this.hre = hre;
    this.provider = ethers.getDefaultProvider(url);
  }

  public async initChainlinkPriceFeedConfig(
    ticker: string,
    network: EthereumNetworkType = "Mainnet",
    priceData?: any
  ) {
    this.currentTicker = ticker.replace(/\s+/g, "");
    this.currentEthereumNetwork = network;
    this.chainlinkPriceFeeds = await ChainlinkDataFeeds.getAllPriceFeeds();
    this.currentProxyAddress = await this.convertTickerToProxyAddress(
      this.currentTicker
    );
    this.mockerContract = await this.deployMockerContract();
    this.currentAggregatorContractAddress = this.mockerContract.address;
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

  public async getPrice(): Promise<any> {
    if (this.mockerContract === undefined) {
      throw new Error("mocker contract is not defined");
    }
    const round = await this.mockerContract.latestRoundData();
    return round.answer;
  }

  public async setPrice(price: string): Promise<string> {
    if (this.mockerContract === undefined) {
      throw new Error("mocker contract is not defined");
    }
    await this.mockerContract.setAnswer(price);
    return `Writing price: ${price} to oracle`;
  }

  public async nextPrice(): Promise<any> {}
}
