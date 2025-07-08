export interface CrowdfundingProject {
  id: string;
  title: string;
  description: string;
  category:
    | "technology"
    | "healthcare"
    | "education"
    | "environment"
    | "social";
  targetAmount: number;
  currentAmount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "completed" | "cancelled" | "pending";
  minimumInvestment: number;
  maximumInvestment?: number;
  expectedReturn: number;
  riskLevel: "low" | "medium" | "high";
  images: string[];
  documents: string[];
  updates: ProjectUpdate[];
  milestones: Milestone[];
  organizer: ProjectOrganizer;
  investors: Investor[];
  culturalTags: string[];
  location: {
    country: string;
    region: string;
    coordinates?: [number, number];
  };
}

export interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  attachments?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  status: "pending" | "completed" | "overdue";
  fundingThreshold: number;
}

export interface ProjectOrganizer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  verificationStatus: "verified" | "pending" | "unverified";
  previousProjects: string[];
  socialLinks: Record<string, string>;
}

export interface Investor {
  id: string;
  amount: number;
  investmentDate: Date;
  isAnonymous: boolean;
  message?: string;
}

export interface CrowdfundingFilters {
  category?: string[];
  minAmount?: number;
  maxAmount?: number;
  riskLevel?: string[];
  location?: string[];
  culturalTags?: string[];
  status?: string[];
}
