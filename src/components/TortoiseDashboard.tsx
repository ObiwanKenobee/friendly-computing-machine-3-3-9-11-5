/**
 * 🐢 Tortoise Dashboard
 * UI for the Tortoise-Led Innovation Protocol
 * "Wealth is not made in haste—it is cultivated with memory, ethics, rhythm, and myth."
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Clock,
  Leaf,
  Users,
  Heart,
  Moon,
  Sun,
  TreePine,
  Waves,
  Mountain,
  Star,
  Circle,
  Triangle,
  Pause,
  Play,
  RotateCcw,
  Sprout,
  Lightbulb,
  Shield,
  Globe,
  Eye,
  Zap,
} from "lucide-react";

import TortoiseProtocolService, {
  PhilosophicalVault,
  TortoisePhase,
} from "../services/tortoiseProtocol";
import MythPromptAgent, {
  EthicalReflection,
} from "../services/mythPromptAgent";
import YieldRhythmEngine from "../services/yieldRhythmEngine";
import VaultEthicsCompiler from "../services/vaultEthicsCompiler";

interface TortoiseDashboardProps {
  className?: string;
}

export const TortoiseDashboard: React.FC<TortoiseDashboardProps> = ({
  className = "",
}) => {
  const [vaults, setVaults] = useState<PhilosophicalVault[]>([]);
  const [selectedVault, setSelectedVault] = useState<PhilosophicalVault | null>(
    null,
  );
  const [currentPhase, setCurrentPhase] = useState<TortoisePhase | null>(null);
  const [phases, setPhases] = useState<TortoisePhase[]>([]);
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [mythicPrompts, setMythicPrompts] = useState<string[]>([]);
  const [reflections, setReflections] = useState<{ [key: string]: string }>({});
  const [silenceRemaining, setSilenceRemaining] = useState<number>(0);

  // Services with error handling
  const [services, setServices] = useState<{
    tortoiseProtocol: any;
    mythPromptAgent: any;
    yieldRhythmEngine: any;
    vaultEthicsCompiler: any;
  } | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);

  // Initialize services safely
  useEffect(() => {
    try {
      const tortoiseProtocol = TortoiseProtocolService.getInstance();
      const mythPromptAgent = MythPromptAgent.getInstance();
      const yieldRhythmEngine = YieldRhythmEngine.getInstance();
      const vaultEthicsCompiler = VaultEthicsCompiler.getInstance();

      setServices({
        tortoiseProtocol,
        mythPromptAgent,
        yieldRhythmEngine,
        vaultEthicsCompiler,
      });
    } catch (error) {
      console.error("Failed to initialize Tortoise Protocol services:", error);
      setServiceError(
        error instanceof Error
          ? error.message
          : "Service initialization failed",
      );
    }
  }, []);

  // New vault form
  const [newVault, setNewVault] = useState({
    name: "",
    purpose: "",
    culturalContexts: [] as string[],
  });

  useEffect(() => {
    if (services) {
      loadDashboardData();
      startSilenceGateMonitoring();
    }
  }, [services]);

  const loadDashboardData = () => {
    if (!services) return;

    const allVaults = services.tortoiseProtocol.getAllVaults();
    const allPhases = services.tortoiseProtocol.getPhases();

    setVaults(allVaults);
    setPhases(allPhases);

    if (allVaults.length > 0 && !selectedVault) {
      setSelectedVault(allVaults[0]);
      loadVaultDetails(allVaults[0]);
    }
  };

  const loadVaultDetails = async (vault: PhilosophicalVault) => {
    if (!services) return;

    setSelectedVault(vault);
    setCurrentPhase(phases.find((p) => p.id === vault.phase) || null);

    // Load mythic prompts if in contemplation phase
    if (vault.phase === "contemplation") {
      try {
        const prompts = await services.mythPromptAgent.generateMythicPrompts(
          vault.id,
          vault.ethicalIntent,
          vault.culturalStewards,
        );
        setMythicPrompts(prompts);
      } catch (error) {
        console.error("Failed to load mythic prompts:", error);
        setMythicPrompts([]);
      }
    }

    // Check silence gate
    try {
      if (services.tortoiseProtocol.isSilenceGateActive(vault.id)) {
        setSilenceRemaining(
          services.tortoiseProtocol.getSilenceGateRemaining(vault.id),
        );
      } else {
        setSilenceRemaining(0);
      }
    } catch (error) {
      console.error("Failed to check silence gate:", error);
      setSilenceRemaining(0);
    }
  };

  const startSilenceGateMonitoring = () => {
    setInterval(() => {
      if (selectedVault && services) {
        try {
          const remaining = services.tortoiseProtocol.getSilenceGateRemaining(
            selectedVault.id,
          );
          setSilenceRemaining(remaining);
        } catch (error) {
          console.error("Failed to monitor silence gate:", error);
        }
      }
    }, 1000);
  };

  const handleCreateVault = async () => {
    if (!newVault.name || !newVault.purpose || !services) {
      alert("Please fill in vault name and purpose");
      return;
    }

    try {
      const vault = await services.tortoiseProtocol.initiateContemplation(
        newVault.name,
        newVault.purpose,
        newVault.culturalContexts,
      );

      setVaults([...vaults, vault]);
      setSelectedVault(vault);
      setIsCreatingVault(false);
      setNewVault({ name: "", purpose: "", culturalContexts: [] });

      await loadVaultDetails(vault);
    } catch (error) {
      console.error("Failed to create vault:", error);
      setServiceError(
        `Failed to create vault: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleSubmitReflection = async (prompt: string) => {
    if (!selectedVault || !reflections[prompt] || !services) return;

    try {
      const reflection =
        await services.mythPromptAgent.processEthicalReflection(
          selectedVault.id,
          prompt,
          reflections[prompt],
          selectedVault.culturalStewards,
        );

      console.log("Reflection processed:", reflection);
      alert("Reflection submitted for ethical analysis");
    } catch (error) {
      console.error("Failed to process reflection:", error);
      setServiceError(
        `Failed to process reflection: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handlePhaseTransition = async (targetPhase: string) => {
    if (!selectedVault || !services) return;

    try {
      switch (targetPhase) {
        case "rooting":
          await services.tortoiseProtocol.transitionToRooting(
            selectedVault.id,
            selectedVault.ethicalIntent,
            selectedVault.culturalStewards,
          );
          break;
        case "deploying":
          await services.tortoiseProtocol.transitionToDeploying(
            selectedVault.id,
          );
          break;
        case "restoring":
          await services.tortoiseProtocol.transitionToRestoring(
            selectedVault.id,
          );
          break;
      }

      // Reload vault data
      const updatedVault = services.tortoiseProtocol.getVault(selectedVault.id);
      if (updatedVault) {
        await loadVaultDetails(updatedVault);
      }

      loadDashboardData();
    } catch (error) {
      console.error("Phase transition failed:", error);
      setServiceError(
        `Phase transition failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const getPhaseIcon = (phaseId: string) => {
    switch (phaseId) {
      case "contemplation":
        return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case "rooting":
        return <Sprout className="h-5 w-5 text-green-600" />;
      case "deploying":
        return <Zap className="h-5 w-5 text-blue-600" />;
      case "restoring":
        return <RotateCcw className="h-5 w-5 text-purple-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPhaseProgress = (vault: PhilosophicalVault) => {
    const phaseIndex = phases.findIndex((p) => p.id === vault.phase);
    return ((phaseIndex + 1) / phases.length) * 100;
  };

  const formatTimeRemaining = (milliseconds: number): string => {
    if (milliseconds <= 0) return "Complete";

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  const getCulturalContextOptions = () => [
    "ubuntu",
    "seven_generations",
    "takaful",
    "harmony",
    "solidarity",
  ];

  // Service error display
  if (serviceError) {
    return (
      <div
        className={`min-h-screen bg-gray-50 flex items-center justify-center p-6 ${className}`}
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <Shield className="h-5 w-5" />
              <span>Service Initialization Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>{serviceError}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setServiceError(null);
                  window.location.href = "/";
                }}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state while services initialize
  if (!services) {
    return (
      <div
        className={`min-h-screen bg-gray-50 flex items-center justify-center p-6 ${className}`}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TreePine className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Initializing Tortoise Protocol
              </p>
              <p className="text-gray-600">
                Setting up ethical contemplation services...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <TreePine className="h-8 w-8 text-green-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🐢 Tortoise Protocol
              </h1>
              <p className="text-gray-600">
                Wealth cultivated with memory, ethics, rhythm, and myth
              </p>
            </div>
          </div>

          {/* Protocol Wisdom */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-green-200 max-w-4xl mx-auto">
            <p className="text-lg font-medium text-green-800 italic">
              "The tortoise beats the hare not through speed, but through
              wisdom, persistence, and rhythmic alignment with natural cycles."
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Vault List & Creation */}
          <div className="space-y-6">
            {/* Create New Vault */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  <span>Create Philosophical Vault</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isCreatingVault ? (
                  <Button
                    onClick={() => setIsCreatingVault(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Begin Contemplation
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vaultName">Vault Name</Label>
                      <Input
                        id="vaultName"
                        value={newVault.name}
                        onChange={(e) =>
                          setNewVault((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g., Rainforest Restoration Vault"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vaultPurpose">Ethical Purpose</Label>
                      <Textarea
                        id="vaultPurpose"
                        value={newVault.purpose}
                        onChange={(e) =>
                          setNewVault((prev) => ({
                            ...prev,
                            purpose: e.target.value,
                          }))
                        }
                        placeholder="What is this vault for beyond ROI? How does it serve the web of life?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Cultural Contexts</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getCulturalContextOptions().map((context) => (
                          <Button
                            key={context}
                            variant={
                              newVault.culturalContexts.includes(context)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              const contexts =
                                newVault.culturalContexts.includes(context)
                                  ? newVault.culturalContexts.filter(
                                      (c) => c !== context,
                                    )
                                  : [...newVault.culturalContexts, context];
                              setNewVault((prev) => ({
                                ...prev,
                                culturalContexts: contexts,
                              }));
                            }}
                          >
                            {context}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleCreateVault} className="flex-1">
                        Create Vault
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreatingVault(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vault List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mountain className="h-5 w-5 text-blue-600" />
                  <span>Philosophical Vaults</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vaults.map((vault) => (
                    <div
                      key={vault.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedVault?.id === vault.id
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => loadVaultDetails(vault)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{vault.name}</h4>
                          <p className="text-sm text-gray-600 truncate">
                            {vault.ethicalIntent}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPhaseIcon(vault.phase)}
                          <Badge variant="outline" className="text-xs">
                            {vault.phase}
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={getPhaseProgress(vault)}
                        className="mt-2 h-1"
                      />
                    </div>
                  ))}

                  {vaults.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <TreePine className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No vaults yet. Begin your first contemplation.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Vault Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedVault ? (
              <>
                {/* Vault Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        {getPhaseIcon(selectedVault.phase)}
                        <span>{selectedVault.name}</span>
                      </CardTitle>
                      <Badge className="text-sm">
                        Phase: {selectedVault.phase}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Ethical Intent
                        </Label>
                        <p className="text-gray-600 mt-1">
                          {selectedVault.ethicalIntent}
                        </p>
                      </div>

                      {selectedVault.purposeHash && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Purpose Hash
                          </Label>
                          <p className="text-xs text-gray-500 font-mono mt-1 break-all">
                            {selectedVault.purposeHash}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {selectedVault.ritualHistory.length}
                          </p>
                          <p className="text-sm text-gray-600">Rituals</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {selectedVault.wisdomLogs.length}
                          </p>
                          <p className="text-sm text-gray-600">
                            Wisdom Entries
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">
                            {selectedVault.culturalStewards.length}
                          </p>
                          <p className="text-sm text-gray-600">Stewards</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Silence Gate */}
                {silenceRemaining > 0 && (
                  <Alert className="border-orange-500 bg-orange-50">
                    <Pause className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Silence Gate Active:</strong>{" "}
                      {formatTimeRemaining(silenceRemaining)} of contemplation
                      remaining. This ensures mindful decision-making without
                      haste.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Phase-Specific Content */}
                <Tabs defaultValue="current" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="current">Current Phase</TabsTrigger>
                    <TabsTrigger value="rituals">Rituals</TabsTrigger>
                    <TabsTrigger value="wisdom">Wisdom</TabsTrigger>
                    <TabsTrigger value="rhythm">Rhythm</TabsTrigger>
                  </TabsList>

                  {/* Current Phase Tab */}
                  <TabsContent value="current" className="space-y-4">
                    {currentPhase && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            {getPhaseIcon(currentPhase.id)}
                            <span>{currentPhase.name}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">
                            {currentPhase.description}
                          </p>

                          {/* Phase-specific content */}
                          {selectedVault.phase === "contemplation" && (
                            <div className="space-y-4">
                              <h4 className="font-medium">
                                Mythic Prompts for Deep Reflection
                              </h4>
                              {mythicPrompts.map((prompt, index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                                >
                                  <p className="font-medium text-yellow-800 mb-2">
                                    {prompt}
                                  </p>
                                  <Textarea
                                    value={reflections[prompt] || ""}
                                    onChange={(e) =>
                                      setReflections((prev) => ({
                                        ...prev,
                                        [prompt]: e.target.value,
                                      }))
                                    }
                                    placeholder="Share your reflection..."
                                    rows={3}
                                    className="mb-2"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleSubmitReflection(prompt)
                                    }
                                    disabled={
                                      !reflections[prompt] ||
                                      silenceRemaining > 0
                                    }
                                  >
                                    Submit Reflection
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Phase Transition */}
                          {silenceRemaining === 0 && (
                            <div className="mt-6 pt-4 border-t">
                              <h4 className="font-medium mb-2">
                                Phase Transition
                              </h4>
                              {selectedVault.phase === "contemplation" && (
                                <Button
                                  onClick={() =>
                                    handlePhaseTransition("rooting")
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Begin Rooting Phase
                                </Button>
                              )}
                              {selectedVault.phase === "rooting" && (
                                <Button
                                  onClick={() =>
                                    handlePhaseTransition("deploying")
                                  }
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Begin Deployment Phase
                                </Button>
                              )}
                              {selectedVault.phase === "deploying" && (
                                <Button
                                  onClick={() =>
                                    handlePhaseTransition("restoring")
                                  }
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  Begin Restoration Phase
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Rituals Tab */}
                  <TabsContent value="rituals" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Ritual Validations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedVault.ritualHistory.length > 0 ? (
                          <div className="space-y-3">
                            {selectedVault.ritualHistory.map((ritual) => (
                              <div
                                key={ritual.id}
                                className="p-3 bg-blue-50 rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <Badge className="bg-blue-100 text-blue-800">
                                    {ritual.type}
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    {new Date(
                                      ritual.timestamp,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm font-medium">
                                  Validator: {ritual.validator}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {ritual.wisdom}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">
                            No rituals completed yet
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Wisdom Tab */}
                  <TabsContent value="wisdom" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Wisdom Logs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedVault.wisdomLogs.length > 0 ? (
                          <div className="space-y-4">
                            {selectedVault.wisdomLogs.map((log) => (
                              <div
                                key={log.id}
                                className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">
                                    Epoch {log.epoch}
                                  </span>
                                  <Badge className="bg-purple-100 text-purple-800">
                                    Score: {log.reflectionScore}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <h5 className="font-medium text-green-700">
                                      Learnings
                                    </h5>
                                    <ul className="list-disc list-inside text-gray-600">
                                      {log.learnings.map((learning, i) => (
                                        <li key={i}>{learning}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-blue-700">
                                      Harms Prevented
                                    </h5>
                                    <ul className="list-disc list-inside text-gray-600">
                                      {log.harmsPrevented.map((harm, i) => (
                                        <li key={i}>{harm}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-purple-700">
                                      Future Changes
                                    </h5>
                                    <ul className="list-disc list-inside text-gray-600">
                                      {log.futureChanges.map((change, i) => (
                                        <li key={i}>{change}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                  By {log.contributor} •{" "}
                                  {new Date(log.timestamp).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">
                            No wisdom entries yet
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Rhythm Tab */}
                  <TabsContent value="rhythm" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Yield Rhythm Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedVault.phase === "deploying" ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <Sun className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
                                <p className="text-sm font-medium">Seasonal</p>
                                <p className="text-xs text-gray-600">
                                  Alignment
                                </p>
                              </div>
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                                <p className="text-sm font-medium">Community</p>
                                <p className="text-xs text-gray-600">
                                  Approval
                                </p>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <Leaf className="h-6 w-6 mx-auto text-green-600 mb-2" />
                                <p className="text-sm font-medium">Ecosystem</p>
                                <p className="text-xs text-gray-600">Health</p>
                              </div>
                              <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <Star className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                                <p className="text-sm font-medium">Ritual</p>
                                <p className="text-xs text-gray-600">
                                  Complete
                                </p>
                              </div>
                            </div>
                            <Alert>
                              <Clock className="h-4 w-4" />
                              <AlertDescription>
                                Yield activation follows natural rhythms, not
                                market timing. All criteria must align for
                                authentic abundance.
                              </AlertDescription>
                            </Alert>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">
                            Rhythm activation available in deployment phase
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <TreePine className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Welcome to the Tortoise Protocol
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first philosophical vault to begin the journey
                    of wisdom-based wealth creation.
                  </p>
                  <Button
                    onClick={() => setIsCreatingVault(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Begin Contemplation
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TortoiseDashboard;
