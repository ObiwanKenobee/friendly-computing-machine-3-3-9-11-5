/**
 * Conversational Intelligence Service
 * AI-native UI with natural language processing and financial copilot
 */

import { userMemoryService } from "./userMemoryService";

export interface ConversationContext {
  user_id: string;
  session_id: string;
  language: string;
  archetype: string;
  current_page: string;
  portfolio_state: PortfolioState;
  user_preferences: UserPreferences;
  conversation_history: ConversationTurn[];
  intents: DetectedIntent[];
}

export interface PortfolioState {
  total_value: number;
  available_cash: number;
  positions: Position[];
  performance: PerformanceMetrics;
  risk_profile: RiskProfile;
}

export interface Position {
  asset: string;
  quantity: number;
  current_value: number;
  cost_basis: number;
  unrealized_gain_loss: number;
  allocation_percentage: number;
}

export interface PerformanceMetrics {
  total_return: number;
  ytd_return: number;
  monthly_return: number;
  sharpe_ratio: number;
  max_drawdown: number;
}

export interface RiskProfile {
  risk_score: number;
  volatility: number;
  var_95: number;
  concentration_risk: number;
}

export interface UserPreferences {
  risk_tolerance: "conservative" | "moderate" | "aggressive";
  investment_horizon: "short" | "medium" | "long";
  esg_preference: boolean;
  cultural_values: string[];
  preferred_sectors: string[];
  exclusions: string[];
}

export interface ConversationTurn {
  id: string;
  timestamp: number;
  type: "user" | "assistant";
  content: string;
  intent?: DetectedIntent;
  actions?: ConversationAction[];
  confidence: number;
  context_used: string[];
}

export interface DetectedIntent {
  name: string;
  confidence: number;
  entities: Entity[];
  parameters: Record<string, any>;
  category: "query" | "action" | "education" | "navigation" | "analysis";
}

export interface Entity {
  type: string;
  value: string;
  confidence: number;
  start: number;
  end: number;
}

export interface ConversationAction {
  type:
    | "navigate"
    | "analyze"
    | "invest"
    | "educate"
    | "visualize"
    | "calculate";
  parameters: Record<string, any>;
  description: string;
  confirmation_required: boolean;
}

export interface FinancialCopilotResponse {
  response: string;
  confidence: number;
  reasoning: string[];
  suggestions: Suggestion[];
  actions: ConversationAction[];
  visual_aids?: VisualAid[];
  follow_up_questions: string[];
  personalization_notes: string[];
}

export interface Suggestion {
  type:
    | "investment"
    | "analysis"
    | "education"
    | "optimization"
    | "risk_management";
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  estimated_impact: number;
  risk_level: "low" | "medium" | "high";
  action_text: string;
  action_params: Record<string, any>;
}

export interface VisualAid {
  type: "chart" | "table" | "infographic" | "calculator" | "comparison";
  title: string;
  data: any;
  description: string;
  interactive: boolean;
}

export interface LanguageProfile {
  language: string;
  formality: "casual" | "professional" | "formal";
  complexity: "beginner" | "intermediate" | "advanced" | "expert";
  cultural_context: string[];
  preferred_examples: string[];
  communication_style: "direct" | "contextual" | "relationship_focused";
}

export interface VoiceCapabilities {
  enabled: boolean;
  language: string;
  accent: string;
  speed: number;
  tone: "professional" | "friendly" | "enthusiastic" | "calm";
  voice_id: string;
}

export class ConversationalIntelligenceService {
  private static instance: ConversationalIntelligenceService;
  private conversationContexts: Map<string, ConversationContext> = new Map();
  private languageProfiles: Map<string, LanguageProfile> = new Map();
  private intentClassifier: IntentClassifier;
  private responseGenerator: ResponseGenerator;
  private voiceCapabilities: Map<string, VoiceCapabilities> = new Map();

  private constructor() {
    this.initializeService();
    this.intentClassifier = new IntentClassifier();
    this.responseGenerator = new ResponseGenerator();
  }

