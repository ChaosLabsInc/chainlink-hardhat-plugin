export type Proxy = {
  pair: string;
  deviationThreshold: number;
  heartbeat: string;
  decimals: number;
  proxy: string;
};

export type EthereumNetwork = {
  name: string;
  url: string;
  proxies: Array<Proxy>;
};

export type ChainlinkPriceFeedApiResponse = {
  "ethereum-addresses": {
    title: string;
    networks: Array<EthereumNetwork>;
  };
};

export type EthereumNetworkType = "Mainnet" | "Kovan" | "Rinkeby";
