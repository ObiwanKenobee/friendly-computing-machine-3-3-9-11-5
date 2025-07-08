import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CryptoWallet {
  id: string;
  name: string;
  type: "browser" | "mobile" | "hardware" | "desktop";
  networks: string[];
  tokens: string[];
  connected: boolean;
  address: string;
  balance: Record<string, number>;
  logo: string;
  features: string[];
  security_score: number;
  user_base: number;
  integration_difficulty: number;
}

interface DeFiProtocol {
  id: string;
  name: string;
  category:
    | "dex"
    | "lending"
    | "yield"
    | "derivatives"
    | "insurance"
    | "bridge";
  network: string;
  tvl: number;
  apy: number;
  tokens: string[];
  description: string;
  logo: string;
  security_audit: boolean;
  governance_token: string;
  fees: number;
}

interface CryptoTransaction {
  id: string;
  type: "send" | "receive" | "swap" | "stake" | "unstake";
  amount: number;
  token: string;
  network: string;
  from: string;
  to: string;
  status: "pending" | "confirmed" | "failed";
  gas_fee: number;
  timestamp: number;
  hash: string;
}

interface NetworkMetrics {
  name: string;
  symbol: string;
  price: number;
  market_cap: number;
  tps: number;
  gas_price: number;
  block_time: number;
  nodes: number;
  logo: string;
  ecosystem_size: number;
}

