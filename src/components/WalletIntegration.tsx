
import React, { useState } from 'react';
import { Wallet, CreditCard, Bitcoin, DollarSign, Euro, BadgeJapaneseYen, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WalletIntegration = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const cryptoBalances = [
    { symbol: 'BTC', name: 'Bitcoin', balance: '0.025', value: '$1,250.00', change: '+2.4%' },
    { symbol: 'ETH', name: 'Ethereum', balance: '2.5', value: '$4,875.00', change: '+1.8%' },
    { symbol: 'USDC', name: 'USD Coin', balance: '5,000', value: '$5,000.00', change: '0.0%' },
    { symbol: 'SOL', name: 'Solana', balance: '15.2', value: '$912.00', change: '+5.2%' }
  ];

  const fiatBalances = [
    { symbol: 'USD', name: 'US Dollar', balance: '12,500.00', icon: DollarSign },
    { symbol: 'EUR', name: 'Euro', balance: '8,750.00', icon: Euro },
    { symbol: 'JPY', name: 'Japanese Yen', balance: '450,000', icon: BadgeJapaneseYen },
    { symbol: 'GBP', name: 'British Pound', balance: '3,200.00', icon: DollarSign }
  ];

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => setIsConnecting(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-lg border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="h-8 w-8 text-purple-400" />
              <div>
                <CardTitle className="text-white text-2xl">Multi-Currency Wallet</CardTitle>
                <CardDescription className="text-slate-300">
                  Manage your crypto and fiat currencies in one secure platform
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">$24,287.00</div>
              <div className="text-sm text-green-400">+$847.50 (3.6%)</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="crypto" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
          <TabsTrigger value="crypto" className="data-[state=active]:bg-white/20 text-white">
            Cryptocurrency
          </TabsTrigger>
          <TabsTrigger value="fiat" className="data-[state=active]:bg-white/20 text-white">
            Fiat Currency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crypto" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cryptoBalances.map((crypto, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Bitcoin className="h-6 w-6 text-orange-400" />
                      <span className="font-medium text-white">{crypto.symbol}</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      crypto.change.startsWith('+') ? 'text-green-400' : 
                      crypto.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {crypto.change}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 mb-1">{crypto.name}</div>
                  <div className="text-xl font-bold text-white mb-1">{crypto.balance}</div>
                  <div className="text-sm text-slate-300">{crypto.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                  Buy Crypto
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Send/Receive
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Swap Tokens
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Connect Wallets</CardTitle>
                <CardDescription className="text-slate-300">
                  Link your external wallets for unified management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                >
                  {isConnecting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                  MetaMask
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  WalletConnect
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Phantom
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fiat" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fiatBalances.map((fiat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <fiat.icon className="h-6 w-6 text-green-400" />
                    <span className="font-medium text-white">{fiat.symbol}</span>
                  </div>
                  <div className="text-sm text-slate-400 mb-1">{fiat.name}</div>
                  <div className="text-xl font-bold text-white">{fiat.balance}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Banking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Add Bank Account
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Wire Transfer
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Convert Currency
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">**** 4567</div>
                    <div className="text-sm text-slate-400">Visa ending in 4567</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletIntegration;
