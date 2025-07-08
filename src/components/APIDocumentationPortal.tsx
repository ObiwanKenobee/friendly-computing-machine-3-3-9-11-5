import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Code,
  BookOpen,
  Zap,
  Key,
  Globe,
  Play,
  Copy,
  Download,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Terminal,
  Smartphone,
  Monitor,
  Database,
  Lock,
  Settings,
} from "lucide-react";

interface APIEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  summary: string;
  description: string;
  category: string;
  deprecated?: boolean;
  rateLimit?: {
    requests: number;
    period: string;
  };
  authentication: "none" | "api-key" | "oauth" | "jwt";
  parameters?: APIParameter[];
  requestBody?: RequestBodySchema;
  responses: ResponseSchema[];
  examples: APIExample[];
  sdks: string[];
}

interface APIParameter {
  name: string;
  in: "query" | "path" | "header";
  type: string;
  required: boolean;
  description: string;
  example?: any;
  enum?: string[];
}

interface RequestBodySchema {
  contentType: string;
  schema: any;
  examples: Record<string, any>;
}

interface ResponseSchema {
  statusCode: number;
  description: string;
  schema?: any;
  examples?: Record<string, any>;
}

interface APIExample {
  title: string;
  description: string;
  request: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
  };
  response: {
    status: number;
    headers?: Record<string, string>;
    body: any;
  };
}

interface SDK {
  id: string;
  name: string;
  language: string;
  version: string;
  downloadUrl: string;
  documentation: string;
  examples: string[];
  popularity: number;
  lastUpdated: string;
}

interface WebhookEvent {
  name: string;
  description: string;
  payload: any;
  retryPolicy: {
    maxAttempts: number;
    backoffStrategy: string;
  };
  security: {
    signature: boolean;
    encryption: boolean;
  };
}

