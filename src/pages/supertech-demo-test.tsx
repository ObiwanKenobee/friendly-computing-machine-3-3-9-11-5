/**
 * SuperTech Layout Test Page
 */

import React from "react";
import SuperTechLayoutSimple from "../components/SuperTechLayoutSimple";

const SuperTechDemoTest: React.FC = () => {
  return (
    <SuperTechLayoutSimple>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🌀</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SuperTech Layout Test
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Testing SuperTech header and footer components
          </p>
        </div>
      </div>
    </SuperTechLayoutSimple>
  );
};

export default SuperTechDemoTest;
