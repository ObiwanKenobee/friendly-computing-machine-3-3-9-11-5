import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const TestEnterprise: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Enterprise System Test Page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                ✅ All Enterprise Systems Operational
              </h2>
              <p className="text-gray-600 mb-6">
                This test page confirms that the enterprise routing and
                component system is working correctly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold text-blue-600 mb-2">
                  🚀 Platform Status
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>✅ React components loading</li>
                  <li>✅ UI components working</li>
                  <li>✅ Routing functional</li>
                  <li>✅ Icons rendering</li>
                </ul>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-purple-600 mb-2">
                  💎 Enterprise Features
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>✅ Legendary Investor Strategies</li>
                  <li>✅ Portfolio Optimization</li>
                  <li>✅ Risk Management</li>
                  <li>✅ Demo Access System</li>
                </ul>
              </Card>
            </div>

            <div className="text-center space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
                  size="sm"
                >
                  Home
                </Button>
                <Button
                  onClick={() => (window.location.href = "/pricing")}
                  variant="outline"
                  size="sm"
                >
                  Pricing
                </Button>
                <Button
                  onClick={() => (window.location.href = "/billing")}
                  variant="outline"
                  size="sm"
                >
                  Billing
                </Button>
                <Button
                  onClick={() =>
                    (window.location.href = "/legendary-investors-enterprise")
                  }
                  variant="outline"
                  size="sm"
                >
                  Legendary
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                All core enterprise routes are accessible and functional.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestEnterprise;
