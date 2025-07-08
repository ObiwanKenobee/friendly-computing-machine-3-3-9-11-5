import { aiService } from "./aiService";
import { localizationService } from "./localizationService";
import { culturalService } from "./culturalService";
import { fetcher } from "../utils/fetcher";

export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  content: string;
  type: "article" | "video" | "interactive" | "quiz" | "course" | "tutorial";
  category:
    | "basics"
    | "investing"
    | "risk"
    | "cultural"
    | "advanced"
    | "regulation";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  language: string;
  culturalContext?: string;
  tags: string[];
  authorId: string;
  status: "draft" | "published" | "archived";
  views: number;
  ratings: number[];
  prerequisites: string[];
  learningObjectives: string[];
  resources: Resource[];
  assessments: Assessment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  type: "link" | "document" | "video" | "tool";
  title: string;
  url: string;
  description?: string;
}

export interface Assessment {
  id: string;
  type: "quiz" | "assignment" | "practical";
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

export interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "essay";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  contentId: string;
  status: "not-started" | "in-progress" | "completed" | "failed";
  progress: number; // 0-100
  score?: number;
  timeSpent: number; // minutes
  completedAt?: Date;
  lastAccessed: Date;
  notes: string[];
  bookmarks: number[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration: number; // hours
  contentIds: string[];
  prerequisites: string[];
  culturalAdaptations: Record<string, Partial<LearningPath>>;
  certification?: {
    available: boolean;
    requirements: string[];
    validityPeriod: number; // months
  };
}

export class EducationService {
  private static instance: EducationService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheTTL = 60 * 60 * 1000; // 1 hour

  static getInstance(): EducationService {
    if (!EducationService.instance) {
      EducationService.instance = new EducationService();
    }
    return EducationService.instance;
  }

  /**
   * Get personalized content recommendations
   */
  async getPersonalizedContent(
    userId: string,
    preferences: {
      difficulty?: "beginner" | "intermediate" | "advanced";
      categories?: string[];
      culturalFramework?: string;
      language?: string;
      timeAvailable?: number; // minutes
    } = {},
  ): Promise<EducationalContent[]> {
    try {
      const userProfile = await this.getUserProfile(userId);
      const userProgress = await this.getUserProgress(userId);

      // Get AI-powered recommendations
      const aiRecommendations = await aiService.generateEducationalContent(
        userProfile,
        "personalized_recommendations",
        preferences.language || userProfile.language,
      );

      // Filter content based on preferences and progress
      const availableContent = await this.getAvailableContent({
        difficulty:
          preferences.difficulty || userProfile.difficulty || "beginner",
        categories: preferences.categories || ["basics", "investing"],
        language: preferences.language || userProfile.language || "en",
        culturalFramework:
          preferences.culturalFramework || userProfile.culturalFramework,
        exclude: userProgress
          .filter((p) => p.status === "completed")
          .map((p) => p.contentId),
      });

      // Score and rank content
      const scoredContent = await this.scoreContent(
        availableContent,
        userProfile,
        userProgress,
      );

      // Filter by time available
      if (preferences.timeAvailable) {
        return scoredContent.filter(
          (content) => content.duration <= preferences.timeAvailable!,
        );
      }

      return scoredContent.slice(0, 10); // Top 10 recommendations
    } catch (error) {
      console.error("Error getting personalized content:", error);
      throw new Error("Failed to get personalized educational content");
    }
  }

  /**
   * Get learning paths
   */
  async getLearningPaths(
    filters: {
      difficulty?: string;
      category?: string;
      culturalFramework?: string;
      language?: string;
    } = {},
  ): Promise<LearningPath[]> {
    try {
      const paths = await this.fetchLearningPaths(filters);

      // Adapt paths for cultural context if needed
      if (filters.culturalFramework) {
        return await this.adaptPathsForCulture(
          paths,
          filters.culturalFramework,
        );
      }

      return paths;
    } catch (error) {
      console.error("Error getting learning paths:", error);
      throw new Error("Failed to get learning paths");
    }
  }

