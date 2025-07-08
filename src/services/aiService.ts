import { aiConfig, getAIHeaders } from "../config/aiConfig";
import { fetcher } from "../utils/fetcher";
import type {
  AIRecommendation,
  PortfolioAnalysis,
  AIAdvisorConfig,
  MarketInsight,
} from "../types/AIAdvisor";
import type { RiskAssessment } from "../types/RiskAssessment";
import type { CulturalInvestment } from "../types/CulturalInvestment";

export class AIService {
  private static instance: AIService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheTTL = aiConfig.cache.ttl.recommendations * 1000;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Generate AI-powered investment recommendations
   */
  async generateRecommendations(
    userId: string,
    portfolioData: any,
    config: AIAdvisorConfig,
  ): Promise<AIRecommendation[]> {
    const cacheKey = `recommendations:${userId}:${JSON.stringify(config)}`;

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const prompt = this.buildRecommendationPrompt(portfolioData, config);
      const aiResponse = await this.callOpenAI(prompt);

      // Parse AI response and format as recommendations
      const recommendations = await this.parseRecommendations(
        aiResponse,
        userId,
        config,
      );

      // Validate cultural compliance if required
      if (config.culturalPreferences.length > 0) {
        for (const rec of recommendations) {
          rec.culturalCompliance = await this.validateCulturalCompliance(
            rec.asset,
            config.culturalPreferences,
          );
        }
      }

      // Cache results
      this.setCache(cacheKey, recommendations);

      return recommendations;
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      throw new Error("Failed to generate investment recommendations");
    }
  }

  /**
   * Analyze portfolio with AI
   */
  async analyzePortfolio(
    portfolioData: any,
    benchmarkData?: any,
  ): Promise<PortfolioAnalysis> {
    try {
      const analysis = await this.performPortfolioAnalysis(
        portfolioData,
        benchmarkData,
      );

      // Enhance with AI insights
      const aiInsights = await this.generatePortfolioInsights(
        portfolioData,
        analysis,
      );

      return {
        ...analysis,
        ...aiInsights,
      };
    } catch (error) {
      console.error("Error analyzing portfolio:", error);
      throw new Error("Failed to analyze portfolio");
    }
  }

  /**
   * Get market insights from AI
   */
  async getMarketInsights(
    categories: string[] = ["market", "economic"],
    language: string = "en",
  ): Promise<MarketInsight[]> {
    const cacheKey = `insights:${categories.join(",")}:${language}`;

    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const insights = await Promise.all(
        categories.map((category) =>
          this.fetchCategoryInsights(category, language),
        ),
      );

      const flattenedInsights = insights.flat();
      this.setCache(cacheKey, flattenedInsights);

      return flattenedInsights;
    } catch (error) {
      console.error("Error fetching market insights:", error);
      throw new Error("Failed to fetch market insights");
    }
  }

  /**
   * Assess investment risk using AI
   */
  async assessRisk(
    portfolioData: any,
    userProfile: any,
  ): Promise<RiskAssessment> {
    try {
      // Use Aladdin AI for sophisticated risk assessment
      const aladdinRisk = await this.callAladdinAPI("/risk/analysis", {
        portfolio: portfolioData,
        userProfile,
      });

      // Combine with custom risk calculations
      const customRisk = await this.calculateCustomRisk(
        portfolioData,
        userProfile,
      );

      return this.mergeRiskAssessments(aladdinRisk, customRisk);
    } catch (error) {
      console.error("Error assessing risk:", error);
      throw new Error("Failed to assess portfolio risk");
    }
  }

  /**
   * Screen investments for cultural compliance
   */
  async screenCulturalCompliance(
    assets: string[],
    framework: string,
  ): Promise<Record<string, CulturalInvestment>> {
    const results: Record<string, CulturalInvestment> = {};

    try {
      for (const asset of assets) {
        results[asset] = await this.performCulturalScreening(asset, framework);
      }

      return results;
    } catch (error) {
      console.error("Error screening cultural compliance:", error);
      throw new Error("Failed to screen cultural compliance");
    }
  }

  /**
   * Generate personalized financial education content
   */
  async generateEducationalContent(
    userProfile: any,
    topic: string,
    language: string = "en",
  ): Promise<{
    title: string;
    content: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    culturalContext?: string;
  }> {
    try {
      const prompt = this.buildEducationPrompt(userProfile, topic, language);
      const response = await this.callOpenAI(prompt);

      return this.parseEducationalContent(response, userProfile);
    } catch (error) {
      console.error("Error generating educational content:", error);
      throw new Error("Failed to generate educational content");
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string, model?: string): Promise<any> {
    const headers = getAIHeaders("openai");
    const requestModel = model || aiConfig.openai.model;

    const response = await fetcher.post(
      aiConfig.openai.endpoints.chat,
      {
        model: requestModel,
        messages: [
          {
            role: "system",
            content:
              "You are a sophisticated financial advisor AI with expertise in global markets, cultural finance, and risk management.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: aiConfig.openai.temperature,
        max_tokens: aiConfig.openai.maxTokens,
      },
      { headers },
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Call Aladdin API
   */
  private async callAladdinAPI(endpoint: string, data: any): Promise<any> {
    if (!aiConfig.aladdin.apiKey) {
      throw new Error("Aladdin API key not configured");
    }

    const headers = getAIHeaders("aladdin");
    const url = `${aiConfig.aladdin.baseUrl}${endpoint}`;

    const response = await fetcher.post(url, data, {
      headers,
      timeout: aiConfig.aladdin.timeout,
    });

    return response.data;
  }

  /**
   * Build recommendation prompt for AI
   */
  private buildRecommendationPrompt(
    portfolioData: any,
    config: AIAdvisorConfig,
  ): string {
    return `
      Analyze the following portfolio and provide investment recommendations:

      Portfolio Data: ${JSON.stringify(portfolioData)}
      Risk Tolerance: ${config.riskTolerance}
      Investment Goals: ${config.investmentGoals.join(", ")}
      Time Horizon: ${config.timeHorizon} years
      Cultural Preferences: ${config.culturalPreferences.join(", ")}
      Excluded Sectors: ${config.excludedSectors.join(", ")}

      Please provide 3-5 specific investment recommendations with:
      1. Asset/security name
      2. Recommended action (buy/sell/hold)
      3. Confidence level (0-1)
      4. Expected return estimate
      5. Risk assessment
      6. Reasoning for recommendation
      7. Cultural compliance status

      Format response as JSON array of recommendations.
    `;
  }

  /**
   * Build education prompt for AI
   */
  private buildEducationPrompt(
    userProfile: any,
    topic: string,
    language: string,
  ): string {
    return `
      Create educational content about "${topic}" for a user with the following profile:

      Experience Level: ${userProfile.investmentExperience || "beginner"}
      Cultural Background: ${userProfile.culturalFramework || "general"}
      Language: ${language}

      Please create:
      1. An engaging title
      2. Educational content (500-800 words)
      3. Key takeaways
      4. Practical examples relevant to their cultural context
      5. Next steps for learning

      Make the content culturally sensitive and appropriate for their experience level.
      Format response as JSON with title, content, difficulty, and culturalContext fields.
    `;
  }

  /**
   * Parse AI recommendations response
   */
  private async parseRecommendations(
    aiResponse: string,
    userId: string,
    config: AIAdvisorConfig,
  ): Promise<AIRecommendation[]> {
    try {
      const parsed = JSON.parse(aiResponse);
      const recommendations: AIRecommendation[] = [];

      for (const item of parsed) {
        recommendations.push({
          id: this.generateId(),
          userId,
          type: item.action || "buy",
          asset: item.asset,
          confidence: item.confidence || 0.7,
          reasoning: item.reasoning || "",
          expectedReturn: item.expectedReturn || 0,
          riskScore: item.riskScore || 50,
          timeHorizon: `${config.timeHorizon} years`,
          culturalCompliance: item.culturalCompliance,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
      }

      return recommendations;
    } catch (error) {
      console.error("Error parsing AI recommendations:", error);
      return [];
    }
  }

  /**
   * Parse educational content response
   */
  private parseEducationalContent(response: string, userProfile: any): any {
    try {
      const parsed = JSON.parse(response);
      return {
        title: parsed.title || "Financial Education",
        content: parsed.content || "",
        difficulty: parsed.difficulty || "beginner",
        culturalContext:
          parsed.culturalContext || userProfile.culturalFramework,
      };
    } catch (error) {
      return {
        title: "Financial Education",
        content: response,
        difficulty: "beginner" as const,
      };
    }
  }

  /**
   * Perform portfolio analysis
   */
  private async performPortfolioAnalysis(
    portfolioData: any,
    benchmarkData?: any,
  ): Promise<PortfolioAnalysis> {
    // Basic portfolio metrics calculation
    const totalValue =
      portfolioData.holdings?.reduce(
        (sum: number, holding: any) => sum + holding.marketValue,
        0,
      ) || 0;

    // Risk calculation (simplified)
    const riskScore = this.calculatePortfolioRisk(portfolioData);

    // Diversification score
    const diversificationScore = this.calculateDiversification(portfolioData);

    return {
      totalValue,
      riskScore,
      diversificationScore,
      culturalComplianceScore: 85, // Default value, should be calculated
      expectedAnnualReturn: 8.5, // Default value, should be calculated
      volatility: 15.2, // Default value, should be calculated
      sharpeRatio: 1.2, // Default value, should be calculated
      maxDrawdown: -12.5, // Default value, should be calculated
    };
  }

  /**
   * Generate portfolio insights using AI
   */
  private async generatePortfolioInsights(
    portfolioData: any,
    analysis: PortfolioAnalysis,
  ): Promise<Partial<PortfolioAnalysis>> {
    const prompt = `
      Analyze this portfolio and provide insights:

      Holdings: ${JSON.stringify(portfolioData.holdings?.slice(0, 10))} // Limit for prompt size
      Current Analysis: ${JSON.stringify(analysis)}

      Provide insights on:
      1. Portfolio strengths and weaknesses
      2. Diversification improvements
      3. Risk management suggestions
      4. Expected returns analysis

      Return as JSON with updated metrics and insights.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating portfolio insights:", error);
      return {};
    }
  }

  /**
   * Fetch category-specific insights
   */
  private async fetchCategoryInsights(
    category: string,
    language: string,
  ): Promise<MarketInsight[]> {
    const prompt = `
      Provide 3-5 current market insights for the "${category}" category in ${language}.
      Include:
      1. Title
      2. Summary (100-150 words)
      3. Impact level (high/medium/low)
      4. Relevant assets/sectors
      5. Confidence level (0-1)

      Format as JSON array.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      const parsed = JSON.parse(response);

      return parsed.map((item: any) => ({
        id: this.generateId(),
        title: item.title,
        summary: item.summary,
        category,
        impact: item.impact || "medium",
        relevantAssets: item.relevantAssets || [],
        confidence: item.confidence || 0.7,
        source: "AI Analysis",
        createdAt: new Date(),
      }));
    } catch (error) {
      console.error("Error fetching category insights:", error);
      return [];
    }
  }

  /**
   * Validate cultural compliance
   */
  private async validateCulturalCompliance(
    asset: string,
    culturalPreferences: string[],
  ): Promise<boolean> {
    // This would integrate with cultural screening service
    // For now, return a simplified check
    const prohibitedSectors = ["gambling", "alcohol", "tobacco", "weapons"];
    return !prohibitedSectors.some((sector) =>
      asset.toLowerCase().includes(sector),
    );
  }

  /**
   * Perform cultural screening
   */
  private async performCulturalScreening(
    asset: string,
    framework: string,
  ): Promise<CulturalInvestment> {
    // This would be a comprehensive cultural screening
    // For now, return a basic structure
    return {
      id: this.generateId(),
      name: asset,
      description: `Cultural screening for ${asset}`,
      framework: {
        type: framework as any,
        principles: [],
        guidelines: [],
        authorities: [],
        region: "global",
        language: "en",
      },
      screening: {
        prohibited: [],
        required: [],
        preferred: [],
        thresholds: [],
        methodology: "automated",
        frequency: "daily",
      },
      compliance: {
        score: 85,
        grade: "B+",
        status: "compliant",
        violations: [],
        lastReview: new Date(),
        nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        auditor: "AI System",
      },
      performance: {
        impactScore: 75,
        beneficiaries: 0,
        sdgAlignment: [],
        socialReturn: 0,
        environmentalImpact: [],
        communityFeedback: [],
        reports: [],
      },
      community: {
        stakeholders: [],
        consultations: [],
        partnerships: [],
        feedback: [],
        transparency: [],
      },
      certification: [],
      metadata: {
        targetMarkets: [],
        languages: ["en"],
        currencies: ["USD"],
        regulations: [],
        documentation: [],
        contacts: [],
      },
    };
  }

  /**
   * Calculate custom risk metrics
   */
  private async calculateCustomRisk(
    portfolioData: any,
    userProfile: any,
  ): Promise<any> {
    // Custom risk calculation logic
    return {
      customRiskScore: 65,
      riskFactors: [],
      recommendations: [],
    };
  }

  /**
   * Merge risk assessments
   */
  private mergeRiskAssessments(
    aladdinRisk: any,
    customRisk: any,
  ): RiskAssessment {
    return {
      id: this.generateId(),
      userId: "user_id",
      portfolioId: "portfolio_id",
      overallRiskScore:
        (aladdinRisk.riskScore + customRisk.customRiskScore) / 2,
      riskGrade: "B",
      assessmentDate: new Date(),
      factors: [],
      metrics: {
        valueAtRisk: {
          oneDay: 0,
          oneWeek: 0,
          oneMonth: 0,
          confidenceLevel: 0.95,
          methodology: "historical",
        },
        expectedShortfall: 0,
        maximumDrawdown: 0,
        volatility: {
          realized: 0,
          implied: 0,
          garch: 0,
          period: 252,
          annualized: true,
        },
        beta: 1,
        correlation: {},
        sharpeRatio: 0,
        sortinoRatio: 0,
        calmarRatio: 0,
      },
      recommendations: [],
      scenario: {
        scenarios: [],
        stressTesting: [],
        monteCarlo: {
          simulations: 0,
          timeHorizon: 0,
          outcomes: [],
          percentiles: {},
          shortfallProbability: 0,
        },
      },
      compliance: { score: 0, violations: [], monitoring: [] },
    };
  }

  /**
   * Calculate portfolio risk
   */
  private calculatePortfolioRisk(portfolioData: any): number {
    // Simplified risk calculation
    const holdings = portfolioData.holdings || [];
    if (holdings.length === 0) return 50;

    const avgVolatility =
      holdings.reduce(
        (sum: number, holding: any) => sum + (holding.volatility || 0.15),
        0,
      ) / holdings.length;

    return Math.min(avgVolatility * 100, 100);
  }

  /**
   * Calculate diversification score
   */
  private calculateDiversification(portfolioData: any): number {
    const holdings = portfolioData.holdings || [];
    if (holdings.length === 0) return 0;

    const sectors = new Set(holdings.map((h: any) => h.sector));
    return Math.min((sectors.size / holdings.length) * 100, 100);
  }

  /**
   * Cache utilities
   */
  private getFromCache(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.timestamp + this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `ai_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// Export singleton instance for use throughout the application
export const aiService = AIService.getInstance();

// Export the class for manual instantiation when needed
export default AIService;