  public static getInstance(): ConversationalIntelligenceService {
    if (!ConversationalIntelligenceService.instance) {
      ConversationalIntelligenceService.instance =
        new ConversationalIntelligenceService();
    }
    return ConversationalIntelligenceService.instance;
  }

  private initializeService(): void {
    console.log("🗣️ Initializing Conversational Intelligence Service...");
    this.loadLanguageProfiles();
    this.setupDefaultLanguageProfiles();
  }

  private loadLanguageProfiles(): void {
    // Load saved language profiles
    try {
      const stored = localStorage.getItem("language_profiles");
      if (stored) {
        const profiles = JSON.parse(stored);
        this.languageProfiles = new Map(profiles);
      }
    } catch (error) {
      console.warn("Failed to load language profiles:", error);
    }
  }

  private setupDefaultLanguageProfiles(): void {
    const defaultProfiles: LanguageProfile[] = [
      {
        language: "en-US",
        formality: "professional",
        complexity: "intermediate",
        cultural_context: [
          "western",
          "individualistic",
          "direct_communication",
        ],
        preferred_examples: ["tech_stocks", "real_estate", "401k"],
        communication_style: "direct",
      },
      {
        language: "en-GB",
        formality: "formal",
        complexity: "advanced",
        cultural_context: ["western", "conservative", "understated"],
        preferred_examples: ["ftse", "isa", "pension_schemes"],
        communication_style: "contextual",
      },
      {
        language: "es-ES",
        formality: "professional",
        complexity: "intermediate",
        cultural_context: [
          "mediterranean",
          "relationship_focused",
          "family_oriented",
        ],
        preferred_examples: ["ibex35", "fondos_inversion", "planes_pensiones"],
        communication_style: "relationship_focused",
      },
      {
        language: "zh-CN",
        formality: "formal",
        complexity: "advanced",
        cultural_context: ["eastern", "collective", "long_term_thinking"],
        preferred_examples: [
          "a_shares",
          "wealth_management",
          "guanxi_networks",
        ],
        communication_style: "contextual",
      },
      {
        language: "ar-SA",
        formality: "formal",
        complexity: "intermediate",
        cultural_context: [
          "middle_eastern",
          "islamic_finance",
          "community_oriented",
        ],
        preferred_examples: ["sukuk", "sharia_compliant", "waqf"],
        communication_style: "relationship_focused",
      },
    ];

    defaultProfiles.forEach((profile) => {
      this.languageProfiles.set(profile.language, profile);
    });
  }

  // Main Conversation Methods

  public async processUserInput(
    userId: string,
    input: string,
    context?: Partial<ConversationContext>,
  ): Promise<FinancialCopilotResponse> {
    // Get or create conversation context
    const conversationContext = this.getOrCreateContext(userId, context);

    // Detect intent and entities
    const intent = await this.intentClassifier.classifyIntent(
      input,
      conversationContext,
    );

    // Create conversation turn
    const turn: ConversationTurn = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: "user",
      content: input,
      intent,
      confidence: intent.confidence,
      context_used: this.getRelevantContext(conversationContext, intent),
    };

    // Add to conversation history
    conversationContext.conversation_history.push(turn);

    // Generate response
    const response = await this.generateResponse(conversationContext, intent);

