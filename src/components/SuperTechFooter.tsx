/**
 * SuperTech Footer - QuantumVest Navigation
 * Ancestral, Ethical, Institutional Layers
 */

import React from "react";
import {
  Github,
  Mail,
  Twitter,
  Linkedin,
  MessageCircle,
  Globe,
  Heart,
  Shield,
  Users,
  Building,
  ExternalLink,
} from "lucide-react";

interface SuperTechFooterProps {
  className?: string;
}

export const SuperTechFooter: React.FC<SuperTechFooterProps> = ({
  className = "",
}) => {
  const footerColumns = [
    {
      title: "Platform Core",
      icon: <Shield className="h-4 w-4" />,
      links: [
        {
          title: "Dashboard",
          href: "/dashboard",
          description: "Investment analytics & portfolio",
        },
        {
          title: "Platform Navigation",
          href: "/platform-navigation",
          description: "Complete platform overview",
        },
        {
          title: "Serverless APIs",
          href: "/serverless-functions",
          description: "Infrastructure monitoring",
        },
        {
          title: "Infrastructure",
          href: "/infrastructure-navigator",
          description: "Snake Xenzia navigation",
        },
      ],
    },
    {
      title: "Enterprise Solutions",
      icon: <Building className="h-4 w-4" />,
      links: [
        {
          title: "UltraLevel Command",
          href: "/ultralevel-admin",
          description: "Enterprise sovereignty control",
        },
        {
          title: "Enterprise Subscriptions",
          href: "/enterprise-subscriptions",
          description: "Comprehensive tier system",
        },
        {
          title: "Institutional Investor",
          href: "/institutional-investor",
          description: "Large-scale solutions",
        },
        {
          title: "Legendary Investors",
          href: "/legendary-investors-enterprise",
          description: "Elite strategy access",
        },
      ],
    },
    {
      title: "Investment Tiers",
      icon: <Users className="h-4 w-4" />,
      links: [
        {
          title: "Retail Investor",
          href: "/retail-investor",
          description: "Individual investor tools",
        },
        {
          title: "Financial Advisor",
          href: "/financial-advisor",
          description: "Professional advisory",
        },
        {
          title: "Cultural Investor",
          href: "/cultural-investor",
          description: "Values-based investing",
        },
        {
          title: "Developer Platform",
          href: "/developer-integrator",
          description: "API & integration tools",
        },
      ],
    },
    {
      title: "Platform Features",
      icon: <Heart className="h-4 w-4" />,
      links: [
        {
          title: "Pricing Plans",
          href: "/pricing",
          description: "Transparent pricing structure",
        },
        {
          title: "Billing Management",
          href: "/billing",
          description: "Account & subscription",
        },
        {
          title: "Investor Archetypes",
          href: "/archetypes",
          description: "Personalized profiles",
        },
        {
          title: "Quantum Enterprise 2050",
          href: "/quantum-enterprise-2050",
          description: "Future vision platform",
        },
      ],
    },
    {
      title: "Resources",
      icon: <Globe className="h-4 w-4" />,
      links: [
        {
          title: "SuperAdmin Console",
          href: "/superadmin",
          description: "Platform administration",
        },
        {
          title: "Geographical Consciousness",
          href: "/geographical-consciousness",
          description: "Global awareness tools",
        },
        {
          title: "Wildlife Conservation",
          href: "/wildlife-conservation-enterprise",
          description: "Environmental impact",
        },
        {
          title: "Tortoise Protocol",
          href: "/tortoise-protocol",
          description: "Long-term strategies",
        },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <Twitter className="h-5 w-5" />,
      href: "https://twitter.com/quantumvest",
      label: "Twitter",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      href: "https://discord.gg/quantumvest",
      label: "Discord",
    },
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/quantumvest",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://linkedin.com/company/quantumvest",
      label: "LinkedIn",
    },
  ];

  const ecosystemPartners = [
    { name: "AmazonDAO", region: "🌿 Amazon Basin", status: "Active" },
    { name: "AfroDAO", region: "🌍 African Continent", status: "Growing" },
    { name: "PacificDAO", region: "🌊 Pacific Islands", status: "Launching" },
    { name: "Arctic DAO", region: "❄️ Arctic Circle", status: "Planning" },
  ];

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      {/* Ecosystem Partners Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Global Ecosystem Partners
            </h3>
            <p className="text-gray-400 text-sm">
              Regional DAOs building the future of planetary stewardship
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {ecosystemPartners.map((partner) => (
              <div
                key={partner.name}
                className="bg-gray-800 rounded-lg p-3 sm:p-4 text-center hover:bg-gray-750 transition-colors"
              >
                <div className="font-medium text-white mb-1 text-sm sm:text-base">
                  {partner.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mb-2">
                  {partner.region}
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full inline-block ${
                    partner.status === "Active"
                      ? "bg-green-900 text-green-300"
                      : partner.status === "Growing"
                        ? "bg-yellow-900 text-yellow-300"
                        : partner.status === "Launching"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {partner.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded">
                  {column.icon}
                </div>
                <h4 className="font-semibold text-base sm:text-lg">
                  {column.title}
                </h4>
              </div>

              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      className="group block hover:text-blue-400 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {link.title}
                        </span>
                        {link.href.startsWith("http") && (
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 pr-4">
                        {link.description}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Social Icons for Contact Column */}
              {column.title === "Contact" && (
                <div className="mt-6">
                  <h5 className="text-sm font-medium mb-3">Follow Us</h5>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
            <div className="lg:max-w-md">
              <h4 className="text-lg font-semibold mb-2">
                Stay Connected with the Quantum
              </h4>
              <p className="text-gray-400 text-sm">
                Get updates on new vaults, ritual yields, and planetary
                stewardship initiatives.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:min-w-0 lg:flex-1 lg:max-w-md lg:ml-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-colors text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Animated Logo */}
              <div className="flex items-center space-x-2">
                <div
                  className="text-xl sm:text-2xl animate-spin"
                  style={{ animationDuration: "12s" }}
                >
                  🌀
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  QuantumVest
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Building the future of planetary stewardship
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a
                href="/security"
                className="hover:text-white transition-colors"
              >
                Security
              </a>
              <div className="text-xs sm:text-sm">
                © 2024 QuantumVest. All rights reserved.
              </div>
            </div>
          </div>

          {/* Protocol Status */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span>Protocol Status: Operational</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span>Vaults Active: 247</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span>Total Value Locked: $2.3B</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SuperTechFooter;
