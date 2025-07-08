/**
 * User Memory Service
 * Reconstructs decision chains, tracks behavior patterns, and provides continuity
 */

export interface UserDecision {
  id: string;
  timestamp: number;
  type:
    | "investment"
    | "portfolio_change"
    | "research"
    | "education"
    | "settings"
    | "interaction";
  action: string;
  context: DecisionContext;
  outcome?: DecisionOutcome;
  reasoning: string[];
  confidence: number;
  impact: "low" | "medium" | "high" | "critical";
  tags: string[];
}

export interface DecisionContext {
  page: string;
  archetype: string;
  session_id: string;
  user_state: UserState;
  market_conditions: MarketConditions;
  external_factors: string[];
  ai_recommendations: AIRecommendation[];
}

export interface UserState {
  risk_tolerance: number;
  portfolio_value: number;
  available_capital: number;
  investment_goals: string[];
  preferences: UserPreferences;
  experience_level: "beginner" | "intermediate" | "advanced" | "expert";
  engagement_score: number;
}

export interface UserPreferences {
  esg_focus: boolean;
  cultural_values: string[];
  geographic_preference: string[];
  sector_preferences: string[];
  risk_appetite: "conservative" | "moderate" | "aggressive";
  automation_level: "manual" | "assisted" | "automated";
}

export interface MarketConditions {
  volatility: number;
  trend: "bull" | "bear" | "sideways";
  sector_performance: Record<string, number>;
  global_events: string[];
  sentiment: number;
}

export interface AIRecommendation {
  id: string;
  type: string;
  message: string;
  confidence: number;
  reasoning: string[];
  priority: "low" | "medium" | "high" | "urgent";
}

export interface DecisionOutcome {
  financial_impact: number;
  satisfaction_score: number;
  lessons_learned: string[];
  follow_up_actions: string[];
  success_metrics: Record<string, number>;
}

export interface UserJourney {
  id: string;
  user_id: string;
  start_date: number;
  end_date?: number;
  status: "active" | "completed" | "abandoned" | "paused";
  goal: string;
  progress: number;
  milestones: Milestone[];
  decisions: UserDecision[];
  story_elements: StoryElement[];
  insights: JourneyInsight[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  target_date: number;
  completed_date?: number;
  status: "pending" | "in_progress" | "completed" | "missed";
  success_criteria: SuccessCriteria[];
  celebration?: CelebrationEvent;
}

export interface SuccessCriteria {
  metric: string;
  target_value: number;
  current_value: number;
  unit: string;
  weight: number;
}

export interface CelebrationEvent {
  type: "achievement" | "progress" | "breakthrough" | "learning";
  message: string;
  visual_element: string;
  share_options: string[];
}

export interface StoryElement {
  id: string;
  timestamp: number;
  type: "impact" | "learning" | "achievement" | "challenge" | "insight";
  title: string;
  description: string;
  emotional_tone: "positive" | "negative" | "neutral" | "mixed";
  impact_metrics: ImpactMetrics;
  visual_data?: VisualData;
}

export interface ImpactMetrics {
  financial_return: number;
  social_impact: number;
  environmental_impact: number;
  personal_growth: number;
  knowledge_gained: number;
}

export interface VisualData {
  chart_type: "line" | "bar" | "pie" | "area" | "scatter";
  data_points: DataPoint[];
  highlights: string[];
  annotations: Annotation[];
}

export interface DataPoint {
  x: number;
  y: number;
  label?: string;
  metadata?: any;
}

export interface Annotation {
  x: number;
  y: number;
  text: string;
  type: "success" | "warning" | "info" | "error";
}

export interface JourneyInsight {
  id: string;
  type: "pattern" | "recommendation" | "warning" | "opportunity" | "reflection";
  message: string;
  confidence: number;
  data_points: string[];
  actionable: boolean;
  action_items?: string[];
}

export interface BehaviorPattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  strength: number;
  predictive_power: number;
  triggers: string[];
  outcomes: string[];
  recommendations: string[];
}

export interface ReengagementPrompt {
  id: string;
  type: "completion" | "opportunity" | "education" | "social" | "achievement";
  message: string;
  urgency: "low" | "medium" | "high";
  context: any;
  actions: ReengagementAction[];
  timing: ReengagementTiming;
}

export interface ReengagementAction {
  label: string;
  action: string;
  estimated_time: number;
  difficulty: "easy" | "medium" | "hard";
  value_proposition: string;
}

