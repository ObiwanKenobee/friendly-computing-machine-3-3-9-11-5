/**
 * Comprehensive Compliance Management System
 * Enterprise-grade compliance tracking for GDPR, SOC2, ISO27001, and other frameworks
 */

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  applicableRegions: string[];
  mandatoryForIndustries: string[];
  certificationBody?: string;
  validityPeriod: number; // months
  lastAuditDate?: string;
  nextAuditDate?: string;
  status: "compliant" | "partial" | "non-compliant" | "pending-audit";
  overallScore: number;
  requirements: ComplianceRequirement[];
  documents: ComplianceDocument[];
  auditTrail: AuditEvent[];
}

export interface ComplianceRequirement {
  id: string;
  frameworkId: string;
  section: string;
  title: string;
  description: string;
  category: "security" | "privacy" | "governance" | "technical" | "operational";
  priority: "critical" | "high" | "medium" | "low";
  status:
    | "compliant"
    | "partial"
    | "non-compliant"
    | "not-applicable"
    | "pending";
  implementationStatus:
    | "implemented"
    | "in-progress"
    | "planned"
    | "not-started";
  dueDate?: string;
  assignedTo?: string;
  lastReviewDate?: string;
  nextReviewDate: string;
  evidenceRequired: string[];
  evidenceProvided: ComplianceEvidence[];
  controlsImplemented: SecurityControl[];
  riskLevel: "low" | "medium" | "high" | "critical";
  automatedCheck: boolean;
  checkFrequency?: "daily" | "weekly" | "monthly" | "quarterly" | "annually";
  lastCheckDate?: string;
  checkResults?: ComplianceCheckResult[];
}

export interface ComplianceEvidence {
  id: string;
  requirementId: string;
  type:
    | "document"
    | "screenshot"
    | "log-file"
    | "certificate"
    | "policy"
    | "procedure";
  title: string;
  description: string;
  fileUrl?: string;
  content?: string;
  hash: string;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate?: string;
  reviewStatus: "pending" | "approved" | "rejected" | "needs-revision";
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComments?: string;
}

export interface SecurityControl {
  id: string;
  name: string;
  type: "preventive" | "detective" | "corrective" | "administrative";
  category:
    | "access-control"
    | "encryption"
    | "monitoring"
    | "backup"
    | "training"
    | "policy";
  implementation: "manual" | "semi-automated" | "automated";
  effectivenessRating: number; // 1-10
  lastTested?: string;
  testResults?: string;
  responsible: string;
  frequency: "continuous" | "daily" | "weekly" | "monthly" | "quarterly";
  status: "active" | "inactive" | "under-review" | "scheduled-for-removal";
}

export interface ComplianceDocument {
  id: string;
  frameworkId: string;
  title: string;
  type:
    | "policy"
    | "procedure"
    | "guideline"
    | "standard"
    | "template"
    | "report";
  version: string;
  content: string;
  author: string;
  approvedBy?: string;
  createdAt: string;
  lastModified: string;
  nextReview: string;
  status: "draft" | "under-review" | "approved" | "published" | "archived";
  relatedRequirements: string[];
  tags: string[];
}

export interface AuditEvent {
  id: string;
  frameworkId: string;
  requirementId?: string;
  eventType:
    | "status-change"
    | "evidence-uploaded"
    | "review-completed"
    | "audit-finding"
    | "control-test";
  description: string;
  performedBy: string;
  timestamp: string;
  oldValue?: any;
  newValue?: any;
  severity: "info" | "warning" | "critical";
  automated: boolean;
}

export interface ComplianceCheckResult {
  id: string;
  requirementId: string;
  checkDate: string;
  status: "pass" | "fail" | "warning" | "manual-review-required";
  score: number;
  details: string;
  automatedFindings: string[];
  recommendedActions: string[];
  nextCheckDate: string;
}

