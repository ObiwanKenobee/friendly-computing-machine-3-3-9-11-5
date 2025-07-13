import React, { Suspense, lazy, useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { XCircle } from "lucide-react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./components/auth/AuthProvider";
import { QuickEnterpriseSecurityProvider } from "./components/QuickEnterpriseSecurityProvider";
import { QuickDemoProvider } from "./components/QuickDemoProvider";
import { AgeProvider } from "./contexts/AgeContext";
import { MethuselahProvider } from "./contexts/MethuselahContext";
import ErrorBoundary from "./components/ErrorBoundary";
import PageErrorBoundary from "./components/PageErrorBoundary";
import FastLoadingFallback from "./components/FastLoadingFallback";
import CriticalComponentMonitor from "./components/CriticalComponentMonitor";
import AppRecoverySystem from "./components/AppRecoverySystem";
import { TooltipProvider } from "@radix-ui/react-tooltip";

// Safe lazy loading with error boundaries
const createSafeLazyImport = (
  importFn: () => Promise<any>,
  componentName: string,
) => {
  return lazy(() =>
    importFn().catch((error) => {
      console.error(`Failed to load ${componentName}:`, error);

      // Return a fallback component
      return {
        default: () => (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Component Loading
              </h2>
              <p className="text-gray-600 mb-4">
                {componentName} is taking longer than expected to load. Please
                wait or try refreshing.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        ),
      };
    }),
  );
};

// Core platform pages - Direct import to fix loading issues
import LandingPageComponent from "./components/LandingPage";
const MainDashboard = createSafeLazyImport(
  () => import("./components/MainDashboard"),
  "MainDashboard",
);
const AuthManager = createSafeLazyImport(
  () => import("./components/AuthManager"),
  "AuthManager",
);
const PlatformRouter = createSafeLazyImport(
  () => import("./components/PlatformRouter"),
  "PlatformRouter",
);
const QuantumInfrastructureManager = createSafeLazyImport(
  () => import("./components/QuantumInfrastructureManager"),
  "QuantumInfrastructureManager",
);
const QuantumCircuitBuilder = createSafeLazyImport(
  () => import("./components/QuantumCircuitBuilder"),
  "QuantumCircuitBuilder",
);
const AssetVaults = createSafeLazyImport(
  () => import("./components/pages/AssetVaults"),
  "AssetVaults",
);
const SovereignWealth = createSafeLazyImport(
  () => import("./components/pages/SovereignWealth"),
  "SovereignWealth",
);
const DeveloperConsole = createSafeLazyImport(
  () => import("./components/pages/DeveloperConsole"),
  "DeveloperConsole",
);
const Index = createSafeLazyImport(() => import("./pages/Index"), "Index");
const PlatformNavigation = createSafeLazyImport(
  () => import("./components/PlatformNavigation"),
  "PlatformNavigation",
);
const PricingPage = createSafeLazyImport(
  () => import("./pages/pricing"),
  "PricingPage",
);
const TortoiseProtocolPage = createSafeLazyImport(
  () => import("./pages/tortoise-protocol"),
  "TortoiseProtocolPage",
);

// Enterprise subscription and workflow pages
const EnterpriseSubscriptionsPage = createSafeLazyImport(
  () => import("./pages/enterprise-subscriptions"),
  "EnterpriseSubscriptionsPage",
);
const LegendaryInvestorsEnterprise = createSafeLazyImport(
  () => import("./pages/legendary-investors-enterprise"),
  "LegendaryInvestorsEnterprise",
);
const WildlifeConservationEnterprise = createSafeLazyImport(
  () => import("./pages/wildlife-conservation-enterprise"),
  "WildlifeConservationEnterprise",
);
const QuantumEnterprise2050 = createSafeLazyImport(
  () => import("./pages/quantum-enterprise-2050"),
  "QuantumEnterprise2050",
);

// Professional tier pages
const FinancialAdvisorPage = createSafeLazyImport(
  () => import("./pages/financial-advisor"),
  "FinancialAdvisorPage",
);
const DeveloperIntegratorPage = createSafeLazyImport(
  () => import("./pages/developer-integrator"),
  "DeveloperIntegratorPage",
);
const CulturalInvestorPage = createSafeLazyImport(
  () => import("./pages/cultural-investor"),
  "CulturalInvestorPage",
);
const DiasporaInvestorPage = createSafeLazyImport(
  () => import("./pages/diaspora-investor"),
  "DiasporaInvestorPage",
);
const PublicSectorNGOPage = createSafeLazyImport(
  () => import("./pages/public-sector-ngo"),
  "PublicSectorNGOPage",
);
const QuantDataDrivenInvestorPage = createSafeLazyImport(
  () => import("./pages/quant-data-driven-investor"),
  "QuantDataDrivenInvestorPage",
);

// Starter tier pages
const RetailInvestorPage = createSafeLazyImport(
  () => import("./pages/retail-investor"),
  "RetailInvestorPage",
);
const EmergingMarketCitizenPage = createSafeLazyImport(
  () => import("./pages/emerging-market-citizen"),
  "EmergingMarketCitizenPage",
);
const StudentEarlyCareerPage = createSafeLazyImport(
  () => import("./pages/student-early-career"),
  "StudentEarlyCareerPage",
);

// Additional enterprise pages
const InstitutionalInvestorPage = createSafeLazyImport(
  () => import("./pages/institutional-investor"),
  "InstitutionalInvestorPage",
);
const AfricanMarketEnterprisePage = createSafeLazyImport(
  () => import("./pages/african-market-enterprise"),
  "AfricanMarketEnterprisePage",
);

// Mega-Structure Components
const QuantumMegaStructuresPage = createSafeLazyImport(
  () => import("./pages/quantum-mega-structures"),
  "QuantumMegaStructuresPage",
);
const EnterpriseCommandCenter = createSafeLazyImport(
  () => import("./components/EnterpriseCommandCenter"),
  "EnterpriseCommandCenter",
);
const GlobalInfrastructureMonitor = createSafeLazyImport(
  () => import("./components/GlobalInfrastructureMonitor"),
  "GlobalInfrastructureMonitor",
);

// Innovation Components
const QuantumInnovationsPage = createSafeLazyImport(
  () => import("./pages/quantum-innovations"),
  "QuantumInnovationsPage",
);
const QuantumRiskMatrix = createSafeLazyImport(
  () => import("./components/innovations/QuantumRiskMatrix"),
  "QuantumRiskMatrix",
);
const NeuralMarketEngine = createSafeLazyImport(
  () => import("./components/innovations/NeuralMarketEngine"),
  "NeuralMarketEngine",
);
const HyperDimensionalOptimizer = createSafeLazyImport(
  () => import("./components/innovations/HyperDimensionalOptimizer"),
  "HyperDimensionalOptimizer",
);
const QuantumTradingDashboard = createSafeLazyImport(
  () => import("./components/innovations/QuantumTradingDashboard"),
  "QuantumTradingDashboard",
);
const TemporalMarketAnalysis = createSafeLazyImport(
  () => import("./components/innovations/TemporalMarketAnalysis"),
  "TemporalMarketAnalysis",
);
const MetaFinancialHub = createSafeLazyImport(
  () => import("./components/innovations/MetaFinancialHub"),
  "MetaFinancialHub",
);

// Global Payment Processing
const GlobalPaymentsPage = createSafeLazyImport(
  () => import("./pages/global-payments"),
  "GlobalPaymentsPage",
);
const RegionalPaymentsPage = createSafeLazyImport(
  () => import("./pages/regional-payments"),
  "RegionalPaymentsPage",
);
const Web3CryptoPage = createSafeLazyImport(
  () => import("./pages/web3-crypto"),
  "Web3CryptoPage",
);
const PaymentHubPage = createSafeLazyImport(
  () => import("./pages/payment-hub"),
  "PaymentHubPage",
);

// Free tier additional pages
const ArchetypeSelectorPage = createSafeLazyImport(
  () => import("./components/ArchetypeSelector"),
  "ArchetypeSelectorPage",
);
const BillingPage = createSafeLazyImport(
  () => import("./pages/billing"),
  "BillingPage",
);

// Demo Routes
const GameLayoutDemoPage = createSafeLazyImport(
  () => import("./pages/game-layout-demo"),
  "GameLayoutDemoPage",
);
const AgeSwitcherDemoPage = createSafeLazyImport(
  () => import("./pages/age-switcher-demo"),
  "AgeSwitcherDemoPage",
);
const MethuselahEnterprisePage = createSafeLazyImport(
  () => import("./pages/methuselah-enterprise"),
  "MethuselahEnterprisePage",
);
const GeographicalConsciousnessPage = createSafeLazyImport(
  () => import("./pages/geographical-consciousness"),
  "GeographicalConsciousnessPage",
);

// Infrastructure Navigator
const InfrastructureNavigatorPage = createSafeLazyImport(
  () => import("./pages/infrastructure-navigator"),
  "InfrastructureNavigatorPage",
);

// Serverless Functions
const ServerlessFunctionsPage = createSafeLazyImport(
  () => import("./pages/serverless-functions"),
  "ServerlessFunctionsPage",
);

// SuperTech Demo
const SuperTechDemoPage = createSafeLazyImport(
  () => import("./pages/supertech-demo"),
  "SuperTechDemoPage",
);

// SuperAdmin
const SuperAdminPage = createSafeLazyImport(
  () => import("./pages/superadmin"),
  "SuperAdminPage",
);

// UltraLevel SuperAdmin
const UltraLevelAdminPage = createSafeLazyImport(
  () => import("./pages/ultralevel-admin"),
  "UltraLevelAdminPage",
);

// Critical Components Dashboard
const CriticalComponentsDashboard = createSafeLazyImport(
  () => import("./pages/critical-components-dashboard"),
  "CriticalComponentsDashboard",
);

// Basic Admin
const BasicAdminPage = createSafeLazyImport(
  () => import("./pages/basic-admin"),
  "BasicAdminPage",
);

// Simple query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: Error) => {
      console.error("Query Error:", error);
    },
  }),
});