export function Web3CryptoIntegration() {
  const [activeTab, setActiveTab] = useState<
    "wallets" | "defi" | "transactions" | "networks"
  >("wallets");
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [defiProtocols, setDefiProtocols] = useState<DeFiProtocol[]>([]);
  const [cryptoTransactions, setCryptoTransactions] = useState<
    CryptoTransaction[]
  >([]);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connectionInProgress, setConnectionInProgress] = useState<
    string | null
  >(null);
  const [swapAmount, setSwapAmount] = useState("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");

  const initializeCryptoWallets = (): CryptoWallet[] => {
    return [
      {
        id: "metamask",
        name: "MetaMask",
        type: "browser",
        networks: ["Ethereum", "Polygon", "BSC", "Avalanche", "Arbitrum"],
        tokens: ["ETH", "USDC", "USDT", "DAI", "WBTC", "UNI", "AAVE"],
        connected: true,
        address: "0x742d35Cc6E2d34b80A00aC8a9E9D9FE2E5B96A1A",
        balance: { ETH: 2.5, USDC: 1500, USDT: 800, DAI: 300 },
        logo: "🦊",
        features: [
          "Browser Extension",
          "Mobile App",
          "Hardware Wallet Support",
          "dApp Browser",
        ],
        security_score: 92,
        user_base: 30000000,
        integration_difficulty: 3,
      },
      {
        id: "walletconnect",
        name: "WalletConnect",
        type: "mobile",
        networks: ["Ethereum", "Polygon", "BSC", "Solana", "Cosmos"],
        tokens: ["ETH", "BTC", "BNB", "SOL", "MATIC", "ATOM"],
        connected: false,
        address: "",
        balance: {},
        logo: "🔗",
        features: [
          "Protocol Standard",
          "Multi-wallet Support",
          "QR Code Pairing",
          "dApp Integration",
        ],
        security_score: 94,
        user_base: 15000000,
        integration_difficulty: 4,
      },
      {
        id: "phantom",
        name: "Phantom",
        type: "browser",
        networks: ["Solana"],
        tokens: ["SOL", "USDC", "USDT", "SRM", "RAY", "MNGO"],
        connected: true,
        address: "7d1X2a9P4j8K5m6N3q7R8s2T4u9V1w3X5y7Z8a2B4c",
        balance: { SOL: 125.8, USDC: 2200, RAY: 450 },
        logo: "👻",
        features: ["Solana Native", "NFT Support", "Staking", "Built-in DEX"],
        security_score: 91,
        user_base: 3000000,
        integration_difficulty: 3,
      },
      {
        id: "coinbase_wallet",
        name: "Coinbase Wallet",
        type: "mobile",
        networks: ["Ethereum", "Polygon", "BSC", "Optimism"],
        tokens: ["BTC", "ETH", "USDC", "ADA", "DOT", "LINK"],
        connected: false,
        address: "",
        balance: {},
        logo: "🔵",
        features: [
          "Self-custody",
          "DeFi Access",
          "NFT Gallery",
          "Institutional Grade",
        ],
        security_score: 96,
        user_base: 8000000,
        integration_difficulty: 4,
      },
      {
        id: "rainbow",
        name: "Rainbow",
        type: "mobile",
        networks: ["Ethereum", "Polygon", "Optimism", "Arbitrum"],
        tokens: ["ETH", "USDC", "UNI", "COMP", "MKR", "SNX"],
        connected: false,
        address: "",
        balance: {},
        logo: "🌈",
        features: [
          "Beautiful UI",
          "DeFi Native",
          "NFT Focus",
          "Social Features",
        ],
        security_score: 89,
        user_base: 1500000,
        integration_difficulty: 3,
      },
      {
        id: "trust_wallet",
        name: "Trust Wallet",
        type: "mobile",
        networks: ["Ethereum", "BSC", "Polygon", "Solana", "Cosmos"],
        tokens: ["BTC", "ETH", "BNB", "ADA", "DOT", "ATOM"],
        connected: false,
        address: "",
        balance: {},
        logo: "🛡️",
        features: ["Multi-chain", "NFT Support", "Staking", "DeFi Browser"],
        security_score: 90,
        user_base: 25000000,
        integration_difficulty: 4,
      },
    ];
  };

  const initializeDefiProtocols = (): DeFiProtocol[] => {
    return [
      {
        id: "uniswap",
        name: "Uniswap V3",
        category: "dex",
        network: "Ethereum",
        tvl: 4200000000,
        apy: 8.5,
        tokens: ["ETH", "USDC", "USDT", "DAI", "WBTC"],
        description:
          "Leading decentralized exchange with concentrated liquidity",
        logo: "🦄",
        security_audit: true,
        governance_token: "UNI",
        fees: 0.3,
      },
      {
        id: "aave",
        name: "Aave Protocol",
        category: "lending",
        network: "Ethereum",
        tvl: 8900000000,
        apy: 12.3,
        tokens: ["ETH", "USDC", "USDT", "DAI", "LINK"],
        description: "Decentralized lending and borrowing protocol",
        logo: "👻",
        security_audit: true,
        governance_token: "AAVE",
        fees: 0.1,
      },
      {
        id: "compound",
        name: "Compound Finance",
        category: "lending",
        network: "Ethereum",
        tvl: 3200000000,
        apy: 9.8,
        tokens: ["ETH", "USDC", "DAI", "USDT", "WBTC"],
        description: "Algorithmic money market protocol",
        logo: "🏛️",
        security_audit: true,
        governance_token: "COMP",
        fees: 0.05,
      },
      {
        id: "curve",
        name: "Curve Finance",
        category: "dex",
        network: "Ethereum",
        tvl: 5600000000,
        apy: 15.2,
        tokens: ["USDC", "USDT", "DAI", "3CRV", "FRAX"],
        description: "Stablecoin-focused automated market maker",
        logo: "🌀",
        security_audit: true,
        governance_token: "CRV",
        fees: 0.04,
      },
      {
        id: "makerdao",
        name: "MakerDAO",
        category: "lending",
        network: "Ethereum",
        tvl: 7800000000,
        apy: 6.5,
        tokens: ["DAI", "ETH", "WBTC", "USDC"],
        description: "Decentralized credit platform and DAI stablecoin issuer",
        logo: "🏭",
        security_audit: true,
        governance_token: "MKR",
        fees: 0.5,
      },
      {
        id: "yearn",
        name: "Yearn Finance",
        category: "yield",
        network: "Ethereum",
        tvl: 2100000000,
        apy: 18.7,
        tokens: ["ETH", "USDC", "DAI", "USDT", "WBTC"],
        description: "Yield optimization protocol for DeFi strategies",
        logo: "💰",
        security_audit: true,
        governance_token: "YFI",
        fees: 2.0,
      },
    ];
  };

  const generateCryptoTransactions = (): CryptoTransaction[] => {
    const types: CryptoTransaction["type"][] = [
      "send",
      "receive",
      "swap",
      "stake",
      "unstake",
    ];
    const tokens = ["ETH", "USDC", "USDT", "DAI", "BTC", "SOL"];
    const networks = ["Ethereum", "Polygon", "BSC", "Solana"];
    const statuses: CryptoTransaction["status"][] = [
      "pending",
      "confirmed",
      "failed",
    ];

    return Array.from({ length: 12 }, (_, index) => ({
      id: `tx-${index + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      amount: Math.random() * 1000 + 10,
      token: tokens[Math.floor(Math.random() * tokens.length)],
      network: networks[Math.floor(Math.random() * networks.length)],
      from: "0x742d35...96A1A",
      to: "0x1a2b3c...7z8a9b",
      status: statuses[Math.floor(Math.random() * statuses.length)],
      gas_fee: Math.random() * 50 + 1,
      timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      hash: `0x${Math.random().toString(16).slice(2, 18)}...${Math.random().toString(16).slice(2, 10)}`,
    }));
  };

  const initializeNetworkMetrics = (): NetworkMetrics[] => {
    return [
      {
        name: "Ethereum",
        symbol: "ETH",
        price: 2450.75,
        market_cap: 294000000000,
        tps: 15,
        gas_price: 35,
        block_time: 12,
        nodes: 8500,
        logo: "⟠",
        ecosystem_size: 4200,
      },
      {
        name: "Polygon",
        symbol: "MATIC",
        price: 1.12,
        market_cap: 11000000000,
        tps: 7000,
        gas_price: 0.001,
        block_time: 2,
        nodes: 100,
        logo: "🟣",
        ecosystem_size: 1800,
      },
      {
        name: "Solana",
        symbol: "SOL",
        price: 85.3,
        market_cap: 38000000000,
        tps: 65000,
        gas_price: 0.00025,
        block_time: 0.4,
        nodes: 1850,
        logo: "☀️",
        ecosystem_size: 750,
      },
      {
        name: "Binance Smart Chain",
        symbol: "BNB",
        price: 315.6,
        market_cap: 47000000000,
        tps: 160,
        gas_price: 0.2,
        block_time: 3,
        nodes: 21,
        logo: "🟡",
        ecosystem_size: 2100,
      },
      {
        name: "Avalanche",
        symbol: "AVAX",
        price: 28.45,
        market_cap: 10500000000,
        tps: 4500,
        gas_price: 0.01,
        block_time: 1,
        nodes: 1200,
        logo: "🔺",
        ecosystem_size: 450,
      },
    ];
  };

  useEffect(() => {
    setCryptoWallets(initializeCryptoWallets());
    setDefiProtocols(initializeDefiProtocols());
    setCryptoTransactions(generateCryptoTransactions());
    setNetworkMetrics(initializeNetworkMetrics());

    const interval = setInterval(() => {
      // Update prices and metrics
      setNetworkMetrics((prev) =>
        prev.map((network) => ({
          ...network,
          price: network.price * (1 + (Math.random() - 0.5) * 0.05),
          gas_price: Math.max(
            0.0001,
            network.gas_price * (1 + (Math.random() - 0.5) * 0.2),
          ),
        })),
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const connectWallet = async (walletId: string) => {
    setConnectionInProgress(walletId);

    // Simulate connection process
    setTimeout(() => {
      setCryptoWallets((prev) =>
        prev.map((wallet) =>
          wallet.id === walletId
            ? {
                ...wallet,
                connected: true,
                address: `0x${Math.random().toString(16).slice(2, 42)}`,
                balance: {
                  ETH: Math.random() * 5,
                  USDC: Math.random() * 5000,
                  USDT: Math.random() * 3000,
                },
              }
            : wallet,
        ),
      );
      setConnectionInProgress(null);
    }, 2000);
  };

  const formatBalance = (amount: number, symbol: string) => {
    if (symbol === "ETH" || symbol === "BTC" || symbol === "SOL") {
      return amount.toFixed(4);
    }
    return amount.toFixed(2);
  };

  const formatTVL = (tvl: number) => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(1)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(1)}M`;
    return `$${tvl.toLocaleString()}`;
  };

  const getWalletTypeIcon = (type: string) => {
    switch (type) {
      case "browser":
        return "🌐";
      case "mobile":
        return "📱";
      case "hardware":
        return "����";
      case "desktop":
        return "💻";
      default:
        return "💳";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "dex":
        return "bg-blue-600";
      case "lending":
        return "bg-green-600";
      case "yield":
        return "bg-yellow-600";
      case "derivatives":
        return "bg-purple-600";
      case "insurance":
        return "bg-red-600";
      case "bridge":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Web3 & Crypto Integration Hub
          </h1>
          <p className="text-xl text-gray-300">
            Complete blockchain payment solutions with DeFi protocol
            integrations
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Badge className="bg-purple-600 text-white">
              {cryptoWallets.filter((w) => w.connected).length} Connected
              Wallets
            </Badge>
            <Badge className="bg-blue-600 text-white">
              {defiProtocols.length} DeFi Protocols
            </Badge>
            <Badge className="bg-cyan-600 text-white">
              {networkMetrics.length} Networks
            </Badge>
          </div>
        </motion.div>

        {/* Quick Swap Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Token Swap</CardTitle>
              <CardDescription>
                Exchange tokens across multiple networks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="swap-amount" className="text-gray-300">
                  Amount
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="swap-amount"
                    type="number"
                    placeholder="0.0"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <select
                    value={fromToken}
                    onChange={(e) => setFromToken(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    {["ETH", "USDC", "USDT", "DAI", "BTC", "SOL"].map(
                      (token) => (
                        <option key={token} value={token}>
                          {token}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="icon" className="rounded-full">
                  ↕️
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">To</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    readOnly
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                    value={
                      swapAmount
                        ? (parseFloat(swapAmount) * 1.02).toFixed(4)
                        : ""
                    }
                  />
                  <select
                    value={toToken}
                    onChange={(e) => setToToken(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    {["USDC", "USDT", "DAI", "ETH", "BTC", "SOL"].map(
                      (token) => (
                        <option key={token} value={token}>
                          {token}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Swap Tokens
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Interface */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Web3 Integration Center
                </CardTitle>
                <CardDescription>
                  Manage wallets, DeFi protocols, and blockchain transactions
                </CardDescription>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as any)}
              >
                <TabsList className="bg-slate-700">
                  <TabsTrigger value="wallets">Wallets</TabsTrigger>
                  <TabsTrigger value="defi">DeFi</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="networks">Networks</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="wallets" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cryptoWallets.map((wallet, index) => (
                  <motion.div
                    key={wallet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-colors ${
                        wallet.connected ? "ring-2 ring-green-500" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{wallet.logo}</span>
                              <div>
                                <h3 className="text-white font-medium">
                                  {wallet.name}
                                </h3>
                                <p className="text-xs text-gray-400 flex items-center space-x-1">
                                  <span>{getWalletTypeIcon(wallet.type)}</span>
                                  <span>{wallet.type}</span>
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={
                                wallet.connected
                                  ? "bg-green-600"
                                  : "bg-gray-600"
                              }
                            >
                              {wallet.connected ? "Connected" : "Disconnected"}
                            </Badge>
                          </div>

                          {wallet.connected && (
                            <div className="space-y-2">
                              <div>
                                <span className="text-gray-400 text-xs">
                                  Address
                                </span>
                                <div className="text-white font-mono text-sm">
                                  {wallet.address.slice(0, 10)}...
                                  {wallet.address.slice(-8)}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400 text-xs">
                                  Balances
                                </span>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  {Object.entries(wallet.balance)
                                    .slice(0, 4)
                                    .map(([token, amount]) => (
                                      <div key={token} className="text-sm">
                                        <span className="text-white font-medium">
                                          {formatBalance(amount, token)} {token}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div>
                            <span className="text-gray-400 text-xs">
                              Networks
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {wallet.networks.slice(0, 3).map((network) => (
                                <Badge
                                  key={network}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {network}
                                </Badge>
                              ))}
                              {wallet.networks.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{wallet.networks.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-400">
                              Security: {wallet.security_score}%
                            </div>
                            <Progress
                              value={wallet.security_score}
                              className="w-16 h-1"
                            />
                          </div>

                          <Button
                            onClick={() => connectWallet(wallet.id)}
                            disabled={connectionInProgress === wallet.id}
                            className={
                              wallet.connected
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }
                            size="sm"
                          >
                            {connectionInProgress === wallet.id
                              ? "Connecting..."
                              : wallet.connected
                                ? "Disconnect"
                                : "Connect"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="defi" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {defiProtocols.map((protocol, index) => (
                  <motion.div
                    key={protocol.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-colors">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{protocol.logo}</span>
                              <div>
                                <h3 className="text-white font-medium">
                                  {protocol.name}
                                </h3>
                                <p className="text-xs text-gray-400">
                                  {protocol.network}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={getCategoryColor(protocol.category)}
                            >
                              {protocol.category.toUpperCase()}
                            </Badge>
                          </div>

                          <p className="text-gray-300 text-sm">
                            {protocol.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">TVL</span>
                              <div className="text-white font-medium">
                                {formatTVL(protocol.tvl)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">APY</span>
                              <div className="text-green-400 font-medium">
                                {protocol.apy.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Fees</span>
                              <div className="text-white font-medium">
                                {protocol.fees}%
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Token</span>
                              <div className="text-white font-medium">
                                {protocol.governance_token}
                              </div>
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400 text-xs">
                              Supported Tokens
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {protocol.tokens.slice(0, 4).map((token) => (
                                <Badge
                                  key={token}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {token}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge
                              className={
                                protocol.security_audit
                                  ? "bg-green-600"
                                  : "bg-yellow-600"
                              }
                            >
                              {protocol.security_audit
                                ? "Audited"
                                : "Unaudited"}
                            </Badge>
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              Interact
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-0">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cryptoTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">
                                {transaction.id}
                              </span>
                              <Badge
                                className={
                                  transaction.type === "receive"
                                    ? "bg-green-600"
                                    : "bg-blue-600"
                                }
                              >
                                {transaction.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-400">
                              {transaction.network} • Gas: $
                              {transaction.gas_fee.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-medium">
                              {transaction.amount.toFixed(4)}{" "}
                              {transaction.token}
                            </div>
                            <div
                              className={`text-sm ${getTransactionStatusColor(transaction.status)}`}
                            >
                              {transaction.status}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-gray-400">
                          <div>
                            <span>Hash</span>
                            <div className="text-white font-mono">
                              {transaction.hash}
                            </div>
                          </div>
                          <div>
                            <span>Time</span>
                            <div className="text-white">
                              {new Date(
                                transaction.timestamp,
                              ).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="networks" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {networkMetrics.map((network, index) => (
                  <motion.div
                    key={network.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className="text-2xl mb-2">{network.logo}</div>
                            <h3 className="text-white font-medium">
                              {network.name}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {network.symbol}
                            </p>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Price</span>
                              <span className="text-white">
                                ${network.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">TPS</span>
                              <span className="text-white">
                                {network.tps.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Gas</span>
                              <span className="text-white">
                                ${network.gas_price.toFixed(4)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Block Time</span>
                              <span className="text-white">
                                {network.block_time}s
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Nodes</span>
                              <span className="text-white">
                                {network.nodes.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-gray-400 mb-1">
                              Ecosystem Size
                            </div>
                            <Progress
                              value={(network.ecosystem_size / 5000) * 100}
                              className="h-2"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                              {network.ecosystem_size} dApps
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
