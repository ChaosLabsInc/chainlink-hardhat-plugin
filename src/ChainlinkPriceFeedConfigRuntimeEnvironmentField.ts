import ChainlinkDataFeeds from "./chainlink-data-feeds";

export class ChainlinkPriceFeedConfig {
  chainlinkPriceFeeds: any;

  constructor() {
    console.log("Constructor runs");
  }

  public async initChainlinkPriceFeedConfig() {
    const res = await ChainlinkDataFeeds.getAllPriceFeeds();
    console.log("init res ", res);
    return "Initializing Chainlink plugin runtime...";
  }

  private deployProxyConfiguratorByteCode() {
    return "Deploying bytecode of contract...";
  }

  public logChainlinkConfig() {
    return "Reading Chainlink runtime...";
  }

  public setChainlinkConfig() {
    return "Reading Chainlink runtime...";
  }

  public getChainlinkConfig() {
    return "Reading Chainlink runtime...";
  }

  public setPrice(address: string, price: string) {
    return `Writing price: ${price} to oracle at address ${address}`;
  }

  public getPrice(address: string) {
    return `Reading price feed: at address ${address}`;
  }
}
