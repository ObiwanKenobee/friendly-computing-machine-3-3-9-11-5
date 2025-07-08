import { singletonPattern } from "../utils/singletonPattern";

export interface ComplianceRegulation {
  id: string;
  name: string;
  shortName: string;
  jurisdiction: string;
  type:
    | "data_protection"
    | "financial"
    | "securities"
    | "banking"
    | "tax"
    | "general";
  status: "active" | "pending" | "deprecated" | "draft";
  effectiveDate: Date;
  lastUpdated: Date;
  description: string;
  requirements: ComplianceRequirement[];
  penalties: {
    monetary: string;
    criminal: string;
    operational: string;
  };
  applicability: {
    businessTypes: string[];
    regions: string[];
    minimumRevenue?: number;
    userThreshold?: number;
  };
}

export interface ComplianceRequirement {
  id: string;
  category:
    | "reporting"
    | "consent"
    | "data_handling"
    | "security"
    | "audit"
    | "licensing";
  title: string;
  description: string;
  mandatory: boolean;
  deadline?: Date;
  frequency: "once" | "annual" | "quarterly" | "monthly" | "continuous";
  evidence: string[];
  automationLevel: "manual" | "semi_automated" | "automated";
  cost: {
    implementation: number;
    maintenance: number;
    annual: number;
  };
}

export interface ComplianceAssessment {
  id: string;
  regulationId: string;
  region: string;
  status:
    | "compliant"
    | "non_compliant"
    | "partially_compliant"
    | "under_review";
  score: number; // 0-100
  lastAssessed: Date;
  nextAssessment: Date;
  assessor: string;
  findings: ComplianceFinding[];
  recommendations: string[];
  remediationPlan?: RemediationPlan;
}

export interface ComplianceFinding {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  evidence: string[];
  remediation: string;
  timeline: number; // days to fix
  responsible: string;
  status: "open" | "in_progress" | "resolved" | "mitigated";
}

export interface RemediationPlan {
  id: string;
  assessmentId: string;
  status: "draft" | "approved" | "in_progress" | "completed";
  totalCost: number;
  estimatedDuration: number; // days
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    status: "pending" | "in_progress" | "completed" | "delayed";
    dependencies: string[];
    cost: number;
  }>;
  resources: Array<{
    type: "internal" | "external" | "technology";
    name: string;
    allocation: number; // percentage
    cost: number;
  }>;
}

export interface ComplianceMonitoring {
  regulationId: string;
  region: string;
  metrics: {
    complianceScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    trendsAnalysis: Array<{
      month: string;
      score: number;
      violations: number;
      remediated: number;
    }>;
    upcomingDeadlines: Array<{
      requirement: string;
      dueDate: Date;
      status: "on_track" | "at_risk" | "overdue";
    }>;
  };
  alerts: ComplianceAlert[];
  lastUpdated: Date;
}

export interface ComplianceAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  type: "deadline" | "violation" | "regulatory_change" | "audit_required";
  title: string;
  description: string;
  actionRequired: string;
  dueDate?: Date;
  region: string;
  regulation: string;
  created: Date;
  resolved: boolean;
}

export interface RegulationUpdate {
  id: string;
  regulationId: string;
  type: "amendment" | "new_requirement" | "deadline_change" | "penalty_update";
  title: string;
  description: string;
  effectiveDate: Date;
  impactAssessment: {
    affected_regions: string[];
    business_impact: "low" | "medium" | "high" | "critical";
    implementation_cost: number;
    implementation_timeline: number; // days
  };
  actionItems: string[];
  status: "published" | "reviewed" | "implemented";
}

class RegionalComplianceService {
  private regulations: Map<string, ComplianceRegulation> = new Map();
  private assessments: Map<string, ComplianceAssessment> = new Map();
  private monitoring: Map<string, ComplianceMonitoring> = new Map();
  private alerts: Map<string, ComplianceAlert> = new Map();
  private updates: Map<string, RegulationUpdate> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize with major global regulations
    await this.createSampleRegulations();
    await this.createSampleAssessments();
    await this.createSampleMonitoring();

    // Start compliance monitoring
    this.startComplianceMonitoring();
    this.startAlertSystem();