export interface ReengagementTiming {
  optimal_time: number;
  frequency: number;
  conditions: string[];
}

export class UserMemoryService {
  private static instance: UserMemoryService;
  private userDecisions: Map<string, UserDecision[]> = new Map();
  private userJourneys: Map<string, UserJourney[]> = new Map();
  private behaviorPatterns: Map<string, BehaviorPattern[]> = new Map();
  private reengagementPrompts: Map<string, ReengagementPrompt[]> = new Map();

  private constructor() {
    this.initializeService();
  }

  public static getInstance(): UserMemoryService {
    if (!UserMemoryService.instance) {
      UserMemoryService.instance = new UserMemoryService();
    }
    return UserMemoryService.instance;
  }

  private initializeService(): void {
    console.log("🧠 Initializing User Memory Service...");
    this.loadStoredMemories();
    this.startPeriodicAnalysis();
  }

  private loadStoredMemories(): void {
    try {
      const stored = localStorage.getItem("user_memories");
      if (stored) {
        const data = JSON.parse(stored);
        this.userDecisions = new Map(data.decisions || []);
        this.userJourneys = new Map(data.journeys || []);
        this.behaviorPatterns = new Map(data.patterns || []);
        console.log("📚 Loaded user memories from storage");
      }
    } catch (error) {
      console.warn("Failed to load stored memories:", error);
    }
  }

