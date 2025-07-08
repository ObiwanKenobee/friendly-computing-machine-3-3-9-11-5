/**
 * 🐢 Tortoise Protocol Page
 * "Wealth is not made in haste—it is cultivated with memory, ethics, rhythm, and myth."
 */

import React from "react";
import TortoiseDashboard from "../components/TortoiseDashboard";
import { SEOHead } from "../components/SEOHead";

const TortoiseProtocolPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="🐢 Tortoise Protocol - Ethical Wealth Creation | QuantumVest"
        description="The Tortoise-Led Innovation Protocol: Cultivate wealth with memory, ethics, rhythm, and myth. Slow, sustainable, and wisdom-based investment strategies."
        keywords={[
          "tortoise protocol",
          "ethical investment",
          "sustainable wealth",
          "philosophical investing",
          "wisdom-based finance",
          "regenerative economics",
          "cultural stewardship",
          "mythic insight",
          "yield rhythm",
          "contemplative investing",
        ]}
        canonicalUrl="/tortoise-protocol"
      />

      <TortoiseDashboard />
    </>
  );
};

export default TortoiseProtocolPage;
