import { ethers } from "ethers";
import {
  blockchainConfig,
  getNetworkConfig,
  getContractAddress,
} from "../config/blockchain";
import { fetcher } from "../utils/fetcher";
import type { TokenizedAsset, TokenHolding } from "../types/TokenizedAsset";
import type { Transaction } from "../types/Wallet";

export class BlockchainService {
  private static instance: BlockchainService;
  private providers: Map<string, ethers.providers.JsonRpcProvider> = new Map();
  private contracts: Map<string, ethers.Contract> = new Map();
  private signer?: ethers.Signer;

  static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  /**
   * Initialize providers for supported networks
   */
  async initialize(): Promise<void> {
    try {
      for (const [networkName, config] of Object.entries(
        blockchainConfig.networks,
      )) {
        const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
        this.providers.set(networkName, provider);
      }

      // Initialize contracts
      await this.initializeContracts();

      console.log("Blockchain service initialized successfully");
    } catch (error) {
      console.error("Error initializing blockchain service:", error);
      throw new Error("Failed to initialize blockchain service");
    }
  }

  /**
   * Connect wallet and set signer
   */
  async connectWallet(): Promise<string> {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet detected");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = provider.getSigner();

      const address = await this.signer.getAddress();

      // Switch to default network if needed
      await this.switchNetwork(blockchainConfig.defaultNetwork);

      return address;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw new Error("Failed to connect wallet");
    }
  }

  /**
   * Switch to a different network
   */
  async switchNetwork(networkName: string): Promise<void> {
    const networkConfig = blockchainConfig.networks[networkName];
    if (!networkConfig) {
      throw new Error(`Network ${networkName} not supported`);
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(networkConfig.chainId) }],
      });
    } catch (switchError: any) {
      // Network not added to wallet, try to add it
      if (switchError.code === 4902) {
        await this.addNetwork(networkName);
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Add network to wallet
   */
  private async addNetwork(networkName: string): Promise<void> {
    const networkConfig = blockchainConfig.networks[networkName];

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: ethers.utils.hexValue(networkConfig.chainId),
          chainName: networkConfig.name,
          nativeCurrency: {
            name: networkConfig.currency,
            symbol: networkConfig.currency,
            decimals: 18,
          },
          rpcUrls: [networkConfig.rpcUrl],
          blockExplorerUrls: [networkConfig.explorerUrl],
        },
      ],
    });
  }

  /**
   * Create tokenized asset
   */
  async createTokenizedAsset(
    assetData: Omit<
      TokenizedAsset,
      "id" | "contractAddress" | "createdAt" | "updatedAt"
    >,
    networkName: string = blockchainConfig.defaultNetwork,
  ): Promise<TokenizedAsset> {
    try {
      if (!this.signer) {
        throw new Error("Wallet not connected");
      }

      const contract = this.getContract("tokenFactory", networkName);

      // Prepare metadata
      const metadata = JSON.stringify({
        name: assetData.name,
        description: assetData.description,
        image: assetData.images[0],
        attributes: assetData.metadata,
      });

      // Upload metadata to IPFS
      const metadataUri = await this.uploadToIPFS(metadata);

      // Deploy token contract
      const tx = await contract.createToken(
        assetData.name,
        assetData.symbol,
        assetData.totalSupply,
        assetData.pricePerToken,
        metadataUri,
      );

      const receipt = await tx.wait();
      const tokenAddress = this.extractTokenAddress(receipt);

      return {
        ...assetData,
        id: this.generateId(),
        contractAddress: tokenAddress,
        blockchain: networkName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error creating tokenized asset:", error);
      throw new Error("Failed to create tokenized asset");
    }
  }

  /**
   * Purchase tokens
   */
  async purchaseTokens(
    contractAddress: string,
    amount: number,
    networkName: string = blockchainConfig.defaultNetwork,
  ): Promise<Transaction> {
    try {
      if (!this.signer) {
        throw new Error("Wallet not connected");
      }

      const tokenContract = new ethers.Contract(
        contractAddress,
        blockchainConfig.abis.tokenizedAsset,
        this.signer,
      );

      const userAddress = await this.signer.getAddress();
      const pricePerToken = await tokenContract.pricePerToken();
      const totalCost = ethers.utils.parseEther(
        (
          amount * parseFloat(ethers.utils.formatEther(pricePerToken))
        ).toString(),
      );

      const tx = await tokenContract.purchase(amount, {
        value: totalCost,
        gasLimit:
          blockchainConfig.transaction.gasSettings[networkName].gasLimit,
      });

      return {
        id: this.generateId(),
        walletId: userAddress,
        type: "invest",
        status: "pending",
        toAddress: contractAddress,
        amount: amount,
        asset: contractAddress,
        fee: 0, // Will be calculated from gas
        feeAsset: blockchainConfig.networks[networkName].currency,
        hash: tx.hash,
        blockchain: networkName,
        blockNumber: 0,
        confirmations: 0,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      throw new Error("Failed to purchase tokens");
    }
  }

  /**
   * Get token balance
   */
  async getTokenBalance(
    contractAddress: string,
    userAddress: string,
    networkName: string = blockchainConfig.defaultNetwork,
  ): Promise<number> {
    try {
      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Provider for ${networkName} not found`);
      }

      const tokenContract = new ethers.Contract(
        contractAddress,
        blockchainConfig.abis.erc20,
        provider,
      );

      const balance = await tokenContract.balanceOf(userAddress);
      const decimals = await tokenContract.decimals();

      return parseFloat(ethers.utils.formatUnits(balance, decimals));
    } catch (error) {
      console.error("Error getting token balance:", error);
      return 0;
    }
  }

  /**
   * Get token information
   */
  async getTokenInfo(
    contractAddress: string,
    networkName: string = blockchainConfig.defaultNetwork,
  ): Promise<Partial<TokenizedAsset>> {
    try {
      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Provider for ${networkName} not found`);
      }

      const tokenContract = new ethers.Contract(
        contractAddress,
        blockchainConfig.abis.tokenizedAsset,
        provider,
      );

      const [name, symbol, totalSupply, pricePerToken, metadataUri] =
        await Promise.all([
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.totalSupply(),
          tokenContract.pricePerToken(),
          tokenContract.getMetadata(),
        ]);

      const metadata = await this.fetchFromIPFS(metadataUri);

      return {
        name,
        symbol,
        totalSupply: parseInt(totalSupply.toString()),
        pricePerToken: parseFloat(ethers.utils.formatEther(pricePerToken)),
        contractAddress,
        blockchain: networkName,
        metadata: metadata ? JSON.parse(metadata) : {},
      };
    } catch (error) {
      console.error("Error getting token info:", error);
      throw new Error("Failed to get token information");
    }
  }

  /**
   * Transfer tokens
   */
  async transferTokens(
    contractAddress: string,
    toAddress: string,
    amount: number,
    networkName: string = blockchainConfig.defaultNetwork,
  ): Promise<Transaction> {
    try {
      if (!this.signer) {
        throw new Error("Wallet not connected");
      }

      const tokenContract = new ethers.Contract(
        contractAddress,
        blockchainConfig.abis.erc20,
        this.signer,
      );

      const decimals = await tokenContract.decimals();
      const transferAmount = ethers.utils.parseUnits(
        amount.toString(),
        decimals,
      );

      const tx = await tokenContract.transfer(toAddress, transferAmount);

      return {
        id: this.generateId(),
        walletId: await this.signer.getAddress(),
        type: "send",
        status: "pending",
        fromAddress: await this.signer.getAddress(),
        toAddress,
        amount,
        asset: contractAddress,
        fee: 0,
        feeAsset: blockchainConfig.networks[networkName].currency,
        hash: tx.hash,
        blockchain: networkName,
        blockNumber: 0,
        confirmations: 0,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Error transferring tokens:", error);
      throw new Error("Failed to transfer tokens");
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(
    userAddress: string,
    contractAddress?: string,
    networkName: string = blockchainConfig.defaultNetwork,
  ): Promise<Transaction[]> {
    try {
      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Provider for ${networkName} not found`);
      }

      const filter = contractAddress
        ? {
            address: contractAddress,
            topics: [null, ethers.utils.hexZeroPad(userAddress, 32)],
          }
        : {
            fromBlock: "earliest",
            toBlock: "latest",
          };

      const logs = await provider.getLogs(filter);

      return Promise.all(
        logs.map(async (log) => {
          const tx = await provider.getTransaction(log.transactionHash);
          const receipt = await provider.getTransactionReceipt(
            log.transactionHash,
          );

          return {
            id: log.transactionHash,
            walletId: userAddress,
            type: this.determineTransactionType(log, userAddress),
            status: receipt.status === 1 ? "confirmed" : "failed",
            fromAddress: tx.from,
            toAddress: tx.to || "",
            amount: 0, // Would need to parse from log data
            asset: contractAddress || "ETH",
            fee: parseFloat(
              ethers.utils.formatEther(tx.gasPrice?.mul(receipt.gasUsed) || 0),
            ),
            feeAsset: blockchainConfig.networks[networkName].currency,
            hash: log.transactionHash,
            blockchain: networkName,
            blockNumber: log.blockNumber,
            confirmations: (await provider.getBlockNumber()) - log.blockNumber,
            createdAt: new Date(
              Date.now() - (Date.now() - log.blockNumber * 15000),
            ), // Approximate
            confirmedAt: new Date(
              Date.now() - (Date.now() - log.blockNumber * 15000),
            ),
          };
        }),
      );
    } catch (error) {
      console.error("Error getting transaction history:", error);
      return [];
    }
  }

  /**
   * Estimate gas for transaction
   */
  async estimateGas(
    contractAddress: string,
    method: string,
    params: any[],
    networkName: string = blockchainConfig.defaultNetwork,
  ): Promise<{
    gasLimit: number;
    gasPrice: string;
    estimatedCost: string;
  }> {
    try {
      const provider = this.providers.get(networkName);
      if (!provider || !this.signer) {
        throw new Error("Provider or signer not available");
      }

      const contract = new ethers.Contract(
        contractAddress,
        blockchainConfig.abis.tokenizedAsset,
        this.signer,
      );

      const gasLimit = await contract.estimateGas[method](...params);
      const gasPrice = await provider.getGasPrice();
      const estimatedCost = gasLimit.mul(gasPrice);

      return {
        gasLimit: gasLimit.toNumber(),
        gasPrice: ethers.utils.formatUnits(gasPrice, "gwei"),
        estimatedCost: ethers.utils.formatEther(estimatedCost),
      };
    } catch (error) {
      console.error("Error estimating gas:", error);
      throw new Error("Failed to estimate gas");
    }
  }

  /**
   * Monitor transaction
   */
  async monitorTransaction(
    txHash: string,
    networkName: string = blockchainConfig.defaultNetwork,
  ): Promise<Transaction> {
    try {
      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Provider for ${networkName} not found`);
      }

      const receipt = await provider.waitForTransaction(
        txHash,
        blockchainConfig.transaction.confirmations[networkName],
      );

      const tx = await provider.getTransaction(txHash);

      return {
        id: txHash,
        walletId: tx.from,
        type: "send", // Default, should be determined from context
        status: receipt.status === 1 ? "confirmed" : "failed",
        fromAddress: tx.from,
        toAddress: tx.to || "",
        amount: parseFloat(ethers.utils.formatEther(tx.value)),
        asset: "ETH", // Default, should be determined from context
        fee: parseFloat(
          ethers.utils.formatEther(tx.gasPrice?.mul(receipt.gasUsed) || 0),
        ),
        feeAsset: blockchainConfig.networks[networkName].currency,
        hash: txHash,
        blockchain: networkName,
        blockNumber: receipt.blockNumber,
        confirmations: receipt.confirmations,
        createdAt: new Date(),
        confirmedAt: new Date(),
      };
    } catch (error) {
      console.error("Error monitoring transaction:", error);
      throw new Error("Failed to monitor transaction");
    }
  }

  /**
   * Get network status
   */
  async getNetworkStatus(networkName: string): Promise<{
    isConnected: boolean;
    blockNumber: number;
    gasPrice: string;
    networkId: number;
  }> {
    try {
      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Provider for ${networkName} not found`);
      }

      const [blockNumber, gasPrice, network] = await Promise.all([
        provider.getBlockNumber(),
        provider.getGasPrice(),
        provider.getNetwork(),
      ]);

      return {
        isConnected: true,
        blockNumber,
        gasPrice: ethers.utils.formatUnits(gasPrice, "gwei"),
        networkId: network.chainId,
      };
    } catch (error) {
      console.error("Error getting network status:", error);
      return {
        isConnected: false,
        blockNumber: 0,
        gasPrice: "0",
        networkId: 0,
      };
    }
  }

  /**
   * Initialize contracts
   */
  private async initializeContracts(): Promise<void> {
    for (const [networkName, networkConfig] of Object.entries(
      blockchainConfig.networks,
    )) {
      const provider = this.providers.get(networkName);
      if (!provider) continue;

      for (const [contractName, contractAddress] of Object.entries(
        networkConfig.contracts,
      )) {
        if (contractAddress) {
          const contract = new ethers.Contract(
            contractAddress,
            this.getABI(contractName),
            provider,
          );
          this.contracts.set(`${networkName}:${contractName}`, contract);
        }
      }
    }
  }

  /**
   * Get contract instance
   */
  private getContract(
    contractName: string,
    networkName: string,
  ): ethers.Contract {
    const contract = this.contracts.get(`${networkName}:${contractName}`);
    if (!contract) {
      throw new Error(
        `Contract ${contractName} not found for network ${networkName}`,
      );
    }

    if (this.signer) {
      return contract.connect(this.signer);
    }

    return contract;
  }

  /**
   * Get ABI for contract type
   */
  private getABI(contractName: string): string[] {
    const abiMap: Record<string, string[]> = {
      tokenFactory: blockchainConfig.abis.tokenizedAsset,
      assetRegistry: blockchainConfig.abis.erc20,
      governance: blockchainConfig.abis.governance,
      treasury: blockchainConfig.abis.erc20,
    };

    return abiMap[contractName] || blockchainConfig.abis.erc20;
  }

  /**
   * Upload to IPFS
   */
  private async uploadToIPFS(data: string): Promise<string> {
    try {
      if (!blockchainConfig.ipfs.pinataApiKey) {
        throw new Error("IPFS configuration missing");
      }

      const response = await fetcher.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          pinataContent: JSON.parse(data),
          pinataMetadata: {
            name: `metadata-${Date.now()}`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${blockchainConfig.ipfs.pinataApiKey}`,
          },
        },
      );

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw new Error("Failed to upload metadata");
    }
  }

  /**
   * Fetch from IPFS
   */
  private async fetchFromIPFS(uri: string): Promise<string | null> {
    try {
      const hash = uri.replace("ipfs://", "");
      const response = await fetcher.get(
        `${blockchainConfig.ipfs.gateway}${hash}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching from IPFS:", error);
      return null;
    }
  }

  /**
   * Extract token address from transaction receipt
   */
  private extractTokenAddress(receipt: ethers.ContractReceipt): string {
    // Look for contract creation event or token creation event
    const event = receipt.events?.find((e) => e.event === "TokenCreated");
    return event?.args?.tokenAddress || receipt.contractAddress || "";
  }

  /**
   * Determine transaction type from log
   */
  private determineTransactionType(
    log: ethers.providers.Log,
    userAddress: string,
  ): Transaction["type"] {
    // Simple logic to determine transaction type
    // In a real implementation, you'd parse the log data more thoroughly
    return "send";
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `bc_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// Global type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Export the class for manual instantiation when needed
export default BlockchainService;