  /**
   * Create custom educational content using AI
   */
  async createCustomContent(
    topic: string,
    userProfile: any,
    options: {
      type?: "article" | "tutorial" | "quiz";
      difficulty?: "beginner" | "intermediate" | "advanced";
      duration?: number;
      culturalFramework?: string;
      language?: string;
    } = {},
  ): Promise<EducationalContent> {
    try {
      const content = await aiService.generateEducationalContent(
        userProfile,
        topic,
        options.language || "en",
      );

      // Generate assessments if needed
      const assessments =
        options.type === "quiz"
          ? await this.generateAssessments(
              topic,
              content.content,
              options.difficulty || "beginner",
            )
          : [];

      // Create cultural adaptations if needed
      const culturalAdaptations = options.culturalFramework
        ? await this.createCulturalAdaptations(
            content,
            options.culturalFramework,
          )
        : {};

      const educationalContent: EducationalContent = {
        id: this.generateId(),
        title: content.title,
        description: `Custom content about ${topic}`,
        content: content.content,
        type: options.type || "article",
        category: this.categorizeContent(topic),
        difficulty: options.difficulty || content.difficulty,
        duration: options.duration || this.estimateDuration(content.content),
        language: options.language || "en",
        culturalContext: options.culturalFramework,
        tags: this.extractTags(topic, content.content),
        authorId: "ai-system",
        status: "published",
        views: 0,
        ratings: [],
        prerequisites: this.identifyPrerequisites(
          topic,
          options.difficulty || "beginner",
        ),
        learningObjectives: this.extractLearningObjectives(content.content),
        resources: await this.findRelatedResources(topic),
        assessments,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return educationalContent;
    } catch (error) {
      console.error("Error creating custom content:", error);
      throw new Error("Failed to create custom educational content");
    }
  }

  /**
   * Track user progress
   */
  async trackProgress(
    userId: string,
    contentId: string,
    progressData: {
      progress?: number;
      timeSpent?: number;
      completed?: boolean;
      score?: number;
      notes?: string;
    },
  ): Promise<UserProgress> {
    try {
      let userProgress = await this.getUserContentProgress(userId, contentId);

      if (!userProgress) {
        userProgress = {
          id: this.generateId(),
          userId,
          contentId,
          status: "not-started",
          progress: 0,
          timeSpent: 0,
          lastAccessed: new Date(),
          notes: [],
          bookmarks: [],
        };
      }

      // Update progress
      if (progressData.progress !== undefined) {
        userProgress.progress = Math.max(
          userProgress.progress,
          progressData.progress,
        );
      }

      if (progressData.timeSpent !== undefined) {
        userProgress.timeSpent += progressData.timeSpent;
      }

      if (progressData.score !== undefined) {
        userProgress.score = progressData.score;
      }

      if (progressData.notes) {
        userProgress.notes.push(progressData.notes);
      }

      if (progressData.completed) {
        userProgress.status = "completed";
        userProgress.progress = 100;
        userProgress.completedAt = new Date();
      } else if (userProgress.progress > 0) {
        userProgress.status = "in-progress";
      }

      userProgress.lastAccessed = new Date();

      // Save progress (in real implementation, this would save to database)
      await this.saveUserProgress(userProgress);

      return userProgress;
    } catch (error) {
      console.error("Error tracking progress:", error);
      throw new Error("Failed to track user progress");
    }
  }

  /**
   * Generate quiz assessments
   */
  async generateQuiz(
    contentId: string,
    difficulty: "beginner" | "intermediate" | "advanced" = "beginner",
  ): Promise<Assessment> {
    try {
      const content = await this.getContent(contentId);
      if (!content) {
        throw new Error("Content not found");
      }

      const questions = await this.generateAssessments(
        content.title,
        content.content,
        difficulty,
      );

      return {
        id: this.generateId(),
        type: "quiz",
        title: `Quiz: ${content.title}`,
        questions: questions[0]?.questions || [],
        passingScore: 70,
        timeLimit: 30, // 30 minutes
      };
    } catch (error) {
      console.error("Error generating quiz:", error);
      throw new Error("Failed to generate quiz");
    }
  }

  /**
   * Evaluate quiz submission
   */
  async evaluateQuiz(
    userId: string,
    assessmentId: string,
    answers: Record<string, string | string[]>,
  ): Promise<{
    score: number;
    passed: boolean;
    feedback: Array<{
      questionId: string;
      correct: boolean;
      explanation?: string;
      userAnswer: string | string[];
      correctAnswer: string | string[];
    }>;
  }> {
    try {
      const assessment = await this.getAssessment(assessmentId);
      if (!assessment) {
        throw new Error("Assessment not found");
      }

      const feedback = [];
      let totalPoints = 0;
      let earnedPoints = 0;

      for (const question of assessment.questions) {
        totalPoints += question.points;
        const userAnswer = answers[question.id];
        const isCorrect = this.checkAnswer(question, userAnswer);

        if (isCorrect) {
          earnedPoints += question.points;
        }

        feedback.push({
          questionId: question.id,
          correct: isCorrect,
          explanation: question.explanation,
          userAnswer,
          correctAnswer: question.correctAnswer,
        });
      }

      const score = Math.round((earnedPoints / totalPoints) * 100);
      const passed = score >= assessment.passingScore;

      // Track progress
      await this.trackProgress(userId, assessment.id, {
        score,
        completed: true,
      });

      return {
        score,
        passed,
        feedback,
      };
    } catch (error) {
      console.error("Error evaluating quiz:", error);
      throw new Error("Failed to evaluate quiz");
    }
  }

  /**
   * Get culturally adapted content
   */
  async getCulturallyAdaptedContent(
    contentId: string,
    culturalFramework: string,
    language?: string,
  ): Promise<EducationalContent> {
    try {
      const baseContent = await this.getContent(contentId);
      if (!baseContent) {
        throw new Error("Content not found");
      }

      // Check if cultural adaptation already exists
      const cacheKey = `adapted:${contentId}:${culturalFramework}:${language || "default"}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      // Create cultural adaptation
      const adaptedContent = await this.createCulturalAdaptation(
        baseContent,
        culturalFramework,
        language,
      );

      this.setCache(cacheKey, adaptedContent);
      return adaptedContent;
    } catch (error) {
      console.error("Error getting culturally adapted content:", error);
      throw new Error("Failed to get culturally adapted content");
    }
  }

  /**
   * Search educational content
   */
  async searchContent(
    query: string,
    filters: {
      type?: string[];
      category?: string[];
      difficulty?: string[];
      language?: string;
      culturalFramework?: string;
    } = {},
  ): Promise<EducationalContent[]> {
    try {
      // This would integrate with a search engine like Elasticsearch
      const searchResults = await fetcher.get("/api/education/search", {
        params: {
          q: query,
          ...filters,
        },
      });

      return searchResults.data.results || [];
    } catch (error) {
      console.error("Error searching content:", error);
      return [];
    }
  }

  /**
   * Get user learning analytics
   */
  async getLearningAnalytics(
    userId: string,
    timeframe: "week" | "month" | "quarter" | "year" = "month",
  ): Promise<{
    totalTimeSpent: number;
    contentCompleted: number;
    averageScore: number;
    streakDays: number;
    strongestAreas: string[];
    improvementAreas: string[];
    progressTrend: Array<{ date: Date; progress: number }>;
    achievements: Array<{
      id: string;
      title: string;
      description: string;
      earnedAt: Date;
    }>;
  }> {
    try {
      const progress = await this.getUserProgress(userId);
      const endDate = new Date();
      const startDate = this.getStartDate(endDate, timeframe);

      const relevantProgress = progress.filter(
        (p) => p.lastAccessed >= startDate && p.lastAccessed <= endDate,
      );

      const totalTimeSpent = relevantProgress.reduce(
        (sum, p) => sum + p.timeSpent,
        0,
      );
      const contentCompleted = relevantProgress.filter(
        (p) => p.status === "completed",
      ).length;
      const scores = relevantProgress
        .filter((p) => p.score !== undefined)
        .map((p) => p.score!);
      const averageScore =
        scores.length > 0
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length
          : 0;

      const analytics = {
        totalTimeSpent,
        contentCompleted,
        averageScore,
        streakDays: await this.calculateStreakDays(userId),
        strongestAreas: await this.identifyStrongestAreas(relevantProgress),
        improvementAreas: await this.identifyImprovementAreas(relevantProgress),
        progressTrend: await this.calculateProgressTrend(userId, timeframe),
        achievements: await this.getUserAchievements(userId),
      };

      return analytics;
    } catch (error) {
      console.error("Error getting learning analytics:", error);
      throw new Error("Failed to get learning analytics");
    }
  }

  /**
   * Helper methods
   */
  private async getUserProfile(userId: string): Promise<any> {
    // This would fetch user profile from database
    return {
      id: userId,
      difficulty: "beginner",
      language: "en",
      culturalFramework: "general",
      interests: ["investing", "basics"],
      completedContent: [],
    };
  }

  private async getUserProgress(userId: string): Promise<UserProgress[]> {
    // This would fetch user progress from database
    return [];
  }

  private async getUserContentProgress(
    userId: string,
    contentId: string,
  ): Promise<UserProgress | null> {
    const allProgress = await this.getUserProgress(userId);
    return allProgress.find((p) => p.contentId === contentId) || null;
  }

  private async getAvailableContent(
    filters: any,
  ): Promise<EducationalContent[]> {
    // This would fetch content from database with filters
    return [];
  }

  private async scoreContent(
    content: EducationalContent[],
    userProfile: any,
    userProgress: UserProgress[],
  ): Promise<EducationalContent[]> {
    // Score content based on user profile and progress
    return content.sort((a, b) => {
      // Simple scoring algorithm
      let scoreA = 0;
      let scoreB = 0;

      // Prefer content matching user's interests
      if (userProfile.interests.includes(a.category)) scoreA += 10;
      if (userProfile.interests.includes(b.category)) scoreB += 10;

      // Prefer content at user's difficulty level or slightly higher
      const difficultyScore = { beginner: 1, intermediate: 2, advanced: 3 };
      const userLevel = difficultyScore[userProfile.difficulty] || 1;
      const aLevel = difficultyScore[a.difficulty] || 1;
      const bLevel = difficultyScore[b.difficulty] || 1;

      if (aLevel === userLevel || aLevel === userLevel + 1) scoreA += 5;
      if (bLevel === userLevel || bLevel === userLevel + 1) scoreB += 5;

      // Prefer highly rated content
      scoreA +=
        a.ratings.length > 0
          ? a.ratings.reduce((sum, r) => sum + r, 0) / a.ratings.length
          : 0;
      scoreB +=
        b.ratings.length > 0
          ? b.ratings.reduce((sum, r) => sum + r, 0) / b.ratings.length
          : 0;

      return scoreB - scoreA;
    });
  }

  private async fetchLearningPaths(filters: any): Promise<LearningPath[]> {
    // This would fetch learning paths from database
    return [];
  }

  private async adaptPathsForCulture(
    paths: LearningPath[],
    framework: string,
  ): Promise<LearningPath[]> {
    return paths.map((path) => {
      if (path.culturalAdaptations[framework]) {
        return { ...path, ...path.culturalAdaptations[framework] };
      }
      return path;
    });
  }

  private categorizeContent(topic: string): EducationalContent["category"] {
    const keywords = {
      basics: ["introduction", "basic", "fundamental", "beginner"],
      investing: ["investment", "portfolio", "asset", "trading"],
      risk: ["risk", "volatility", "hedge", "insurance"],
      cultural: ["islamic", "sharia", "esg", "ethical", "cultural"],
      advanced: ["derivatives", "options", "complex", "sophisticated"],
      regulation: ["regulation", "compliance", "legal", "law"],
    };

    const topicLower = topic.toLowerCase();
    for (const [category, keywordList] of Object.entries(keywords)) {
      if (keywordList.some((keyword) => topicLower.includes(keyword))) {
        return category as EducationalContent["category"];
      }
    }

    return "basics";
  }

  private estimateDuration(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private extractTags(topic: string, content: string): string[] {
    const commonTags = ["finance", "education", "learning"];
    const topicTags = topic
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 3);
    return [...commonTags, ...topicTags].slice(0, 10);
  }

  private identifyPrerequisites(topic: string, difficulty: string): string[] {
    if (difficulty === "beginner") return [];

    const prerequisites: Record<string, string[]> = {
      investing: ["Financial Basics", "Money Management"],
      risk: ["Investment Fundamentals", "Portfolio Theory"],
      advanced: ["Intermediate Investing", "Financial Mathematics"],
    };

    const category = this.categorizeContent(topic);
    return prerequisites[category] || [];
  }

  private extractLearningObjectives(content: string): string[] {
    // Simple extraction - in reality, this would use NLP
    const objectives = [
      "Understand key concepts",
      "Apply knowledge to real situations",
      "Make informed decisions",
    ];

    return objectives;
  }

  private async findRelatedResources(topic: string): Promise<Resource[]> {
    // This would find related external resources
    return [
      {
        type: "link",
        title: `External resource for ${topic}`,
        url: "#",
        description: "Additional reading material",
      },
    ];
  }

  private async generateAssessments(
    topic: string,
    content: string,
    difficulty: string,
  ): Promise<Assessment[]> {
    try {
      // Use AI to generate quiz questions
      const prompt = `Generate 5 ${difficulty} level quiz questions about "${topic}" based on this content: ${content.substring(0, 1000)}...`;
      const aiResponse = await aiService.generateEducationalContent(
        { difficulty },
        prompt,
        "en",
      );

      // Parse AI response to create questions (simplified)
      const questions: Question[] = [
        {
          id: this.generateId(),
          type: "multiple-choice",
          question: `What is the main concept in ${topic}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          explanation: "This is the correct answer because...",
          points: 10,
        },
      ];

      return [
        {
          id: this.generateId(),
          type: "quiz",
          title: `${topic} Assessment`,
          questions,
          passingScore: 70,
          timeLimit: 20,
        },
      ];
    } catch (error) {
      console.error("Error generating assessments:", error);
      return [];
    }
  }

