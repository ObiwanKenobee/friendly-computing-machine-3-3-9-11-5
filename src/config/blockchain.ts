export const blockchainConfig = {
  // Supported Networks
  networks: {
    ethereum: {
      chainId: 1,
      name: "Ethereum Mainnet",
      currency: "ETH",
      rpcUrl:
        import.meta.env.VITE_ETHEREUM_RPC_URL ||
        "https://mainnet.infura.io/v3/",
      explorerUrl: "https://etherscan.io",
      multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
      contracts: {
        tokenFactory: import.meta.env.VITE_ETHEREUM_TOKEN_FACTORY || "",
        assetRegistry: import.meta.env.VITE_ETHEREUM_ASSET_REGISTRY || "",
        governance: import.meta.env.VITE_ETHEREUM_GOVERNANCE || "",
        treasury: import.meta.env.VITE_ETHEREUM_TREASURY || "",
      },
    },
    polygon: {
      chainId: 137,
      name: "Polygon",
      currency: "MATIC",
      rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL || "https://polygon-rpc.com",
      explorerUrl: "https://polygonscan.com",
      multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
      contracts: {
        tokenFactory: import.meta.env.VITE_POLYGON_TOKEN_FACTORY || "",
        assetRegistry: import.meta.env.VITE_POLYGON_ASSET_REGISTRY || "",
        governance: import.meta.env.VITE_POLYGON_GOVERNANCE || "",
        treasury: import.meta.env.VITE_POLYGON_TREASURY || "",
      },
    },
    bsc: {
      chainId: 56,
      name: "Binance Smart Chain",
      currency: "BNB",
      rpcUrl:
        import.meta.env.VITE_BSC_RPC_URL || "https://bsc-dataseed1.binance.org",
      explorerUrl: "https://bscscan.com",
      multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
      contracts: {
        tokenFactory: import.meta.env.VITE_BSC_TOKEN_FACTORY || "",
        assetRegistry: import.meta.env.VITE_BSC_ASSET_REGISTRY || "",
        governance: import.meta.env.VITE_BSC_GOVERNANCE || "",
        treasury: import.meta.env.VITE_BSC_TREASURY || "",
      },
    },
    arbitrum: {
      chainId: 42161,
      name: "Arbitrum One",
      currency: "ETH",
      rpcUrl:
        import.meta.env.VITE_ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
      explorerUrl: "https://arbiscan.io",
      multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
      contracts: {
        tokenFactory: import.meta.env.VITE_ARBITRUM_TOKEN_FACTORY || "",
        assetRegistry: import.meta.env.VITE_ARBITRUM_ASSET_REGISTRY || "",
        governance: import.meta.env.VITE_ARBITRUM_GOVERNANCE || "",
        treasury: import.meta.env.VITE_ARBITRUM_TREASURY || "",
      },
    },
  },

  // Default Network
  defaultNetwork: "ethereum",

  // Wallet Providers
  walletProviders: {
    metamask: {
      name: "MetaMask",
      icon: "/icons/metamask.svg",
      deepLink: "https://metamask.app.link",
      downloadUrl: "https://metamask.io/download/",
    },
    walletConnect: {
      name: "WalletConnect",
      icon: "/icons/walletconnect.svg",
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    },
    coinbase: {
      name: "Coinbase Wallet",
      icon: "/icons/coinbase.svg",
      appName: "QuantumVest",
    },
    trust: {
      name: "Trust Wallet",
      icon: "/icons/trust.svg",
      deepLink: "https://link.trustwallet.com",
    },
  },

  // Smart Contract ABIs
  abis: {
    erc20: [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)",
      "function transfer(address, uint256) returns (bool)",
      "function transferFrom(address, address, uint256) returns (bool)",
      "function approve(address, uint256) returns (bool)",
      "function allowance(address, address) view returns (uint256)",
      "event Transfer(address indexed, address indexed, uint256)",
      "event Approval(address indexed, address indexed, uint256)",
    ],
    tokenizedAsset: [
      "function mint(address, uint256) returns (bool)",
      "function burn(uint256) returns (bool)",
      "function setMetadata(string) returns (bool)",
      "function getMetadata() view returns (string)",
      "function transfer(address, uint256) returns (bool)",
      "function approve(address, uint256) returns (bool)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)",
      "event AssetTokenized(address indexed, uint256, string)",
      "event MetadataUpdated(string)",
    ],
    governance: [
      "function propose(string, string, address[], uint256[], bytes[]) returns (uint256)",
      "function vote(uint256, bool) returns (bool)",
      "function execute(uint256) returns (bool)",
      "function getProposal(uint256) view returns (string, string, uint256, uint256, bool)",
      "function getVotes(address) view returns (uint256)",
      "event ProposalCreated(uint256 indexed, address indexed, string)",
      "event VoteCast(uint256 indexed, address indexed, bool, uint256)",
      "event ProposalExecuted(uint256 indexed)",
    ],
  },

  // Transaction Settings
  transaction: {
    confirmations: {
      ethereum: 12,
      polygon: 20,
      bsc: 15,
      arbitrum: 1,
    },
    timeout: 300000, // 5 minutes
    gasSettings: {
      ethereum: {
        gasLimit: 500000,
        maxFeePerGas: "50000000000", // 50 gwei
        maxPriorityFeePerGas: "2000000000", // 2 gwei
      },
      polygon: {
        gasLimit: 500000,
        maxFeePerGas: "50000000000", // 50 gwei
        maxPriorityFeePerGas: "30000000000", // 30 gwei
      },
      bsc: {
        gasLimit: 500000,
        gasPrice: "5000000000", // 5 gwei
      },
      arbitrum: {
        gasLimit: 1000000,
        maxFeePerGas: "100000000", // 0.1 gwei
        maxPriorityFeePerGas: "10000000", // 0.01 gwei
      },
    },
  },

  // Token Standards
  tokenStandards: {
    erc20: {
      name: "ERC-20",
      description: "Fungible tokens",
      interface: "ERC20",
    },
    erc721: {
      name: "ERC-721",
      description: "Non-fungible tokens",
      interface: "ERC721",
    },
    erc1155: {
      name: "ERC-1155",
      description: "Multi-token standard",
      interface: "ERC1155",
    },
    erc1400: {
      name: "ERC-1400",
      description: "Security tokens",
      interface: "ERC1400",
    },
  },

  // Oracle Configuration
  oracles: {
    chainlink: {
      enabled: true,
      feeds: {
        "ETH/USD": "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        "BTC/USD": "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
        "MATIC/USD": "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",
        "BNB/USD": "0x14e613AC84a31f709eadbdF89C6CC390fDc9540A",
      },
    },
    custom: {
      enabled: true,
      endpoint: import.meta.env.VITE_CUSTOM_ORACLE_ENDPOINT || "",
      apiKey: import.meta.env.VITE_CUSTOM_ORACLE_API_KEY || "",
    },
  },

  // IPFS Configuration
  ipfs: {
    gateway: import.meta.env.VITE_IPFS_GATEWAY || "https://ipfs.io/ipfs/",
    pinataApiKey: import.meta.env.VITE_PINATA_API_KEY || "",
    pinataSecretKey: import.meta.env.VITE_PINATA_SECRET_KEY || "",
  },

  // DeFi Protocols
  defi: {
    uniswap: {
      v2Router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      v3Router: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      quoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    },
    sushiswap: {
      router: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
    },
    aave: {
      lendingPool: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
      dataProvider: "0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d",
    },
    compound: {
      comptroller: "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
    },
  },

  // Security Settings
  security: {
    maxSlippage: 0.05, // 5%
    maxGasPrice: "100000000000", // 100 gwei
    trustedContracts: [],
    blacklistedAddresses: [],
    requireSignature: true,
    multiSigThreshold: 2,
  },

  // Monitoring
  monitoring: {
    enabled: true,
    blockExplorerApi: {
      ethereum: import.meta.env.VITE_ETHERSCAN_API_KEY || "",
      polygon: import.meta.env.VITE_POLYGONSCAN_API_KEY || "",
      bsc: import.meta.env.VITE_BSCSCAN_API_KEY || "",
      arbitrum: import.meta.env.VITE_ARBISCAN_API_KEY || "",
    },
    webhooks: {
      enabled: false,
      endpoint: import.meta.env.VITE_WEBHOOK_ENDPOINT || "",
    },
  },
};

// Helper functions
export const getNetworkConfig = (chainId: number) => {
  return Object.values(blockchainConfig.networks).find(
    (network) => network.chainId === chainId,
  );
};

export const getSupportedChainIds = (): number[] => {
  return Object.values(blockchainConfig.networks).map(
    (network) => network.chainId,
  );
};

export const getContractAddress = (
  network: string,
  contract: string,
): string => {
  const networkConfig =
    blockchainConfig.networks[
      network as keyof typeof blockchainConfig.networks
    ];
  return (
    networkConfig?.contracts[
      contract as keyof typeof networkConfig.contracts
    ] || ""
  );
};

export const isNetworkSupported = (chainId: number): boolean => {
  return getSupportedChainIds().includes(chainId);
};

export default blockchainConfig;
