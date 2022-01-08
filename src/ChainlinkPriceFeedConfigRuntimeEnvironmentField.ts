export class ChainlinkPriceFeedConfig {
  public initChainlinkPriceFeedConfig() {
    return "Initializing Chainlink plugin runtime...";
  }

  public logChainlinkConfig() {
    return "Reading Chainlink runtime...";
  }

  public readChainlinkConfig() {
    return "Reading Chainlink runtime...";
  }

  public writePrice(address: string, price: string) {
    return `Writing price: ${price} to oracle at address ${address}`;
  }

  public readPrice(address: string) {
    return `Reading price feed: at address ${address}`;
  }
}