  private async createCulturalAdaptations(
    content: EducationalContent,
    framework: string,
  ): Promise<Record<string, any>> {
    try {
      const culturalContent = await culturalService.screenInvestment(
        "GENERAL",
        framework,
      );

      // Adapt content based on cultural framework
      const adaptations = {
        examples: await this.adaptExamples(content.content, framework),
        terminology: await this.adaptTerminology(content.content, framework),
        caseStudies: await this.createCulturalCaseStudies(
          content.category,
          framework,
        ),
      };

      return { [framework]: adaptations };
    } catch (error) {
      console.error("Error creating cultural adaptations:", error);
      return {};
    }
  }

  private async createCulturalAdaptation(
    content: EducationalContent,
    framework: string,
    language?: string,
  ): Promise<EducationalContent> {
    const adapted = { ...content };

    // Adapt content for cultural framework
    if (framework === "islamic") {
      adapted.content = await this.adaptForIslamic(content.content);
      adapted.title = `${content.title} (Islamic Finance)`;
    } else if (framework === "esg") {
      adapted.content = await this.adaptForESG(content.content);
      adapted.title = `${content.title} (ESG Perspective)`;
    }

    // Translate if needed
    if (language && language !== content.language) {
      adapted.content = await this.translateContent(adapted.content, language);
      adapted.title = await this.translateContent(adapted.title, language);
      adapted.language = language;
    }

    adapted.id = this.generateId();
    adapted.culturalContext = framework;
    adapted.createdAt = new Date();
    adapted.updatedAt = new Date();

    return adapted;
  }