    // Add assistant turn
    const assistantTurn: ConversationTurn = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: "assistant",
      content: response.response,
      actions: response.actions,
      confidence: response.confidence,
      context_used: response.personalization_notes,
    };

    conversationContext.conversation_history.push(assistantTurn);

    // Update context
    this.conversationContexts.set(userId, conversationContext);

    return response;
  }

  public async generateResponse(
    context: ConversationContext,
    intent: DetectedIntent,
  ): Promise<FinancialCopilotResponse> {
    const languageProfile =
      this.languageProfiles.get(context.language) ||
      this.languageProfiles.get("en-US")!;

    // Get user's behavior patterns for personalization
    const behaviorPatterns = userMemoryService.getBehaviorPatterns(
      context.user_id,
    );
    const recentDecisions = userMemoryService.getDecisionChain(
      context.user_id,
      7 * 24 * 60 * 60 * 1000,
    );

    switch (intent.category) {
      case "query":
        return this.handleQueryIntent(
          context,
          intent,
          languageProfile,
          behaviorPatterns,
        );

      case "action":
        return this.handleActionIntent(context, intent, languageProfile);

      case "education":
        return this.handleEducationIntent(context, intent, languageProfile);

      case "navigation":
        return this.handleNavigationIntent(context, intent, languageProfile);

      case "analysis":
        return this.handleAnalysisIntent(
          context,
          intent,
          languageProfile,
          recentDecisions,
        );

      default:
        return this.handleGeneralIntent(context, intent, languageProfile);
    }
  }

  private async handleQueryIntent(
    context: ConversationContext,
    intent: DetectedIntent,
    profile: LanguageProfile,
    patterns: any[],
  ): Promise<FinancialCopilotResponse> {
    const { portfolio_state, user_preferences } = context;

    // Extract query specifics
    const queryType = intent.parameters.query_type || "general";
    const timeframe = intent.parameters.timeframe || "current";
    const asset = intent.parameters.asset;

    let response = "";
    const suggestions: Suggestion[] = [];
    const actions: ConversationAction[] = [];
    const visualAids: VisualAid[] = [];

    switch (queryType) {
      case "performance":
        response = this.generatePerformanceResponse(
          portfolio_state,
          timeframe,
          profile,
        );
        visualAids.push({
          type: "chart",
          title: "Portfolio Performance",
          data: this.generatePerformanceChartData(portfolio_state, timeframe),
          description: `Your portfolio performance over ${timeframe}`,
          interactive: true,
        });
        break;

      case "allocation":
        response = this.generateAllocationResponse(portfolio_state, profile);
        visualAids.push({
          type: "chart",
          title: "Asset Allocation",
          data: this.generateAllocationChartData(portfolio_state),
          description: "Current portfolio allocation breakdown",
          interactive: true,
        });
        break;

      case "risk":
        response = this.generateRiskResponse(portfolio_state, profile);
        suggestions.push({
          type: "risk_management",
          title: "Optimize Risk Profile",
          description: "Adjust portfolio to better match your risk tolerance",
          priority: "medium",
          estimated_impact: 0.15,
          risk_level: "low",
          action_text: "Review Risk Settings",
          action_params: { action: "navigate", path: "/risk-profile" },
        });
        break;

      case "opportunities":
        response = this.generateOpportunitiesResponse(
          user_preferences,
          patterns,
          profile,
        );
        suggestions.push(
          ...this.generateOpportunitySuggestions(user_preferences, patterns),
        );
        break;

      default:
        response = this.generateGeneralQueryResponse(
          intent.parameters,
          profile,
        );
    }

    return {
      response,
      confidence: 0.85,
      reasoning: [
        `Analyzed ${queryType} query`,
        `Used ${profile.language} profile`,
        "Applied user preferences",
      ],
      suggestions,
      actions,
      visual_aids: visualAids,
      follow_up_questions: this.generateFollowUpQuestions(queryType, profile),
      personalization_notes: [
        `Adapted for ${profile.complexity} level`,
        `Used ${profile.communication_style} style`,
      ],
    };
  }

  private async handleActionIntent(
    context: ConversationContext,
    intent: DetectedIntent,
    profile: LanguageProfile,
  ): Promise<FinancialCopilotResponse> {
    const action = intent.parameters.action;
    const amount = intent.parameters.amount;
    const asset = intent.parameters.asset;

    const actions: ConversationAction[] = [];
    let response = "";

    switch (action) {
      case "invest":
        if (amount && asset) {
          actions.push({
            type: "invest",
            parameters: { amount, asset },
            description: `Invest $${amount} in ${asset}`,
            confirmation_required: true,
          });
          response = `I can help you invest $${amount} in ${asset}. Let me show you the details first.`;
        } else {
          response =
            "I need more information. How much would you like to invest and in which asset?";
        }
        break;

      case "rebalance":
        actions.push({
          type: "analyze",
          parameters: { type: "rebalancing" },
          description: "Analyze portfolio for rebalancing opportunities",
          confirmation_required: false,
        });
        response =
          "Let me analyze your current allocation and suggest rebalancing options.";
        break;

      case "sell":
        if (asset) {
          actions.push({
            type: "invest",
            parameters: { action: "sell", asset, amount },
            description: `Sell ${amount || "some"} ${asset}`,
            confirmation_required: true,
          });
          response = `I'll help you sell ${asset}. Let me check your current position first.`;
        }
        break;

      default:
        response = `I understand you want to ${action}. Let me help you with that.`;
    }

    return {
      response,
      confidence: 0.9,
      reasoning: [`Identified ${action} action`, "Prepared execution steps"],
      suggestions: [],
      actions,
      follow_up_questions: [
        `Do you want to proceed with ${action}?`,
        "Would you like to see more details first?",
      ],
      personalization_notes: [`Action complexity: ${profile.complexity}`],
    };
  }

  private async handleEducationIntent(
    context: ConversationContext,
    intent: DetectedIntent,
    profile: LanguageProfile,
  ): Promise<FinancialCopilotResponse> {
    const topic = intent.parameters.topic || "general";
    const level = profile.complexity;

    const educationalContent = this.generateEducationalContent(
      topic,
      level,
      profile,
    );

    return {
      response: educationalContent.explanation,
      confidence: 0.8,
      reasoning: [`Generated ${level} level content`, `Topic: ${topic}`],
      suggestions: educationalContent.suggestions,
      actions: [
        {
          type: "educate",
          parameters: { topic, level },
          description: `Learn more about ${topic}`,
          confirmation_required: false,
        },
      ],
      visual_aids: educationalContent.visualAids,
      follow_up_questions: educationalContent.followUpQuestions,
      personalization_notes: [
        `Adapted for ${level} level`,
        `Cultural context: ${profile.cultural_context.join(", ")}`,
      ],
    };
  }

  private async handleNavigationIntent(
    context: ConversationContext,
    intent: DetectedIntent,
    profile: LanguageProfile,
  ): Promise<FinancialCopilotResponse> {
    const destination = intent.parameters.destination;
    const feature = intent.parameters.feature;

    const navigationMap: Record<string, string> = {
      portfolio: "/portfolio",
      dashboard: "/",
      investments: "/investments",
      analytics: "/analytics",
      settings: "/settings",
      profile: "/profile",
      help: "/help",
      pricing: "/pricing",
      enterprise: "/enterprise-innovations",
    };

    const path = navigationMap[destination] || "/";

    return {
      response: `I'll take you to ${destination}. ${this.getNavigationDescription(destination, profile)}`,
      confidence: 0.95,
      reasoning: [`Navigation to ${destination}`, "Clear user intent"],
      suggestions: [],
      actions: [
        {
          type: "navigate",
          parameters: { path },
          description: `Navigate to ${destination}`,
          confirmation_required: false,
        },
      ],
      follow_up_questions: [`What would you like to do in ${destination}?`],
      personalization_notes: [
        `Navigation adapted for ${profile.formality} style`,
      ],
    };
  }

  private async handleAnalysisIntent(
    context: ConversationContext,
    intent: DetectedIntent,
    profile: LanguageProfile,
    recentDecisions: any[],
  ): Promise<FinancialCopilotResponse> {
    const analysisType = intent.parameters.analysis_type;
    const timeframe = intent.parameters.timeframe || "1month";

    const analysisResults = this.performAnalysis(
      analysisType,
      context.portfolio_state,
      recentDecisions,
      timeframe,
    );

    return {
      response: analysisResults.summary,
      confidence: 0.88,
      reasoning: [
        `Performed ${analysisType} analysis`,
        `Used ${timeframe} timeframe`,
        "Incorporated recent decisions",
      ],
      suggestions: analysisResults.suggestions,
      actions: analysisResults.actions,
      visual_aids: analysisResults.visualAids,
      follow_up_questions: analysisResults.followUpQuestions,
      personalization_notes: [
        `Analysis depth: ${profile.complexity}`,
        `Communication: ${profile.communication_style}`,
      ],
    };
  }

  private async handleGeneralIntent(
    context: ConversationContext,
    intent: DetectedIntent,
    profile: LanguageProfile,
  ): Promise<FinancialCopilotResponse> {
    const fallbackResponses = this.generateContextualFallback(context, profile);

    return {
      response: fallbackResponses.message,
      confidence: 0.6,
      reasoning: ["Fallback response", "General intent detected"],
      suggestions: fallbackResponses.suggestions,
      actions: [],
      follow_up_questions: fallbackResponses.questions,
      personalization_notes: [
        `Language: ${profile.language}`,
        `Style: ${profile.communication_style}`,
      ],
    };
  }

  // Voice Capabilities

  public enableVoice(userId: string, capabilities: VoiceCapabilities): void {
    this.voiceCapabilities.set(userId, capabilities);
    console.log(`🎤 Voice enabled for user ${userId}:`, capabilities.language);
  }

  public async processVoiceInput(
    userId: string,
    audioBlob: Blob,
  ): Promise<FinancialCopilotResponse> {
    try {
      // In a real implementation, this would use a speech-to-text service
      const transcript = await this.speechToText(audioBlob);
      return this.processUserInput(userId, transcript);
    } catch (error) {
      console.error("Voice processing error:", error);
      return {
        response:
          "Sorry, I had trouble understanding your voice input. Could you try typing instead?",
        confidence: 0.1,
        reasoning: ["Voice processing failed"],
        suggestions: [],
        actions: [],
        follow_up_questions: ["Would you like to try typing your question?"],
        personalization_notes: ["Voice processing error"],
      };
    }
  }

  public async textToSpeech(
    userId: string,
    text: string,
  ): Promise<AudioBuffer | null> {
    const voiceSettings = this.voiceCapabilities.get(userId);
    if (!voiceSettings?.enabled) return null;

    try {
      // In a real implementation, this would use a text-to-speech service
      console.log(`🔊 Converting to speech: "${text.substring(0, 50)}..."`);
      // Return mock audio buffer
      return null;
    } catch (error) {
      console.error("Text-to-speech error:", error);
      return null;
    }
  }

  // Helper Methods

  private getOrCreateContext(
    userId: string,
    partialContext?: Partial<ConversationContext>,
  ): ConversationContext {
    let context = this.conversationContexts.get(userId);

    if (!context) {
      context = {
        user_id: userId,
        session_id: this.generateId(),
        language: "en-US",
        archetype: "Professional Investor",
        current_page: "/",
        portfolio_state: this.getDefaultPortfolioState(),
        user_preferences: this.getDefaultUserPreferences(),
        conversation_history: [],
        intents: [],
      };
    }

    // Merge with partial context if provided
    if (partialContext) {
      context = { ...context, ...partialContext };
    }

    return context;
  }

  private getDefaultPortfolioState(): PortfolioState {
    return {
      total_value: 100000,
      available_cash: 10000,
      positions: [
        {
          asset: "VTI",
          quantity: 100,
          current_value: 25000,
          cost_basis: 24000,
          unrealized_gain_loss: 1000,
          allocation_percentage: 25,
        },
        {
          asset: "BND",
          quantity: 200,
          current_value: 20000,
          cost_basis: 20500,
          unrealized_gain_loss: -500,
          allocation_percentage: 20,
        },
      ],
      performance: {
        total_return: 0.08,
        ytd_return: 0.12,
        monthly_return: 0.02,
        sharpe_ratio: 1.2,
        max_drawdown: -0.15,
      },
      risk_profile: {
        risk_score: 65,
        volatility: 0.18,
        var_95: -0.08,
        concentration_risk: 0.3,
      },
    };
  }

  private getDefaultUserPreferences(): UserPreferences {
    return {
      risk_tolerance: "moderate",
      investment_horizon: "long",
      esg_preference: false,
      cultural_values: [],
      preferred_sectors: ["technology", "healthcare"],
      exclusions: ["tobacco", "weapons"],
    };
  }

  private async speechToText(audioBlob: Blob): Promise<string> {
    // Mock implementation - in production, use a real STT service
    return "What is my portfolio performance?";
  }

  private generateId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Content Generation Methods (these would be more sophisticated in production)

  private generatePerformanceResponse(
    portfolio: PortfolioState,
    timeframe: string,
    profile: LanguageProfile,
  ): string {
    const perf = portfolio.performance;
    const formality = profile.formality === "formal" ? "formal" : "casual";

    if (formality === "formal") {
      return (
        `Your portfolio performance for the ${timeframe} period shows a total return of ${(perf.total_return * 100).toFixed(1)}%. ` +
        `Year-to-date returns stand at ${(perf.ytd_return * 100).toFixed(1)}%, with a Sharpe ratio of ${perf.sharpe_ratio.toFixed(2)}.`
      );
    } else {
      return (
        `Looking good! Your portfolio is up ${(perf.total_return * 100).toFixed(1)}% overall. ` +
        `This year you're ahead by ${(perf.ytd_return * 100).toFixed(1)}%. Pretty solid performance!`
      );
    }
  }

  private generateAllocationResponse(
    portfolio: PortfolioState,
    profile: LanguageProfile,
  ): string {
    const positions = portfolio.positions;
    const topPosition = positions.reduce((max, pos) =>
      pos.allocation_percentage > max.allocation_percentage ? pos : max,
    );

    return (
      `Your largest position is ${topPosition.asset} at ${topPosition.allocation_percentage}% of your portfolio. ` +
      `You have ${positions.length} different positions totaling $${portfolio.total_value.toLocaleString()}.`
    );
  }

  private generateRiskResponse(
    portfolio: PortfolioState,
    profile: LanguageProfile,
  ): string {
    const risk = portfolio.risk_profile;
    return (
      `Your portfolio has a risk score of ${risk.risk_score}/100 with ${(risk.volatility * 100).toFixed(1)}% volatility. ` +
      `Your 95% Value at Risk is ${(Math.abs(risk.var_95) * 100).toFixed(1)}%.`
    );
  }

  private generateOpportunitiesResponse(
    preferences: UserPreferences,
    patterns: any[],
    profile: LanguageProfile,
  ): string {
    const sectors = preferences.preferred_sectors.join(" and ");
    return (
      `Based on your interest in ${sectors} and recent market conditions, I see several opportunities. ` +
      `Let me show you some investments that match your profile.`
    );
  }

  private generateEducationalContent(
    topic: string,
    level: string,
    profile: LanguageProfile,
  ): any {
    // This would be much more sophisticated in production
    return {
      explanation: `Here's what you need to know about ${topic}...`,
      suggestions: [],
      visualAids: [],
      followUpQuestions: [`Would you like to learn more about ${topic}?`],
    };
  }

  private getNavigationDescription(
    destination: string,
    profile: LanguageProfile,
  ): string {
    const descriptions: Record<string, string> = {
      portfolio:
        "You can view your holdings, performance, and allocation there.",
      dashboard: "Your main overview with key metrics and recent activity.",
      investments: "Browse and research new investment opportunities.",
      analytics: "Deep dive into your performance and risk metrics.",
    };

    return descriptions[destination] || "You can explore more features there.";
  }

  // Additional helper methods would go here...

  private getRelevantContext(
    context: ConversationContext,
    intent: DetectedIntent,
  ): string[] {
    return ["portfolio_state", "user_preferences", "conversation_history"];
  }

  private generateFollowUpQuestions(
    queryType: string,
    profile: LanguageProfile,
  ): string[] {
    const questions: Record<string, string[]> = {
      performance: [
        "Would you like to see a detailed breakdown?",
        "Any specific time period you want to analyze?",
      ],
      allocation: [
        "Should we look at rebalancing options?",
        "Want to see how this compares to your target allocation?",
      ],
      risk: [
        "Would you like to adjust your risk profile?",
        "Should we explore ways to optimize risk?",
      ],
    };

    return (
      questions[queryType] || [
        "What else would you like to know?",
        "How can I help you further?",
      ]
    );
  }

  private generateOpportunitySuggestions(
    preferences: UserPreferences,
    patterns: any[],
  ): Suggestion[] {
    return [
      {
        type: "investment",
        title: "ESG Tech Fund",
        description: "Sustainable technology investments matching your values",
        priority: "medium",
        estimated_impact: 0.12,
        risk_level: "medium",
        action_text: "Learn More",
        action_params: { action: "research", asset: "ESG_TECH_ETF" },
      },
    ];
  }

  private performAnalysis(
    type: string,
    portfolio: PortfolioState,
    decisions: any[],
    timeframe: string,
  ): any {
    return {
      summary: `Analysis complete. Your ${type} analysis shows...`,
      suggestions: [],
      actions: [],
      visualAids: [],
      followUpQuestions: [
        `Would you like to drill down into any specific area?`,
      ],
    };
  }

  private generateContextualFallback(
    context: ConversationContext,
    profile: LanguageProfile,
  ): any {
    return {
      message:
        "I'm here to help with your investments. What would you like to know?",
      suggestions: [],
      questions: [
        "How can I help you today?",
        "Would you like to see your portfolio?",
      ],
    };
  }

  private generatePerformanceChartData(
    portfolio: PortfolioState,
    timeframe: string,
  ): any {
    // Mock chart data
    return {
      type: "line",
      data: [
        { date: "2024-01-01", value: 95000 },
        { date: "2024-02-01", value: 98000 },
        { date: "2024-03-01", value: portfolio.total_value },
      ],
    };
  }

  private generateAllocationChartData(portfolio: PortfolioState): any {
    return {
      type: "pie",
      data: portfolio.positions.map((pos) => ({
        label: pos.asset,
        value: pos.allocation_percentage,
      })),
    };
  }
}

