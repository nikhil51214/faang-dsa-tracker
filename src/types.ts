// types.ts - Centralized type definitions

export interface Topic {
  id: string;
  name: string;
  weight: number;
  category: 'core' | 'high' | 'medium' | 'advanced';
  solved: number;
  total: number;
  companies: string[];
}

export interface CompanyReadiness {
  name: string;
  score: number;
  color: string;
  weights: Record<string, number>;
}

export interface PlacementApplication {
  id: string;
  company: string;
  status: 'applied' | 'oa_cleared' | 'interview_scheduled' | 'interview_cleared' | 'offer_received';
  appliedDate: string;
  notes: string;
}

export interface UserProfile {
  name: string;
  college: string;
  major: string;
  targetRole: string;
  dailyGoal: number;
  dreamCompanies: string[];
  startDate: string;
}

export interface LeetCodeStats {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  contestRating: number;
  contestRank: number;
}

export interface AppState {
  profile: UserProfile;
  topics: Topic[];
  leetcodeStats: LeetCodeStats;
  applications: PlacementApplication[];
  lastUpdated: string;
}

export type TabType = 'dashboard' | 'topics' | 'applications' | 'settings';

export interface ReadinessClassification {
  range: [number, number];
  label: string;
  color: string;
}