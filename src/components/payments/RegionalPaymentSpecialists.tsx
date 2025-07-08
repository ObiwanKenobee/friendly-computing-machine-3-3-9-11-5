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

interface RegionalSpecialist {
  id: string;
  name: string;
  region: string;
  country: string;
  specialization: string[];
  marketShare: number;
  transactionVolume: number;
  averageTicketSize: number;
  merchantCount: number;
  logo: string;
  description: string;
  keyFeatures: string[];
  complianceLevel: number;
  integrationSDK: boolean;
  apiDocumentation: string;
  supportedLanguages: string[];
  regulatoryApprovals: string[];
}

interface MarketInsight {
  region: string;
  totalVolume: number;
  growthRate: number;
  dominantMethods: string[];
  emergingTrends: string[];
  challengs: string[];
  opportunities: string[];
}

export function RegionalPaymentSpecialists() {
  const [activeRegion, setActiveRegion] = useState<
    "africa" | "europe" | "asia"
  >("africa");
  const [specialists, setSpecialists] = useState<RegionalSpecialist[]>([]);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(
    null,
  );

  const initializeSpecialists = (): RegionalSpecialist[] => {
    return [
      // African Specialists
      {
        id: "mpesa_vodacom",
        name: "M-Pesa (Vodacom)",
        region: "Africa",
        country: "Kenya, Tanzania",
        specialization: [
          "Mobile Money",
          "P2P Transfers",
          "Microfinance",
          "Agent Banking",
        ],
        marketShare: 85,
        transactionVolume: 12.5e9,
        averageTicketSize: 25,
        merchantCount: 450000,
        logo: "📱",
        description:
          "Revolutionary mobile money service transforming financial inclusion across East Africa",
        keyFeatures: [
          "USSD Access",
          "Agent Network",
          "Savings Products",
          "International Remittances",
        ],
        complianceLevel: 98,
        integrationSDK: true,
        apiDocumentation: "Comprehensive REST APIs with sandbox environment",
        supportedLanguages: ["Swahili", "English"],
        regulatoryApprovals: ["CBK", "BOT", "BOU"],
      },
      {
        id: "flutterwave_enterprise",
        name: "Flutterwave Enterprise",
        region: "Africa",
        country: "Nigeria, Ghana, Kenya, South Africa",
        specialization: [
          "Cross-border Payments",
          "Card Processing",
          "Digital Banking",
          "Forex",
        ],
        marketShare: 35,
        transactionVolume: 8.2e9,
        averageTicketSize: 125,
        merchantCount: 290000,
        logo: "🌊",
        description:
          "Pan-African payment infrastructure connecting Africa to the global economy",
        keyFeatures: [
          "Multi-currency Support",
          "Compliance Suite",
          "Risk Management",
          "Business Banking",
        ],
        complianceLevel: 96,
        integrationSDK: true,
        apiDocumentation: "Enterprise-grade APIs with white-label solutions",
        supportedLanguages: ["English", "French", "Portuguese"],
        regulatoryApprovals: ["CBN", "BOG", "CBK", "SARB"],
      },
      {
        id: "interswitch_group",
        name: "Interswitch Group",
        region: "Africa",
        country: "Nigeria",
        specialization: [
          "Card Switching",
          "Digital Identity",
          "E-commerce",
          "Financial Technology",
        ],
        marketShare: 75,
        transactionVolume: 15.8e9,
        averageTicketSize: 85,
        merchantCount: 180000,
        logo: "🔄",
        description:
          "Pioneering African payment processor with robust switching infrastructure",
        keyFeatures: [
          "Verve Cards",
          "Quickteller",
          "Paycode",
          "Digital Identity",
        ],
        complianceLevel: 94,
        integrationSDK: true,
        apiDocumentation: "Enterprise integration with PCI DSS compliance",
        supportedLanguages: ["English", "Hausa", "Yoruba", "Igbo"],
        regulatoryApprovals: ["CBN", "PCI DSS"],
      },

      // European Specialists
      {
        id: "adyen_global",
        name: "Adyen Global",
        region: "Europe",
        country: "Netherlands, Global",
        specialization: [
          "Unified Commerce",
          "Risk Management",
          "Data Analytics",
          "Point of Sale",
        ],
        marketShare: 45,
        transactionVolume: 516e9,
        averageTicketSize: 75,
        merchantCount: 25000,
        logo: "🔷",
        description:
          "Single platform for online, mobile, and in-store payments across global markets",
        keyFeatures: [
          "Unified Platform",
          "Real-time Data",
          "RevenueProtect",
          "MarketPay",
        ],
        complianceLevel: 99,
        integrationSDK: true,
        apiDocumentation:
          "Comprehensive APIs with extensive documentation and SDKs",
        supportedLanguages: [
          "English",
          "Dutch",
          "German",
          "French",
          "Spanish",
          "Italian",
        ],
        regulatoryApprovals: ["PCI DSS", "DNB", "EMI License", "PSD2"],
      },
      {
        id: "klarna_bnpl",
        name: "Klarna BNPL",
        region: "Europe",
        country: "Sweden, EU, US",
        specialization: [
          "Buy Now Pay Later",
          "Installments",
          "Shopping Experience",
          "Consumer Credit",
        ],
        marketShare: 65,
        transactionVolume: 72e9,
        averageTicketSize: 95,
        merchantCount: 450000,
        logo: "🎀",
        description:
          "Leading buy-now-pay-later service revolutionizing consumer shopping experience",
        keyFeatures: [
          "Flexible Payments",
          "Shopping App",
          "One-time Cards",
          "Price Drop Alerts",
        ],
        complianceLevel: 97,
        integrationSDK: true,
        apiDocumentation: "Modern REST APIs with comprehensive merchant tools",
        supportedLanguages: [
          "Swedish",
          "English",
          "German",
          "Spanish",
          "French",
        ],
        regulatoryApprovals: [
          "Finansinspektionen",
          "PCI DSS",
          "GDPR Compliant",
        ],
      },
      {
        id: "worldline_solutions",
        name: "Worldline Solutions",
        region: "Europe",
        country: "France, EU",
        specialization: [
          "Merchant Services",
          "Financial Processing",
          "Digital Banking",
          "Mobility",
        ],
        marketShare: 38,
        transactionVolume: 28e9,
        averageTicketSize: 65,
        merchantCount: 1200000,
        logo: "🌐",
        description:
          "European leader in payment and transactional services for digital commerce",
        keyFeatures: [
          "omnichannel Solutions",
          "Fraud Prevention",
          "Terminal Management",
          "E-ticketing",
        ],
        complianceLevel: 98,
        integrationSDK: true,
        apiDocumentation:
          "Enterprise APIs with extensive European market coverage",
        supportedLanguages: [
          "French",
          "English",
          "German",
          "Italian",
          "Spanish",
        ],
        regulatoryApprovals: ["ACPR", "PCI DSS", "EMV", "SEPA"],
      },

      // Asian Specialists
      {
        id: "alipay_ant",
        name: "Alipay (Ant Group)",
        region: "Asia",
        country: "China, Global",
        specialization: [
          "Digital Wallet",
          "Super App",
          "Financial Services",
          "Lifestyle Payments",
        ],
        marketShare: 92,
        transactionVolume: 17300e9,
        averageTicketSize: 45,
        merchantCount: 80000000,
        logo: "🅰️",
        description:
          "World's largest mobile payment platform with comprehensive financial ecosystem",
        keyFeatures: [
          "QR Payments",
          "Yu'e Bao",
          "Ant Credit Pay",
          "Mini Programs",
        ],
        complianceLevel: 96,
        integrationSDK: true,
        apiDocumentation: "Comprehensive APIs for global merchant integration",
        supportedLanguages: ["Chinese", "English", "Japanese", "Korean"],
        regulatoryApprovals: ["PBOC", "CBIRC", "CSRC"],
      },
      {
        id: "paytm_one97",
        name: "Paytm (One97)",
        region: "Asia",
        country: "India",
        specialization: [
          "Digital Payments",
          "Financial Services",
          "E-commerce",
          "Investment",
        ],
        marketShare: 48,
        transactionVolume: 8.5e9,
        averageTicketSize: 35,
        merchantCount: 25000000,
        logo: "💰",
        description:
          "India's leading digital payment and financial services company",
        keyFeatures: [
          "UPI Payments",
          "Paytm Wallet",
          "Bill Payments",
          "Investment Platform",
        ],
        complianceLevel: 94,
        integrationSDK: true,
        apiDocumentation: "Robust APIs supporting UPI and wallet integrations",
        supportedLanguages: ["Hindi", "English", "Bengali", "Tamil", "Telugu"],
        regulatoryApprovals: ["RBI", "SEBI", "IRDAI"],
      },
      {
        id: "grab_holdings",
        name: "Grab Holdings",
        region: "Asia",
        country: "Singapore, SEA",
        specialization: [
          "Super App",
          "Financial Services",
          "Digital Banking",
          "Insurance",
        ],
        marketShare: 75,
        transactionVolume: 12.8e9,
        averageTicketSize: 28,
        merchantCount: 9500000,
        logo: "🚗",
        description:
          "Southeast Asia's leading super app offering comprehensive financial services",
        keyFeatures: [
          "GrabPay",
          "GrabInvest",
          "GrabInsure",
          "Merchant Solutions",
        ],
        complianceLevel: 93,
        integrationSDK: true,
        apiDocumentation: "Regional APIs with multi-country support",
        supportedLanguages: [
          "English",
          "Bahasa Indonesia",
          "Thai",
          "Vietnamese",
          "Tagalog",
        ],
        regulatoryApprovals: ["MAS", "BI", "BSP", "BOT"],
      },
    ];
  };

  const initializeMarketInsights = (): MarketInsight[] => {
    return [
      {
        region: "Africa",
        totalVolume: 456e9,
        growthRate: 43,
        dominantMethods: ["Mobile Money", "Agent Banking", "USSD", "QR Codes"],
        emergingTrends: [
          "Blockchain Payments",
          "Central Bank Digital Currencies",
          "Cross-border Corridors",
        ],
        challengs: [
          "Regulatory Fragmentation",
          "Infrastructure Gaps",
          "Low Smartphone Penetration",
        ],
        opportunities: [
          "Financial Inclusion",
          "Remittance Markets",
          "E-commerce Growth",
          "Youth Demographics",
        ],
      },
      {
        region: "Europe",
        totalVolume: 1250e9,
        growthRate: 12,
        dominantMethods: [
          "Card Payments",
          "Bank Transfers",
          "Digital Wallets",
          "BNPL",
        ],
        emergingTrends: [
          "Instant Payments",
          "Open Banking",
          "Embedded Finance",
          "Green Payments",
        ],
        challengs: [
          "Regulatory Compliance",
          "Legacy Infrastructure",
          "Competition",
        ],
        opportunities: [
          "PSD2 Innovation",
          "Cross-border Harmonization",
          "SME Digitization",
        ],
      },
      {
        region: "Asia",
        totalVolume: 2890e9,
        growthRate: 28,
        dominantMethods: [
          "QR Payments",
          "Super Apps",
          "Digital Wallets",
          "Bank Integration",
        ],
        emergingTrends: [
          "Central Bank Digital Currencies",
          "Cross-border Wallets",
          "Embedded Finance",
        ],
        challengs: [
          "Regulatory Differences",
          "Market Fragmentation",
          "Security Concerns",
        ],
        opportunities: [
          "Financial Inclusion",
          "Rural Digitization",
          "B2B Payments",
          "Investment Products",
        ],
      },
    ];
  };

  useEffect(() => {
    setSpecialists(initializeSpecialists());
    setMarketInsights(initializeMarketInsights());
  }, []);

  const filteredSpecialists = specialists.filter(
    (s) => s.region.toLowerCase() === activeRegion.toLowerCase(),
  );

  const currentMarketInsight = marketInsights.find(
    (m) => m.region.toLowerCase() === activeRegion.toLowerCase(),
  );

  const getRegionColor = (region: string) => {
    switch (region.toLowerCase()) {
      case "africa":
        return "from-green-500 to-yellow-500";
      case "europe":
        return "from-blue-500 to-purple-500";
      case "asia":
        return "from-red-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e12) return `$${(volume / 1e12).toFixed(1)}T`;
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    return `$${volume.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-red-400 bg-clip-text text-transparent">
            Regional Payment Specialists
          </h1>
          <p className="text-xl text-gray-300">
            Deep dive into regional fintech ecosystems and payment specialists
          </p>
        </motion.div>

        {/* Region Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center space-x-4"
        >
          {[
            { id: "africa", name: "Africa", flag: "🌍" },
            { id: "europe", name: "Europe", flag: "🇪🇺" },
            { id: "asia", name: "Asia", flag: "🌏" },
          ].map((region) => (
            <Button
              key={region.id}
              variant={activeRegion === region.id ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveRegion(region.id as any)}
              className={`flex items-center space-x-2 ${
                activeRegion === region.id
                  ? `bg-gradient-to-r ${getRegionColor(region.id)} text-white`
                  : ""
              }`}
            >
              <span className="text-xl">{region.flag}</span>
              <span>{region.name}</span>
            </Button>
          ))}
        </motion.div>

        {/* Market Insights */}
        <AnimatePresence mode="wait">
          {currentMarketInsight && (
            <motion.div
              key={activeRegion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-green-400">
                      {formatVolume(currentMarketInsight.totalVolume)}
                    </div>
                    <div className="text-sm text-gray-400">Annual Volume</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-blue-400">
                      {currentMarketInsight.growthRate}%
                    </div>
                    <div className="text-sm text-gray-400">YoY Growth</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-purple-400">
                      {filteredSpecialists.length}
                    </div>
                    <div className="text-sm text-gray-400">Key Players</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-yellow-400">
                      {currentMarketInsight.dominantMethods.length}
                    </div>
                    <div className="text-sm text-gray-400">Payment Methods</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Specialists Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredSpecialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Card
                  className={`bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer h-full ${
                    selectedSpecialist === specialist.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedSpecialist(
                      selectedSpecialist === specialist.id
                        ? null
                        : specialist.id,
                    )
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{specialist.logo}</span>
                        <div>
                          <CardTitle className="text-white">
                            {specialist.name}
                          </CardTitle>
                          <p className="text-sm text-gray-400">
                            {specialist.country}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`bg-gradient-to-r ${getRegionColor(specialist.region)}`}
                      >
                        {specialist.marketShare}% Share
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">
                      {specialist.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Volume</span>
                        <div className="text-white font-medium">
                          {formatVolume(specialist.transactionVolume)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Merchants</span>
                        <div className="text-white font-medium">
                          {specialist.merchantCount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Ticket</span>
                        <div className="text-white font-medium">
                          ${specialist.averageTicketSize}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Compliance</span>
                        <div className="text-white font-medium">
                          {specialist.complianceLevel}%
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">
                        Specializations
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {specialist.specialization.slice(0, 3).map((spec) => (
                          <Badge
                            key={spec}
                            variant="outline"
                            className="text-xs"
                          >
                            {spec}
                          </Badge>
                        ))}
                        {specialist.specialization.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{specialist.specialization.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedSpecialist === specialist.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 border-t border-slate-600 pt-3"
                        >
                          <div>
                            <span className="text-gray-400 text-sm">
                              Key Features
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {specialist.keyFeatures.map((feature) => (
                                <Badge
                                  key={feature}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400 text-sm">
                              Regulatory Approvals
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {specialist.regulatoryApprovals.map(
                                (approval) => (
                                  <Badge
                                    key={approval}
                                    className="bg-green-600 text-xs"
                                  >
                                    {approval}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400 text-sm">
                              Integration
                            </span>
                            <div className="flex items-center space-x-4 mt-1">
                              <Badge
                                className={
                                  specialist.integrationSDK
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }
                              >
                                {specialist.integrationSDK
                                  ? "SDK Available"
                                  : "No SDK"}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-xs text-gray-400">
                            <strong>API Documentation:</strong>{" "}
                            {specialist.apiDocumentation}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Market Trends */}
        <AnimatePresence mode="wait">
          {currentMarketInsight && (
            <motion.div
              key={`${activeRegion}-insights`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Market Intelligence
                  </CardTitle>
                  <CardDescription>
                    Trends, challenges, and opportunities in {activeRegion}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <h4 className="text-white font-medium mb-3">
                        Dominant Methods
                      </h4>
                      <div className="space-y-2">
                        {currentMarketInsight.dominantMethods.map((method) => (
                          <div
                            key={method}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">
                              {method}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">
                        Emerging Trends
                      </h4>
                      <div className="space-y-2">
                        {currentMarketInsight.emergingTrends.map((trend) => (
                          <div
                            key={trend}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">
                              {trend}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">
                        Challenges
                      </h4>
                      <div className="space-y-2">
                        {currentMarketInsight.challengs.map((challenge) => (
                          <div
                            key={challenge}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">
                              {challenge}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">
                        Opportunities
                      </h4>
                      <div className="space-y-2">
                        {currentMarketInsight.opportunities.map(
                          (opportunity) => (
                            <div
                              key={opportunity}
                              className="flex items-center space-x-2"
                            >
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <span className="text-gray-300 text-sm">
                                {opportunity}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
