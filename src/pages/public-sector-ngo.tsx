import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Building, Globe, Heart } from "lucide-react";

const PublicSectorNGODashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-indigo-200 rounded-lg mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-xl">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Public Sector & NGO Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  Government development funds and social impact investing
                  platform
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                <span>Impact Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Track social and environmental impact
              </p>
              <Button className="w-full">View Impact</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-blue-600" />
                <span>Community Programs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage community development programs
              </p>
              <Button className="w-full">Manage Programs</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Full public sector features coming soon!
              </p>
              <Badge variant="outline" className="mt-2">
                In Development
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicSectorNGODashboard;
