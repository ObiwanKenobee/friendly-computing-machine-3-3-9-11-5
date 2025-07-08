/**
 * Simple SuperTech Layout for Testing
 */

import React from "react";
import SuperTechHeaderSimple from "./SuperTechHeaderSimple";

interface SuperTechLayoutSimpleProps {
  children: React.ReactNode;
  className?: string;
}

export const SuperTechLayoutSimple: React.FC<SuperTechLayoutSimpleProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <SuperTechHeaderSimple />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-white p-8 text-center">
        <div className="text-2xl mb-2">🌀</div>
        <p>QuantumVest - Building the future of planetary stewardship</p>
      </footer>
    </div>
  );
};

export default SuperTechLayoutSimple;
