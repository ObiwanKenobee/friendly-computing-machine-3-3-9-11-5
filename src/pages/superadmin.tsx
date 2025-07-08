/**
 * Protected SuperAdmin Page
 * Uses unified authentication system
 */

import React from "react";
import {
  UnifiedAdminProvider,
  AdminGuard,
  AdminLevel,
} from "../components/UnifiedAdminAuth";
import SuperAdminDashboard from "./superadmin-dashboard";

const SuperAdminPage: React.FC = () => {
  return (
    <UnifiedAdminProvider>
      <AdminGuard requiredLevel={AdminLevel.SUPER}>
        <SuperAdminDashboard />
      </AdminGuard>
    </UnifiedAdminProvider>
  );
};

export default SuperAdminPage;
