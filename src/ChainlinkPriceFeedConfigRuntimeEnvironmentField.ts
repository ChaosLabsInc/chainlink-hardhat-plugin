import ChainlinkDataFeeds from "./chainlink-data-feeds";
import {
  ChainlinkPriceFeedApiResponse,
  EthereumNetworkType,
} from "./chainlink-data-types";

export class ChainlinkPriceFeedConfig {
  currentEthereumNetwork?: "Mainnet" | "Kovan" | "Rinkeby";
  chainlinkPriceFeeds?: ChainlinkPriceFeedApiResponse;
  currentTicker?: string;
  currentProxyAddress?: string;
  currentAggregatorContractAddress?: string;

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
    this.currentAggregatorContractAddress = await this.deployProxyConfiguratorByteCode();
    return "Initializing Chainlink plugin runtime...";
  }

  private async deployProxyConfiguratorByteCode(): Promise<string> {
    // TODO: Deploy bytecode ... @yhayun
    return "Deploying bytecode of contract...";
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
    // TODO: Smart Contract call... @yhayun
    return `Writing price: ${price} to oracle at address ${address}`;
  }

  public async getPrice(address: string) {
    // TODO: Smart Contract call... @yhayun
    return `Reading price feed: at address ${address}`;
  }
}
