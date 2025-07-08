import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { GraduationCap, BookOpen, Target } from "lucide-react";

const StudentEarlyCareerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-pink-200 rounded-lg mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Student & Early Career Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  Gamified education and micro-investment platform for students
                  and young professionals
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
                <BookOpen className="h-5 w-5 text-pink-600" />
                <span>Educational Modules</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Interactive learning paths designed for beginners
              </p>
              <Button className="w-full">Start Learning</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span>Savings Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Set and track your financial goals
              </p>
              <Button className="w-full">Set Goals</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Full student dashboard features coming soon!
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

export default StudentEarlyCareerDashboard;