  private async adaptForIslamic(content: string): Promise<string> {
    // Replace interest-based concepts with Islamic alternatives
    return content
      .replace(/interest/gi, "profit sharing")
      .replace(/loan/gi, "murabaha financing")
      .replace(/insurance/gi, "takaful");
  }

  private async adaptForESG(content: string): Promise<string> {
    // Add ESG considerations
    return (
      content +
      "\n\nESG Considerations: Environmental, Social, and Governance factors are important in sustainable investing..."
    );
  }

  private async translateContent(
    content: string,
    language: string,
  ): Promise<string> {
    // This would use a translation service
    return content; // Placeholder
  }

  private async getContent(
    contentId: string,
  ): Promise<EducationalContent | null> {
    // This would fetch content from database
    return null;
  }

  private async getAssessment(
    assessmentId: string,
  ): Promise<Assessment | null> {
    // This would fetch assessment from database
    return null;
  }

  private checkAnswer(
    question: Question,
    userAnswer: string | string[],
  ): boolean {
    if (Array.isArray(question.correctAnswer)) {
      return (
        Array.isArray(userAnswer) &&
        userAnswer.length === question.correctAnswer.length &&
        userAnswer.every((answer) => question.correctAnswer.includes(answer))
      );
    } else {
      return userAnswer === question.correctAnswer;
    }
  }

