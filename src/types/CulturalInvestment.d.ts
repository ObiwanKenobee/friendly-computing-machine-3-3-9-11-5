export interface CulturalInvestment {
  id: string;
  name: string;
  description: string;
  framework: CulturalFramework;
  screening: ScreeningCriteria;
  compliance: CulturalCompliance;
  performance: CulturalPerformance;
  community: CommunityEngagement;
  certification: Certification[];
  metadata: CulturalMetadata;
}

export interface CulturalFramework {
  type:
    | "islamic"
    | "christian"
    | "jewish"
    | "buddhist"
    | "hindu"
    | "indigenous"
    | "esg"
    | "custom";
  principles: string[];
  guidelines: string[];
  authorities: string[];
  region: string;
  language: string;
}

export interface ScreeningCriteria {
  prohibited: ProhibitedActivity[];
  required: RequiredActivity[];
  preferred: PreferredActivity[];
  thresholds: ComplianceThreshold[];
  methodology: string;
  frequency: string;
}

export interface ProhibitedActivity {
  category: string;
  activity: string;
  reasoning: string;
  severity: "absolute" | "conditional" | "threshold";
  threshold?: number;
}

export interface RequiredActivity {
  category: string;
  activity: string;
  reasoning: string;
  minimumRequirement: string;
}

export interface PreferredActivity {
  category: string;
  activity: string;
  reasoning: string;
  bonus: number;
}

export interface ComplianceThreshold {
  metric: string;
  operator: ">" | "<" | "=" | ">=" | "<=";
  value: number;
  unit: string;
  tolerance: number;
}

export interface CulturalCompliance {
  score: number;
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  status: "compliant" | "conditional" | "non-compliant" | "under-review";
  violations: ComplianceViolation[];
  lastReview: Date;
  nextReview: Date;
  auditor: string;
  certificate?: string;
}

export interface ComplianceViolation {
  rule: string;
  description: string;
  severity: "critical" | "major" | "minor";
  discovered: Date;
  resolved?: Date;
  remediation: string;
}

export interface CulturalPerformance {
  impactScore: number;
  beneficiaries: number;
  sdgAlignment: SDGAlignment[];
  socialReturn: number;
  environmentalImpact: EnvironmentalMetric[];
  communityFeedback: CommunityFeedback[];
  reports: ImpactReport[];
}

export interface SDGAlignment {
  goal: number;
  target: string;
  contribution: number;
  measurement: string;
  evidence: string[];
}

export interface EnvironmentalMetric {
  indicator: string;
  value: number;
  unit: string;
  baseline: number;
  target: number;
  progress: number;
}

export interface CommunityFeedback {
  source: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
}

export interface ImpactReport {
  id: string;
  title: string;
  period: string;
  summary: string;
  metrics: ReportMetric[];
  published: Date;
  url: string;
}

export interface ReportMetric {
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: "improving" | "stable" | "declining";
}

export interface CommunityEngagement {
  stakeholders: Stakeholder[];
  consultations: Consultation[];
  partnerships: Partnership[];
  feedback: FeedbackChannel[];
  transparency: TransparencyMeasure[];
}

export interface Stakeholder {
  type: "investor" | "community" | "regulator" | "scholar" | "beneficiary";
  name: string;
  role: string;
  influence: "high" | "medium" | "low";
  engagement: "active" | "passive" | "consulted";
}

export interface Consultation {
  topic: string;
  participants: string[];
  date: Date;
  outcome: string;
  implementation: string;
}

export interface Partnership {
  organization: string;
  type: "implementation" | "oversight" | "advisory" | "funding";
  duration: string;
  objectives: string[];
  status: "active" | "pending" | "completed" | "terminated";
}

export interface FeedbackChannel {
  type: "survey" | "forum" | "hotline" | "meeting" | "email";
  frequency: string;
  participants: number;
  responsiveness: number;
}

export interface TransparencyMeasure {
  type: "reporting" | "disclosure" | "audit" | "monitoring";
  frequency: string;
  accessibility: string;
  language: string[];
}

export interface Certification {
  authority: string;
  name: string;
  number: string;
  issued: Date;
  expires: Date;
  scope: string;
  level: string;
  status: "valid" | "expired" | "suspended" | "revoked";
}

export interface CulturalMetadata {
  targetMarkets: string[];
  languages: string[];
  currencies: string[];
  regulations: string[];
  documentation: string[];
  contacts: CulturalContact[];
}

export interface CulturalContact {
  role: "scholar" | "advisor" | "auditor" | "community-leader";
  name: string;
  organization: string;
  credentials: string[];
  contact: string;
}

export interface IslamicInvestment extends CulturalInvestment {
  sharia: ShariaCompliance;
  zakat: ZakatCalculation;
  purification: PurificationProcess;
}

export interface ShariaCompliance {
  board: ShariaBoard;
  principles: ShariaPrinciple[];
  screening: ShariaScreening;
  monitoring: ShariaMonitoring;
}

export interface ShariaBoard {
  scholars: ShariaScholar[];
  chairman: string;
  meetings: number;
  decisions: ShariaDecision[];
}

export interface ShariaScholar {
  name: string;
  credentials: string[];
  specialization: string[];
  tenure: number;
}

export interface ShariaPrinciple {
  principle: string;
  description: string;
  application: string;
  evidence: string[];
}

export interface ShariaScreening {
  ratios: ShariaRatio[];
  sectors: ProhibitedSector[];
  activities: ProhibitedActivity[];
}

export interface ShariaRatio {
  name: string;
  threshold: number;
  current: number;
  status: "compliant" | "non-compliant";
}

export interface ProhibitedSector {
  sector: string;
  reasoning: string;
  exceptions: string[];
}

export interface ShariaMonitoring {
  frequency: string;
  reports: string[];
  violations: ShariaViolation[];
}

export interface ShariaViolation {
  date: Date;
  description: string;
  action: string;
  resolved: boolean;
}

export interface ShariaDecision {
  date: Date;
  topic: string;
  decision: string;
  reasoning: string;
  implementation: Date;
}

export interface ZakatCalculation {
  applicable: boolean;
  rate: number;
  base: number;
  amount: number;
  distribution: ZakatDistribution[];
}

export interface ZakatDistribution {
  category: string;
  amount: number;
  recipients: string[];
}

export interface PurificationProcess {
  required: boolean;
  amount: number;
  calculation: string;
  distribution: string;
  frequency: string;
}
