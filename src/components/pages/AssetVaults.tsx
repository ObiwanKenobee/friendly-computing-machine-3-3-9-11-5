import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Vault,
  ArrowLeft,
  Shield,
  TrendingUp,
  Users,
  Globe,
  BarChart3,
  CheckCircle,
} from "lucide-react";

const AssetVaults: React.FC = () => {
  const navigate = useNavigate();

  const vaultTypes = [
    {
      name: "Real Estate Vaults",
      description: "Tokenized property investments with fractional ownership",
      apy: "8.2%",
      minInvestment: "$100",
      totalValue: "$2.1B",
      investors: "45K+",
    },
    {
      name: "Green Infrastructure",
      description: "Sustainable projects with verified carbon credits",
      apy: "6.8%",
      minInvestment: "$50",
      totalValue: "$890M",
      investors: "32K+",
    },
    {
      name: "Cultural Heritage",
      description: "Preserve and invest in cultural assets worldwide",
      apy: "12.1%",
      minInvestment: "$25",
      totalValue: "$450M",
      investors: "18K+",
    },
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Quantum Security",
      description:
        "Military-grade encryption with quantum-resistant algorithms",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "AI-Optimized Returns",
      description: "Machine learning algorithms optimize portfolio performance",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Governance",
      description: "Decentralized decision-making with stakeholder voting",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Access",
      description: "Invest from anywhere with multi-currency support",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <div className="flex items-center space-x-3">
                <Vault className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold">AssetVaults™</h1>
                  <p className="text-sm text-gray-600">
                    Tokenized Asset Investment Platform
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={() => navigate("/auth")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Democratizing Asset Investment
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Access institutional-grade assets through tokenized vaults. From
            real estate to cultural heritage, invest in the future with as
            little as $25.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate("/auth")}
            >
              Start Investing
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Vault Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">
            Featured Vault Categories
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {vaultTypes.map((vault, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {vault.name}
                    <Badge variant="secondary">{vault.apy} APY</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{vault.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Min Investment:</span>
                      <span className="font-semibold">
                        {vault.minInvestment}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Value:</span>
                      <span className="font-semibold">{vault.totalValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investors:</span>
                      <span className="font-semibold">{vault.investors}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => navigate("/auth")}
                  >
                    Invest Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">
            Why Choose AssetVaults™
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-6">
            Ready to Start Building Wealth?
          </h3>
          <p className="text-xl mb-8">
            Join thousands of investors already earning returns through
            tokenized assets.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/auth")}
          >
            Create Your Vault Account
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AssetVaults;