  private async saveUserProgress(progress: UserProgress): Promise<void> {
    // This would save to database
  }

  private async adaptExamples(
    content: string,
    framework: string,
  ): Promise<string[]> {
    return [`Adapted example for ${framework}`];
  }

  private async adaptTerminology(
    content: string,
    framework: string,
  ): Promise<Record<string, string>> {
    return { interest: "profit sharing" };
  }

  private async createCulturalCaseStudies(
    category: string,
    framework: string,
  ): Promise<string[]> {
    return [`Case study for ${category} in ${framework} context`];
  }

  private getStartDate(endDate: Date, timeframe: string): Date {
    const date = new Date(endDate);
    switch (timeframe) {
      case "week":
        date.setDate(date.getDate() - 7);
        break;
      case "month":
        date.setMonth(date.getMonth() - 1);
        break;
      case "quarter":
        date.setMonth(date.getMonth() - 3);
        break;
      case "year":
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date;
  }

  private async calculateStreakDays(userId: string): Promise<number> {
    // Calculate consecutive days of learning activity
    return 5; // Placeholder
  }

  private async identifyStrongestAreas(
    progress: UserProgress[],
  ): Promise<string[]> {
    // Analyze progress to identify strongest areas
    return ["Investment Basics", "Risk Management"];
  }

  private async identifyImprovementAreas(
    progress: UserProgress[],
  ): Promise<string[]> {
    // Analyze progress to identify areas needing improvement
    return ["Advanced Analytics", "International Markets"];
  }

  private async calculateProgressTrend(
    userId: string,
    timeframe: string,
  ): Promise<Array<{ date: Date; progress: number }>> {
    // Calculate progress trend over time
    return [];
  }

  private async getUserAchievements(
    userId: string,
  ): Promise<
    Array<{ id: string; title: string; description: string; earnedAt: Date }>
  > {
    // Get user achievements/badges
    return [
      {
        id: "1",
        title: "First Steps",
        description: "Completed your first lesson",
        earnedAt: new Date(),
      },
    ];
  }

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
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private generateId(): string {
    return `edu_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// Export singleton instance for use throughout the application
export const educationService = EducationService.getInstance();

// Export the class for manual instantiation when needed
export default EducationService;
