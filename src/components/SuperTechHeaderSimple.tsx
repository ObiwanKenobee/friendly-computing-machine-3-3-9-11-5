/**
 * Simple SuperTech Header for Testing
 */

import React from "react";
import { Button } from "./ui/button";
import { Bell, Globe, Menu } from "lucide-react";

interface SuperTechHeaderSimpleProps {
  className?: string;
}

export const SuperTechHeaderSimple: React.FC<SuperTechHeaderSimpleProps> = ({
  className = "",
}) => {
  return (
    <header
      className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className="text-2xl animate-spin"
                style={{ animationDuration: "8s" }}
              >
                🌀
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QuantumVest
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <span className="text-gray-700">Vaults</span>
            <span className="text-gray-700">AI Advisor</span>
            <span className="text-gray-700">Ritual Yield</span>
            <span className="text-gray-700">GeoDAOs</span>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <Globe className="h-5 w-5" />
            </button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Join a Vault
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperTechHeaderSimple;
