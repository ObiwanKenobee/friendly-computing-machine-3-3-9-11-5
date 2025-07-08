export interface CommunityFund {
  id: string;
  name: string;
  description: string;
  community: CommunityProfile;
  governance: CommunityGovernance;
  funding: FundingStructure;
  projects: CommunityProject[];
  members: CommunityMember[];
  decisions: CommunityDecision[];
  performance: CommunityPerformance;
  impact: CommunityImpact;
  metadata: CommunityMetadata;
}

export interface CommunityProfile {
  type: "geographic" | "demographic" | "interest" | "industry" | "purpose";
  region: string;
  size: number;
  characteristics: string[];
  needs: CommunityNeed[];
  assets: CommunityAsset[];
  challenges: string[];
  opportunities: string[];
}

export interface CommunityNeed {
  category:
    | "education"
    | "healthcare"
    | "infrastructure"
    | "economic"
    | "social"
    | "environmental";
  priority: "critical" | "high" | "medium" | "low";
  description: string;
  beneficiaries: number;
  cost: number;
  timeframe: string;
}

export interface CommunityAsset {
  type: "human" | "natural" | "physical" | "financial" | "social";
  description: string;
  value: number;
  utilization: number;
  potential: string;
}

export interface CommunityGovernance {
  structure: "democratic" | "representative" | "consensus" | "hybrid";
  votingMechanism: VotingMechanism;
  decisionProcess: DecisionProcess;
  leadership: CommunityLeadership;
  participation: ParticipationMetrics;
  transparency: TransparencyLevel;
}

export interface VotingMechanism {
  type: "token-weighted" | "one-person-one-vote" | "quadratic" | "delegated";
  threshold: number;
  quorum: number;
  timeline: string;
  eligibility: string[];
}

export interface DecisionProcess {
  proposal: ProposalRequirements;
  discussion: DiscussionPeriod;
  voting: VotingPeriod;
  implementation: ImplementationPhase;
  review: ReviewProcess;
}

export interface ProposalRequirements {
  minimumSupport: number;
  deposit: number;
  documentation: string[];
  timeline: string;
}

export interface DiscussionPeriod {
  duration: string;
  platform: string;
  moderation: boolean;
  feedback: boolean;
}

export interface VotingPeriod {
  duration: string;
  platform: string;
  privacy: boolean;
  delegation: boolean;
}

export interface ImplementationPhase {
  responsible: string;
  timeline: string;
  milestones: string[];
  reporting: string;
}

export interface ReviewProcess {
  frequency: string;
  criteria: string[];
  stakeholders: string[];
  outcomes: string[];
}

export interface CommunityLeadership {
  elected: ElectedOfficial[];
  appointed: AppointedRole[];
  advisory: AdvisoryBoard[];
  rotation: RotationPolicy;
}

export interface ElectedOfficial {
  position: string;
  name: string;
  tenure: string;
  responsibilities: string[];
  accountability: string[];
}

export interface AppointedRole {
  position: string;
  name: string;
  appointer: string;
  term: string;
  qualifications: string[];
}

export interface AdvisoryBoard {
  name: string;
  expertise: string[];
  role: string;
  term: string;
}

export interface RotationPolicy {
  frequency: string;
  mechanism: string;
  limits: string[];
}

export interface ParticipationMetrics {
  membershipGrowth: number;
  votingParticipation: number;
  proposalActivity: number;
  discussionEngagement: number;
  volunteerHours: number;
}

export interface TransparencyLevel {
  financialReporting: string;
  decisionDocumentation: string;
  memberAccess: string;
  publicDisclosure: string;
}

export interface FundingStructure {
  sources: FundingSource[];
  allocation: FundAllocation[];
  management: FundManagement;
  sustainability: SustainabilityPlan;
  accountability: AccountabilityMeasures;
}

export interface FundingSource {
  type:
    | "member-contributions"
    | "grants"
    | "donations"
    | "investments"
    | "revenue";
  amount: number;
  percentage: number;
  conditions: string[];
  sustainability: number;
}

export interface FundAllocation {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  utilization: number;
  impact: string;
}

export interface FundManagement {
  custodian: string;
  signatories: string[];
  approvalProcess: string;
  auditFrequency: string;
  transparency: string;
}

export interface SustainabilityPlan {
  strategy: string;
  timeline: string;
  milestones: string[];
  risks: string[];
  mitigation: string[];
}

export interface AccountabilityMeasures {
  reporting: string[];
  oversight: string[];
  sanctions: string[];
  appeals: string[];
}

export interface CommunityProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "proposed" | "approved" | "active" | "completed" | "cancelled";
  budget: number;
  spent: number;
  timeline: ProjectTimeline;
  stakeholders: ProjectStakeholder[];
  milestones: ProjectMilestone[];
  impact: ProjectImpact;
  lessons: string[];
}

export interface ProjectTimeline {
  start: Date;
  end: Date;
  phases: ProjectPhase[];
  dependencies: string[];
}

export interface ProjectPhase {
  name: string;
  start: Date;
  end: Date;
  deliverables: string[];
  responsible: string;
}

export interface ProjectStakeholder {
  type: "beneficiary" | "implementer" | "funder" | "partner" | "regulator";
  name: string;
  role: string;
  contribution: string;
  expectations: string[];
}

export interface ProjectMilestone {
  name: string;
  target: Date;
  status: "pending" | "achieved" | "delayed" | "missed";
  metrics: string[];
  responsible: string;
}