  private persistMemories(): void {
    try {
      const data = {
        decisions: Array.from(this.userDecisions.entries()),
        journeys: Array.from(this.userJourneys.entries()),
        patterns: Array.from(this.behaviorPatterns.entries()),
        timestamp: Date.now(),
      };
      localStorage.setItem("user_memories", JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to persist memories:", error);
    }
  }

  private startPeriodicAnalysis(): void {
    // Analyze patterns every 5 minutes
    setInterval(() => {
      this.analyzeAllUserPatterns();
    }, 300000);

    // Generate re-engagement prompts every hour
    setInterval(() => {
      this.generateReengagementPrompts();
    }, 3600000);

    // Persist memories every 2 minutes
    setInterval(() => {
      this.persistMemories();
    }, 120000);
  }

  // Core Memory Functions

  public recordDecision(
    userId: string,
    decision: Omit<UserDecision, "id" | "timestamp">,
  ): string {
    const decisionId = this.generateId();
    const fullDecision: UserDecision = {
      id: decisionId,
      timestamp: Date.now(),
      ...decision,
    };

    if (!this.userDecisions.has(userId)) {
      this.userDecisions.set(userId, []);
    }

    this.userDecisions.get(userId)!.push(fullDecision);

    // Trigger pattern analysis
    this.analyzeUserPatterns(userId);

    console.log(`📝 Recorded decision for user ${userId}:`, decision.action);
    return decisionId;
  }

  public getDecisionChain(userId: string, timeframe?: number): UserDecision[] {
    const decisions = this.userDecisions.get(userId) || [];

    if (timeframe) {
      const cutoff = Date.now() - timeframe;
      return decisions.filter((d) => d.timestamp >= cutoff);
    }

    return decisions.sort((a, b) => b.timestamp - a.timestamp);
  }

  public reconstructUserStory(
    userId: string,
    timeframe?: number,
  ): StoryElement[] {
    const decisions = this.getDecisionChain(userId, timeframe);
    const story: StoryElement[] = [];

    for (const decision of decisions) {
      if (decision.outcome) {
        const storyElement: StoryElement = {
          id: this.generateId(),
          timestamp: decision.timestamp,
          type: this.categorizeDecisionType(decision),
          title: this.generateStoryTitle(decision),
          description: this.generateStoryDescription(decision),
          emotional_tone: this.analyzeEmotionalTone(decision),
          impact_metrics: this.calculateImpactMetrics(decision),
          visual_data: this.generateVisualData(decision),
        };

        story.push(storyElement);
      }
    }

    return story.sort((a, b) => b.timestamp - a.timestamp);
  }

  public createUserJourney(userId: string, goal: string): string {
    const journeyId = this.generateId();
    const journey: UserJourney = {
      id: journeyId,
      user_id: userId,
      start_date: Date.now(),
      status: "active",
      goal,
      progress: 0,
      milestones: this.generateMilestones(goal),
      decisions: [],
      story_elements: [],
      insights: [],
    };

    if (!this.userJourneys.has(userId)) {
      this.userJourneys.set(userId, []);
    }

    this.userJourneys.get(userId)!.push(journey);
    console.log(`🎯 Created new journey for user ${userId}: ${goal}`);

    return journeyId;
  }

  public updateJourneyProgress(
    userId: string,
    journeyId: string,
    progress: number,
  ): void {
    const journeys = this.userJourneys.get(userId) || [];
    const journey = journeys.find((j) => j.id === journeyId);

    if (journey) {
      journey.progress = progress;
      journey.insights.push(this.generateProgressInsight(journey));

      // Check for milestone completion
      this.checkMilestones(journey);

      console.log(`📈 Updated journey progress: ${progress}%`);
    }
  }

  public analyzeUserPatterns(userId: string): BehaviorPattern[] {
    const decisions = this.userDecisions.get(userId) || [];
    const patterns: BehaviorPattern[] = [];

    // Analyze decision timing patterns
    patterns.push(...this.analyzeTimingPatterns(decisions));

    // Analyze investment preferences
    patterns.push(...this.analyzeInvestmentPatterns(decisions));

    // Analyze risk behavior
    patterns.push(...this.analyzeRiskPatterns(decisions));

    // Analyze engagement patterns
    patterns.push(...this.analyzeEngagementPatterns(decisions));

    this.behaviorPatterns.set(userId, patterns);
    return patterns;
  }

  public generateReengagementPrompt(userId: string): ReengagementPrompt | null {
    const decisions = this.getDecisionChain(userId, 7 * 24 * 60 * 60 * 1000); // Last 7 days
    const journeys = this.userJourneys.get(userId) || [];

    // Check for incomplete actions
    const incompleteJourneys = journeys.filter(
      (j) => j.status === "active" && j.progress < 100,
    );

    if (incompleteJourneys.length > 0) {
      const journey = incompleteJourneys[0];
      return {
        id: this.generateId(),
        type: "completion",
        message: `You're ${journey.progress}% of the way to "${journey.goal}". Ready to continue?`,
        urgency: journey.progress > 50 ? "medium" : "low",
        context: { journey_id: journey.id, progress: journey.progress },
        actions: [
          {
            label: "Continue Journey",
            action: "resume_journey",
            estimated_time: 10,
            difficulty: "easy",
            value_proposition: "Complete your investment goal",
          },
          {
            label: "View Progress",
            action: "view_journey",
            estimated_time: 2,
            difficulty: "easy",
            value_proposition: "See how far you've come",
          },
        ],
        timing: {
          optimal_time: this.calculateOptimalTime(userId),
          frequency: 2,
          conditions: ["user_online", "good_market_conditions"],
        },
      };
    }

    // Check for missed opportunities
    const patterns = this.behaviorPatterns.get(userId) || [];
    const opportunityPattern = patterns.find((p) =>
      p.name.includes("opportunity"),
    );

    if (opportunityPattern) {
      return {
        id: this.generateId(),
        type: "opportunity",
        message:
          "New investment opportunities match your interests. Take a look?",
        urgency: "medium",
        context: { pattern: opportunityPattern },
        actions: [
          {
            label: "View Opportunities",
            action: "view_opportunities",
            estimated_time: 5,
            difficulty: "easy",
            value_proposition: "Discover new investments",
          },
        ],
        timing: {
          optimal_time: this.calculateOptimalTime(userId),
          frequency: 1,
          conditions: ["market_opportunity", "user_available"],
        },
      };
    }

    return null;
  }

  // Visual Storytelling

  public generateInvestmentStoryline(userId: string): VisualData {
    const decisions = this.getDecisionChain(userId);
    const investmentDecisions = decisions.filter(
      (d) => d.type === "investment",
    );

    const dataPoints: DataPoint[] = investmentDecisions.map(
      (decision, index) => ({
        x: decision.timestamp,
        y: decision.outcome?.financial_impact || 0,
        label: decision.action,
        metadata: {
          confidence: decision.confidence,
          impact: decision.impact,
          reasoning: decision.reasoning,
        },
      }),
    );

    const annotations: Annotation[] = investmentDecisions
      .filter((d) => d.impact === "high" || d.impact === "critical")
      .map((d) => ({
        x: d.timestamp,
        y: d.outcome?.financial_impact || 0,
        text:
          d.impact === "critical" ? "🎯 Major Decision" : "📈 Important Move",
        type:
          d.outcome?.financial_impact && d.outcome.financial_impact > 0
            ? "success"
            : "warning",
      }));

    return {
      chart_type: "line",
      data_points: dataPoints,
      highlights: this.generateHighlights(investmentDecisions),
      annotations,
    };
  }

  public generateJourneyVisualization(
    userId: string,
    journeyId: string,
  ): VisualData | null {
    const journeys = this.userJourneys.get(userId) || [];
    const journey = journeys.find((j) => j.id === journeyId);

    if (!journey) return null;

    const milestoneData: DataPoint[] = journey.milestones.map(
      (milestone, index) => ({
        x: index,
        y:
          milestone.status === "completed"
            ? 100
            : milestone.status === "in_progress"
              ? 50
              : 0,
        label: milestone.name,
        metadata: {
          status: milestone.status,
          description: milestone.description,
          completion_date: milestone.completed_date,
        },
      }),
    );

    return {
      chart_type: "bar",
      data_points: milestoneData,
      highlights: [`Journey Progress: ${journey.progress}%`],
      annotations: journey.milestones
        .filter((m) => m.completed_date)
        .map((m, i) => ({
          x: i,
          y: 100,
          text: "✅ Completed",
          type: "success" as const,
        })),
    };
  }

  // Private Helper Methods

  private analyzeAllUserPatterns(): void {
    for (const [userId] of this.userDecisions) {
      this.analyzeUserPatterns(userId);
    }
  }

  private generateReengagementPrompts(): void {
    for (const [userId] of this.userDecisions) {
      const prompt = this.generateReengagementPrompt(userId);
      if (prompt) {
        if (!this.reengagementPrompts.has(userId)) {
          this.reengagementPrompts.set(userId, []);
        }
        this.reengagementPrompts.get(userId)!.push(prompt);
      }
    }
  }

  private categorizeDecisionType(decision: UserDecision): StoryElement["type"] {
    if (
      decision.outcome?.financial_impact &&
      decision.outcome.financial_impact > 1000
    ) {
      return "achievement";
    }
    if (decision.confidence < 0.5) {
      return "challenge";
    }
    if (decision.reasoning.length > 3) {
      return "learning";
    }
    return "impact";
  }

  private generateStoryTitle(decision: UserDecision): string {
    const templates = {
      investment: ["Invested in {action}", "Added {action} to Portfolio"],
      research: ["Researched {action}", "Explored {action}"],
      education: ["Learned about {action}", "Studied {action}"],
      settings: ["Updated {action}", "Changed {action}"],
    };

    const template = templates[decision.type] || ["Action: {action}"];
    return template[0].replace("{action}", decision.action);
  }

  private generateStoryDescription(decision: UserDecision): string {
    if (decision.outcome) {
      const impact = decision.outcome.financial_impact;
      const satisfaction = decision.outcome.satisfaction_score;

      return (
        `This decision resulted in ${impact > 0 ? "positive" : "negative"} financial impact ` +
        `of ${Math.abs(impact).toLocaleString()} with satisfaction score of ${satisfaction}/10. ` +
        `Key learnings: ${decision.outcome.lessons_learned.join(", ")}.`
      );
    }

    return (
      `Decision made with ${Math.round(decision.confidence * 100)}% confidence. ` +
      `Reasoning: ${decision.reasoning.join(", ")}.`
    );
  }

  private analyzeEmotionalTone(
    decision: UserDecision,
  ): StoryElement["emotional_tone"] {
    if (decision.outcome) {
      if (decision.outcome.satisfaction_score >= 8) return "positive";
      if (decision.outcome.satisfaction_score <= 4) return "negative";
      if (
        decision.outcome.financial_impact > 0 &&
        decision.outcome.satisfaction_score >= 6
      )
        return "positive";
      if (decision.outcome.financial_impact < 0) return "negative";
    }

    if (decision.confidence >= 0.8) return "positive";
    if (decision.confidence <= 0.4) return "negative";

    return "neutral";
  }

  private calculateImpactMetrics(decision: UserDecision): ImpactMetrics {
    const outcome = decision.outcome;

    return {
      financial_return: outcome?.financial_impact || 0,
      social_impact: decision.tags.includes("esg") ? 8 : 3,
      environmental_impact: decision.tags.includes("green") ? 9 : 2,
      personal_growth: outcome?.lessons_learned.length || 3,
      knowledge_gained: decision.reasoning.length || 2,
    };
  }

  private generateVisualData(decision: UserDecision): VisualData {
    return {
      chart_type: "bar",
      data_points: [
        { x: 0, y: decision.confidence * 100, label: "Confidence" },
        {
          x: 1,
          y: decision.outcome?.satisfaction_score
            ? decision.outcome.satisfaction_score * 10
            : 50,
          label: "Satisfaction",
        },
      ],
      highlights: [`Impact: ${decision.impact}`, `Type: ${decision.type}`],
      annotations: [],
    };
  }

  private generateMilestones(goal: string): Milestone[] {
    // Generate context-appropriate milestones based on goal
    const commonMilestones = [
      {
        id: this.generateId(),
        name: "Initial Research",
        description: "Complete research phase",
        target_date: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        status: "pending" as const,
        success_criteria: [
          {
            metric: "research_hours",
            target_value: 5,
            current_value: 0,
            unit: "hours",
            weight: 1,
          },
        ],
      },
      {
        id: this.generateId(),
        name: "First Investment",
        description: "Make initial investment",
        target_date: Date.now() + 14 * 24 * 60 * 60 * 1000, // 2 weeks
        status: "pending" as const,
        success_criteria: [
          {
            metric: "investment_amount",
            target_value: 1000,
            current_value: 0,
            unit: "USD",
            weight: 1,
          },
        ],
      },
    ];

    return commonMilestones;
  }

  private generateProgressInsight(journey: UserJourney): JourneyInsight {
    return {
      id: this.generateId(),
      type: "pattern",
      message: `You're ${journey.progress}% complete with "${journey.goal}". Keep up the great momentum!`,
      confidence: 0.8,
      data_points: [
        `Progress: ${journey.progress}%`,
        `Active milestones: ${journey.milestones.filter((m) => m.status === "in_progress").length}`,
      ],
      actionable: true,
      action_items: ["Continue with next milestone", "Review recent decisions"],
    };
  }

  private checkMilestones(journey: UserJourney): void {
    for (const milestone of journey.milestones) {
      if (
        milestone.status === "pending" ||
        milestone.status === "in_progress"
      ) {
        const completionRate =
          milestone.success_criteria.reduce((acc, criteria) => {
            return (
              acc +
              (criteria.current_value / criteria.target_value) * criteria.weight
            );
          }, 0) / milestone.success_criteria.length;

        if (completionRate >= 1) {
          milestone.status = "completed";
          milestone.completed_date = Date.now();
          milestone.celebration = {
            type: "achievement",
            message: `Congratulations! You've completed "${milestone.name}"`,
            visual_element: "🎉",
            share_options: ["twitter", "linkedin", "email"],
          };
        } else if (completionRate > 0) {
          milestone.status = "in_progress";
        }
      }
    }
  }

  private analyzeTimingPatterns(decisions: UserDecision[]): BehaviorPattern[] {
    // Analyze when user makes decisions
    const hourCounts = new Array(24).fill(0);
    decisions.forEach((d) => {
      const hour = new Date(d.timestamp).getHours();
      hourCounts[hour]++;
    });

    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

    return [
      {
        id: this.generateId(),
        name: "Peak Activity Time",
        description: `Most active around ${peakHour}:00`,
        frequency: Math.max(...hourCounts),
        strength: 0.8,
        predictive_power: 0.7,
        triggers: [`time_of_day_${peakHour}`],
        outcomes: ["higher_engagement", "better_decisions"],
        recommendations: [`Schedule important decisions around ${peakHour}:00`],
      },
    ];
  }

  private analyzeInvestmentPatterns(
    decisions: UserDecision[],
  ): BehaviorPattern[] {
    const investmentDecisions = decisions.filter(
      (d) => d.type === "investment",
    );
    const esgCount = investmentDecisions.filter((d) =>
      d.tags.includes("esg"),
    ).length;
    const techCount = investmentDecisions.filter((d) =>
      d.tags.includes("tech"),
    ).length;

    const patterns: BehaviorPattern[] = [];

    if (esgCount > investmentDecisions.length * 0.6) {
      patterns.push({
        id: this.generateId(),
        name: "ESG-Focused Investor",
        description: "Strong preference for ESG investments",
        frequency: esgCount,
        strength: 0.9,
        predictive_power: 0.85,
        triggers: ["esg_opportunity", "sustainability_news"],
        outcomes: ["values_alignment", "long_term_thinking"],
        recommendations: [
          "Show ESG investments first",
          "Highlight impact metrics",
        ],
      });
    }

    return patterns;
  }

  private analyzeRiskPatterns(decisions: UserDecision[]): BehaviorPattern[] {
    const avgConfidence =
      decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length;
    const highRiskDecisions = decisions.filter(
      (d) => d.impact === "high" || d.impact === "critical",
    ).length;

    return [
      {
        id: this.generateId(),
        name:
          avgConfidence > 0.7
            ? "Confident Decision Maker"
            : "Cautious Decision Maker",
        description: `Average confidence: ${Math.round(avgConfidence * 100)}%`,
        frequency: decisions.length,
        strength: Math.abs(avgConfidence - 0.5) * 2,
        predictive_power: 0.6,
        triggers:
          avgConfidence > 0.7
            ? ["opportunity", "research"]
            : ["validation", "education"],
        outcomes:
          avgConfidence > 0.7
            ? ["quick_decisions", "higher_risk"]
            : ["thorough_research", "lower_risk"],
        recommendations:
          avgConfidence > 0.7
            ? ["Provide quick insights"]
            : ["Offer detailed analysis"],
      },
    ];
  }

  private analyzeEngagementPatterns(
    decisions: UserDecision[],
  ): BehaviorPattern[] {
    const recentDecisions = decisions.filter(
      (d) => d.timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000,
    );
    const engagementScore = recentDecisions.length / 30; // decisions per day

    return [
      {
        id: this.generateId(),
        name: "Engagement Level",
        description: `${engagementScore.toFixed(1)} decisions per day`,
        frequency: recentDecisions.length,
        strength: Math.min(engagementScore / 2, 1), // normalize to 0-1
        predictive_power: 0.5,
        triggers: ["regular_schedule", "market_events"],
        outcomes: ["consistent_progress", "habit_formation"],
        recommendations:
          engagementScore > 1
            ? ["Provide advanced features"]
            : ["Encourage more engagement"],
      },
    ];
  }

  private calculateOptimalTime(userId: string): number {
    const patterns = this.behaviorPatterns.get(userId) || [];
    const timingPattern = patterns.find((p) => p.name === "Peak Activity Time");

    if (timingPattern && timingPattern.triggers.length > 0) {
      const hourMatch = timingPattern.triggers[0].match(/time_of_day_(\d+)/);
      if (hourMatch) {
        const hour = parseInt(hourMatch[1]);
        const today = new Date();
        today.setHours(hour, 0, 0, 0);
        return today.getTime();
      }
    }

    // Default to 2 PM
    const defaultTime = new Date();
    defaultTime.setHours(14, 0, 0, 0);
    return defaultTime.getTime();
  }

  private generateHighlights(decisions: UserDecision[]): string[] {
    const highlights: string[] = [];

    const totalImpact = decisions.reduce(
      (sum, d) => sum + (d.outcome?.financial_impact || 0),
      0,
    );
    if (totalImpact !== 0) {
      highlights.push(
        `Total Financial Impact: ${totalImpact > 0 ? "+" : ""}${totalImpact.toLocaleString()}`,
      );
    }

    const avgConfidence =
      decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length;
    highlights.push(`Average Confidence: ${Math.round(avgConfidence * 100)}%`);

    const esgCount = decisions.filter((d) => d.tags.includes("esg")).length;
    if (esgCount > 0) {
      highlights.push(`ESG-Focused Decisions: ${esgCount}`);
    }

    return highlights;
  }

  private generateId(): string {
    return `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API Methods

  public getReengagementPrompts(userId: string): ReengagementPrompt[] {
    return this.reengagementPrompts.get(userId) || [];
  }

  public getUserJourneys(userId: string): UserJourney[] {
    return this.userJourneys.get(userId) || [];
  }

  public getBehaviorPatterns(userId: string): BehaviorPattern[] {
    return this.behaviorPatterns.get(userId) || [];
  }

  public getMemoryStats(): any {
    return {
      total_users: this.userDecisions.size,
      total_decisions: Array.from(this.userDecisions.values()).reduce(
        (sum, decisions) => sum + decisions.length,
        0,
      ),
      total_journeys: Array.from(this.userJourneys.values()).reduce(
        (sum, journeys) => sum + journeys.length,
        0,
      ),
      total_patterns: Array.from(this.behaviorPatterns.values()).reduce(
        (sum, patterns) => sum + patterns.length,
        0,
      ),
    };
  }
}

// Export singleton instance
export const userMemoryService = UserMemoryService.getInstance();
