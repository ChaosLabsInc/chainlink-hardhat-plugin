import { ethers, utils } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import hre from "hardhat";

export async function DeploySetterContract(
  originProxyAddress: string,
  provider: ethers.providers.Provider
): Promise<ethers.Contract> {
  const originContract = await genChainLinkAggregatorContract(
    originProxyAddress,
    provider
  );
  const lastRoundData = await originContract.latestRoundData();
  const mockFactory = new ethers.ContractFactory(
    SetterContractABI,
    SetterContractBytecode
  );
  const mockContract = await mockFactory.deploy(
    lastRoundData.roundId,
    lastRoundData.answer,
    lastRoundData.startedAt,
    lastRoundData.updatedAt,
    lastRoundData.answeredInRound
  );
  mockAggregator(originContract, mockContract, provider);
  return mockContract;
}

async function mockAggregator(
  originAggregator: ethers.Contract,
  aggregatorManipulator: ethers.Contract,
  provider: ethers.providers.Provider
): Promise<void> {
  const chainlinkAggregatorOwner = await originAggregator.owner();
  await hre.network.provider.send("hardhat_setBalance", [
    chainlinkAggregatorOwner,
    utils.parseEther("10"),
    ,
  ]);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [chainlinkAggregatorOwner],
  });
  const rpcProvider = provider as JsonRpcProvider;
  const chainlinkAggOwnerSigner = await rpcProvider.getSigner(
    chainlinkAggregatorOwner
  );
  try {
    await originAggregator
      .connect(chainlinkAggOwnerSigner)
      .proposeAggregator(aggregatorManipulator.address);
  } catch (e) {
    throw new Error(`Failed to propose new aggregator...[${e}]`);
  }
  try {
    await originAggregator
      .connect(chainlinkAggOwnerSigner)
      .confirmAggregator(aggregatorManipulator.address);
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [chainlinkAggregatorOwner],
    });
  } catch (e) {
    throw new Error(`Failed to confirm new aggregator...[${e}]`);
  }
}

async function genChainLinkAggregatorContract(
  originProxyAddress: string,
  provider: ethers.providers.Provider
): Promise<ethers.Contract> {
  return new ethers.Contract(
    originProxyAddress,
    chainlinkAggregatorABI,
    provider
  );
}

const chainlinkAggregatorABI = [
  "function proposeAggregator(address _aggregator) external",
  "function confirmAggregator(address _aggregator) external",
  "function aggregator() external view returns (address)",
  "function owner() external view returns (address)",
  "function latestRoundData() public view virtual override returns (uint80 roundId,int256 answer,uint256 startedAt,uint256 updatedAt,uint80 answeredInRound)",
];

export const SetterContractABI = [
  {
    inputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
    ],
    name: "getRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
    ],
    name: "setAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    name: "setValues",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const SetterContractBytecode =
  "0x608060405234801561001057600080fd5b50604051610568380380610568833981810160405260a081101561003357600080fd5b810190808051906020019092919080519060200190929190805190602001909291908051906020019092919080519060200190929190505050846000806101000a81548169ffffffffffffffffffff021916908369ffffffffffffffffffff16021790555083600181905550826002819055508160038190555080600460006101000a81548169ffffffffffffffffffff021916908369ffffffffffffffffffff160217905550505050505061047a806100ee6000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80637284e4161161005b5780637284e4161461013257806399213cd8146101b55780639a6fc8f5146101e3578063feaf968c1461027d5761007d565b80632c9823de14610082578063313ce567146100f057806354fd4d5014610114575b600080fd5b6100ee600480360360a081101561009857600080fd5b81019080803569ffffffffffffffffffff169060200190929190803590602001909291908035906020019092919080359060200190929190803569ffffffffffffffffffff1690602001909291905050506102e7565b005b6100f861035c565b604051808260ff1660ff16815260200191505060405180910390f35b61011c610364565b6040518082815260200191505060405180910390f35b61013a61036c565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561017a57808201518184015260208101905061015f565b50505050905090810190601f1680156101a75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101e1600480360360208110156101cb57600080fd5b81019080803590602001909291905050506103a9565b005b61021b600480360360208110156101f957600080fd5b81019080803569ffffffffffffffffffff1690602001909291905050506103b3565b604051808669ffffffffffffffffffff1669ffffffffffffffffffff1681526020018581526020018481526020018381526020018269ffffffffffffffffffff1669ffffffffffffffffffff1681526020019550505050505060405180910390f35b6102856103f1565b604051808669ffffffffffffffffffff1669ffffffffffffffffffff1681526020018581526020018481526020018381526020018269ffffffffffffffffffff1669ffffffffffffffffffff1681526020019550505050505060405180910390f35b846000806101000a81548169ffffffffffffffffffff021916908369ffffffffffffffffffff16021790555083600181905550826002819055508160038190555080600460006101000a81548169ffffffffffffffffffff021916908369ffffffffffffffffffff1602179055505050505050565b600080905090565b600080905090565b60606040518060400160405280602081526020017f636f6e7374616e742076616c75652061676772656761746f72206d6f636b6572815250905090565b8060018190555050565b600080600080600085600154600254600354600460009054906101000a900469ffffffffffffffffffff169450945094509450945091939590929450565b60008060008060008060009054906101000a900469ffffffffffffffffffff16600154600254600354600460009054906101000a900469ffffffffffffffffffff1694509450945094509450909192939456fea264697066735822122061a12eb4735c70b5d4e9a6b0632ab1368d4be822954e078b38c3b62af805758e64736f6c63430006060033";
