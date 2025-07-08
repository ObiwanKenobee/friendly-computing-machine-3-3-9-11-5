import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Shield,
  Key,
  Database,
  Users,
  Settings,
  ArrowRight,
  Lock,
} from "lucide-react";
import { superAdminAuthService } from "../services/superAdminAuthService";
import { databaseSeedingService } from "../services/databaseSeedingService";

interface SuperAdminAccessProps {
  showInNavigation?: boolean;
}

const SuperAdminAccess: React.FC<SuperAdminAccessProps> = ({
  showInNavigation = false,
}) => {
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingMessage, setSeedingMessage] = useState("");

  const handleQuickSetup = async () => {
    setIsSeeding(true);
    setSeedingMessage("");

    try {
      // Seed the database
      const result = await databaseSeedingService.seedDatabase();
      setSeedingMessage(result.message);

      // Auto-navigate to super admin page after seeding
      setTimeout(() => {
        navigate("/super-admin");
      }, 2000);
    } catch (error) {
      setSeedingMessage("Setup failed. Please try again.");
    } finally {
      setIsSeeding(false);
    }
  };

  if (showInNavigation) {
    return (
      <Link
        to="/super-admin"
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
      >
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium">Super Admin</span>
      </Link>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl">Super Admin Access</CardTitle>
        <CardDescription>
          Enterprise-level administrative control panel for QuantumVest
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            Administrative Features:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm">User Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-green-600" />
              <span className="text-sm">Database Control</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-purple-600" />
              <span className="text-sm">System Config</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-red-600" />
              <span className="text-sm">Security Center</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Development Credentials:
          </h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Username:</span>
              <Badge variant="secondary" className="text-xs">
                superadmin
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Password:</span>
              <Badge variant="secondary" className="text-xs">
                QuantumVest@2024!
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">MFA Code:</span>
              <Badge variant="secondary" className="text-xs">
                123456
              </Badge>
            </div>
          </div>
        </div>

        {seedingMessage && (
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>{seedingMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleQuickSetup}
            disabled={isSeeding}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSeeding ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Setting up...
              </div>
            ) : (
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Quick Setup & Access
              </div>
            )}
          </Button>

          <Link to="/super-admin" className="block">
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Go to Super Admin
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            🔒 Secure administrative interface for enterprise operations
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuperAdminAccess;
