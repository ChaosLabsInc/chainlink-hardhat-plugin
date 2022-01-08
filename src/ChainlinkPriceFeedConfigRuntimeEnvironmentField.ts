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

  constructor() {
    console.log("Constructor runs");
  }

  public async initChainlinkPriceFeedConfig(
    ticker: string,
    network: EthereumNetworkType | null = "Mainnet"
  ) {
    this.currentTicker = ticker;
    this.currentEthereumNetwork = network || "Mainnet";
    this.chainlinkPriceFeeds = await ChainlinkDataFeeds.getAllPriceFeeds();
    this.currentProxyAddress = await this.convertTickerToProxyAddress(ticker);
    console.log(this.chainlinkPriceFeeds);
    return "Initializing Chainlink plugin runtime...";
  }

  private deployProxyConfiguratorByteCode() {
    // TODO: Deploy bytecode ... @yhayun
    return "Deploying bytecode of contract...";
  }

  private convertTickerToProxyAddress(ticker: string) {
    // TODO: Write Ticker
    return "Deploying bytecode of contract...";
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
