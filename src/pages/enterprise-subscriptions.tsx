/**
 * Enterprise Subscriptions Overview Page
 * Complete operational workflows for all subscription tiers
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { SEOHead } from "../components/SEOHead";
import { EnterpriseSubscriptionPackages } from "../components/EnterpriseSubscriptionPackages";
import {
  Crown,
  Star,
  Shield,
  Users,
  TrendingUp,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle,
  Building,
  Briefcase,
  GraduationCap,
  Heart,
} from "lucide-react";

const EnterpriseSubscriptionsPage: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState("new-user");

  const operationalWorkflows = [
    {
      id: "new-user",
      title: "New User Onboarding Journey",
      description: "Complete pathway from discovery to subscription activation",
      icon: <Users className="h-6 w-6" />,
      steps: [
        "Visit platform homepage",
        "Explore investor archetypes assessment",
        "Complete personality and strategy matching",
        "Access free investment dashboard",
        "Review subscription plans and features",
        "Select appropriate tier based on needs",
        "Complete payment and account setup",
        "Access tier-specific features and tools",
      ],
      estimatedTime: "15-30 minutes",
      targetUsers: "First-time visitors and new investors",
    },
    {
      id: "enterprise-client",
      title: "Enterprise Client Workflow",
      description: "High-touch enterprise onboarding and feature activation",
      icon: <Building className="h-6 w-6" />,
      steps: [
        "Schedule consultation call",
        "Assess institutional investment needs",
        "Demo legendary investor strategies",
        "Configure Tortoise Protocol settings",
        "Set up enterprise security and compliance",
        "Integrate with existing systems via API",
        "Train team on advanced analytics tools",
        "Launch full enterprise dashboard",
      ],
      estimatedTime: "2-4 weeks",
      targetUsers: "Institutional investors and large enterprises",
    },
    {
      id: "professional-advisor",
      title: "Professional Advisor Workflow",
      description:
        "Tailored experience for financial professionals and advisors",
      icon: <Briefcase className="h-6 w-6" />,
      steps: [
        "Verify professional credentials",
        "Access client management tools",
        "Set up portfolio modeling environment",
        "Configure compliance tracking",
        "Integrate with existing CRM systems",
        "Access professional-grade analytics",
        "Set up client reporting automation",
        "Launch advisor dashboard",
      ],
      estimatedTime: "3-7 days",
      targetUsers: "Financial advisors and wealth managers",
    },
    {
      id: "conservation-org",
      title: "Conservation Organization Workflow",
      description: "Specialized workflow for conservation and impact investing",
      icon: <Heart className="h-6 w-6" />,
      steps: [
        "Assess conservation investment goals",
        "Access wildlife conservation platform",
        "Set up biodiversity tracking tools",
        "Configure impact measurement systems",
        "Connect with conservation partners",
        "Launch impact bond creation tools",
        "Implement satellite monitoring",
        "Begin conservation investment tracking",
      ],
      estimatedTime: "1-2 weeks",
      targetUsers: "Conservation organizations and impact investors",
    },
  ];

  const tierComparison = [
    {
      tier: "Free",
      price: "$0",
      color: "gray",
      icon: <Users className="h-5 w-5" />,
      features: [
        "Investment Dashboard",
        "Basic Analytics",
        "Archetype Assessment",
        "Billing Management",
      ],
      targetUsers: "Individual investors exploring options",
      limitations: "Limited analytics, no API access",
    },
    {
      tier: "Starter",
      price: "$29",
      color: "blue",
      icon: <Star className="h-5 w-5" />,
      features: [
        "Retail Investor Tools",
        "Educational Resources",
        "Emerging Market Access",
        "Student Programs",
      ],
      targetUsers: "Individual retail investors and students",
      limitations: "Basic features, limited customization",
    },
    {
      tier: "Professional",
      price: "$99",
      color: "purple",
      icon: <Crown className="h-5 w-5" />,
      features: [
        "Financial Advisor Tools",
        "API Access",
        "Client Management",
        "Advanced Analytics",
        "Cultural Investing",
      ],
      targetUsers: "Financial professionals and advisors",
      limitations: "No enterprise features or white-labeling",
    },
    {
      tier: "Enterprise",
      price: "$299",
      color: "orange",
      icon: <Shield className="h-5 w-5" />,
      features: [
        "Legendary Strategies",
        "Tortoise Protocol",
        "Institutional Tools",
        "Custom Reporting",
        "White-label",
      ],
      targetUsers: "Institutions and large organizations",
      limitations: "None - full platform access",
    },
  ];

  const currentWorkflow = operationalWorkflows.find(
    (w) => w.id === selectedWorkflow,
  );

  return (
    <>
      <SEOHead
        title="Enterprise Subscriptions & Workflows | QuantumVest"
        description="Complete subscription tiers and operational workflows for every type of investor - from individuals to institutions."
        keywords={[
          "enterprise subscriptions",
          "investment platform tiers",
          "operational workflows",
          "subscription management",
          "investor onboarding",
          "professional tools",
          "institutional investing",
          "subscription comparison",
        ]}
        canonicalUrl="/enterprise-subscriptions"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise Subscriptions & Workflows
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete operational workflows and subscription management for
              every type of investor
            </p>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="subscriptions" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="subscriptions">All Subscriptions</TabsTrigger>
              <TabsTrigger value="workflows">Operational Workflows</TabsTrigger>
              <TabsTrigger value="comparison">Tier Comparison</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise Features</TabsTrigger>
            </TabsList>

            {/* All Subscriptions Tab */}
            <TabsContent value="subscriptions" className="space-y-6">
              <EnterpriseSubscriptionPackages showWorkflows={true} />
            </TabsContent>

            {/* Operational Workflows Tab */}
            <TabsContent value="workflows" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Operational Workflows
                </h2>
                <p className="text-gray-600">
                  Step-by-step workflows for different user types and use cases
                </p>
              </div>

              {/* Workflow Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {operationalWorkflows.map((workflow) => (
                  <Card
                    key={workflow.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedWorkflow === workflow.id
                        ? "ring-2 ring-blue-500 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedWorkflow(workflow.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {workflow.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {workflow.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-2">
                        {workflow.description}
                      </p>
                      <p className="text-xs text-gray-600">
                        Time: {workflow.estimatedTime}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Workflow Details */}
              {currentWorkflow && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        {currentWorkflow.icon}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {currentWorkflow.title}
                        </CardTitle>
                        <p className="text-gray-600">
                          {currentWorkflow.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Workflow Steps
                        </h3>
                        <ol className="space-y-3">
                          {currentWorkflow.steps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-3"
                            >
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {idx + 1}
                              </div>
                              <span className="text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Estimated Time
                          </h3>
                          <p className="text-lg font-bold text-blue-600">
                            {currentWorkflow.estimatedTime}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Target Users
                          </h3>
                          <p className="text-gray-700">
                            {currentWorkflow.targetUsers}
                          </p>
                        </div>
                        <Button className="w-full group">
                          Start This Workflow
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tier Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Subscription Tier Comparison
                </h2>
                <p className="text-gray-600">
                  Compare features, pricing, and capabilities across all
                  subscription tiers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tierComparison.map((tier) => (
                  <Card key={tier.tier} className="relative">
                    {tier.tier === "Professional" && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Badge className="bg-purple-100 text-purple-800">
                          Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className={`p-2 bg-${tier.color}-100 rounded-lg`}>
                          {tier.icon}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{tier.tier}</CardTitle>
                      <p className="text-3xl font-bold">
                        {tier.price}
                        <span className="text-lg font-normal text-gray-600">
                          /month
                        </span>
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Key Features:
                        </h4>
                        <ul className="space-y-1">
                          {tier.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Best For:
                        </h4>
                        <p className="text-sm text-gray-600">
                          {tier.targetUsers}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Limitations:
                        </h4>
                        <p className="text-sm text-gray-600">
                          {tier.limitations}
                        </p>
                      </div>

                      <Button
                        className="w-full"
                        variant={
                          tier.tier === "Professional" ? "default" : "outline"
                        }
                      >
                        {tier.tier === "Free"
                          ? "Get Started"
                          : `Choose ${tier.tier}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Enterprise Features Tab */}
            <TabsContent value="enterprise" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Enterprise Features
                </h2>
                <p className="text-gray-600">
                  Advanced capabilities for institutional investors and large
                  organizations
                </p>
              </div>

              <EnterpriseSubscriptionPackages
                filterTier="enterprise"
                showWorkflows={false}
              />

              <Card className="bg-gradient-to-r from-orange-100 to-amber-100">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Ready for Enterprise?
                    </h3>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                      Schedule a consultation with our enterprise team to
                      discuss custom solutions, white-labeling opportunities,
                      and institutional-grade features.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg">Schedule Enterprise Demo</Button>
                      <Button variant="outline" size="lg">
                        Contact Sales Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default EnterpriseSubscriptionsPage;
