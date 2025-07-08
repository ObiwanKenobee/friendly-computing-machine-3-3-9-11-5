import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Building,
  ArrowLeft,
  Shield,
  Globe,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  CheckCircle,
  Crown,
} from "lucide-react";

const SovereignWealth: React.FC = () => {
  const navigate = useNavigate();

  const solutions = [
    {
      title: "National Infrastructure Vaults",
      description:
        "Tokenize large-scale infrastructure projects with sovereign backing",
      features: [
        "Multi-billion dollar capacity",
        "Sovereign guarantees",
        "ESG compliance",
      ],
      icon: <Building className="h-8 w-8" />,
    },
    {
      title: "Quantum Treasury Management",
      description: "AI-powered portfolio optimization for national reserves",
      features: [
        "Real-time risk assessment",
        "Multi-currency hedging",
        "Quantum security",
      ],
      icon: <Shield className="h-8 w-8" />,
    },
    {
      title: "Global Development Bonds",
      description: "Cross-border development financing through tokenized bonds",
      features: [
        "International partnerships",
        "Impact tracking",
        "Transparent allocation",
      ],
      icon: <Globe className="h-8 w-8" />,
    },
  ];

  const stats = [
    { label: "Assets Under Management", value: "$847B", change: "+12.4%" },
    { label: "Sovereign Partners", value: "23", change: "+6 new" },
    { label: "Infrastructure Projects", value: "156", change: "+24 active" },
    { label: "Global Coverage", value: "67", change: "countries" },
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
                <Crown className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold">
                    Sovereign Wealth Solutions
                  </h1>
                  <p className="text-sm text-gray-600">
                    National Treasury & Infrastructure Finance
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={() => navigate("/auth")}>
              Schedule Consultation
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Next-Generation Sovereign Finance
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Empower your nation's financial future with quantum-secured,
              AI-optimized wealth management and infrastructure tokenization
              platforms designed for sovereign entities.
            </p>
            <Button
              size="lg"
              className="bg-white text-purple-800 hover:bg-gray-100"
              onClick={() => navigate("/auth")}
            >
              Request Sovereign Partnership
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {stat.change}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">
            Sovereign-Grade Solutions
          </h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      {solution.icon}
                    </div>
                    <CardTitle className="text-lg">{solution.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{solution.description}</p>
                  <div className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-6"
                    onClick={() => navigate("/auth")}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Sovereign-Grade Security
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Built with the highest security standards for national
                treasuries and sovereign wealth funds.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Quantum-resistant encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Multi-signature governance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Real-time audit trails</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Regulatory compliance automation</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-8 text-white">
              <h4 className="text-xl font-bold mb-4">Trusted by Nations</h4>
              <p className="mb-6">
                Join leading sovereign wealth funds and central banks already
                using QuantumVest for trillion-dollar asset management.
              </p>
              <Button
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => navigate("/auth")}
              >
                Schedule Secure Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-6">
            Transform Your Nation's Financial Infrastructure
          </h3>
          <p className="text-xl mb-8">
            Partner with QuantumVest to unlock the future of sovereign wealth
            management and infrastructure finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate("/auth")}
            >
              Request Partnership
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900"
            >
              Download Whitepaper
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SovereignWealth;