export interface ProjectImpact {
  beneficiaries: number;
  outcomes: ImpactOutcome[];
  measurement: string[];
  sustainability: string;
}

export interface ImpactOutcome {
  indicator: string;
  baseline: number;
  target: number;
  achieved: number;
  measurement: string;
}

export interface CommunityMember {
  id: string;
  type: "individual" | "organization" | "representative";
  profile: MemberProfile;
  participation: MemberParticipation;
  contributions: MemberContribution[];
  rights: MemberRights;
  responsibilities: string[];
}

export interface MemberProfile {
  name: string;
  location: string;
  demographics: Record<string, any>;
  interests: string[];
  skills: string[];
  availability: string;
}

export interface MemberParticipation {
  joinDate: Date;
  activityLevel: "active" | "moderate" | "passive" | "inactive";
  votingHistory: VotingRecord[];
  proposalsSubmitted: number;
  meetingsAttended: number;
  volunteering: VolunteerRecord[];
}

export interface VotingRecord {
  proposalId: string;
  vote: "yes" | "no" | "abstain";
  date: Date;
  weight: number;
}

export interface VolunteerRecord {
  project: string;
  role: string;
  hours: number;
  period: string;
  impact: string;
}

export interface MemberContribution {
  type: "financial" | "time" | "skills" | "resources" | "network";
  amount: number;
  value: number;
  date: Date;
  project?: string;
  recognition: string;
}

export interface MemberRights {
  voting: boolean;
  proposal: boolean;
  access: string[];
  benefits: string[];
  protection: string[];
}

export interface CommunityDecision {
  id: string;
  title: string;
  description: string;
  category: string;
  proposer: string;
  status:
    | "draft"
    | "discussion"
    | "voting"
    | "approved"
    | "rejected"
    | "implemented";
  timeline: DecisionTimeline;
  voting: VotingResults;
  implementation: ImplementationStatus;
  review: ReviewResults;
}

export interface DecisionTimeline {
  proposed: Date;
  discussionStart: Date;
  discussionEnd: Date;
  votingStart: Date;
  votingEnd: Date;
  implemented?: Date;
  reviewed?: Date;
}

export interface VotingResults {
  totalVotes: number;
  yes: number;
  no: number;
  abstain: number;
  turnout: number;
  passed: boolean;
  threshold: number;
}

export interface ImplementationStatus {
  responsible: string;
  progress: number;
  milestones: ImplementationMilestone[];
  challenges: string[];
  adjustments: string[];
}

export interface ImplementationMilestone {
  name: string;
  target: Date;
  completed?: Date;
  status: "pending" | "completed" | "delayed";
}

export interface ReviewResults {
  effectiveness: number;
  satisfaction: number;
  impact: string;
  lessons: string[];
  recommendations: string[];
}

export interface CommunityPerformance {
  financial: FinancialPerformance;
  social: SocialPerformance;
  governance: GovernancePerformance;
  sustainability: SustainabilityPerformance;
}

export interface FinancialPerformance {
  funding: FundingMetrics;
  efficiency: EfficiencyMetrics;
  sustainability: SustainabilityMetrics;
  transparency: number;
}

export interface FundingMetrics {
  totalRaised: number;
  diversification: number;
  growthRate: number;
  reliability: number;
}

export interface EfficiencyMetrics {
  costPerBeneficiary: number;
  adminCosts: number;
  projectSuccess: number;
  timeToImpact: number;
}

export interface SustainabilityMetrics {
  fundingStability: number;
  memberRetention: number;
  projectContinuity: number;
  capacityBuilding: number;
}

export interface SocialPerformance {
  engagement: EngagementMetrics;
  inclusion: InclusionMetrics;
  satisfaction: SatisfactionMetrics;
  cohesion: CohesionMetrics;
}

export interface EngagementMetrics {
  participation: number;
  volunteerism: number;
  leadership: number;
  innovation: number;
}

export interface InclusionMetrics {
  diversity: number;
  accessibility: number;
  representation: number;
  equity: number;
}

export interface SatisfactionMetrics {
  overall: number;
  governance: number;
  projects: number;
  communication: number;
}

export interface CohesionMetrics {
  trust: number;
  cooperation: number;
  solidarity: number;
  resilience: number;
}

export interface GovernancePerformance {
  effectiveness: number;
  legitimacy: number;
  accountability: number;
  responsiveness: number;
}

export interface SustainabilityPerformance {
  environmental: number;
  economic: number;
  social: number;
  institutional: number;
}

export interface CommunityImpact {
  direct: DirectImpact;
  indirect: IndirectImpact;
  longTerm: LongTermImpact;
  spillover: SpilloverEffect[];
}

export interface DirectImpact {
  beneficiaries: number;
  outcomes: string[];
  measurement: string[];
  evidence: string[];
}

export interface IndirectImpact {
  ecosystem: string[];
  capacity: string[];
  knowledge: string[];
  networks: string[];
}

export interface LongTermImpact {
  sustainability: string[];
  scalability: string[];
  replication: string[];
  transformation: string[];
}

export interface SpilloverEffect {
  area: string;
  description: string;
  magnitude: number;
  beneficiaries: number;
}

export interface CommunityMetadata {
  established: Date;
  legal: LegalStructure;
  contact: ContactInformation;
  partnerships: string[];
  recognition: string[];
  documentation: string[];
}

export interface LegalStructure {
  type: string;
  jurisdiction: string;
  registration: string;
  compliance: string[];
}

export interface ContactInformation {
  address: string;
  phone: string;
  email: string;
  website: string;
  social: Record<string, string>;
}
