
import React from 'react';
import { Shield, AlertTriangle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const RiskDashboard = () => {
  const riskMetrics = [
    { label: 'Portfolio VaR (95%)', value: '-2.3%', color: 'text-green-400', trend: 'down' },
    { label: 'Sharpe Ratio', value: '1.47', color: 'text-blue-400', trend: 'up' },
    { label: 'Maximum Drawdown', value: '-8.1%', color: 'text-yellow-400', trend: 'stable' },
    { label: 'Beta', value: '0.89', color: 'text-purple-400', trend: 'down' }
  ];

  const riskFactors = [
    { name: 'Market Risk', level: 35, color: 'bg-red-500' },
    { name: 'Credit Risk', level: 20, color: 'bg-orange-500' },
    { name: 'Liquidity Risk', level: 15, color: 'bg-yellow-500' },
    { name: 'Operational Risk', level: 10, color: 'bg-blue-500' },
    { name: 'Currency Risk', level: 25, color: 'bg-purple-500' }
  ];

  const scenarios = [
    { name: 'Bull Market', probability: 45, impact: '+12.5%', color: 'text-green-400' },
    { name: 'Base Case', probability: 35, impact: '+6.2%', color: 'text-blue-400' },
    { name: 'Bear Market', probability: 15, impact: '-8.7%', color: 'text-red-400' },
    { name: 'Black Swan', probability: 5, impact: '-22.3%', color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        {riskMetrics.map((metric, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-400" />}
                  {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
                  {metric.trend === 'stable' && <Activity className="h-4 w-4 text-blue-400" />}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: metric.color.replace('text-', '') }}>
                {metric.value}
              </div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 text-blue-400 mr-2" />
              Risk Factor Analysis
            </CardTitle>
            <CardDescription className="text-slate-300">
              AI-powered breakdown of portfolio risk components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{factor.name}</span>
                    <span className="text-slate-300">{factor.level}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${factor.color}`}
                      style={{ width: `${factor.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              Scenario Analysis
            </CardTitle>
            <CardDescription className="text-slate-300">
              AI-predicted outcomes under different market conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarios.map((scenario, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                    <span className="text-white font-medium">{scenario.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${scenario.color}`}>{scenario.impact}</div>
                    <div className="text-xs text-slate-400">{scenario.probability}% probability</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 backdrop-blur-lg border-red-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            AI Risk Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-red-900/20 border border-red-500/30">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-300">High Correlation Warning</h4>
                <p className="text-sm text-red-200">Your tech holdings show 89% correlation. Consider diversification.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-300">Liquidity Risk</h4>
                <p className="text-sm text-yellow-200">30% of assets in illiquid positions. Monitor for rebalancing opportunities.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskDashboard;
