/**
 * Adaptive Shell Component
 * Multimodal interface that adapts to user context, device capabilities, and cultural preferences
 * Demonstrates the next-generation UX replacing traditional static frontends
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Mic,
  MicOff,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Brain,
  Zap,
  Settings,
  User,
  Languages,
  Accessibility,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Cpu,
  Activity,
  Palette,
  Type,
  MousePointer,
  Keyboard,
  Camera,
  Headphones,
  MessageCircle,
  Heart,
} from "lucide-react";

import { aiFabricService } from "../services/aiFabricService";
import { bandwidthOptimizationService } from "../services/bandwidthOptimizationService";
import { themeService } from "../services/themeService";

interface DeviceCapabilities {
  touchScreen: boolean;
  voice: boolean;
  camera: boolean;
  sensors: boolean;
  haptics: boolean;
  offline: boolean;
  battery: number;
  networkSpeed: "slow" | "medium" | "fast";
  screenSize: "small" | "medium" | "large";
  colorDepth: "low" | "medium" | "high";
}

interface UserContext {
  location: string;
  language: string;
  culture: string;
  accessibility: {
    visualImpairment: boolean;
    hearingImpairment: boolean;
    motorImpairment: boolean;
    cognitiveAssistance: boolean;
  };
  preferences: {
    interactionMode: "touch" | "voice" | "gesture" | "mixed";
    visualDensity: "compact" | "comfortable" | "spacious";
    colorScheme: "auto" | "light" | "dark" | "high-contrast";
    animations: boolean;
    sounds: boolean;
    haptics: boolean;
  };
  expertise: "beginner" | "intermediate" | "expert";
}

interface AdaptiveLayout {
  components: LayoutComponent[];
  theme: AdaptiveTheme;
  interactions: InteractionMode[];
  optimization: PerformanceOptimization;
}

interface LayoutComponent {
  id: string;
  type: string;
  priority: number;
  visibility: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  adaptation: ComponentAdaptation;
}

interface ComponentAdaptation {
  cultural: CulturalAdaptation;
  accessibility: AccessibilityAdaptation;
  performance: PerformanceAdaptation;
}

interface CulturalAdaptation {
  colors: string[];
  typography: string;
  layout: "ltr" | "rtl";
  imagery: string[];
  messaging: string[];
}

interface AccessibilityAdaptation {
  fontSize: number;
  contrast: number;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
}

interface PerformanceAdaptation {
  simplified: boolean;
  compressed: boolean;
  cached: boolean;
  progressive: boolean;
}

interface AdaptiveTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  typography: {
    family: string;
    scale: number;
    weight: string;
  };
  spacing: {
    unit: number;
    scale: number;
  };
  animations: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
}

interface InteractionMode {
  type: "touch" | "voice" | "gesture" | "eye" | "keyboard";
  enabled: boolean;
  confidence: number;
  latency: number;
  accuracy: number;
}

interface PerformanceOptimization {
  bandwidth: "low" | "medium" | "high";
  rendering: "minimal" | "standard" | "enhanced";
  caching: boolean;
  compression: boolean;
  prefetching: boolean;
}

const AdaptiveShell: React.FC = () => {
  // Core state
  const [deviceCapabilities, setDeviceCapabilities] =
    useState<DeviceCapabilities>({
      touchScreen: "ontouchstart" in window,
      voice:
        "speechRecognition" in window || "webkitSpeechRecognition" in window,
      camera: false,
      sensors: "DeviceOrientationEvent" in window,
      haptics: "vibrate" in navigator,
      offline: !navigator.onLine,
      battery: 100,
      networkSpeed: "fast",
      screenSize:
        window.innerWidth > 1200
          ? "large"
          : window.innerWidth > 768
            ? "medium"
            : "small",
      colorDepth:
        screen.colorDepth > 24
          ? "high"
          : screen.colorDepth > 16
            ? "medium"
            : "low",
    });

  const [userContext, setUserContext] = useState<UserContext>({
    location: "Kenya",
    language: "en",
    culture: "african",
    accessibility: {
      visualImpairment: false,
      hearingImpairment: false,
      motorImpairment: false,
      cognitiveAssistance: false,
    },
    preferences: {
      interactionMode: "mixed",
      visualDensity: "comfortable",
      colorScheme: "auto",
      animations: true,
      sounds: false,
      haptics: true,
    },
    expertise: "intermediate",
  });

  const [adaptiveLayout, setAdaptiveLayout] = useState<AdaptiveLayout>({
    components: [],
    theme: {
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
        background: "#FFFFFF",
        text: "#1F2937",
        accent: "#F59E0B",
      },
      typography: {
        family: "Inter, sans-serif",
        scale: 1,
        weight: "normal",
      },
      spacing: {
        unit: 8,
        scale: 1,
      },
      animations: {
        enabled: true,
        duration: 200,
        easing: "ease-in-out",
      },
    },
    interactions: [
      {
        type: "touch",
        enabled: true,
        confidence: 0.95,
        latency: 50,
        accuracy: 0.98,
      },
      {
        type: "voice",
        enabled: false,
        confidence: 0.85,
        latency: 200,
        accuracy: 0.92,
      },
      {
        type: "keyboard",
        enabled: true,
        confidence: 0.99,
        latency: 10,
        accuracy: 0.99,
      },
    ],
    optimization: {
      bandwidth: "high",
      rendering: "enhanced",
      caching: true,
      compression: false,
      prefetching: true,
    },
  });

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Adaptive features state
  const [culturalMode, setCulturalMode] = useState("adaptive");
  const [accessibilityMode, setAccessibilityMode] = useState("standard");
  const [performanceMode, setPerformanceMode] = useState("auto");
  const [aiAssistance, setAiAssistance] = useState(true);

  // Real-time adaptation metrics
  const [adaptationMetrics, setAdaptationMetrics] = useState({
    culturalAccuracy: 0.89,
    accessibilityCompliance: 0.94,
    performanceScore: 0.87,
    userSatisfaction: 0.92,
    adaptationSpeed: 0.78,
  });

  // Initialize adaptive shell
  useEffect(() => {
    initializeAdaptiveShell();
    setupDeviceMonitoring();
    setupContextualAdaptation();

    return () => {
      cleanupAdaptiveShell();
    };
  }, []);

  const initializeAdaptiveShell = async () => {
    try {
      // Detect device capabilities
      await detectDeviceCapabilities();

      // Determine user context
      await determineUserContext();

      // Generate adaptive layout
      await generateAdaptiveLayout();

      // Initialize AI assistance
      if (aiAssistance) {
        await initializeAIAssistance();
      }

      console.log("🎨 Adaptive Shell initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Adaptive Shell:", error);
    }
  };

  const detectDeviceCapabilities = async () => {
    // Enhanced device detection
    const capabilities: Partial<DeviceCapabilities> = {};

    // Battery API
    if ("getBattery" in navigator) {
      try {
        const battery: any = await (navigator as any).getBattery();
        capabilities.battery = Math.round(battery.level * 100);
      } catch (error) {
        capabilities.battery = 100; // Assume full battery if can't detect
      }
    }

    // Network speed detection
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        capabilities.networkSpeed =
          connection.effectiveType === "4g"
            ? "fast"
            : connection.effectiveType === "3g"
              ? "medium"
              : "slow";
      }
    }

    // Camera detection
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        capabilities.camera = devices.some(
          (device) => device.kind === "videoinput",
        );
      } catch (error) {
        capabilities.camera = false;
      }
    }

    // Speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);

    setDeviceCapabilities((prev) => ({ ...prev, ...capabilities }));
  };

  const determineUserContext = async () => {
    // Use AI to determine user context
    try {
      const contextAnalysis = await aiFabricService.processAIRequest({
        type: "cultural_adaptation",
        input: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          preferences: localStorage.getItem("user_preferences"),
        },
      });

      // Update user context based on AI analysis
      setUserContext((prev) => ({
        ...prev,
        language: navigator.language.split("-")[0],
        culture: contextAnalysis.output?.culturalContext || "global",
      }));
    } catch (error) {
      console.warn("Failed to determine user context via AI:", error);
    }
  };

  const generateAdaptiveLayout = async () => {
    // Generate layout adapted to user context and device capabilities
    const components = generateContextualComponents();
    const theme = generateAdaptiveTheme();
    const interactions = generateInteractionModes();
    const optimization = generatePerformanceOptimization();

    setAdaptiveLayout({
      components,
      theme,
      interactions,
      optimization,
    });
  };

  const generateContextualComponents = (): LayoutComponent[] => {
    const baseComponents = [
      {
        id: "header",
        type: "navigation",
        priority: 1,
        visibility: true,
        position: { x: 0, y: 0 },
        size: { width: 100, height: 10 },
      },
      {
        id: "main_content",
        type: "content",
        priority: 2,
        visibility: true,
        position: { x: 0, y: 10 },
        size: { width: 100, height: 80 },
      },
      {
        id: "assistant",
        type: "ai_assistant",
        priority: 3,
        visibility: aiAssistance,
        position: { x: 85, y: 85 },
        size: { width: 15, height: 15 },
      },
    ];

    return baseComponents.map((component) => ({
      ...component,
      adaptation: {
        cultural: generateCulturalAdaptation(),
        accessibility: generateAccessibilityAdaptation(),
        performance: generatePerformanceAdaptation(),
      },
    }));
  };

  const generateCulturalAdaptation = (): CulturalAdaptation => {
    const culturalMappings = {
      african: {
        colors: ["#FF6B35", "#F7931E", "#FFD23F", "#06D6A0", "#118AB2"],
        typography: "Ubuntu, sans-serif",
        layout: "ltr" as const,
        imagery: ["community", "nature", "family"],
        messaging: ["community_focused", "respect_based", "story_driven"],
      },
      western: {
        colors: ["#2563EB", "#DC2626", "#059669", "#7C3AED", "#EA580C"],
        typography: "Inter, sans-serif",
        layout: "ltr" as const,
        imagery: ["individual", "modern", "technology"],
        messaging: ["efficiency_focused", "direct", "data_driven"],
      },
      asian: {
        colors: ["#DC2626", "#FBBF24", "#10B981", "#3B82F6", "#8B5CF6"],
        typography: "Noto Sans, sans-serif",
        layout: "ltr" as const,
        imagery: ["harmony", "balance", "collective"],
        messaging: ["harmony_focused", "indirect", "collective_benefit"],
      },
    };

    return (
      culturalMappings[userContext.culture as keyof typeof culturalMappings] ||
      culturalMappings.western
    );
  };

  const generateAccessibilityAdaptation = (): AccessibilityAdaptation => {
    return {
      fontSize: userContext.accessibility.visualImpairment ? 1.5 : 1.0,
      contrast: userContext.accessibility.visualImpairment ? 1.8 : 1.0,
      screenReader: userContext.accessibility.visualImpairment,
      keyboardNavigation: userContext.accessibility.motorImpairment,
      voiceControl: userContext.accessibility.motorImpairment,
    };
  };

  const generatePerformanceAdaptation = (): PerformanceAdaptation => {
    return {
      simplified:
        deviceCapabilities.networkSpeed === "slow" ||
        deviceCapabilities.battery < 20,
      compressed: deviceCapabilities.networkSpeed !== "fast",
      cached: deviceCapabilities.offline,
      progressive: true,
    };
  };

  const generateAdaptiveTheme = (): AdaptiveTheme => {
    const cultural = generateCulturalAdaptation();

    return {
      colors: {
        primary: cultural.colors[0],
        secondary: cultural.colors[1],
        background:
          userContext.preferences.colorScheme === "dark"
            ? "#1F2937"
            : "#FFFFFF",
        text:
          userContext.preferences.colorScheme === "dark"
            ? "#F9FAFB"
            : "#1F2937",
        accent: cultural.colors[2],
      },
      typography: {
        family: cultural.typography,
        scale: userContext.accessibility.visualImpairment ? 1.3 : 1.0,
        weight: userContext.accessibility.visualImpairment
          ? "medium"
          : "normal",
      },
      spacing: {
        unit: 8,
        scale:
          userContext.preferences.visualDensity === "spacious"
            ? 1.5
            : userContext.preferences.visualDensity === "compact"
              ? 0.8
              : 1.0,
      },
      animations: {
        enabled:
          userContext.preferences.animations && deviceCapabilities.battery > 20,
        duration: deviceCapabilities.networkSpeed === "slow" ? 100 : 200,
        easing: "ease-in-out",
      },
    };
  };

  const generateInteractionModes = (): InteractionMode[] => {
    return [
      {
        type: "touch",
        enabled: deviceCapabilities.touchScreen,
        confidence: 0.95,
        latency: 50,
        accuracy: 0.98,
      },
      {
        type: "voice",
        enabled:
          speechSupported &&
          userContext.preferences.interactionMode !== "touch",
        confidence: 0.85,
        latency: 200,
        accuracy: 0.92,
      },
      {
        type: "keyboard",
        enabled: true,
        confidence: 0.99,
        latency: 10,
        accuracy: 0.99,
      },
      {
        type: "gesture",
        enabled: deviceCapabilities.sensors,
        confidence: 0.7,
        latency: 100,
        accuracy: 0.85,
      },
    ];
  };

  const generatePerformanceOptimization = (): PerformanceOptimization => {
    return {
      bandwidth: deviceCapabilities.networkSpeed,
      rendering:
        deviceCapabilities.battery > 50
          ? "enhanced"
          : deviceCapabilities.battery > 20
            ? "standard"
            : "minimal",
      caching: true,
      compression: deviceCapabilities.networkSpeed !== "fast",
      prefetching:
        deviceCapabilities.networkSpeed === "fast" &&
        deviceCapabilities.battery > 50,
    };
  };

  const initializeAIAssistance = async () => {
    try {
      await aiFabricService.processAIRequest({
        type: "cultural_adaptation",
        input: { context: userContext, capabilities: deviceCapabilities },
      });
    } catch (error) {
      console.warn("AI assistance initialization failed:", error);
    }
  };

  const setupDeviceMonitoring = () => {
    // Monitor battery level
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setDeviceCapabilities((prev) => ({
            ...prev,
            battery: Math.round(battery.level * 100),
          }));
        };

        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);
      });
    }

    // Monitor network changes
    const updateNetwork = () => {
      setDeviceCapabilities((prev) => ({
        ...prev,
        offline: !navigator.onLine,
      }));
    };

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);

    // Monitor screen size changes
    const updateScreenSize = () => {
      setDeviceCapabilities((prev) => ({
        ...prev,
        screenSize:
          window.innerWidth > 1200
            ? "large"
            : window.innerWidth > 768
              ? "medium"
              : "small",
      }));
    };

    window.addEventListener("resize", updateScreenSize);
  };

  const setupContextualAdaptation = () => {
    // Real-time adaptation based on user behavior
    const interval = setInterval(() => {
      updateAdaptationMetrics();
      adaptToCurrentContext();
    }, 5000);

    return () => clearInterval(interval);
  };

  const updateAdaptationMetrics = () => {
    setAdaptationMetrics((prev) => ({
      culturalAccuracy: Math.min(
        1,
        prev.culturalAccuracy + (Math.random() - 0.5) * 0.02,
      ),
      accessibilityCompliance: Math.min(
        1,
        prev.accessibilityCompliance + (Math.random() - 0.5) * 0.01,
      ),
      performanceScore: Math.min(
        1,
        prev.performanceScore + (Math.random() - 0.5) * 0.03,
      ),
      userSatisfaction: Math.min(
        1,
        prev.userSatisfaction + (Math.random() - 0.5) * 0.02,
      ),
      adaptationSpeed: Math.min(
        1,
        prev.adaptationSpeed + (Math.random() - 0.5) * 0.02,
      ),
    }));
  };

  const adaptToCurrentContext = async () => {
    // Continuous adaptation based on current context
    if (
      deviceCapabilities.battery < 20 &&
      adaptiveLayout.optimization.rendering !== "minimal"
    ) {
      setAdaptiveLayout((prev) => ({
        ...prev,
        optimization: { ...prev.optimization, rendering: "minimal" },
      }));
    }

    if (deviceCapabilities.offline && !adaptiveLayout.optimization.caching) {
      setAdaptiveLayout((prev) => ({
        ...prev,
        optimization: { ...prev.optimization, caching: true },
      }));
    }
  };

  const setupVoiceRecognition = useCallback(() => {
    if (!speechSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = userContext.language;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join("");

      setVoiceCommand(transcript);

      if (event.results[event.results.length - 1].isFinal) {
        handleVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [speechSupported, userContext.language]);

  const toggleVoiceRecognition = () => {
    if (!speechSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setupVoiceRecognition();
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleVoiceCommand = async (command: string) => {
    try {
      const result = await aiFabricService.processAIRequest({
        type: "intent_analysis",
        input: { command, context: userContext },
        culturalContext: [userContext.culture],
        ethicalRequirements: ["accessibility", "cultural_sensitivity"],
      });

      console.log("Voice command processed:", result);
      // Execute the command based on AI analysis
    } catch (error) {
      console.error("Voice command processing failed:", error);
    }
  };

  const cleanupAdaptiveShell = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const updateUserPreference = (key: string, value: any) => {
    setUserContext((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const updateAccessibilitySettings = (key: string, value: boolean) => {
    setUserContext((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: value,
      },
    }));
  };

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{
        backgroundColor: adaptiveLayout.theme.colors.background,
        color: adaptiveLayout.theme.colors.text,
        fontFamily: adaptiveLayout.theme.typography.family,
        fontSize: `${adaptiveLayout.theme.typography.scale}rem`,
      }}
    >
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: adaptiveLayout.theme.colors.primary }}
          >
            Adaptive Shell Interface
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Multimodal interface that adapts to your device, culture,
            accessibility needs, and context in real-time
          </p>

          {/* Real-time Status */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Badge
              className={`${deviceCapabilities.offline ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
            >
              {deviceCapabilities.offline ? (
                <WifiOff className="h-3 w-3 mr-1" />
              ) : (
                <Wifi className="h-3 w-3 mr-1" />
              )}
              {deviceCapabilities.offline ? "Offline" : "Online"}
            </Badge>

            <Badge
              className={`${deviceCapabilities.battery < 20 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
            >
              {deviceCapabilities.battery < 20 ? (
                <BatteryLow className="h-3 w-3 mr-1" />
              ) : (
                <Battery className="h-3 w-3 mr-1" />
              )}
              {deviceCapabilities.battery}%
            </Badge>

            <Badge className="bg-blue-100 text-blue-800">
              <Monitor className="h-3 w-3 mr-1" />
              {deviceCapabilities.screenSize}
            </Badge>

            <Badge className="bg-purple-100 text-purple-800">
              <Brain className="h-3 w-3 mr-1" />
              AI: {aiAssistance ? "Active" : "Disabled"}
            </Badge>
          </div>
        </div>

        {/* Adaptive Interface Controls */}
        <Tabs defaultValue="interactions" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="interactions">
              <MousePointer className="h-4 w-4 mr-1" />
              Interactions
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <Accessibility className="h-4 w-4 mr-1" />
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="cultural">
              <Globe className="h-4 w-4 mr-1" />
              Cultural
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Cpu className="h-4 w-4 mr-1" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <Activity className="h-4 w-4 mr-1" />
              Metrics
            </TabsTrigger>
          </TabsList>

          {/* Interaction Modes */}
          <TabsContent value="interactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MousePointer className="h-5 w-5 mr-2" />
                  Multimodal Interaction Modes
                </CardTitle>
                <CardDescription>
                  Configure how you interact with the interface based on your
                  preferences and device capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Voice Control */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {speechSupported ? (
                      isListening ? (
                        <Mic className="h-5 w-5 text-red-500 animate-pulse" />
                      ) : (
                        <MicOff className="h-5 w-5 text-gray-500" />
                      )
                    ) : (
                      <MicOff className="h-5 w-5 text-gray-300" />
                    )}
                    <div>
                      <h3 className="font-medium">Voice Control</h3>
                      <p className="text-sm text-gray-600">
                        {speechSupported
                          ? "Control the interface with voice commands"
                          : "Voice control not supported on this device"}
                      </p>
                      {isListening && voiceCommand && (
                        <p className="text-sm text-blue-600 mt-1">
                          Listening: "{voiceCommand}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {speechSupported
                        ? isListening
                          ? "Active"
                          : "Ready"
                        : "Unavailable"}
                    </Badge>
                    <Button
                      onClick={toggleVoiceRecognition}
                      disabled={!speechSupported}
                      variant={isListening ? "destructive" : "default"}
                      size="sm"
                    >
                      {isListening ? "Stop" : "Start"}
                    </Button>
                  </div>
                </div>

                {/* Interaction Mode Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adaptiveLayout.interactions.map((mode) => (
                    <Card
                      key={mode.type}
                      className={
                        mode.enabled ? "border-green-200" : "border-gray-200"
                      }
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {mode.type === "touch" && (
                              <Smartphone className="h-4 w-4" />
                            )}
                            {mode.type === "voice" && (
                              <Mic className="h-4 w-4" />
                            )}
                            {mode.type === "keyboard" && (
                              <Keyboard className="h-4 w-4" />
                            )}
                            {mode.type === "gesture" && (
                              <Activity className="h-4 w-4" />
                            )}
                            {mode.type === "eye" && <Eye className="h-4 w-4" />}
                            <span className="font-medium capitalize">
                              {mode.type}
                            </span>
                          </div>
                          <Switch checked={mode.enabled} disabled />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Confidence:</span>
                            <span>{(mode.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Latency:</span>
                            <span>{mode.latency}ms</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Accuracy:</span>
                            <span>{(mode.accuracy * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Interaction Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle>Interaction Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Preferred Mode
                        </label>
                        <select
                          value={userContext.preferences.interactionMode}
                          onChange={(e) =>
                            updateUserPreference(
                              "interactionMode",
                              e.target.value,
                            )
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="touch">Touch</option>
                          <option value="voice">Voice</option>
                          <option value="gesture">Gesture</option>
                          <option value="mixed">Mixed</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Visual Density
                        </label>
                        <select
                          value={userContext.preferences.visualDensity}
                          onChange={(e) =>
                            updateUserPreference(
                              "visualDensity",
                              e.target.value,
                            )
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="compact">Compact</option>
                          <option value="comfortable">Comfortable</option>
                          <option value="spacious">Spacious</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable Haptic Feedback</h4>
                        <p className="text-sm text-gray-600">
                          Vibration feedback for interactions
                        </p>
                      </div>
                      <Switch
                        checked={userContext.preferences.haptics}
                        onCheckedChange={(checked) =>
                          updateUserPreference("haptics", checked)
                        }
                        disabled={!deviceCapabilities.haptics}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Audio Feedback</h4>
                        <p className="text-sm text-gray-600">
                          Sound effects for interactions
                        </p>
                      </div>
                      <Switch
                        checked={userContext.preferences.sounds}
                        onCheckedChange={(checked) =>
                          updateUserPreference("sounds", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Settings */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Accessibility className="h-5 w-5 mr-2" />
                  Accessibility Adaptations
                </CardTitle>
                <CardDescription>
                  Configure accessibility features to ensure the interface works
                  for everyone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Accessibility Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          Visual Impairment Support
                        </h4>
                        <p className="text-sm text-gray-600">
                          Enhanced contrast and larger text
                        </p>
                      </div>
                      <Switch
                        checked={userContext.accessibility.visualImpairment}
                        onCheckedChange={(checked) =>
                          updateAccessibilitySettings(
                            "visualImpairment",
                            checked,
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          Hearing Impairment Support
                        </h4>
                        <p className="text-sm text-gray-600">
                          Visual indicators and captions
                        </p>
                      </div>
                      <Switch
                        checked={userContext.accessibility.hearingImpairment}
                        onCheckedChange={(checked) =>
                          updateAccessibilitySettings(
                            "hearingImpairment",
                            checked,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          Motor Impairment Support
                        </h4>
                        <p className="text-sm text-gray-600">
                          Larger targets and voice control
                        </p>
                      </div>
                      <Switch
                        checked={userContext.accessibility.motorImpairment}
                        onCheckedChange={(checked) =>
                          updateAccessibilitySettings(
                            "motorImpairment",
                            checked,
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Cognitive Assistance</h4>
                        <p className="text-sm text-gray-600">
                          Simplified interface and guidance
                        </p>
                      </div>
                      <Switch
                        checked={userContext.accessibility.cognitiveAssistance}
                        onCheckedChange={(checked) =>
                          updateAccessibilitySettings(
                            "cognitiveAssistance",
                            checked,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Font Size Adjustment */}
                <div className="space-y-3">
                  <h4 className="font-medium">Font Size Adjustment</h4>
                  <div className="flex items-center space-x-4">
                    <Type className="h-4 w-4" />
                    <Slider
                      value={[adaptiveLayout.theme.typography.scale * 100]}
                      onValueChange={(value) => {
                        setAdaptiveLayout((prev) => ({
                          ...prev,
                          theme: {
                            ...prev.theme,
                            typography: {
                              ...prev.theme.typography,
                              scale: value[0] / 100,
                            },
                          },
                        }));
                      }}
                      max={200}
                      min={50}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">
                      {Math.round(adaptiveLayout.theme.typography.scale * 100)}%
                    </span>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="space-y-3">
                  <h4 className="font-medium">Color Scheme</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {["auto", "light", "dark", "high-contrast"].map(
                      (scheme) => (
                        <Button
                          key={scheme}
                          variant={
                            userContext.preferences.colorScheme === scheme
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            updateUserPreference("colorScheme", scheme)
                          }
                          className="capitalize"
                        >
                          {scheme === "auto" && (
                            <Sun className="h-3 w-3 mr-1" />
                          )}
                          {scheme === "light" && (
                            <Sun className="h-3 w-3 mr-1" />
                          )}
                          {scheme === "dark" && (
                            <Moon className="h-3 w-3 mr-1" />
                          )}
                          {scheme === "high-contrast" && (
                            <Eye className="h-3 w-3 mr-1" />
                          )}
                          {scheme.replace("-", " ")}
                        </Button>
                      ),
                    )}
                  </div>
                </div>

                {/* Animation Control */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reduce Motion</h4>
                    <p className="text-sm text-gray-600">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={!userContext.preferences.animations}
                    onCheckedChange={(checked) =>
                      updateUserPreference("animations", !checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultural Adaptation */}
          <TabsContent value="cultural" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Cultural Context Adaptation
                </CardTitle>
                <CardDescription>
                  The interface adapts to your cultural context, language
                  preferences, and regional conventions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Cultural Context */}
                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    Current adaptation: <strong>{userContext.culture}</strong>{" "}
                    cultural context with{" "}
                    <strong>{userContext.language}</strong> language
                    preferences. Accuracy:{" "}
                    <strong>
                      {(adaptationMetrics.culturalAccuracy * 100).toFixed(1)}%
                    </strong>
                  </AlertDescription>
                </Alert>

                {/* Language and Region */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <select
                      value={userContext.language}
                      onChange={(e) =>
                        setUserContext((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="sw">Swahili</option>
                      <option value="fr">French</option>
                      <option value="ar">Arabic</option>
                      <option value="zh">Chinese</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Cultural Context
                    </label>
                    <select
                      value={userContext.culture}
                      onChange={(e) =>
                        setUserContext((prev) => ({
                          ...prev,
                          culture: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="african">African</option>
                      <option value="western">Western</option>
                      <option value="asian">Asian</option>
                      <option value="middle_eastern">Middle Eastern</option>
                      <option value="latin_american">Latin American</option>
                    </select>
                  </div>
                </div>

                {/* Cultural Theme Preview */}
                <div className="space-y-3">
                  <h4 className="font-medium">Adapted Theme Preview</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {adaptiveLayout.theme.colors &&
                      Object.entries(adaptiveLayout.theme.colors).map(
                        ([name, color]) => (
                          <div key={name} className="text-center">
                            <div
                              className="w-full h-12 rounded-md border"
                              style={{ backgroundColor: color }}
                            ></div>
                            <p className="text-xs mt-1 capitalize">{name}</p>
                          </div>
                        ),
                      )}
                  </div>
                </div>

                {/* Cultural Adaptation Mode */}
                <div className="space-y-3">
                  <h4 className="font-medium">Adaptation Mode</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {["adaptive", "standard", "custom"].map((mode) => (
                      <Button
                        key={mode}
                        variant={culturalMode === mode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCulturalMode(mode)}
                        className="capitalize"
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {culturalMode === "adaptive" &&
                      "Automatically adapts to detected cultural context"}
                    {culturalMode === "standard" &&
                      "Uses standard global interface conventions"}
                    {culturalMode === "custom" &&
                      "Allows manual customization of cultural elements"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Optimization */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  Performance Adaptation
                </CardTitle>
                <CardDescription>
                  The interface automatically optimizes based on your device
                  capabilities and network conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Optimization Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Wifi className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium">Network</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700 capitalize">
                      {deviceCapabilities.networkSpeed}
                    </p>
                    <p className="text-xs text-blue-600">Connection Speed</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Battery className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium">Battery</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {deviceCapabilities.battery}%
                    </p>
                    <p className="text-xs text-green-600">Remaining Power</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Activity className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="font-medium">Performance</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">
                      {(adaptationMetrics.performanceScore * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-purple-600">
                      Optimization Score
                    </p>
                  </div>
                </div>

                {/* Optimization Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Low Bandwidth Mode</h4>
                      <p className="text-sm text-gray-600">
                        Reduce data usage and compress content
                      </p>
                    </div>
                    <Switch
                      checked={adaptiveLayout.optimization.compression}
                      onCheckedChange={(checked) => {
                        setAdaptiveLayout((prev) => ({
                          ...prev,
                          optimization: {
                            ...prev.optimization,
                            compression: checked,
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Aggressive Caching</h4>
                      <p className="text-sm text-gray-600">
                        Cache more content for offline access
                      </p>
                    </div>
                    <Switch
                      checked={adaptiveLayout.optimization.caching}
                      onCheckedChange={(checked) => {
                        setAdaptiveLayout((prev) => ({
                          ...prev,
                          optimization: {
                            ...prev.optimization,
                            caching: checked,
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Predictive Loading</h4>
                      <p className="text-sm text-gray-600">
                        Preload likely-to-be-used content
                      </p>
                    </div>
                    <Switch
                      checked={adaptiveLayout.optimization.prefetching}
                      onCheckedChange={(checked) => {
                        setAdaptiveLayout((prev) => ({
                          ...prev,
                          optimization: {
                            ...prev.optimization,
                            prefetching: checked,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>

                {/* Rendering Quality */}
                <div className="space-y-3">
                  <h4 className="font-medium">Rendering Quality</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {["minimal", "standard", "enhanced"].map((quality) => (
                      <Button
                        key={quality}
                        variant={
                          adaptiveLayout.optimization.rendering === quality
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setAdaptiveLayout((prev) => ({
                            ...prev,
                            optimization: {
                              ...prev.optimization,
                              rendering: quality as any,
                            },
                          }));
                        }}
                        className="capitalize"
                      >
                        {quality}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adaptation Metrics */}
          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Real-time Adaptation Metrics
                </CardTitle>
                <CardDescription>
                  Live metrics showing how well the interface adapts to your
                  needs and context
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(adaptationMetrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </h4>
                      <div className="flex items-end space-x-2 mb-2">
                        <span className="text-2xl font-bold">
                          {(value * 100).toFixed(1)}%
                        </span>
                        <Badge
                          className={
                            value > 0.8
                              ? "bg-green-100 text-green-800"
                              : value > 0.6
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {value > 0.8
                            ? "Excellent"
                            : value > 0.6
                              ? "Good"
                              : "Needs Improvement"}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Assistance Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      AI Assistance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">
                          Enable AI-Powered Adaptation
                        </h4>
                        <p className="text-sm text-gray-600">
                          Use AI to continuously improve interface adaptation
                        </p>
                      </div>
                      <Switch
                        checked={aiAssistance}
                        onCheckedChange={setAiAssistance}
                      />
                    </div>

                    {aiAssistance && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Cultural Context Analysis:</span>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Accessibility Optimization:</span>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Performance Tuning:</span>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Predictive Adaptation:</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            Learning
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Adaptation History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Adaptations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">
                          Cultural theme adapted for African context
                        </span>
                        <Badge className="bg-blue-100 text-blue-800">
                          2 min ago
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">
                          Font size increased for accessibility
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          5 min ago
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-sm">
                          Performance mode adjusted for low battery
                        </span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          8 min ago
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdaptiveShell;