// Simple route wrapper with error boundary
const OptimizedRoute: React.FC<{
  children: React.ReactNode;
  pageName: string;
}> = ({ children, pageName }) => {
  return (
    <PageErrorBoundary pageName={pageName}>
      <Suspense
        fallback={
          <FastLoadingFallback
            pageName={pageName}
            timeout={10000}
            showProgress={true}
          />
        }
      >
        {children}
      </Suspense>
    </PageErrorBoundary>
  );
};

function App() {
  useEffect(() => {
    // Simple initialization
    try {
      if (typeof window !== "undefined") {
        console.log("✅ QuantumVest Enterprise loaded successfully");
      }
    } catch (error) {
      console.error("❌ Failed to initialize QuantumVest:", error);
    }
  }, []);

  return (
    <AppRecoverySystem maxRetries={3}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <TooltipProvider>
              <AuthProvider>
                <QuickEnterpriseSecurityProvider>
                  <QuickDemoProvider>
                    <AgeProvider>
                      <CriticalComponentMonitor showMonitor={false}>
                        <div className="min-h-screen bg-background font-sans antialiased">
                          {/* <Sonner /> */}
                          <ErrorBoundary>
                            <Routes>
                              {/* Core Platform Routes - Landing Page as Main Entry Point */}
                              <Route
                                path="/"
                                element={
                                  <OptimizedRoute pageName="Landing Page">
                                    <LandingPageComponent />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/platform-navigation"
                                element={
                                  <OptimizedRoute pageName="Platform Navigation">
                                    <PlatformNavigation />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/dashboard"
                                element={
                                  <OptimizedRoute pageName="Main Dashboard">
                                    <MainDashboard />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/auth"
                                element={
                                  <OptimizedRoute pageName="Authentication">
                                    <AuthManager />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/router"
                                element={
                                  <OptimizedRoute pageName="Platform Router">
                                    <PlatformRouter />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/legacy-dashboard"
                                element={
                                  <OptimizedRoute pageName="Legacy Dashboard">
                                    <Index />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/quantum-infrastructure"
                                element={
                                  <OptimizedRoute pageName="Quantum Infrastructure">
                                    <QuantumInfrastructureManager />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/circuit-builder"
                                element={
                                  <OptimizedRoute pageName="Quantum Circuit Builder">
                                    <QuantumCircuitBuilder />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/asset-vaults"
                                element={
                                  <OptimizedRoute pageName="Asset Vaults">
                                    <AssetVaults />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/sovereign-wealth"
                                element={
                                  <OptimizedRoute pageName="Sovereign Wealth">
                                    <SovereignWealth />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/dev-console"
                                element={
                                  <OptimizedRoute pageName="Developer Console">
                                    <DeveloperConsole />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/pricing"
                                element={
                                  <OptimizedRoute pageName="Pricing">
                                    <PricingPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/billing"
                                element={
                                  <OptimizedRoute pageName="Billing">
                                    <BillingPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/archetypes"
                                element={
                                  <OptimizedRoute pageName="Investor Archetypes">
                                    <ArchetypeSelectorPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Enterprise Subscriptions Overview */}
                              <Route
                                path="/enterprise-subscriptions"
                                element={
                                  <OptimizedRoute pageName="Enterprise Subscriptions">
                                    <EnterpriseSubscriptionsPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Starter Tier Routes */}
                              <Route
                                path="/retail-investor"
                                element={
                                  <OptimizedRoute pageName="Retail Investor">
                                    <RetailInvestorPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/emerging-market-citizen"
                                element={
                                  <OptimizedRoute pageName="Emerging Market Citizen">
                                    <EmergingMarketCitizenPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/student-early-career"
                                element={
                                  <OptimizedRoute pageName="Student Early Career">
                                    <StudentEarlyCareerPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Professional Tier Routes */}
                              <Route
                                path="/financial-advisor"
                                element={
                                  <OptimizedRoute pageName="Financial Advisor">
                                    <FinancialAdvisorPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/developer-integrator"
                                element={
                                  <OptimizedRoute pageName="Developer Platform">
                                    <DeveloperIntegratorPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/cultural-investor"
                                element={
                                  <OptimizedRoute pageName="Cultural Investor">
                                    <CulturalInvestorPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/diaspora-investor"
                                element={
                                  <OptimizedRoute pageName="Diaspora Investor">
                                    <DiasporaInvestorPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/public-sector-ngo"
                                element={
                                  <OptimizedRoute pageName="Public Sector NGO">
                                    <PublicSectorNGOPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/quant-data-driven-investor"
                                element={
                                  <OptimizedRoute pageName="Quantitative Investor">
                                    <QuantDataDrivenInvestorPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Enterprise Tier Routes */}
                              <Route
                                path="/tortoise-protocol"
                                element={
                                  <OptimizedRoute pageName="Tortoise Protocol">
                                    <TortoiseProtocolPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/legendary-investors-enterprise"
                                element={
                                  <OptimizedRoute pageName="Legendary Investor Strategies">
                                    <LegendaryInvestorsEnterprise />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/institutional-investor"
                                element={
                                  <OptimizedRoute pageName="Institutional Investor">
                                    <InstitutionalInvestorPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/african-market-enterprise"
                                element={
                                  <OptimizedRoute pageName="African Market Enterprise">
                                    <AfricanMarketEnterprisePage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/wildlife-conservation-enterprise"
                                element={
                                  <OptimizedRoute pageName="Wildlife Conservation">
                                    <WildlifeConservationEnterprise />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/quantum-enterprise-2050"
                                element={
                                  <OptimizedRoute pageName="Quantum Enterprise 2050">
                                    <QuantumEnterprise2050 />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Demo Routes */}
                              <Route
                                path="/game-layout-demo"
                                element={
                                  <OptimizedRoute pageName="Game Layout Demo">
                                    <GameLayoutDemoPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/age-switcher-demo"
                                element={
                                  <OptimizedRoute pageName="Age Switcher Demo">
                                    <AgeSwitcherDemoPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/methuselah-enterprise"
                                element={
                                  <OptimizedRoute pageName="Methuselah Enterprise">
                                    <MethuselahEnterprisePage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Infrastructure Navigator */}
                              <Route
                                path="/infrastructure-navigator"
                                element={
                                  <OptimizedRoute pageName="Infrastructure Navigator">
                                    <InfrastructureNavigatorPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Serverless Functions */}
                              <Route
                                path="/serverless-functions"
                                element={
                                  <OptimizedRoute pageName="Serverless Functions">
                                    <ServerlessFunctionsPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* SuperTech Demo */}
                              <Route
                                path="/supertech-demo"
                                element={
                                  <OptimizedRoute pageName="SuperTech Demo">
                                    <SuperTechDemoPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Basic Admin Dashboard */}
                              <Route
                                path="/basic-admin"
                                element={
                                  <OptimizedRoute pageName="Basic Admin Dashboard">
                                    <BasicAdminPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* SuperAdmin Dashboard */}
                              <Route
                                path="/superadmin"
                                element={
                                  <OptimizedRoute pageName="SuperAdmin Dashboard">
                                    <SuperAdminPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* UltraLevel SuperAdmin */}
                              <Route
                                path="/ultralevel-admin"
                                element={
                                  <OptimizedRoute pageName="UltraLevel SuperAdmin">
                                    <UltraLevelAdminPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Critical Components Dashboard */}
                              <Route
                                path="/critical-components"
                                element={
                                  <OptimizedRoute pageName="Critical Components Dashboard">
                                    <CriticalComponentsDashboard />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/geographical-consciousness"
                                element={
                                  <OptimizedRoute pageName="Geographical Consciousness">
                                    <GeographicalConsciousnessPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Quantum Mega-Structures */}
                              <Route
                                path="/quantum-mega-structures"
                                element={
                                  <OptimizedRoute pageName="Quantum Mega-Structures">
                                    <QuantumMegaStructuresPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/enterprise-command-center"
                                element={
                                  <OptimizedRoute pageName="Enterprise Command Center">
                                    <EnterpriseCommandCenter />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/global-infrastructure-monitor"
                                element={
                                  <OptimizedRoute pageName="Global Infrastructure Monitor">
                                    <GlobalInfrastructureMonitor />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Quantum Innovations */}
                              <Route
                                path="/quantum-innovations"
                                element={
                                  <OptimizedRoute pageName="Quantum Innovations Hub">
                                    <QuantumInnovationsPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/quantum-risk-matrix"
                                element={
                                  <OptimizedRoute pageName="Quantum Risk Matrix">
                                    <QuantumRiskMatrix />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/neural-market-engine"
                                element={
                                  <OptimizedRoute pageName="Neural Market Engine">
                                    <NeuralMarketEngine />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/hyper-dimensional-optimizer"
                                element={
                                  <OptimizedRoute pageName="Hyper-Dimensional Optimizer">
                                    <HyperDimensionalOptimizer />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/quantum-trading-dashboard"
                                element={
                                  <OptimizedRoute pageName="Quantum Trading Dashboard">
                                    <QuantumTradingDashboard />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/temporal-market-analysis"
                                element={
                                  <OptimizedRoute pageName="Temporal Market Analysis">
                                    <TemporalMarketAnalysis />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/meta-financial-hub"
                                element={
                                  <OptimizedRoute pageName="Meta-Financial Intelligence Hub">
                                    <MetaFinancialHub />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Global Payment Processing */}
                              <Route
                                path="/global-payments"
                                element={
                                  <OptimizedRoute pageName="Global Payment Processing">
                                    <GlobalPaymentsPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/regional-payments"
                                element={
                                  <OptimizedRoute pageName="Regional Payment Specialists">
                                    <RegionalPaymentsPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/web3-crypto"
                                element={
                                  <OptimizedRoute pageName="Web3 Crypto Integration">
                                    <Web3CryptoPage />
                                  </OptimizedRoute>
                                }
                              />

                              <Route
                                path="/payment-hub"
                                element={
                                  <OptimizedRoute pageName="Payment Processing Hub">
                                    <PaymentHubPage />
                                  </OptimizedRoute>
                                }
                              />

                              {/* Catch all route */}
                              <Route
                                path="*"
                                element={
                                  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                                    <div className="text-center">
                                      <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                        Page Not Found
                                      </h1>
                                      <button
                                        onClick={() =>
                                          (window.location.href = "/")
                                        }
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                      >
                                        Go Home
                                      </button>
                                    </div>
                                  </div>
                                }
                              />
                            </Routes>
                          </ErrorBoundary>
                        </div>
                      </CriticalComponentMonitor>
                    </AgeProvider>
                  </QuickDemoProvider>
                </QuickEnterpriseSecurityProvider>
              </AuthProvider>
            </TooltipProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </AppRecoverySystem>
  );
}

export default App;