    this.isInitialized = true;
    console.log(
      "Regional Compliance Service initialized with global regulatory framework",
    );
  }

  private async createSampleRegulations(): Promise<void> {
    const sampleRegulations: ComplianceRegulation[] = [
      {
        id: "gdpr-eu",
        name: "General Data Protection Regulation",
        shortName: "GDPR",
        jurisdiction: "European Union",
        type: "data_protection",
        status: "active",
        effectiveDate: new Date("2018-05-25"),
        lastUpdated: new Date("2024-03-15"),
        description: "Comprehensive data protection regulation for EU citizens",
        requirements: [
          {
            id: "gdpr-consent",
            category: "consent",
            title: "Explicit User Consent",
            description: "Obtain clear, informed consent for data processing",
            mandatory: true,
            frequency: "continuous",
            evidence: ["consent_records", "opt_in_logs", "privacy_policy"],
            automationLevel: "automated",
            cost: { implementation: 50000, maintenance: 10000, annual: 25000 },
          },
          {
            id: "gdpr-dpo",
            category: "reporting",
            title: "Data Protection Officer",
            description: "Appoint qualified DPO for data protection oversight",
            mandatory: true,
            frequency: "continuous",
            evidence: [
              "dpo_appointment",
              "qualification_certificates",
              "contact_info",
            ],
            automationLevel: "manual",
            cost: {
              implementation: 100000,
              maintenance: 120000,
              annual: 150000,
            },
          },
        ],
        penalties: {
          monetary: "Up to €20M or 4% of annual turnover",
          criminal: "Potential criminal charges for severe violations",
          operational: "Data processing restrictions, business suspension",
        },
        applicability: {
          businessTypes: ["fintech", "bank", "investment", "insurance"],
          regions: ["eu-west", "eu-central", "eu-north"],
          userThreshold: 1000,
        },
      },
      {
        id: "sox-us",
        name: "Sarbanes-Oxley Act",
        shortName: "SOX",
        jurisdiction: "United States",
        type: "financial",
        status: "active",
        effectiveDate: new Date("2002-07-30"),
        lastUpdated: new Date("2024-02-20"),
        description:
          "Federal law enhancing corporate financial reporting accuracy",
        requirements: [
          {
            id: "sox-404",
            category: "audit",
            title: "Internal Controls Assessment",
            description:
              "Annual assessment of internal controls over financial reporting",
            mandatory: true,
            deadline: new Date("2024-12-31"),
            frequency: "annual",
            evidence: [
              "audit_reports",
              "control_testing",
              "management_attestation",
            ],
            automationLevel: "semi_automated",
            cost: {
              implementation: 200000,
              maintenance: 80000,
              annual: 150000,
            },
          },
        ],
        penalties: {
          monetary: "Up to $5M in fines",
          criminal: "Up to 25 years imprisonment for executives",
          operational: "Delisting from stock exchanges",
        },
        applicability: {
          businessTypes: ["public_company", "bank", "investment"],
          regions: ["us-east", "us-west", "us-central"],
          minimumRevenue: 75000000,
        },
      },
      {
        id: "lgpd-br",
        name: "Lei Geral de Proteção de Dados",
        shortName: "LGPD",
        jurisdiction: "Brazil",
        type: "data_protection",
        status: "active",
        effectiveDate: new Date("2020-09-18"),
        lastUpdated: new Date("2024-01-10"),
        description: "Brazilian data protection law similar to GDPR",
        requirements: [
          {
            id: "lgpd-consent",
            category: "consent",
            title: "Data Subject Consent",
            description: "Obtain specific consent for personal data processing",
            mandatory: true,
            frequency: "continuous",
            evidence: ["consent_logs", "privacy_notices", "withdrawal_records"],
            automationLevel: "automated",
            cost: { implementation: 40000, maintenance: 8000, annual: 20000 },
          },
        ],
        penalties: {
          monetary: "Up to R$50M or 2% of revenue",
          criminal: "Potential criminal liability",
          operational: "Data processing suspension",
        },
        applicability: {
          businessTypes: ["fintech", "bank", "investment"],
          regions: ["latam"],
          userThreshold: 500,
        },
      },
      {
        id: "ndpr-ng",
        name: "Nigeria Data Protection Regulation",
        shortName: "NDPR",
        jurisdiction: "Nigeria",
        type: "data_protection",
        status: "active",
        effectiveDate: new Date("2019-01-25"),
        lastUpdated: new Date("2023-11-15"),
        description: "Nigerian data protection framework",
        requirements: [
          {
            id: "ndpr-registration",
            category: "licensing",
            title: "Data Controller Registration",
            description: "Register with NITDA as data controller",
            mandatory: true,
            deadline: new Date("2024-06-30"),
            frequency: "annual",
            evidence: [
              "registration_certificate",
              "compliance_audit",
              "fee_payment",
            ],
            automationLevel: "manual",
            cost: { implementation: 15000, maintenance: 5000, annual: 8000 },
          },
        ],
        penalties: {
          monetary: "Up to ₦10M or 2% of annual turnover",
          criminal: "Potential prosecution",
          operational: "License revocation",
        },
        applicability: {
          businessTypes: ["fintech", "bank", "investment"],
          regions: ["africa-west"],
          userThreshold: 100,
        },
      },
    ];

    for (const regulation of sampleRegulations) {
      this.regulations.set(regulation.id, regulation);
    }
  }

  private async createSampleAssessments(): Promise<void> {
    const sampleAssessments: ComplianceAssessment[] = [
      {
        id: "assess-gdpr-2024",
        regulationId: "gdpr-eu",
        region: "eu-west",
        status: "compliant",
        score: 94,
        lastAssessed: new Date("2024-02-15"),
        nextAssessment: new Date("2024-08-15"),
        assessor: "external-auditor-eu",
        findings: [
          {
            id: "finding-001",
            severity: "medium",
            category: "data_retention",
            title: "Data Retention Policy Gap",
            description:
              "Some user data retained beyond specified retention periods",
            evidence: ["audit_log_analysis", "data_inventory"],
            remediation: "Implement automated data purging system",
            timeline: 30,
            responsible: "data-protection-team",
            status: "in_progress",
          },
        ],
        recommendations: [
          "Enhance automated data lifecycle management",
          "Conduct quarterly privacy impact assessments",
          "Update privacy notices to reflect new processing activities",
        ],
      },
      {
        id: "assess-sox-2024",
        regulationId: "sox-us",
        region: "us-east",
        status: "partially_compliant",
        score: 78,
        lastAssessed: new Date("2024-01-30"),
        nextAssessment: new Date("2024-12-31"),
        assessor: "big4-auditor",
        findings: [
          {
            id: "finding-002",
            severity: "high",
            category: "internal_controls",
            title: "IT General Controls Deficiency",
            description:
              "Insufficient segregation of duties in financial systems",
            evidence: ["control_testing_results", "access_review"],
            remediation:
              "Implement role-based access controls and approval workflows",
            timeline: 60,
            responsible: "it-security-team",
            status: "open",
          },
        ],
        recommendations: [
          "Strengthen IT general controls framework",
          "Implement continuous control monitoring",
          "Enhance financial reporting automation",
        ],
      },
    ];

    for (const assessment of sampleAssessments) {
      this.assessments.set(assessment.id, assessment);
    }
  }

  private async createSampleMonitoring(): Promise<void> {
    const monitoringData: ComplianceMonitoring[] = [
      {
        regulationId: "gdpr-eu",
        region: "eu-west",
        metrics: {
          complianceScore: 94,
          riskLevel: "low",
          trendsAnalysis: [
            { month: "Jan", score: 89, violations: 2, remediated: 2 },
            { month: "Feb", score: 92, violations: 1, remediated: 1 },
            { month: "Mar", score: 94, violations: 0, remediated: 1 },
          ],
          upcomingDeadlines: [
            {
              requirement: "Annual DPO Report",
              dueDate: new Date("2024-05-25"),
              status: "on_track",
            },
            {
              requirement: "Privacy Impact Assessment",
              dueDate: new Date("2024-04-15"),
              status: "at_risk",
            },
          ],
        },
        alerts: [],
        lastUpdated: new Date(),
      },
    ];

    for (const monitoring of monitoringData) {
      const key = `${monitoring.regulationId}-${monitoring.region}`;
      this.monitoring.set(key, monitoring);
    }
  }

  async getRegulations(filters?: {
    jurisdiction?: string;
    type?: string;
    status?: string;
    region?: string;
  }): Promise<ComplianceRegulation[]> {
    let regulations = Array.from(this.regulations.values());

    if (filters?.jurisdiction) {
      regulations = regulations.filter((r) =>
        r.jurisdiction
          .toLowerCase()
          .includes(filters.jurisdiction!.toLowerCase()),
      );
    }

    if (filters?.type) {
      regulations = regulations.filter((r) => r.type === filters.type);
    }

    if (filters?.status) {
      regulations = regulations.filter((r) => r.status === filters.status);
    }

    if (filters?.region) {
      regulations = regulations.filter((r) =>
        r.applicability.regions.includes(filters.region!),
      );
    }

    return regulations.sort(
      (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime(),
    );
  }

  async getRegulation(
    regulationId: string,
  ): Promise<ComplianceRegulation | null> {
    return this.regulations.get(regulationId) || null;
  }

  async assessCompliance(
    regulationId: string,
    region: string,
  ): Promise<ComplianceAssessment> {
    const regulation = this.regulations.get(regulationId);
    if (!regulation) {
      throw new Error(`Regulation ${regulationId} not found`);
    }

    // Simulate comprehensive compliance assessment
    const assessment: ComplianceAssessment = {
      id: `assess-${regulationId}-${region}-${Date.now()}`,
      regulationId,
      region,
      status: "under_review",
      score: 0,
      lastAssessed: new Date(),
      nextAssessment: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
      assessor: "ai-compliance-system",
      findings: [],
      recommendations: [],
    };

    // Simulate assessment scoring
    let totalScore = 0;
    let maxScore = 0;

    for (const requirement of regulation.requirements) {
      maxScore += 100;
      const requirementScore = this.evaluateRequirement(requirement, region);
      totalScore += requirementScore;

      if (requirementScore < 80) {
        assessment.findings.push({
          id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          severity:
            requirementScore < 50
              ? "critical"
              : requirementScore < 70
                ? "high"
                : "medium",
          category: requirement.category,
          title: `${requirement.title} Non-Compliance`,
          description: `Assessment indicates partial compliance with ${requirement.title}`,
          evidence: ["automated_scan", "policy_review", "system_audit"],
          remediation: `Address gaps in ${requirement.title} implementation`,
          timeline: requirement.mandatory ? 30 : 60,
          responsible: "compliance-team",
          status: "open",
        });
      }
    }

    assessment.score =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    assessment.status =
      assessment.score >= 90
        ? "compliant"
        : assessment.score >= 70
          ? "partially_compliant"
          : "non_compliant";

    // Generate recommendations
    assessment.recommendations = this.generateRecommendations(assessment);

    this.assessments.set(assessment.id, assessment);
    return assessment;
  }

  private evaluateRequirement(
    requirement: ComplianceRequirement,
    region: string,
  ): number {
    // Simulate requirement evaluation
    let score = 75; // Base score

    // Adjust based on automation level
    if (requirement.automationLevel === "automated") score += 15;
    else if (requirement.automationLevel === "semi_automated") score += 8;

    // Adjust based on implementation cost (lower cost = better implementation)
    if (requirement.cost.implementation < 50000) score += 10;
    else if (requirement.cost.implementation > 200000) score -= 5;

    // Add some randomness for simulation
    score += Math.random() * 20 - 10;

    return Math.max(0, Math.min(100, score));
  }

  private generateRecommendations(assessment: ComplianceAssessment): string[] {
    const recommendations: string[] = [];

    if (assessment.score < 90) {
      recommendations.push(
        "Implement comprehensive compliance monitoring system",
      );
    }

    if (assessment.findings.some((f) => f.severity === "critical")) {
      recommendations.push(
        "Address critical findings immediately to avoid regulatory penalties",
      );
    }

    if (assessment.findings.some((f) => f.category === "audit")) {
      recommendations.push(
        "Strengthen internal audit procedures and documentation",
      );
    }

    recommendations.push(
      "Conduct regular compliance training for relevant staff",
    );
    recommendations.push(
      "Establish automated compliance monitoring and alerting",
    );

    return recommendations;
  }

  async getAssessments(
    regulationId?: string,
    region?: string,
  ): Promise<ComplianceAssessment[]> {
    let assessments = Array.from(this.assessments.values());

    if (regulationId) {
      assessments = assessments.filter((a) => a.regulationId === regulationId);
    }

    if (region) {
      assessments = assessments.filter((a) => a.region === region);
    }

    return assessments.sort(
      (a, b) => b.lastAssessed.getTime() - a.lastAssessed.getTime(),
    );
  }

  async getMonitoring(
    regulationId?: string,
    region?: string,
  ): Promise<ComplianceMonitoring[]> {
    const monitoring = Array.from(this.monitoring.values());

    if (regulationId && region) {
      const key = `${regulationId}-${region}`;
      const specific = this.monitoring.get(key);
      return specific ? [specific] : [];
    }

    return monitoring.filter((m) => {
      if (regulationId && m.regulationId !== regulationId) return false;
      if (region && m.region !== region) return false;
      return true;
    });
  }

  async createAlert(
    alertData: Omit<ComplianceAlert, "id" | "created" | "resolved">,
  ): Promise<ComplianceAlert> {
    const alert: ComplianceAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created: new Date(),
      resolved: false,
      ...alertData,
    };

    this.alerts.set(alert.id, alert);

    // Add to region monitoring
    const key = `${alertData.regulation}-${alertData.region}`;
    const monitoring = this.monitoring.get(key);
    if (monitoring) {
      monitoring.alerts.push(alert);
    }

    return alert;
  }

  async getAlerts(filters?: {
    severity?: string;
    type?: string;
    region?: string;
    resolved?: boolean;
  }): Promise<ComplianceAlert[]> {
    let alerts = Array.from(this.alerts.values());

    if (filters?.severity) {
      alerts = alerts.filter((a) => a.severity === filters.severity);
    }

    if (filters?.type) {
      alerts = alerts.filter((a) => a.type === filters.type);
    }

    if (filters?.region) {
      alerts = alerts.filter((a) => a.region === filters.region);
    }

    if (filters?.resolved !== undefined) {
      alerts = alerts.filter((a) => a.resolved === filters.resolved);
    }

    return alerts.sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
      return b.created.getTime() - a.created.getTime();
    });
  }

  async resolveAlert(alertId: string): Promise<boolean> {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.resolved = true;
    return true;
  }

  async generateComplianceReport(
    region: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    summary: {
      totalRegulations: number;
      compliantRegulations: number;
      averageScore: number;
      criticalFindings: number;
      resolvedFindings: number;
    };
    details: Array<{
      regulation: string;
      score: number;
      status: string;
      findings: number;
      lastAssessed: Date;
    }>;
    recommendations: string[];
  }> {
    const regionAssessments = Array.from(this.assessments.values()).filter(
      (a) =>
        a.region === region &&
        a.lastAssessed >= startDate &&
        a.lastAssessed <= endDate,
    );

    const summary = {
      totalRegulations: regionAssessments.length,
      compliantRegulations: regionAssessments.filter(
        (a) => a.status === "compliant",
      ).length,
      averageScore:
        regionAssessments.reduce((sum, a) => sum + a.score, 0) /
          regionAssessments.length || 0,
      criticalFindings: regionAssessments.reduce(
        (sum, a) =>
          sum + a.findings.filter((f) => f.severity === "critical").length,
        0,
      ),
      resolvedFindings: regionAssessments.reduce(
        (sum, a) =>
          sum + a.findings.filter((f) => f.status === "resolved").length,
        0,
      ),
    };

    const details = regionAssessments.map((assessment) => ({
      regulation: assessment.regulationId,
      score: assessment.score,
      status: assessment.status,
      findings: assessment.findings.length,
      lastAssessed: assessment.lastAssessed,
    }));

    const recommendations = [
      ...new Set(regionAssessments.flatMap((a) => a.recommendations)),
    ].slice(0, 10); // Top 10 unique recommendations

    return { summary, details, recommendations };
  }

  private startComplianceMonitoring(): void {
    setInterval(() => {
      // Update compliance scores and risk levels
      for (const monitoring of this.monitoring.values()) {
        // Simulate score fluctuations
        const variation = (Math.random() - 0.5) * 2; // ±1 point
        monitoring.metrics.complianceScore = Math.max(
          70,
          Math.min(100, monitoring.metrics.complianceScore + variation),
        );

        // Update risk level based on score
        if (monitoring.metrics.complianceScore >= 95) {
          monitoring.metrics.riskLevel = "low";
        } else if (monitoring.metrics.complianceScore >= 85) {
          monitoring.metrics.riskLevel = "medium";
        } else if (monitoring.metrics.complianceScore >= 75) {
          monitoring.metrics.riskLevel = "high";
        } else {
          monitoring.metrics.riskLevel = "critical";
        }

        monitoring.lastUpdated = new Date();
      }
    }, 300000); // Every 5 minutes
  }

  private startAlertSystem(): void {
    setInterval(() => {
      // Check for upcoming deadlines and generate alerts
      const now = new Date();
      const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      for (const regulation of this.regulations.values()) {
        for (const requirement of regulation.requirements) {
          if (
            requirement.deadline &&
            requirement.deadline <= next30Days &&
            requirement.deadline > now
          ) {
            // Check if alert already exists
            const existingAlert = Array.from(this.alerts.values()).find(
              (a) =>
                a.type === "deadline" &&
                a.regulation === regulation.id &&
                !a.resolved,
            );

            if (!existingAlert) {
              this.createAlert({
                severity:
                  requirement.deadline <=
                  new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                    ? "critical"
                    : "warning",
                type: "deadline",
                title: `Upcoming Compliance Deadline`,
                description: `${requirement.title} deadline approaching for ${regulation.shortName}`,
                actionRequired: "Complete compliance requirement documentation",
                dueDate: requirement.deadline,
                region: regulation.applicability.regions[0] || "global",
                regulation: regulation.id,
              });
            }
          }
        }
      }
    }, 86400000); // Daily check
  }

  async getComplianceOverview(): Promise<{
    globalComplianceScore: number;
    totalRegulations: number;
    compliantRegulations: number;
    criticalAlerts: number;
    upcomingDeadlines: number;
    regionBreakdown: Array<{
      region: string;
      score: number;
      regulations: number;
      alerts: number;
    }>;
  }> {
    const assessments = Array.from(this.assessments.values());
    const alerts = Array.from(this.alerts.values()).filter((a) => !a.resolved);

    const globalScore =
      assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length ||
      0;
    const compliantCount = assessments.filter(
      (a) => a.status === "compliant",
    ).length;
    const criticalAlerts = alerts.filter(
      (a) => a.severity === "critical",
    ).length;
    const upcomingDeadlines = alerts.filter(
      (a) => a.type === "deadline",
    ).length;

    // Calculate region breakdown
    const regionMap = new Map<
      string,
      { score: number; count: number; regulations: number; alerts: number }
    >();

    for (const assessment of assessments) {
      const existing = regionMap.get(assessment.region) || {
        score: 0,
        count: 0,
        regulations: 0,
        alerts: 0,
      };
      existing.score += assessment.score;
      existing.count += 1;
      existing.regulations += 1;
      regionMap.set(assessment.region, existing);
    }

    for (const alert of alerts) {
      const existing = regionMap.get(alert.region) || {
        score: 0,
        count: 0,
        regulations: 0,
        alerts: 0,
      };
      existing.alerts += 1;
      regionMap.set(alert.region, existing);
    }

    const regionBreakdown = Array.from(regionMap.entries()).map(
      ([region, data]) => ({
        region,
        score: data.count > 0 ? Math.round(data.score / data.count) : 0,
        regulations: data.regulations,
        alerts: data.alerts,
      }),
    );

    return {
      globalComplianceScore: Math.round(globalScore),
      totalRegulations: this.regulations.size,
      compliantRegulations: compliantCount,
      criticalAlerts,
      upcomingDeadlines,
      regionBreakdown,
    };
  }
}

export const regionalComplianceService = singletonPattern(
  () => new RegionalComplianceService(),
);
