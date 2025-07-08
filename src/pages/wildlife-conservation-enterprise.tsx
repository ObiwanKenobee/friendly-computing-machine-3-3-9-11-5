/**
 * Wildlife Conservation Enterprise Page
 * Conservation-focused investment platform
 */

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { SEOHead } from "../components/SEOHead";
import { ProtectedFeature } from "../components/SubscriptionGating";
import {
  Leaf,
  TreePine,
  Bird,
  Fish,
  Mountain,
  Globe,
  Heart,
  Shield,
  TrendingUp,
  Target,
  BarChart3,
  DollarSign,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Activity,
  Camera,
  Satellite,
} from "lucide-react";

const WildlifeConservationEnterprise: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState("biodiversity");

  const conservationPrograms = [
    {
      id: "biodiversity",
      name: "Biodiversity Preservation",
      description:
        "Invest in projects that protect endangered species and ecosystems",
      icon: <Bird className="h-8 w-8 text-green-600" />,
      impactMetrics: {
        speciesProtected: 1247,
        habitatPreserved: "2.3M hectares",
        carbonSequestered: "450K tons CO2",
        communitiesSupported: 89,
      },
      returns: "+12.8% annual",
      riskLevel: "Medium",
      investmentRange: "$50K - $5M",
    },
    {
      id: "marine",
      name: "Marine Conservation",
      description:
        "Protect ocean ecosystems and marine life through sustainable investments",
      icon: <Fish className="h-8 w-8 text-blue-600" />,
      impactMetrics: {
        marineAreasProtected: "1.8M km²",
        fishStocksRestored: 34,
        plasticRemoved: "2.1M kg",
        coastalCommunitiesHelped: 156,
      },
      returns: "+14.2% annual",
      riskLevel: "Medium-High",
      investmentRange: "$100K - $10M",
    },
    {
      id: "forests",
      name: "Forest Restoration",
      description:
        "Reforestation and sustainable forest management investments",
      icon: <TreePine className="h-8 w-8 text-emerald-600" />,
      impactMetrics: {
        treesPlanted: "12.4M",
        forestsRestored: "890K hectares",
        carbonCapture: "1.2M tons CO2",
        jobsCreated: 4567,
      },
      returns: "+16.5% annual",
      riskLevel: "Low-Medium",
      investmentRange: "$25K - $2M",
    },
    {
      id: "wildlife",
      name: "Wildlife Corridors",
      description:
        "Create and maintain wildlife corridors for species migration",
      icon: <Mountain className="h-8 w-8 text-amber-600" />,
      impactMetrics: {
        corridorsCreated: 67,
        wildlifePopulationIncrease: "23%",
        humanWildlifeConflictReduction: "45%",
        touristRevenue: "$12.3M",
      },
      returns: "+11.4% annual",
      riskLevel: "Medium",
      investmentRange: "$75K - $3M",
    },
  ];

  const currentProgram = conservationPrograms.find(
    (p) => p.id === selectedProgram,
  );

  const enterpriseTools = [
    {
      title: "Satellite Monitoring",
      description:
        "Real-time satellite imagery for conservation project tracking",
      icon: <Satellite className="h-6 w-6" />,
      metrics: [
        "Deforestation alerts",
        "Wildlife movement tracking",
        "Habitat changes",
      ],
    },
    {
      title: "Biodiversity Analytics",
      description:
        "Advanced analytics for species population and ecosystem health",
      icon: <BarChart3 className="h-6 w-6" />,
      metrics: [
        "Species count trends",
        "Ecosystem health scores",
        "Predictive modeling",
      ],
    },
    {
      title: "Impact Bonds Platform",
      description: "Create and manage conservation impact bonds",
      icon: <Target className="h-6 w-6" />,
      metrics: ["Bond structuring", "Impact verification", "Payout automation"],
    },
    {
      title: "Community Engagement",
      description: "Connect with local communities and conservation partners",
      icon: <Users className="h-6 w-6" />,
      metrics: [
        "Community feedback",
        "Local employment",
        "Cultural preservation",
      ],
    },
  ];

  const impactBonds = [
    {
      title: "Amazon Rainforest Protection Bond",
      amount: "$50M",
      target: "Protect 500K hectares",
      return: "8-15% based on impact",
      duration: "10 years",
      status: "Active",
    },
    {
      title: "Great Barrier Reef Restoration Bond",
      amount: "$30M",
      target: "Restore 50 reef sites",
      return: "6-12% based on impact",
      duration: "8 years",
      status: "Fundraising",
    },
    {
      title: "African Elephant Corridor Bond",
      amount: "$25M",
      target: "Create 5 wildlife corridors",
      return: "10-18% based on impact",
      duration: "12 years",
      status: "Planning",
    },
  ];

  return (
    <>
      <SEOHead
        title="Wildlife Conservation Enterprise | QuantumVest"
        description="Conservation-focused investment platform with biodiversity tracking, impact bonds, and sustainable returns for conservation organizations."
        keywords={[
          "wildlife conservation",
          "conservation finance",
          "biodiversity investing",
          "impact bonds",
          "sustainable investment",
          "environmental returns",
          "conservation enterprise",
          "ecosystem protection",
        ]}
        canonicalUrl="/wildlife-conservation-enterprise"
      />

      <ProtectedFeature
        requiredTier="enterprise"
        featureName="Wildlife Conservation Enterprise"
        description="Advanced conservation-focused investment platform with biodiversity tracking and impact measurement."
        benefits={[
          "Satellite monitoring for real-time conservation tracking",
          "Biodiversity analytics and species population tracking",
          "Impact bonds platform for conservation finance",
          "Community engagement and partnership tools",
          "Carbon sequestration measurement",
          "ESG reporting and compliance",
          "Conservation project pipeline management",
          "Sustainable returns measurement",
        ]}
      >
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <Leaf className="h-8 w-8 text-green-700" />
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Enterprise Conservation
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Wildlife Conservation Enterprise
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conservation-focused investment platform with biodiversity
                tracking, impact measurement, and sustainable returns
              </p>
            </div>

            {/* Conservation Programs */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Conservation Investment Programs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {conservationPrograms.map((program) => (
                  <Card
                    key={program.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedProgram === program.id
                        ? "ring-2 ring-green-500 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedProgram(program.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        {program.icon}
                        <div>
                          <CardTitle className="text-lg">
                            {program.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {program.returns}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-3">
                        {program.description}
                      </p>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>Risk: {program.riskLevel}</p>
                        <p>Range: {program.investmentRange}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Program Details */}
              {currentProgram && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {currentProgram.icon}
                        <div>
                          <CardTitle className="text-2xl">
                            {currentProgram.name}
                          </CardTitle>
                          <p className="text-gray-600">
                            {currentProgram.description}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {currentProgram.returns}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(currentProgram.impactMetrics).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="text-center p-3 bg-green-50 rounded-lg"
                          >
                            <p className="text-2xl font-bold text-green-700">
                              {value}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Enterprise Tools */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Enterprise Conservation Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enterpriseTools.map((tool, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          {tool.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {tool.title}
                          </CardTitle>
                          <p className="text-gray-600">{tool.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tool.metrics.map((metric, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">
                              {metric}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Impact Bonds */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Conservation Impact Bonds
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {impactBonds.map((bond, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{bond.title}</CardTitle>
                      <div className="flex items-center justify-between">
                        <Badge
                          className={
                            bond.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : bond.status === "Fundraising"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {bond.status}
                        </Badge>
                        <span className="text-lg font-bold">{bond.amount}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Target:</span>
                          <span className="text-sm font-medium">
                            {bond.target}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Return:</span>
                          <span className="text-sm font-medium">
                            {bond.return}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Duration:
                          </span>
                          <span className="text-sm font-medium">
                            {bond.duration}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        variant={
                          bond.status === "Active" ? "default" : "outline"
                        }
                        disabled={bond.status === "Planning"}
                      >
                        {bond.status === "Active"
                          ? "Invest Now"
                          : bond.status === "Fundraising"
                            ? "Join Waitlist"
                            : "Coming Soon"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Global Impact Dashboard */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-6 w-6 text-blue-600" />
                  <span>Global Conservation Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      15.2M
                    </div>
                    <p className="text-sm text-gray-600">Hectares Protected</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      2,847
                    </div>
                    <p className="text-sm text-gray-600">Species Safeguarded</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      1.8M
                    </div>
                    <p className="text-sm text-gray-600">
                      Tons CO2 Sequestered
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      456
                    </div>
                    <p className="text-sm text-gray-600">
                      Communities Supported
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Center */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group">
                  Launch Conservation Dashboard
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  Download Impact Report
                </Button>
                <Button variant="outline" size="lg">
                  Schedule Conservation Call
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Estimated setup time: ~10 minutes | Target: Conservation
                organizations
              </p>
            </div>
          </div>
        </div>
      </ProtectedFeature>
    </>
  );
};

export default WildlifeConservationEnterprise;
