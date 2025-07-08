import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import SuperAdminLogin from "../components/SuperAdminLogin";
import SuperAdminDashboard from "../components/SuperAdminDashboard";
import { superAdminAuthService } from "../services/superAdminAuthService";

const SuperAdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const session = superAdminAuthService.getCurrentSession();
    if (session && session.isValid) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await superAdminAuthService.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return <SuperAdminDashboard onLogout={handleLogout} />;
  }

  // If not authenticated, show login
  return <SuperAdminLogin onLoginSuccess={handleLoginSuccess} />;
};

export default SuperAdminPage;