// Intent Classifier (simplified implementation)
class IntentClassifier {
  async classifyIntent(
    input: string,
    context: ConversationContext,
  ): Promise<DetectedIntent> {
    const lowerInput = input.toLowerCase();

    // Simple rule-based classification (in production, use ML models)
    if (
      lowerInput.includes("performance") ||
      lowerInput.includes("how am i doing")
    ) {
      return {
        name: "query_performance",
        confidence: 0.9,
        entities: this.extractEntities(input),
        parameters: { query_type: "performance" },
        category: "query",
      };
    }

    if (lowerInput.includes("invest") || lowerInput.includes("buy")) {
      return {
        name: "action_invest",
        confidence: 0.85,
        entities: this.extractEntities(input),
        parameters: { action: "invest" },
        category: "action",
      };
    }

    if (
      lowerInput.includes("allocation") ||
      lowerInput.includes("portfolio breakdown")
    ) {
      return {
        name: "query_allocation",
        confidence: 0.8,
        entities: this.extractEntities(input),
        parameters: { query_type: "allocation" },
        category: "query",
      };
    }

    // Default intent
    return {
      name: "general_query",
      confidence: 0.5,
      entities: this.extractEntities(input),
      parameters: {},
      category: "query",
    };
  }

  private extractEntities(input: string): Entity[] {
    const entities: Entity[] = [];

    // Extract dollar amounts
    const amountMatch = input.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (amountMatch) {
      entities.push({
        type: "amount",
        value: amountMatch[1],
        confidence: 0.9,
        start: amountMatch.index || 0,
        end: (amountMatch.index || 0) + amountMatch[0].length,
      });
    }

    // Extract stock symbols (simplified)
    const symbolMatch = input.match(/\b[A-Z]{2,5}\b/);
    if (symbolMatch) {
      entities.push({
        type: "asset",
        value: symbolMatch[0],
        confidence: 0.7,
        start: symbolMatch.index || 0,
        end: (symbolMatch.index || 0) + symbolMatch[0].length,
      });
    }

    return entities;
  }
}

// Response Generator (simplified implementation)
class ResponseGenerator {
  // This would contain more sophisticated response generation logic
}

// Export singleton instance
export const conversationalIntelligenceService =
  ConversationalIntelligenceService.getInstance();
