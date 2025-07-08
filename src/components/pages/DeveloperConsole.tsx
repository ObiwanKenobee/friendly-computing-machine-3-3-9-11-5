import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Code,
  ArrowLeft,
  Terminal,
  Zap,
  Shield,
  BarChart3,
  Key,
  BookOpen,
  Download,
  Play,
  CheckCircle,
  ExternalLink,
  GitBranch,
} from "lucide-react";

const DeveloperConsole: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const apiStats = [
    { label: "API Calls/Month", value: "2.4B", trend: "+18%" },
    { label: "Uptime", value: "99.98%", trend: "SLA" },
    { label: "Avg Response", value: "89ms", trend: "-12%" },
    { label: "Developers", value: "12.8K", trend: "+45%" },
  ];

  const sdks = [
    {
      name: "JavaScript SDK",
      version: "v3.2.1",
      downloads: "45K/month",
      status: "stable",
    },
    {
      name: "Python SDK",
      version: "v2.8.3",
      downloads: "38K/month",
      status: "stable",
    },
    {
      name: "Go SDK",
      version: "v1.9.2",
      downloads: "23K/month",
      status: "stable",
    },
    {
      name: "Rust SDK",
      version: "v0.8.1",
      downloads: "12K/month",
      status: "beta",
    },
  ];

  const endpoints = [
    {
      method: "POST",
      path: "/api/v3/vaults/create",
      description: "Create new asset vault",
    },
    {
      method: "GET",
      path: "/api/v3/vaults/{id}",
      description: "Get vault details",
    },
    {
      method: "POST",
      path: "/api/v3/tokens/mint",
      description: "Mint vault tokens",
    },
    {
      method: "GET",
      path: "/api/v3/analytics/portfolio",
      description: "Portfolio analytics",
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
                <Terminal className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold">Developer Console</h1>
                  <p className="text-sm text-gray-600">
                    Build on QuantumVest Platform
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/auth")}>Get API Key</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Build the Future of Finance
              </h2>
              <p className="text-xl mb-8">
                Integrate tokenized assets, AI-powered analytics, and
                quantum-secured vaults into your applications with our
                comprehensive developer platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100"
                  onClick={() => navigate("/auth")}
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  View Documentation
                </Button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm">
              <div className="mb-2 text-gray-400">
                // Initialize QuantumVest SDK
              </div>
              <div className="mb-4">
                <span className="text-blue-300">import</span> {"{QuantumVest}"}{" "}
                <span className="text-blue-300">from</span>{" "}
                <span className="text-yellow-300">'@quantumvest/sdk'</span>;
              </div>
              <div className="mb-4">
                <span className="text-blue-300">const</span> qv ={" "}
                <span className="text-blue-300">new</span>{" "}
                <span className="text-yellow-300">QuantumVest</span>({"{"}
              </div>
              <div className="mb-4 ml-4">
                apiKey: <span className="text-yellow-300">'your-api-key'</span>,
              </div>
              <div className="mb-4 ml-4">
                network: <span className="text-yellow-300">'mainnet'</span>
              </div>
              <div className="mb-4">{"}"});</div>
              <div className="mb-2 text-gray-400">// Create a new vault</div>
              <div>
                <span className="text-blue-300">const</span> vault ={" "}
                <span className="text-blue-300">await</span> qv.createVault(
                {"{"}
              </div>
              <div className="ml-4">
                type: <span className="text-yellow-300">'real-estate'</span>,
              </div>
              <div className="ml-4">
                minInvestment: <span className="text-green-300">100</span>
              </div>
              <div>{"}"});</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {["overview", "api", "sdks", "documentation"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 font-medium ${
                  activeTab === tab
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content based on active tab */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "overview" && (
            <div className="space-y-12">
              {/* API Stats */}
              <div>
                <h3 className="text-2xl font-bold mb-8">Platform Statistics</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {apiStats.map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="p-6 text-center">
                        <div className="text-2xl font-bold mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {stat.label}
                        </div>
                        <Badge variant="secondary">{stat.trend}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Start */}
              <div>
                <h3 className="text-2xl font-bold mb-8">Quick Start Guide</h3>
                <div className="grid lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <Key className="h-8 w-8 text-blue-600 mb-2" />
                      <CardTitle>1. Get API Key</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Sign up for a developer account and generate your API
                        key
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => navigate("/auth")}
                      >
                        Get API Key
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Download className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle>2. Install SDK</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Install our SDK in your preferred programming language
                      </p>
                      <div className="bg-gray-100 rounded p-2 text-sm font-mono">
                        npm install @quantumvest/sdk
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Play className="h-8 w-8 text-purple-600 mb-2" />
                      <CardTitle>3. Start Building</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Follow our tutorials and start integrating vault
                        features
                      </p>
                      <Button variant="outline" className="w-full">
                        View Tutorials
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">API Reference</h3>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge
                            variant={
                              endpoint.method === "GET"
                                ? "secondary"
                                : "default"
                            }
                            className={
                              endpoint.method === "GET"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="font-mono text-sm">
                            {endpoint.path}
                          </code>
                          <span className="text-gray-600">
                            {endpoint.description}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Try it
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sdks" && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Software Development Kits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {sdks.map((sdk, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{sdk.name}</CardTitle>
                        <Badge
                          variant={
                            sdk.status === "stable" ? "default" : "secondary"
                          }
                        >
                          {sdk.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Version:</span>
                          <span className="font-mono">{sdk.version}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Downloads:</span>
                          <span>{sdk.downloads}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Install
                          </Button>
                          <Button size="sm" variant="outline">
                            <GitBranch className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "documentation" && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Documentation</h3>
              <div className="grid lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle>Getting Started</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Learn the basics of integrating with the QuantumVest
                      platform
                    </p>
                    <Button variant="outline" className="w-full">
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Code className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle>Code Examples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Browse complete code examples and implementation patterns
                    </p>
                    <Button variant="outline" className="w-full">
                      View Examples
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Zap className="h-8 w-8 text-purple-600 mb-2" />
                    <CardTitle>Tutorials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Step-by-step tutorials for common integration scenarios
                    </p>
                    <Button variant="outline" className="w-full">
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-6">Ready to Start Building?</h3>
          <p className="text-xl mb-8">
            Join thousands of developers building the future of finance with
            QuantumVest APIs.
          </p>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => navigate("/auth")}
          >
            Get Your API Key
          </Button>
        </div>
      </section>
    </div>
  );
};

export default DeveloperConsole;