const APIDocumentationPortal: React.FC = () => {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [sdks, setSDKs] = useState<SDK[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEvent[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [apiKey, setApiKey] = useState("");
  const [playgroundResponse, setPlaygroundResponse] = useState<any>(null);

  useEffect(() => {
    initializeAPIData();
  }, []);

  const initializeAPIData = () => {
    // API Endpoints
    setEndpoints([
      {
        id: "get-user-profile",
        method: "GET",
        path: "/api/v1/users/{userId}",
        summary: "Get User Profile",
        description:
          "Retrieve comprehensive user profile information including investment preferences and portfolio summary.",
        category: "Users",
        authentication: "jwt",
        rateLimit: { requests: 100, period: "minute" },
        parameters: [
          {
            name: "userId",
            in: "path",
            type: "string",
            required: true,
            description: "Unique identifier for the user",
            example: "user_123456789",
          },
          {
            name: "include",
            in: "query",
            type: "string",
            required: false,
            description: "Comma-separated list of additional data to include",
            enum: ["portfolio", "preferences", "analytics"],
            example: "portfolio,preferences",
          },
        ],
        responses: [
          {
            statusCode: 200,
            description: "User profile retrieved successfully",
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
                name: { type: "string" },
                archetype: { type: "string" },
                createdAt: { type: "string", format: "date-time" },
                portfolio: { type: "object" },
              },
            },
          },
          {
            statusCode: 404,
            description: "User not found",
          },
        ],
        examples: [
          {
            title: "Basic Profile Request",
            description: "Simple request to get user profile",
            request: {
              method: "GET",
              url: "/api/v1/users/user_123456789",
              headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "Content-Type": "application/json",
              },
            },
            response: {
              status: 200,
              body: {
                id: "user_123456789",
                email: "john.doe@example.com",
                name: "John Doe",
                archetype: "emerging-market-citizen",
                createdAt: "2024-01-15T10:30:00Z",
                lastLoginAt: "2024-01-20T14:22:00Z",
              },
            },
          },
        ],
        sdks: ["javascript", "python", "java", "php", "ruby"],
      },
      {
        id: "create-investment",
        method: "POST",
        path: "/api/v1/investments",
        summary: "Create Investment",
        description:
          "Create a new investment transaction for the authenticated user.",
        category: "Investments",
        authentication: "jwt",
        rateLimit: { requests: 20, period: "minute" },
        requestBody: {
          contentType: "application/json",
          schema: {
            type: "object",
            required: ["assetId", "amount", "type"],
            properties: {
              assetId: {
                type: "string",
                description: "Unique identifier for the investment asset",
              },
              amount: {
                type: "number",
                minimum: 0.01,
                description: "Investment amount in USD",
              },
              type: {
                type: "string",
                enum: ["buy", "sell"],
                description: "Type of investment transaction",
              },
              riskProfile: {
                type: "string",
                enum: ["conservative", "moderate", "aggressive"],
              },
            },
          },
          examples: {
            "healthcare-investment": {
              assetId: "asset_healthcare_001",
              amount: 1000.0,
              type: "buy",
              riskProfile: "moderate",
            },
          },
        },
        responses: [
          {
            statusCode: 201,
            description: "Investment created successfully",
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                status: { type: "string" },
                transactionId: { type: "string" },
                amount: { type: "number" },
                fees: { type: "number" },
                estimatedCompletion: { type: "string", format: "date-time" },
              },
            },
          },
          {
            statusCode: 400,
            description: "Invalid investment parameters",
          },
          {
            statusCode: 402,
            description: "Insufficient funds",
          },
        ],
        examples: [
          {
            title: "Healthcare Investment",
            description: "Create a healthcare sector investment",
            request: {
              method: "POST",
              url: "/api/v1/investments",
              headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "Content-Type": "application/json",
              },
              body: {
                assetId: "asset_healthcare_001",
                amount: 1000.0,
                type: "buy",
                riskProfile: "moderate",
              },
            },
            response: {
              status: 201,
              body: {
                id: "inv_987654321",
                status: "pending",
                transactionId: "txn_abc123def456",
                amount: 1000.0,
                fees: 5.0,
                estimatedCompletion: "2024-01-20T16:00:00Z",
              },
            },
          },
        ],
        sdks: ["javascript", "python", "java", "php", "ruby"],
      },
      {
        id: "get-portfolio",
        method: "GET",
        path: "/api/v1/portfolio",
        summary: "Get Portfolio",
        description:
          "Retrieve the user's complete investment portfolio with performance metrics.",
        category: "Portfolio",
        authentication: "jwt",
        rateLimit: { requests: 50, period: "minute" },
        parameters: [
          {
            name: "include_history",
            in: "query",
            type: "boolean",
            required: false,
            description: "Include historical performance data",
            example: true,
          },
          {
            name: "period",
            in: "query",
            type: "string",
            required: false,
            description: "Time period for historical data",
            enum: ["1d", "7d", "30d", "90d", "1y"],
            example: "30d",
          },
        ],
        responses: [
          {
            statusCode: 200,
            description: "Portfolio data retrieved successfully",
          },
        ],
        examples: [
          {
            title: "Portfolio with History",
            description: "Get portfolio including 30-day performance history",
            request: {
              method: "GET",
              url: "/api/v1/portfolio?include_history=true&period=30d",
              headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
            response: {
              status: 200,
              body: {
                totalValue: 15420.5,
                totalReturn: 8.7,
                holdings: [
                  {
                    assetId: "asset_healthcare_001",
                    quantity: 10.5,
                    currentValue: 1155.75,
                    return: 15.5,
                  },
                ],
              },
            },
          },
        ],
        sdks: ["javascript", "python", "java", "php", "ruby"],
      },
      {
        id: "list-assets",
        method: "GET",
        path: "/api/v1/assets",
        summary: "List Available Assets",
        description:
          "Get a list of all available investment assets with filtering and sorting options.",
        category: "Assets",
        authentication: "api-key",
        rateLimit: { requests: 200, period: "minute" },
        parameters: [
          {
            name: "category",
            in: "query",
            type: "string",
            required: false,
            description: "Filter assets by category",
            enum: ["healthcare", "technology", "cultural", "infrastructure"],
            example: "healthcare",
          },
          {
            name: "risk_level",
            in: "query",
            type: "string",
            required: false,
            description: "Filter by risk level",
            enum: ["low", "medium", "high"],
            example: "low",
          },
          {
            name: "limit",
            in: "query",
            type: "integer",
            required: false,
            description: "Maximum number of assets to return",
            example: 20,
          },
        ],
        responses: [
          {
            statusCode: 200,
            description: "Assets retrieved successfully",
          },
        ],
        examples: [
          {
            title: "Healthcare Assets",
            description: "Get low-risk healthcare investment opportunities",
            request: {
              method: "GET",
              url: "/api/v1/assets?category=healthcare&risk_level=low&limit=10",
              headers: {
                "X-API-Key": "qv_live_sk_1234567890abcdef...",
              },
            },
            response: {
              status: 200,
              body: {
                assets: [
                  {
                    id: "asset_healthcare_001",
                    name: "Kenya Rural Health Initiative",
                    category: "healthcare",
                    riskLevel: "low",
                    expectedReturn: 6.5,
                    minimumInvestment: 100.0,
                  },
                ],
                pagination: {
                  total: 25,
                  page: 1,
                  limit: 10,
                },
              },
            },
          },
        ],
        sdks: ["javascript", "python", "java", "php", "ruby"],
      },
    ]);

    // SDKs
    setSDKs([
      {
        id: "js-sdk",
        name: "QuantumVest JavaScript SDK",
        language: "JavaScript",
        version: "2.1.0",
        downloadUrl: "https://cdn.quantumvest.com/sdk/js/quantumvest-2.1.0.js",
        documentation: "/docs/sdks/javascript",
        examples: ["browser-integration", "node-server", "react-components"],
        popularity: 95,
        lastUpdated: "2024-01-15T10:00:00Z",
      },
      {
        id: "python-sdk",
        name: "QuantumVest Python SDK",
        language: "Python",
        version: "1.8.2",
        downloadUrl: "https://pypi.org/project/quantumvest/",
        documentation: "/docs/sdks/python",
        examples: ["django-integration", "flask-app", "data-analysis"],
        popularity: 87,
        lastUpdated: "2024-01-12T14:30:00Z",
      },
      {
        id: "java-sdk",
        name: "QuantumVest Java SDK",
        language: "Java",
        version: "1.5.1",
        downloadUrl: "https://repo1.maven.org/maven2/com/quantumvest/sdk/",
        documentation: "/docs/sdks/java",
        examples: ["spring-boot", "android-app", "enterprise-integration"],
        popularity: 73,
        lastUpdated: "2024-01-10T09:15:00Z",
      },
    ]);

    // Webhooks
    setWebhooks([
      {
        name: "investment.created",
        description: "Triggered when a new investment is successfully created",
        payload: {
          event: "investment.created",
          data: {
            id: "inv_123456789",
            userId: "user_987654321",
            assetId: "asset_healthcare_001",
            amount: 1000.0,
            status: "completed",
            createdAt: "2024-01-20T15:30:00Z",
          },
        },
        retryPolicy: {
          maxAttempts: 3,
          backoffStrategy: "exponential",
        },
        security: {
          signature: true,
          encryption: false,
        },
      },
      {
        name: "portfolio.updated",
        description: "Triggered when portfolio values are recalculated",
        payload: {
          event: "portfolio.updated",
          data: {
            userId: "user_987654321",
            totalValue: 15420.5,
            totalReturn: 8.7,
            lastUpdated: "2024-01-20T16:00:00Z",
          },
        },
        retryPolicy: {
          maxAttempts: 3,
          backoffStrategy: "exponential",
        },
        security: {
          signature: true,
          encryption: false,
        },
      },
    ]);
  };

  const filteredEndpoints = endpoints.filter((endpoint) => {
    const matchesSearch =
      endpoint.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || endpoint.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(endpoints.map((e) => e.category))),
  ];

  const executePlaygroundRequest = async (endpoint: APIEndpoint) => {
    // Simulate API request
    setPlaygroundResponse({
      status: 200,
      statusText: "OK",
      data: endpoint.examples[0]?.response.body || { message: "Success" },
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": "95",
      },
      executionTime: Math.floor(Math.random() * 200) + 50,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateCodeExample = (endpoint: APIEndpoint, language: string) => {
    const example = endpoint.examples[0];
    if (!example) return "";

    switch (language) {
      case "curl":
        return `curl -X ${endpoint.method} "${window.location.origin}${example.request.url}" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"${
    example.request.body
      ? ` \\
  -d '${JSON.stringify(example.request.body, null, 2)}'`
      : ""
  }`;

      case "javascript":
        return `const response = await fetch('${example.request.url}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }${
    example.request.body
      ? `,
  body: JSON.stringify(${JSON.stringify(example.request.body, null, 2)})`
      : ""
  }
});

const data = await response.json();
console.log(data);`;

      case "python":
        return `import requests

response = requests.${endpoint.method.toLowerCase()}(
    '${window.location.origin}${example.request.url}',
    headers={
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    }${
      example.request.body
        ? `,
    json=${JSON.stringify(example.request.body, null, 2)}`
        : ""
    }
)

data = response.json()
print(data)`;

      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Code className="h-8 w-8 text-blue-600" />
                  QuantumVest API Documentation
                </h1>
                <p className="text-gray-600 mt-2">
                  Complete API reference for building on the QuantumVest
                  platform
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  API v1.0
                </Badge>
                <Button>
                  <Key className="h-4 w-4 mr-2" />
                  Get API Key
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {endpoints.length}
                </div>
                <div className="text-sm text-gray-600">API Endpoints</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {sdks.length}
                </div>
                <div className="text-sm text-gray-600">Official SDKs</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-gray-600">API Uptime</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  &lt; 100ms
                </div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r h-screen sticky top-0 overflow-y-auto">
            <div className="p-6">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Endpoints List */}
              <div className="space-y-2">
                {filteredEndpoints.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedEndpoint?.id === endpoint.id
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        className={`text-xs ${
                          endpoint.method === "GET"
                            ? "bg-green-100 text-green-800"
                            : endpoint.method === "POST"
                              ? "bg-blue-100 text-blue-800"
                              : endpoint.method === "PUT"
                                ? "bg-orange-100 text-orange-800"
                                : endpoint.method === "DELETE"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {endpoint.method}
                      </Badge>
                      {endpoint.deprecated && (
                        <Badge variant="outline" className="text-xs">
                          Deprecated
                        </Badge>
                      )}
                    </div>
                    <div className="font-medium text-sm text-gray-900">
                      {endpoint.summary}
                    </div>
                    <div className="text-xs text-gray-600 font-mono">
                      {endpoint.path}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <a
                    href="#getting-started"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Getting Started
                  </a>
                  <a
                    href="#authentication"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Authentication
                  </a>
                  <a
                    href="#sdks"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    SDKs & Libraries
                  </a>
                  <a
                    href="#webhooks"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Webhooks
                  </a>
                  <a
                    href="#rate-limits"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Rate Limits
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {selectedEndpoint ? (
              <div className="space-y-6">
                {/* Endpoint Header */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${
                          selectedEndpoint.method === "GET"
                            ? "bg-green-100 text-green-800"
                            : selectedEndpoint.method === "POST"
                              ? "bg-blue-100 text-blue-800"
                              : selectedEndpoint.method === "PUT"
                                ? "bg-orange-100 text-orange-800"
                                : selectedEndpoint.method === "DELETE"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedEndpoint.method}
                      </Badge>
                      <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">
                        {selectedEndpoint.path}
                      </code>
                    </div>
                    {selectedEndpoint.rateLimit && (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedEndpoint.rateLimit.requests}/
                        {selectedEndpoint.rateLimit.period}
                      </Badge>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEndpoint.summary}
                  </h2>
                  <p className="text-gray-600">
                    {selectedEndpoint.description}
                  </p>

                  {selectedEndpoint.deprecated && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This endpoint is deprecated and will be removed in a
                        future version.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Endpoint Details */}
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="playground">Try It</TabsTrigger>
                    <TabsTrigger value="sdks">SDKs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Request Details */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Request</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Authentication
                            </h4>
                            <Badge className="capitalize">
                              {selectedEndpoint.authentication}
                            </Badge>
                          </div>

                          {selectedEndpoint.parameters &&
                            selectedEndpoint.parameters.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Parameters
                                </h4>
                                <div className="space-y-2">
                                  {selectedEndpoint.parameters
                                    .slice(0, 3)
                                    .map((param) => (
                                      <div
                                        key={param.name}
                                        className="flex justify-between items-center"
                                      >
                                        <span className="font-mono text-sm">
                                          {param.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {param.type}
                                          </Badge>
                                          {param.required && (
                                            <Badge className="text-xs bg-red-100 text-red-800">
                                              Required
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>

                      {/* Response Details */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Response</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Status Codes</h4>
                            <div className="space-y-2">
                              {selectedEndpoint.responses.map((response) => (
                                <div
                                  key={response.statusCode}
                                  className="flex justify-between items-center"
                                >
                                  <Badge
                                    className={`${
                                      response.statusCode < 300
                                        ? "bg-green-100 text-green-800"
                                        : response.statusCode < 400
                                          ? "bg-blue-100 text-blue-800"
                                          : response.statusCode < 500
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {response.statusCode}
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    {response.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="parameters">
                    {selectedEndpoint.parameters &&
                    selectedEndpoint.parameters.length > 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Parameters</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {selectedEndpoint.parameters.map((param) => (
                              <div
                                key={param.name}
                                className="border-b pb-4 last:border-b-0"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <code className="font-mono font-semibold">
                                      {param.name}
                                    </code>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {param.type}
                                    </Badge>
                                    <Badge
                                      className={`text-xs ${param.in === "path" ? "bg-blue-100 text-blue-800" : param.in === "query" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                                    >
                                      {param.in}
                                    </Badge>
                                    {param.required && (
                                      <Badge className="text-xs bg-red-100 text-red-800">
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">
                                  {param.description}
                                </p>
                                {param.example && (
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500">
                                      Example:
                                    </span>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">
                                      {JSON.stringify(param.example)}
                                    </code>
                                  </div>
                                )}
                                {param.enum && (
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500">
                                      Allowed values:
                                    </span>
                                    <div className="flex gap-1 mt-1">
                                      {param.enum.map((value) => (
                                        <Badge
                                          key={value}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {value}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="text-center py-8">
                          <p className="text-gray-500">
                            This endpoint does not require any parameters.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="examples">
                    <div className="space-y-6">
                      {selectedEndpoint.examples.map((example, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">
                                  {example.title}
                                </CardTitle>
                                <CardDescription>
                                  {example.description}
                                </CardDescription>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(
                                    generateCodeExample(
                                      selectedEndpoint,
                                      "curl",
                                    ),
                                  )
                                }
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Tabs defaultValue="curl" className="space-y-4">
                              <TabsList>
                                <TabsTrigger value="curl">cURL</TabsTrigger>
                                <TabsTrigger value="javascript">
                                  JavaScript
                                </TabsTrigger>
                                <TabsTrigger value="python">Python</TabsTrigger>
                              </TabsList>

                              <TabsContent value="curl">
                                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                  <pre>
                                    {generateCodeExample(
                                      selectedEndpoint,
                                      "curl",
                                    )}
                                  </pre>
                                </div>
                              </TabsContent>

                              <TabsContent value="javascript">
                                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                  <pre>
                                    {generateCodeExample(
                                      selectedEndpoint,
                                      "javascript",
                                    )}
                                  </pre>
                                </div>
                              </TabsContent>

                              <TabsContent value="python">
                                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                  <pre>
                                    {generateCodeExample(
                                      selectedEndpoint,
                                      "python",
                                    )}
                                  </pre>
                                </div>
                              </TabsContent>
                            </Tabs>

                            {/* Response Preview */}
                            <div className="mt-6">
                              <h4 className="font-semibold mb-2">Response</h4>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-green-100 text-green-800">
                                    {example.response.status}
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    application/json
                                  </span>
                                </div>
                                <pre className="text-sm text-gray-800 overflow-x-auto">
                                  {JSON.stringify(
                                    example.response.body,
                                    null,
                                    2,
                                  )}
                                </pre>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="playground">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Play className="h-5 w-5" />
                          API Playground
                        </CardTitle>
                        <CardDescription>
                          Test this endpoint with live API calls
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* API Key Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            API Key / JWT Token
                          </label>
                          <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key or JWT token"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Parameter Inputs */}
                        {selectedEndpoint.parameters &&
                          selectedEndpoint.parameters.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-4">Parameters</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedEndpoint.parameters.map((param) => (
                                  <div key={param.name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      {param.name}
                                      {param.required && (
                                        <span className="text-red-500 ml-1">
                                          *
                                        </span>
                                      )}
                                    </label>
                                    <input
                                      type="text"
                                      placeholder={
                                        param.example?.toString() ||
                                        param.description
                                      }
                                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Execute Button */}
                        <Button
                          onClick={() =>
                            executePlaygroundRequest(selectedEndpoint)
                          }
                          disabled={!apiKey}
                          className="w-full"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Execute Request
                        </Button>

                        {/* Response Display */}
                        {playgroundResponse && (
                          <div>
                            <h4 className="font-semibold mb-2">Response</h4>
                            <div className="bg-gray-50 border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={`${playgroundResponse.status < 300 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                  >
                                    {playgroundResponse.status}{" "}
                                    {playgroundResponse.statusText}
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    {playgroundResponse.executionTime}ms
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    copyToClipboard(
                                      JSON.stringify(
                                        playgroundResponse.data,
                                        null,
                                        2,
                                      ),
                                    )
                                  }
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Response
                                </Button>
                              </div>
                              <pre className="text-sm text-gray-800 overflow-x-auto">
                                {JSON.stringify(
                                  playgroundResponse.data,
                                  null,
                                  2,
                                )}
                              </pre>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="sdks">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sdks.map((sdk) => (
                        <Card key={sdk.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                {sdk.name}
                              </CardTitle>
                              <Badge variant="outline">v{sdk.version}</Badge>
                            </div>
                            <CardDescription>
                              Official {sdk.language} SDK
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                              <span>Popularity</span>
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span>{sdk.popularity}%</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span>Last Updated</span>
                              <span>
                                {new Date(sdk.lastUpdated).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                <Download className="h-4 w-4 mr-2" />
                                Install
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <BookOpen className="h-4 w-4 mr-2" />
                                Docs
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              /* Getting Started Content */
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Getting Started with QuantumVest API
                    </CardTitle>
                    <CardDescription>
                      Learn how to integrate with our comprehensive financial
                      platform API
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                          <Key className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">1. Get API Keys</h3>
                        <p className="text-sm text-gray-600">
                          Sign up for a developer account and generate your API
                          keys
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                          <Code className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">
                          2. Make Your First Call
                        </h3>
                        <p className="text-sm text-gray-600">
                          Use our interactive playground to test API endpoints
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                          <Zap className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">
                          3. Build & Deploy
                        </h3>
                        <p className="text-sm text-gray-600">
                          Integrate our SDKs and deploy your financial
                          application
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold mb-4">
                        Quick Start Example
                      </h4>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
                        <pre>{`// Install the SDK
npm install @quantumvest/sdk

// Initialize the client
import QuantumVest from '@quantumvest/sdk';

const client = new QuantumVest({
  apiKey: 'your-api-key-here',
  environment: 'sandbox' // or 'production'
});

// Get user portfolio
const portfolio = await client.portfolio.get();
console.log(portfolio);`}</pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SDK Cards */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Official SDKs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sdks.map((sdk) => (
                      <Card key={sdk.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            {sdk.language === "JavaScript" && (
                              <Terminal className="h-5 w-5" />
                            )}
                            {sdk.language === "Python" && (
                              <Database className="h-5 w-5" />
                            )}
                            {sdk.language === "Java" && (
                              <Monitor className="h-5 w-5" />
                            )}
                            {sdk.name}
                          </CardTitle>
                          <CardDescription>v{sdk.version}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>Popularity</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span>{sdk.popularity}%</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                <Download className="h-4 w-4 mr-2" />
                                Install
                              </Button>
                              <Button size="sm" variant="outline">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Docs
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentationPortal;