export interface ComplianceReport {
  id: string;
  title: string;
  type:
    | "executive-summary"
    | "detailed-assessment"
    | "gap-analysis"
    | "certification-readiness";
  frameworkIds: string[];
  generatedAt: string;
  generatedBy: string;
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    overallScore: number;
    compliantRequirements: number;
    totalRequirements: number;
    criticalFindings: number;
    recommendationCount: number;
  };
  sections: ReportSection[];
  recommendations: Recommendation[];
  appendices: ReportAppendix[];
}

export interface ReportSection {
  title: string;
  content: string;
  charts?: ChartData[];
  tables?: TableData[];
}

export interface Recommendation {
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: "low" | "medium" | "high";
  timeline: string;
  assignedTo?: string;
  status: "open" | "in-progress" | "completed" | "deferred";
}

export interface ReportAppendix {
  title: string;
  content: string;
  type: "evidence-list" | "gap-analysis" | "control-matrix" | "risk-register";
}

export interface ChartData {
  type: "pie" | "bar" | "line" | "radar";
  title: string;
  data: any[];
}

export interface TableData {
  title: string;
  headers: string[];
  rows: string[][];
}

class ComplianceManagementService {
  private static instance: ComplianceManagementService;
  private frameworks: Map<string, ComplianceFramework> = new Map();
  private requirements: Map<string, ComplianceRequirement> = new Map();
  private evidence: Map<string, ComplianceEvidence> = new Map();
  private documents: Map<string, ComplianceDocument> = new Map();
  private auditTrail: AuditEvent[] = [];
  private checkScheduler: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.initializeFrameworks();
    this.setupAutomatedChecks();
  }

  public static getInstance(): ComplianceManagementService {
    if (!ComplianceManagementService.instance) {
      ComplianceManagementService.instance = new ComplianceManagementService();
    }
    return ComplianceManagementService.instance;
  }

  private initializeFrameworks(): void {
    // Initialize GDPR framework
    const gdpr: ComplianceFramework = {
      id: "gdpr-2018",
      name: "General Data Protection Regulation",
      version: "2018",
      description: "EU regulation on data protection and privacy",
      applicableRegions: ["EU", "EEA"],
      mandatoryForIndustries: ["all"],
      validityPeriod: 12,
      status: "compliant",
      overallScore: 94,
      requirements: this.generateGDPRRequirements(),
      documents: [],
      auditTrail: [],
    };

    // Initialize SOC 2 framework
    const soc2: ComplianceFramework = {
      id: "soc2-2017",
      name: "SOC 2 Type II",
      version: "2017",
      description: "Service Organization Control 2 audit",
      applicableRegions: ["US", "Global"],
      mandatoryForIndustries: [
        "financial-services",
        "healthcare",
        "technology",
      ],
      certificationBody: "AICPA",
      validityPeriod: 12,
      status: "compliant",
      overallScore: 92,
      requirements: this.generateSOC2Requirements(),
      documents: [],
      auditTrail: [],
    };

    // Initialize ISO 27001 framework
    const iso27001: ComplianceFramework = {
      id: "iso27001-2022",
      name: "ISO/IEC 27001",
      version: "2022",
      description: "Information security management systems",
      applicableRegions: ["Global"],
      mandatoryForIndustries: [],
      certificationBody: "ISO",
      validityPeriod: 36,
      status: "partial",
      overallScore: 78,
      requirements: this.generateISO27001Requirements(),
      documents: [],
      auditTrail: [],
    };

    this.frameworks.set(gdpr.id, gdpr);
    this.frameworks.set(soc2.id, soc2);
    this.frameworks.set(iso27001.id, iso27001);

    // Add requirements to the requirements map
    [gdpr, soc2, iso27001].forEach((framework) => {
      framework.requirements.forEach((req) => {
        this.requirements.set(req.id, req);
      });
    });
  }

  private generateGDPRRequirements(): ComplianceRequirement[] {
    return [
      {
        id: "gdpr-art6",
        frameworkId: "gdpr-2018",
        section: "Article 6",
        title: "Lawfulness of Processing",
        description:
          "Processing shall be lawful only if and to the extent that at least one legal basis applies",
        category: "privacy",
        priority: "critical",
        status: "compliant",
        implementationStatus: "implemented",
        nextReviewDate: this.addMonths(new Date(), 6).toISOString(),
        evidenceRequired: [
          "Privacy Policy",
          "Legal Basis Documentation",
          "Consent Records",
        ],
        evidenceProvided: [],
        controlsImplemented: [],
        riskLevel: "high",
        automatedCheck: true,
        checkFrequency: "monthly",
        checkResults: [],
      },
      {
        id: "gdpr-art32",
        frameworkId: "gdpr-2018",
        section: "Article 32",
        title: "Security of Processing",
        description:
          "Implement appropriate technical and organizational measures",
        category: "security",
        priority: "critical",
        status: "compliant",
        implementationStatus: "implemented",
        nextReviewDate: this.addMonths(new Date(), 3).toISOString(),
        evidenceRequired: [
          "Encryption Implementation",
          "Access Controls",
          "Security Assessments",
        ],
        evidenceProvided: [],
        controlsImplemented: [],
        riskLevel: "critical",
        automatedCheck: true,
        checkFrequency: "weekly",
        checkResults: [],
      },
      {
        id: "gdpr-art33",
        frameworkId: "gdpr-2018",
        section: "Article 33",
        title: "Notification of Personal Data Breach",
        description:
          "Notify supervisory authority of data breaches within 72 hours",
        category: "operational",
        priority: "high",
        status: "compliant",
        implementationStatus: "implemented",
        nextReviewDate: this.addMonths(new Date(), 6).toISOString(),
        evidenceRequired: [
          "Incident Response Plan",
          "Notification Procedures",
          "Breach Register",
        ],
        evidenceProvided: [],
        controlsImplemented: [],
        riskLevel: "high",
        automatedCheck: false,
        checkResults: [],
      },
    ];
  }

  private generateSOC2Requirements(): ComplianceRequirement[] {
    return [
      {
        id: "soc2-cc6.1",
        frameworkId: "soc2-2017",
        section: "CC6.1",
        title: "Logical and Physical Access Controls",
        description: "Implement controls to manage logical and physical access",
        category: "security",
        priority: "critical",
        status: "compliant",
        implementationStatus: "implemented",
        nextReviewDate: this.addMonths(new Date(), 3).toISOString(),
        evidenceRequired: [
          "Access Control Matrix",
          "Physical Security Procedures",
          "Access Reviews",
        ],
        evidenceProvided: [],
        controlsImplemented: [],
        riskLevel: "high",
        automatedCheck: true,
        checkFrequency: "weekly",
        checkResults: [],
      },
      {
        id: "soc2-cc6.2",
        frameworkId: "soc2-2017",
        section: "CC6.2",
        title: "System Access Control",
        description:
          "Prior to issuing system credentials, the entity verifies user identity",
        category: "security",
        priority: "high",
        status: "compliant",
        implementationStatus: "implemented",
        nextReviewDate: this.addMonths(new Date(), 3).toISOString(),
        evidenceRequired: [
          "Identity Verification Procedures",
          "User Provisioning Process",
        ],
        evidenceProvided: [],
        controlsImplemented: [],
        riskLevel: "medium",
        automatedCheck: true,
        checkFrequency: "monthly",
        checkResults: [],
      },
    ];
  }

  private generateISO27001Requirements(): ComplianceRequirement[] {
    return [
      {
        id: "iso27001-a9.1",
        frameworkId: "iso27001-2022",
        section: "A.9.1",
        title: "Access Control Policy",
        description:
          "An access control policy shall be established and reviewed",
        category: "governance",
        priority: "high",
        status: "compliant",
        implementationStatus: "implemented",
        nextReviewDate: this.addMonths(new Date(), 12).toISOString(),
        evidenceRequired: [
          "Access Control Policy Document",
          "Policy Review Records",
        ],
        evidenceProvided: [],
        controlsImplemented: [],
        riskLevel: "medium",
        automatedCheck: false,
        checkResults: [],
      },
      {
        id: "iso27001-a12.1",
        frameworkId: "iso27001-2022",
        section: "A.12.1",
        title: "Operational Procedures and Responsibilities",
        description:
          "Operating procedures shall be documented and made available",
        category: "operational",
        priority: "medium",
        status: "non-compliant",
        implementationStatus: "in-progress",
        nextReviewDate: this.addMonths(new Date(), 1).toISOString(),
        evidenceRequired: ["Operational Procedures", "Responsibility Matrix"],
        evidenceProvided: [],
        controlsImplemented: [],
        riskLevel: "medium",
        automatedCheck: false,
        checkResults: [],
      },
    ];
  }

  private setupAutomatedChecks(): void {
    // Setup automated compliance checks
    this.requirements.forEach((requirement) => {
      if (requirement.automatedCheck && requirement.checkFrequency) {
        this.scheduleComplianceCheck(requirement);
      }
    });
  }

  private scheduleComplianceCheck(requirement: ComplianceRequirement): void {
    const frequency = requirement.checkFrequency!;
    let interval: number;

    switch (frequency) {
      case "daily":
        interval = 24 * 60 * 60 * 1000;
        break;
      case "weekly":
        interval = 7 * 24 * 60 * 60 * 1000;
        break;
      case "monthly":
        interval = 30 * 24 * 60 * 60 * 1000;
        break;
      case "quarterly":
        interval = 90 * 24 * 60 * 60 * 1000;
        break;
      case "annually":
        interval = 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        return;
    }

    const timeoutId = setInterval(() => {
      this.runAutomatedCheck(requirement.id);
    }, interval);

    this.checkScheduler.set(requirement.id, timeoutId);
  }

  private async runAutomatedCheck(requirementId: string): Promise<void> {
    const requirement = this.requirements.get(requirementId);
    if (!requirement) return;

    try {
      const result = await this.performComplianceCheck(requirement);

      requirement.checkResults = requirement.checkResults || [];
      requirement.checkResults.push(result);
      requirement.lastCheckDate = new Date().toISOString();

      // Keep only last 10 check results
      if (requirement.checkResults.length > 10) {
        requirement.checkResults = requirement.checkResults.slice(-10);
      }

      // Update requirement status based on check result
      if (result.status === "fail") {
        requirement.status = "non-compliant";
      } else if (result.status === "warning") {
        requirement.status = "partial";
      } else if (result.status === "pass") {
        requirement.status = "compliant";
      }

      // Log audit event
      this.logAuditEvent({
        frameworkId: requirement.frameworkId,
        requirementId: requirement.id,
        eventType: "control-test",
        description: `Automated compliance check completed: ${result.status}`,
        performedBy: "system",
        timestamp: new Date().toISOString(),
        severity:
          result.status === "fail"
            ? "critical"
            : result.status === "warning"
              ? "warning"
              : "info",
        automated: true,
      });
    } catch (error) {
      console.error(
        `Failed to run automated check for ${requirementId}:`,
        error,
      );
    }
  }

  private async performComplianceCheck(
    requirement: ComplianceRequirement,
  ): Promise<ComplianceCheckResult> {
    // This is where specific compliance checks would be implemented
    // For demonstration, we'll simulate different types of checks

    const result: ComplianceCheckResult = {
      id: this.generateId(),
      requirementId: requirement.id,
      checkDate: new Date().toISOString(),
      status: "pass",
      score: 0,
      details: "",
      automatedFindings: [],
      recommendedActions: [],
      nextCheckDate: this.calculateNextCheckDate(
        requirement.checkFrequency!,
      ).toISOString(),
    };

    switch (requirement.id) {
      case "gdpr-art32": // Security of Processing
        result.status = (await this.checkEncryptionImplementation())
          ? "pass"
          : "fail";
        result.score = result.status === "pass" ? 100 : 0;
        result.details = "Encryption implementation verification";
        if (result.status === "fail") {
          result.automatedFindings.push(
            "Encryption not properly implemented for all data at rest",
          );
          result.recommendedActions.push(
            "Enable encryption for all database storage",
          );
        }
        break;

      case "soc2-cc6.1": // Access Controls
        const accessControlScore = await this.checkAccessControls();
        result.score = accessControlScore;
        result.status =
          accessControlScore >= 90
            ? "pass"
            : accessControlScore >= 70
              ? "warning"
              : "fail";
        result.details = `Access control assessment score: ${accessControlScore}%`;
        if (accessControlScore < 90) {
          result.automatedFindings.push("Some users have excessive privileges");
          result.recommendedActions.push(
            "Review and update user access permissions",
          );
        }
        break;

      case "gdpr-art6": // Lawfulness of Processing
        const hasValidLegalBasis = await this.checkLegalBasisDocumentation();
        result.status = hasValidLegalBasis ? "pass" : "fail";
        result.score = hasValidLegalBasis ? 100 : 0;
        result.details = "Legal basis documentation verification";
        if (!hasValidLegalBasis) {
          result.automatedFindings.push(
            "Missing or incomplete legal basis documentation",
          );
          result.recommendedActions.push(
            "Update privacy policy and legal basis documentation",
          );
        }
        break;

      default:
        // Generic check
        result.status = Math.random() > 0.1 ? "pass" : "warning";
        result.score = Math.floor(Math.random() * 20) + 80; // 80-100
        result.details = "Generic automated compliance check";
    }

    return result;
  }

  // Specific compliance check implementations
  private async checkEncryptionImplementation(): Promise<boolean> {
    // Check if encryption is enabled for databases, file storage, etc.
    // This would integrate with actual infrastructure checks
    return Math.random() > 0.05; // 95% success rate for demo
  }

  private async checkAccessControls(): Promise<number> {
    // Analyze user access patterns, permissions, etc.
    // Return a score from 0-100
    return Math.floor(Math.random() * 30) + 70; // 70-100 for demo
  }

  private async checkLegalBasisDocumentation(): Promise<boolean> {
    // Verify that legal basis documentation exists and is current
    return Math.random() > 0.02; // 98% success rate for demo
  }

  // Evidence Management
  public async uploadEvidence(
    requirementId: string,
    evidence: Omit<ComplianceEvidence, "id" | "uploadedAt" | "hash">,
  ): Promise<string> {
    const evidenceId = this.generateId();
    const hash = this.generateHash(evidence.content || evidence.fileUrl || "");

    const fullEvidence: ComplianceEvidence = {
      ...evidence,
      id: evidenceId,
      uploadedAt: new Date().toISOString(),
      hash,
      reviewStatus: "pending",
    };

    this.evidence.set(evidenceId, fullEvidence);

    // Add evidence to requirement
    const requirement = this.requirements.get(requirementId);
    if (requirement) {
      requirement.evidenceProvided.push(fullEvidence);
    }

    // Log audit event
    this.logAuditEvent({
      frameworkId: requirement?.frameworkId || "",
      requirementId,
      eventType: "evidence-uploaded",
      description: `Evidence uploaded: ${evidence.title}`,
      performedBy: evidence.uploadedBy,
      timestamp: new Date().toISOString(),
      severity: "info",
      automated: false,
    });

    return evidenceId;
  }

  public async reviewEvidence(
    evidenceId: string,
    reviewStatus: ComplianceEvidence["reviewStatus"],
    reviewedBy: string,
    comments?: string,
  ): Promise<boolean> {
    const evidence = this.evidence.get(evidenceId);
    if (!evidence) return false;

    evidence.reviewStatus = reviewStatus;
    evidence.reviewedBy = reviewedBy;
    evidence.reviewedAt = new Date().toISOString();
    evidence.reviewComments = comments;

    // Log audit event
    const requirement = this.requirements.get(evidence.requirementId);
    this.logAuditEvent({
      frameworkId: requirement?.frameworkId || "",
      requirementId: evidence.requirementId,
      eventType: "review-completed",
      description: `Evidence reviewed: ${evidence.title} - ${reviewStatus}`,
      performedBy: reviewedBy,
      timestamp: new Date().toISOString(),
      oldValue: "pending",
      newValue: reviewStatus,
      severity: reviewStatus === "rejected" ? "warning" : "info",
      automated: false,
    });

    return true;
  }

  // Document Management
  public async createDocument(
    document: Omit<
      ComplianceDocument,
      "id" | "createdAt" | "lastModified" | "status"
    >,
  ): Promise<string> {
    const documentId = this.generateId();
    const fullDocument: ComplianceDocument = {
      ...document,
      id: documentId,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: "draft",
    };

    this.documents.set(documentId, fullDocument);

    // Add document to framework
    const framework = this.frameworks.get(document.frameworkId);
    if (framework) {
      framework.documents.push(fullDocument);
    }

    return documentId;
  }

  public async updateDocumentStatus(
    documentId: string,
    status: ComplianceDocument["status"],
    approvedBy?: string,
  ): Promise<boolean> {
    const document = this.documents.get(documentId);
    if (!document) return false;

    const oldStatus = document.status;
    document.status = status;
    document.lastModified = new Date().toISOString();
    if (approvedBy) {
      document.approvedBy = approvedBy;
    }

    // Log audit event
    this.logAuditEvent({
      frameworkId: document.frameworkId,
      eventType: "status-change",
      description: `Document status changed: ${document.title}`,
      performedBy: approvedBy || "system",
      timestamp: new Date().toISOString(),
      oldValue: oldStatus,
      newValue: status,
      severity: "info",
      automated: false,
    });

    return true;
  }

  // Reporting
  public async generateComplianceReport(
    type: ComplianceReport["type"],
    frameworkIds: string[],
    period: { startDate: string; endDate: string },
  ): Promise<ComplianceReport> {
    const reportId = this.generateId();

    const selectedFrameworks = frameworkIds
      .map((id) => this.frameworks.get(id))
      .filter(Boolean) as ComplianceFramework[];

    // Calculate summary statistics
    const allRequirements = selectedFrameworks.flatMap((f) => f.requirements);
    const compliantRequirements = allRequirements.filter(
      (r) => r.status === "compliant",
    ).length;
    const criticalFindings = allRequirements.filter(
      (r) => r.riskLevel === "critical" && r.status !== "compliant",
    ).length;

    const overallScore =
      allRequirements.length > 0
        ? Math.round((compliantRequirements / allRequirements.length) * 100)
        : 0;

    const report: ComplianceReport = {
      id: reportId,
      title: `${type.replace("-", " ").toUpperCase()} Report`,
      type,
      frameworkIds,
      generatedAt: new Date().toISOString(),
      generatedBy: "system", // In real implementation, this would be the current user
      period,
      summary: {
        overallScore,
        compliantRequirements,
        totalRequirements: allRequirements.length,
        criticalFindings,
        recommendationCount: 0, // Will be calculated below
      },
      sections: [],
      recommendations: [],
      appendices: [],
    };

    // Generate report sections based on type
    switch (type) {
      case "executive-summary":
        report.sections =
          this.generateExecutiveSummarySections(selectedFrameworks);
        break;
      case "detailed-assessment":
        report.sections =
          this.generateDetailedAssessmentSections(selectedFrameworks);
        break;
      case "gap-analysis":
        report.sections = this.generateGapAnalysisSections(selectedFrameworks);
        break;
      case "certification-readiness":
        report.sections =
          this.generateCertificationReadinessSections(selectedFrameworks);
        break;
    }

    // Generate recommendations
    report.recommendations = this.generateRecommendations(selectedFrameworks);
    report.summary.recommendationCount = report.recommendations.length;

    // Generate appendices
    report.appendices = this.generateReportAppendices(selectedFrameworks);

    return report;
  }

  private generateExecutiveSummarySections(
    frameworks: ComplianceFramework[],
  ): ReportSection[] {
    return [
      {
        title: "Compliance Overview",
        content: `This executive summary provides an overview of the organization's compliance status across ${frameworks.length} frameworks.`,
        charts: [
          {
            type: "pie",
            title: "Overall Compliance Status",
            data: frameworks.map((f) => ({
              name: f.name,
              value: f.overallScore,
              status: f.status,
            })),
          },
        ],
      },
      {
        title: "Key Findings",
        content:
          "Summary of key compliance findings and areas requiring attention.",
      },
      {
        title: "Strategic Recommendations",
        content: "High-level recommendations for improving compliance posture.",
      },
    ];
  }

  private generateDetailedAssessmentSections(
    frameworks: ComplianceFramework[],
  ): ReportSection[] {
    return frameworks.map((framework) => ({
      title: `${framework.name} Assessment`,
      content: `Detailed assessment of ${framework.name} compliance requirements.`,
      tables: [
        {
          title: "Requirement Status Summary",
          headers: ["Requirement", "Status", "Last Review", "Risk Level"],
          rows: framework.requirements.map((req) => [
            req.title,
            req.status,
            req.lastReviewDate || "Never",
            req.riskLevel,
          ]),
        },
      ],
    }));
  }

  private generateGapAnalysisSections(
    frameworks: ComplianceFramework[],
  ): ReportSection[] {
    return [
      {
        title: "Compliance Gaps",
        content: "Analysis of compliance gaps across all frameworks.",
        tables: [
          {
            title: "Non-Compliant Requirements",
            headers: [
              "Framework",
              "Requirement",
              "Gap Description",
              "Priority",
            ],
            rows: frameworks.flatMap((f) =>
              f.requirements
                .filter(
                  (r) => r.status === "non-compliant" || r.status === "partial",
                )
                .map((req) => [
                  f.name,
                  req.title,
                  `Status: ${req.status}`,
                  req.priority,
                ]),
            ),
          },
        ],
      },
    ];
  }

  private generateCertificationReadinessSections(
    frameworks: ComplianceFramework[],
  ): ReportSection[] {
    return frameworks.map((framework) => ({
      title: `${framework.name} Certification Readiness`,
      content: `Assessment of readiness for ${framework.name} certification audit.`,
      charts: [
        {
          type: "bar",
          title: "Readiness Score by Category",
          data: this.calculateReadinessByCategory(framework),
        },
      ],
    }));
  }

  private calculateReadinessByCategory(framework: ComplianceFramework): any[] {
    const categories = [
      "security",
      "privacy",
      "governance",
      "technical",
      "operational",
    ];

    return categories.map((category) => {
      const categoryRequirements = framework.requirements.filter(
        (r) => r.category === category,
      );
      const compliantCount = categoryRequirements.filter(
        (r) => r.status === "compliant",
      ).length;
      const score =
        categoryRequirements.length > 0
          ? Math.round((compliantCount / categoryRequirements.length) * 100)
          : 0;

      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        score,
        total: categoryRequirements.length,
        compliant: compliantCount,
      };
    });
  }

  private generateRecommendations(
    frameworks: ComplianceFramework[],
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    frameworks.forEach((framework) => {
      framework.requirements.forEach((req) => {
        if (req.status === "non-compliant" || req.status === "partial") {
          recommendations.push({
            priority: req.priority,
            category: req.category,
            title: `Address ${req.title}`,
            description: `Requirement ${req.section} is currently ${req.status}`,
            impact:
              req.riskLevel === "critical"
                ? "High impact on compliance score"
                : "Medium impact on compliance score",
            effort:
              req.implementationStatus === "not-started" ? "high" : "medium",
            timeline:
              req.dueDate || this.addMonths(new Date(), 3).toISOString(),
            status: "open",
          });
        }
      });
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private generateReportAppendices(
    frameworks: ComplianceFramework[],
  ): ReportAppendix[] {
    return [
      {
        title: "Evidence Inventory",
        content: "Complete list of compliance evidence collected",
        type: "evidence-list",
      },
      {
        title: "Control Effectiveness Matrix",
        content: "Assessment of security control effectiveness",
        type: "control-matrix",
      },
      {
        title: "Risk Register",
        content: "Compliance-related risks and mitigation strategies",
        type: "risk-register",
      },
    ];
  }

  // Audit Trail
  private logAuditEvent(event: Omit<AuditEvent, "id">): void {
    const auditEvent: AuditEvent = {
      ...event,
      id: this.generateId(),
    };

    this.auditTrail.push(auditEvent);

    // Add to framework audit trail
    const framework = this.frameworks.get(event.frameworkId);
    if (framework) {
      framework.auditTrail.push(auditEvent);
    }

    // Keep only last 1000 events
    if (this.auditTrail.length > 1000) {
      this.auditTrail = this.auditTrail.slice(-1000);
    }
  }

  // Utility methods
  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  private calculateNextCheckDate(
    frequency: ComplianceRequirement["checkFrequency"],
  ): Date {
    const now = new Date();
    switch (frequency) {
      case "daily":
        return this.addDays(now, 1);
      case "weekly":
        return this.addDays(now, 7);
      case "monthly":
        return this.addMonths(now, 1);
      case "quarterly":
        return this.addMonths(now, 3);
      case "annually":
        return this.addMonths(now, 12);
      default:
        return this.addMonths(now, 1);
    }
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private generateHash(content: string): string {
    // Simple hash function for demo purposes
    return btoa(content).substring(0, 16);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API methods
  public getFrameworks(): ComplianceFramework[] {
    return Array.from(this.frameworks.values());
  }

  public getFramework(frameworkId: string): ComplianceFramework | undefined {
    return this.frameworks.get(frameworkId);
  }

  public getRequirements(frameworkId?: string): ComplianceRequirement[] {
    if (frameworkId) {
      return Array.from(this.requirements.values()).filter(
        (r) => r.frameworkId === frameworkId,
      );
    }
    return Array.from(this.requirements.values());
  }

  public getRequirement(
    requirementId: string,
  ): ComplianceRequirement | undefined {
    return this.requirements.get(requirementId);
  }

  public async updateRequirementStatus(
    requirementId: string,
    status: ComplianceRequirement["status"],
    updatedBy: string,
  ): Promise<boolean> {
    const requirement = this.requirements.get(requirementId);
    if (!requirement) return false;

    const oldStatus = requirement.status;
    requirement.status = status;
    requirement.lastReviewDate = new Date().toISOString();

    this.logAuditEvent({
      frameworkId: requirement.frameworkId,
      requirementId,
      eventType: "status-change",
      description: `Requirement status updated: ${requirement.title}`,
      performedBy: updatedBy,
      timestamp: new Date().toISOString(),
      oldValue: oldStatus,
      newValue: status,
      severity: status === "non-compliant" ? "critical" : "info",
      automated: false,
    });

    return true;
  }

  public getAuditTrail(frameworkId?: string): AuditEvent[] {
    if (frameworkId) {
      return this.auditTrail.filter(
        (event) => event.frameworkId === frameworkId,
      );
    }
    return this.auditTrail;
  }

  public getDashboardMetrics(): {
    overallComplianceScore: number;
    frameworkStatuses: { name: string; status: string; score: number }[];
    criticalFindings: number;
    upcomingReviews: number;
    recentAuditEvents: AuditEvent[];
  } {
    const frameworks = this.getFrameworks();
    const overallScore =
      frameworks.length > 0
        ? Math.round(
            frameworks.reduce((sum, f) => sum + f.overallScore, 0) /
              frameworks.length,
          )
        : 0;

    const criticalFindings = Array.from(this.requirements.values()).filter(
      (r) => r.riskLevel === "critical" && r.status !== "compliant",
    ).length;

    const upcomingReviews = Array.from(this.requirements.values()).filter(
      (r) => {
        if (!r.nextReviewDate) return false;
        const reviewDate = new Date(r.nextReviewDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return reviewDate <= thirtyDaysFromNow;
      },
    ).length;

    return {
      overallComplianceScore: overallScore,
      frameworkStatuses: frameworks.map((f) => ({
        name: f.name,
        status: f.status,
        score: f.overallScore,
      })),
      criticalFindings,
      upcomingReviews,
      recentAuditEvents: this.auditTrail.slice(-10),
    };
  }
}

// Export singleton instance
export const complianceManagementService =
  ComplianceManagementService.getInstance();
