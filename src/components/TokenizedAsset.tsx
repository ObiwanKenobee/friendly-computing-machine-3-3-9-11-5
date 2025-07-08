
import React from 'react';
import { Coins, TrendingUp, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TokenizedAssetProps {
  name: string;
  value: string;
  tokenPrice: string;
  apy: string;
  risk: string;
}

const TokenizedAsset: React.FC<TokenizedAssetProps> = ({ 
  name, 
  value, 
  tokenPrice, 
  apy, 
  risk 
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const funding = Math.floor(Math.random() * 40) + 60; // Random funding between 60-100%

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Coins className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            risk.toLowerCase() === 'low' ? 'bg-green-900/50 text-green-300' :
            risk.toLowerCase() === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
            'bg-red-900/50 text-red-300'
          }`}>
            {risk} Risk
          </span>
        </div>
        <CardTitle className="text-white text-lg">{name}</CardTitle>
        <CardDescription className="text-slate-300">
          Tokenized real-world asset with fractional ownership
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Asset Value and Token Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-400">Total Value</p>
            <p className="text-xl font-bold text-white">{value}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Token Price</p>
            <p className="text-xl font-bold text-white">{tokenPrice}</p>
          </div>
        </div>

        {/* APY and Funding Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-400">Expected APY</span>
            </div>
            <span className="text-lg font-semibold text-green-400">{apy}</span>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Funding Progress</span>
              <span className="text-white">{funding}%</span>
            </div>
            <Progress value={funding} className="h-2" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-slate-300">{Math.floor(Math.random() * 500) + 100} investors</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-slate-300">Insured</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            Invest Now
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenizedAsset;
