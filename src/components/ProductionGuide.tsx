import React, { useState } from "react";
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
import { ScrollArea } from "./ui/scroll-area";
import {
  Book,
  Code,
  Database,
  Cloud,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  FileText,
  Settings,
  Monitor,
  Key,
  Lock,
  Server,
  Network,
  Cpu,
  HardDrive,
  Globe,
  Users,
  BarChart3,
  TrendingUp,
  Award,
  Star,
  Target,
  Rocket,
  Brain,
} from "lucide-react";

interface ProductionGuideProps {
  showAllSections?: boolean;
}

const ProductionGuide: React.FC<ProductionGuideProps> = ({
  showAllSections = true,
}) => {
  const [selectedTab, setSelectedTab] = useState("overview");

  const architecturePatterns = [
    {
      pattern: "Microservices Architecture",
      description:
        "Distributed system design with independent, scalable services",
      benefits: [
        "Independent scaling",
        "Technology diversity",
        "Fault isolation",
        "Team autonomy",
      ],
      implementation: "Service mesh with Kubernetes orchestration",
      complexity: "High",
      recommended: true,
    },
    {
      pattern: "Event-Driven Architecture",
      description:
        "Asynchronous communication through events and message queues",
      benefits: [
        "Loose coupling",
        "Scalability",
        "Resilience",
        "Real-time processing",
      ],
      implementation: "Apache Kafka with event sourcing",
      complexity: "Medium",
      recommended: true,
    },
    {
      pattern: "CQRS (Command Query Responsibility Segregation)",
      description: "Separate read and write operations for optimal performance",
      benefits: [
        "Read/write optimization",
        "Scalability",
        "Complex query support",
      ],
      implementation: "Separate command and query databases",
      complexity: "High",
      recommended: false,
    },
    {
      pattern: "Hexagonal Architecture",
      description:
        "Ports and adapters pattern for clean separation of concerns",
      benefits: ["Testability", "Maintainability", "Technology independence"],
      implementation: "Clean architecture with dependency injection",
      complexity: "Medium",
      recommended: true,
    },
  ];

  const dataStructures = [
    {
      name: "Hash Table",
      timeComplexity: { search: "O(1)", insert: "O(1)", delete: "O(1)" },
      spaceComplexity: "O(n)",
      useCase: "Caching, user sessions, fast lookups",
      implementation: "Redis, in-memory caches",
      tradeoffs: "Memory usage vs speed",
    },
    {
      name: "B+ Tree",
      timeComplexity: {
        search: "O(log n)",
        insert: "O(log n)",
        delete: "O(log n)",
      },
      spaceComplexity: "O(n)",
      useCase: "Database indexes, range queries",
      implementation: "PostgreSQL indexes, file systems",
      tradeoffs: "Balanced performance vs complexity",
    },
    {
      name: "Time Series Database",
      timeComplexity: {
        search: "O(log n)",
        insert: "O(1)",
        delete: "O(log n)",
      },
      spaceComplexity: "O(n)",
      useCase: "Financial data, metrics, monitoring",
      implementation: "InfluxDB, TimescaleDB",
      tradeoffs: "Specialized optimization vs general purpose",
    },
    {
      name: "Graph Database",
      timeComplexity: { search: "O(V + E)", insert: "O(1)", delete: "O(1)" },
      spaceComplexity: "O(V + E)",
      useCase: "Social networks, recommendations, fraud detection",
      implementation: "Neo4j, Amazon Neptune",
      tradeoffs: "Relationship traversal vs traditional queries",
    },
  ];

  const algorithms = [
    {
      name: "Consistent Hashing",
      purpose: "Distributed data partitioning",
      complexity: "O(log n)",
      benefits: ["Minimal data movement", "Load balancing", "Scalability"],
      implementation: "Used in distributed caches and databases",
    },
    {
      name: "Bloom Filter",
      purpose: "Probabilistic membership testing",
      complexity: "O(k)",
      benefits: ["Memory efficient", "Fast lookups", "No false negatives"],
      implementation: "Database query optimization, caching",
    },
    {
      name: "Rate Limiting Algorithms",
      purpose: "API throttling and protection",
      complexity: "O(1)",
      benefits: ["Resource protection", "Fair usage", "DDoS prevention"],
      implementation: "Token bucket, sliding window",
    },
    {
      name: "Circuit Breaker",
      purpose: "Fault tolerance and resilience",
      complexity: "O(1)",
      benefits: ["Fast failure", "System protection", "Graceful degradation"],
      implementation: "Hystrix, resilience4j",
    },
  ];

  const securityBestPractices = [
    {
      category: "Authentication & Authorization",
      practices: [
        "Implement OAuth 2.0 with PKCE",
        "Use JWT with short expiration times",
        "Multi-factor authentication (MFA)",
        "Role-based access control (RBAC)",
        "Principle of least privilege",
      ],
      implementation: "Auth0, Keycloak, AWS Cognito",
    },
    {
      category: "Data Protection",
      practices: [
        "Encryption at rest (AES-256)",
        "Encryption in transit (TLS 1.3)",
        "Database field-level encryption",
        "Key rotation policies",
        "Secure key management",
      ],
      implementation: "AWS KMS, HashiCorp Vault, Azure Key Vault",
    },
    {
      category: "Network Security",
      practices: [
        "Web Application Firewall (WAF)",
        "DDoS protection",
        "Network segmentation",
        "VPN for remote access",
        "Intrusion detection systems",
      ],
      implementation: "Cloudflare, AWS Shield, Cisco ASA",
    },
    {
      category: "Application Security",
      practices: [
        "Input validation and sanitization",
        "SQL injection prevention",
        "Cross-site scripting (XSS) protection",
        "Content Security Policy (CSP)",
        "Regular security testing",
      ],
      implementation: "OWASP guidelines, static analysis tools",
    },
  ];

  const performanceOptimizations = [
    {
      area: "Database Optimization",
      techniques: [
        "Query optimization and indexing",
        "Connection pooling",
        "Read replicas for scaling",
        "Database partitioning/sharding",
        "Query result caching",
      ],
      impact: "High",
      effort: "Medium",
    },
    {
      area: "Caching Strategy",
      techniques: [
        "Multi-level caching (L1, L2, L3)",
        "CDN for static content",
        "Application-level caching",
        "Database query result caching",
        "Intelligent cache invalidation",
      ],
      impact: "High",
      effort: "Medium",
    },
    {
      area: "Frontend Optimization",
      techniques: [
        "Code splitting and lazy loading",
        "Tree shaking and minification",
        "Image optimization and WebP",
        "Service workers and PWA",
        "Critical path optimization",
      ],
      impact: "High",
      effort: "Low",
    },
    {
      area: "Infrastructure Optimization",
      techniques: [
        "Auto-scaling policies",
        "Load balancing strategies",
        "Container optimization",
        "Resource right-sizing",
        "Network optimization",
      ],
      impact: "Medium",
      effort: "High",
    },
  ];

  const apiDocumentation = [
    {
      endpoint: "POST /api/auth/login",
      description: "Authenticate user and return JWT token",
      headers: { "Content-Type": "application/json" },
      body: { email: "string", password: "string", mfa_code: "string?" },
      response: { token: "string", expires_in: "number", user: "object" },
      status: 200,
      security: "Rate limited: 5 attempts per minute",
    },
    {
      endpoint: "GET /api/portfolio/{id}",
      description: "Retrieve portfolio details with real-time data",
      headers: { Authorization: "Bearer <token>" },
      params: { id: "Portfolio UUID" },
      response: {
        portfolio: "object",
        holdings: "array",
        performance: "object",
      },
      status: 200,
      security: "JWT required, RBAC enforced",
    },
    {
      endpoint: "POST /api/orders",
      description: "Submit new trading order",
      headers: {
        Authorization: "Bearer <token>",
        "Content-Type": "application/json",
      },
      body: {
        symbol: "string",
        quantity: "number",
        side: "buy|sell",
        type: "market|limit",
      },
      response: { order_id: "string", status: "string", timestamp: "string" },
      status: 201,
      security: "Trading permissions required, risk checks applied",
    },
    {
      endpoint: "GET /api/market/data/{symbol}",
      description: "Real-time market data for given symbol",
      headers: { Authorization: "Bearer <token>" },
      params: { symbol: "Trading symbol (e.g., AAPL, BTC-USD)" },
      response: {
        price: "number",
        volume: "number",
        change: "number",
        timestamp: "string",
      },
      status: 200,
      security: "Market data subscription required",
    },
  ];

  const cloudBestPractices = [
    {
      provider: "AWS",
      services: [
        "ECS/EKS for container orchestration",
        "RDS with Multi-AZ for database",
        "ElastiCache for caching",
        "CloudFront for CDN",
        "Route 53 for DNS",
        "WAF for application security",
      ],
      architecture: "Multi-region with auto-failover",
      cost: "Reserved instances + spot for dev",
    },
    {
      provider: "Azure",
      services: [
        "AKS for Kubernetes",
        "Azure SQL with geo-replication",
        "Redis Cache",
        "Azure CDN",
        "Traffic Manager",
        "Application Gateway",
      ],
      architecture: "Hub-spoke network topology",
      cost: "Azure Reserved VM Instances",
    },
    {
      provider: "GCP",
      services: [
        "GKE for container management",
        "Cloud SQL with read replicas",
        "Memorystore for Redis",
        "Cloud CDN",
        "Cloud DNS",
        "Cloud Armor for security",
      ],
      architecture: "Multi-zone with global load balancing",
      cost: "Committed use discounts",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center">
            <Book className="h-8 w-8 mr-3 text-blue-400" />
            Production System Guide
          </CardTitle>
          <CardDescription className="text-gray-300">
            Comprehensive guide to building production-ready, secure, and
            scalable systems
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-slate-700 mb-6">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-600"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="architecture"
                className="data-[state=active]:bg-green-600"
              >
                Architecture
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="data-[state=active]:bg-purple-600"
              >
                Data & Algorithms
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-red-600"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="data-[state=active]:bg-yellow-600"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="api"
                className="data-[state=active]:bg-orange-600"
              >
                API & Cloud
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-700/50 border-blue-500/30">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Security First
                    </h3>
                    <p className="text-sm text-gray-300">
                      Zero-trust architecture with defense in depth
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-green-400" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      High Performance
                    </h3>
                    <p className="text-sm text-gray-300">
                      Optimized algorithms and data structures
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border-purple-500/30">
                  <CardContent className="p-6 text-center">
                    <Cloud className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Cloud Native
                    </h3>
                    <p className="text-sm text-gray-300">
                      Containerized microservices with auto-scaling
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border-yellow-500/30">
                  <CardContent className="p-6 text-center">
                    <Monitor className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Observable
                    </h3>
                    <p className="text-sm text-gray-300">
                      Comprehensive monitoring and alerting
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">
                    System Principles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3">
                        Design Principles
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          Single Responsibility Principle
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          Open/Closed Principle
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          Dependency Inversion
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          Don't Repeat Yourself (DRY)
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          Keep It Simple (KISS)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-3">
                        Operational Excellence
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          Infrastructure as Code
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          Continuous Integration/Deployment
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          Automated Testing
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          Disaster Recovery
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          24/7 Monitoring
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="architecture" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {architecturePatterns.map((pattern, index) => (
                  <Card
                    key={index}
                    className="bg-slate-700/50 border-slate-600"
                  >
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        {pattern.pattern}
                        {pattern.recommended && (
                          <Badge className="bg-green-600">Recommended</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {pattern.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">
                            Benefits
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {pattern.benefits.map((benefit, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            Implementation:
                          </span>
                          <span className="text-sm text-white">
                            {pattern.implementation}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            Complexity:
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              pattern.complexity === "High"
                                ? "text-red-400 border-red-400"
                                : pattern.complexity === "Medium"
                                  ? "text-yellow-400 border-yellow-400"
                                  : "text-green-400 border-green-400"
                            }
                          >
                            {pattern.complexity}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Data Structures */}
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Data Structures
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {dataStructures.map((ds, index) => (
                          <div
                            key={index}
                            className="p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                          >
                            <h4 className="font-semibold text-white mb-2">
                              {ds.name}
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                              <div>
                                <span className="text-gray-400">Search: </span>
                                <code className="text-blue-400">
                                  {ds.timeComplexity.search}
                                </code>
                              </div>
                              <div>
                                <span className="text-gray-400">Insert: </span>
                                <code className="text-green-400">
                                  {ds.timeComplexity.insert}
                                </code>
                              </div>
                              <div>
                                <span className="text-gray-400">Delete: </span>
                                <code className="text-red-400">
                                  {ds.timeComplexity.delete}
                                </code>
                              </div>
                              <div>
                                <span className="text-gray-400">Space: </span>
                                <code className="text-purple-400">
                                  {ds.spaceComplexity}
                                </code>
                              </div>
                            </div>
                            <p className="text-xs text-gray-300 mb-2">
                              {ds.useCase}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-xs text-yellow-400 border-yellow-400"
                            >
                              {ds.implementation}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Algorithms */}
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white">Key Algorithms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {algorithms.map((algo, index) => (
                        <div
                          key={index}
                          className="p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">
                              {algo.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs text-blue-400 border-blue-400"
                            >
                              {algo.complexity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">
                            {algo.purpose}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {algo.benefits.map((benefit, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400">
                            {algo.implementation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {securityBestPractices.map((practice, index) => (
                  <Card
                    key={index}
                    className="bg-slate-700/50 border-red-500/30"
                  >
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Lock className="h-5 w-5 mr-2 text-red-400" />
                        {practice.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">
                            Best Practices
                          </h4>
                          <ul className="space-y-1">
                            {practice.practices.map((item, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-300 flex items-center"
                              >
                                <CheckCircle className="h-3 w-3 mr-2 text-green-400 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-white mb-1">
                            Implementation
                          </h4>
                          <p className="text-xs text-gray-400">
                            {practice.implementation}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {performanceOptimizations.map((opt, index) => (
                  <Card
                    key={index}
                    className="bg-slate-700/50 border-green-500/30"
                  >
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                          {opt.area}
                        </div>
                        <div className="flex space-x-1">
                          <Badge
                            variant="outline"
                            className={
                              opt.impact === "High"
                                ? "text-green-400 border-green-400"
                                : "text-yellow-400 border-yellow-400"
                            }
                          >
                            {opt.impact} Impact
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              opt.effort === "Low"
                                ? "text-green-400 border-green-400"
                                : opt.effort === "Medium"
                                  ? "text-yellow-400 border-yellow-400"
                                  : "text-red-400 border-red-400"
                            }
                          >
                            {opt.effort} Effort
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {opt.techniques.map((technique, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-300 flex items-center"
                          >
                            <Zap className="h-3 w-3 mr-2 text-yellow-400 flex-shrink-0" />
                            {technique}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              {/* API Documentation */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">
                    API Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiDocumentation.map((api, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <code className="text-blue-400 font-mono">
                            {api.endpoint}
                          </code>
                          <Badge className="bg-green-600">{api.status}</Badge>
                        </div>

                        <p className="text-sm text-gray-300 mb-3">
                          {api.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <h5 className="font-semibold text-white mb-1">
                              Headers
                            </h5>
                            <pre className="bg-slate-900/50 p-2 rounded text-gray-300 overflow-x-auto">
                              {JSON.stringify(api.headers, null, 2)}
                            </pre>
                          </div>

                          <div>
                            <h5 className="font-semibold text-white mb-1">
                              {api.body
                                ? "Body"
                                : api.params
                                  ? "Parameters"
                                  : "Response"}
                            </h5>
                            <pre className="bg-slate-900/50 p-2 rounded text-gray-300 overflow-x-auto">
                              {JSON.stringify(
                                api.body || api.params || api.response,
                                null,
                                2,
                              )}
                            </pre>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-600">
                          <p className="text-xs text-yellow-400">
                            {api.security}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cloud Best Practices */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">
                    Cloud Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {cloudBestPractices.map((cloud, index) => (
                      <Card
                        key={index}
                        className="bg-slate-800/50 border-slate-600"
                      >
                        <CardHeader>
                          <CardTitle className="text-white text-lg">
                            {cloud.provider}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2">
                              Core Services
                            </h4>
                            <ul className="space-y-1">
                              {cloud.services.map((service, idx) => (
                                <li key={idx} className="text-xs text-gray-300">
                                  • {service}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-white mb-1">
                              Architecture
                            </h4>
                            <p className="text-xs text-gray-300">
                              {cloud.architecture}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-white mb-1">
                              Cost Optimization
                            </h4>
                            <p className="text-xs text-gray-300">
                              {cloud.cost}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionGuide;
