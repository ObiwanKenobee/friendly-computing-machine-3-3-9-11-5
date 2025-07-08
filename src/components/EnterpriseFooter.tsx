/**
 * QuantumVest Enterprise Footer Architecture
 * Comprehensive footer with segmented callouts, utilities, and global presence
 */

import React from "react";
import { Button } from "./ui/button";
import {
  Vault,
  Brain,
  Users,
  Code,
  Briefcase,
  Shield,
  FileText,
  BarChart3,
  Github,
  Linkedin,
  Youtube,
  Twitter,
  MapPin,
} from "lucide-react";

const EnterpriseFooter: React.FC = () => {
  const productLinks = [
    {
      name: "VaultTap™",
      href: "/vault-tap",
      icon: <Vault className="h-4 w-4" />,
    },
    {
      name: "RitualNet™",
      href: "/ritual-net",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      name: "AIAdvisor™",
      href: "/ai-advisor",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      name: "QuantumVest Vaults",
      href: "/vaults",
      icon: <Vault className="h-4 w-4" />,
    },
  ];

  const institutionalLinks = [
    { name: "Sovereign Wealth", href: "/sovereign-wealth" },
    { name: "Family Offices", href: "/family-offices" },
    { name: "NGOs", href: "/ngos" },
    { name: "Development Banks", href: "/development-banks" },
  ];

  const communityLinks = [
    { name: "Diaspora", href: "/diaspora" },
    { name: "Tribal Finance", href: "/tribal-finance" },
    { name: "Village Vaults", href: "/village-vaults" },
    { name: "Local Orgs", href: "/local-orgs" },
  ];

  const developerLinks = [
    {
      name: "Dev Console",
      href: "/dev-console",
      icon: <Code className="h-4 w-4" />,
    },
    { name: "SDKs", href: "/sdks", icon: <Code className="h-4 w-4" /> },
    {
      name: "Public APIs",
      href: "/api",
      icon: <FileText className="h-4 w-4" />,
    },
    { name: "GitHub", href: "/github", icon: <Github className="h-4 w-4" /> },
  ];

  const careerLinks = [
    { name: "Open Roles", href: "/careers" },
    { name: "Work at QuantumVest", href: "/work-here" },
    { name: "Internships", href: "/internships" },
    { name: "Fellowships", href: "/fellowships" },
  ];

  const utilityLinks = [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Vault Transparency Report", href: "/transparency" },
    { name: "Regulatory Disclosures", href: "/regulatory" },
    { name: "AI + Ethics", href: "/ai-ethics" },
  ];

  const globalOffices = [
    { city: "Nairobi", country: "Kenya", flag: "🇰🇪" },
    { city: "Geneva", country: "Switzerland", flag: "🇨🇭" },
    { city: "Dubai", country: "UAE", flag: "🇦🇪" },
    { city: "Toronto", country: "Canada", flag: "🇨🇦" },
    { city: "Lagos", country: "Nigeria", flag: "🇳🇬" },
    { city: "Singapore", country: "Singapore", flag: "🇸🇬" },
    { city: "Bogotá", country: "Colombia", flag: "🇨🇴" },
    { city: "Berlin", country: "Germany", flag: "🇩🇪" },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "/linkedin",
      icon: <Linkedin className="h-5 w-5" />,
    },
    { name: "GitHub", href: "/github", icon: <Github className="h-5 w-5" /> },
    {
      name: "YouTube",
      href: "/youtube",
      icon: <Youtube className="h-5 w-5" />,
    },
    {
      name: "ResearchGate",
      href: "/researchgate",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Twitter/X",
      href: "/twitter",
      icon: <Twitter className="h-5 w-5" />,
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Footer - Segmented Callouts */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                Products
              </h3>
              <div className="space-y-3">
                {productLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Institutional */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-400">
                Institutional
              </h3>
              <div className="space-y-3">
                {institutionalLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">
                Community
              </h3>
              <div className="space-y-3">
                {communityLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Developers */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">
                Developers
              </h3>
              <div className="space-y-3">
                {developerLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Careers */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">
                Careers
              </h3>
              <div className="space-y-3">
                {careerLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Footer - Utilities */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-center lg:justify-start gap-6">
            {utilityLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          {/* Brand & Tagline */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Vault className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">QuantumVest</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 QuantumVest Global Holdings. A Sovereign Finance Protocol.
            </p>
            <p className="text-blue-400 italic text-sm mt-1">
              "Re-encoding wealth, for a living world."
            </p>
          </div>

          {/* Global Offices */}
          <div className="text-center">
            <h4 className="text-sm font-medium mb-3 text-gray-300">
              Global Presence
            </h4>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              {globalOffices.map((office) => (
                <div key={office.city} className="flex items-center space-x-1">
                  <span>{office.flag}</span>
                  <span>{office.city}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center lg:text-right">
            <h4 className="text-sm font-medium mb-3 text-gray-300">Connect</h4>
            <div className="flex justify-center lg:justify-end space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
              <p className="text-blue-100">
                Get the latest insights from the quantum finance frontier
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 min-w-[250px]"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnterpriseFooter;
