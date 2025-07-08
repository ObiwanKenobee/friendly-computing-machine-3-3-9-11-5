/**
 * SuperTech Layout - Complete page layout with header and footer
 * Wraps content with the new SuperTech navigation system
 */

import React from "react";
import ResponsiveNavbar from "./ResponsiveNavbar";
import SuperTechFooter from "./SuperTechFooter";

interface SuperTechLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const SuperTechLayout: React.FC<SuperTechLayoutProps> = ({
  children,
  className = "",
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-white ${className}`}>
      {showHeader && <ResponsiveNavbar />}

      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {showFooter && <SuperTechFooter />}
    </div>
  );
};

export default SuperTechLayout;
