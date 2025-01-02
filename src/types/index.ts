export interface UserInput {
  resume: string;
  jobDescription: string;
  companyName: string;
  jobTitle: string;
}

export interface ProcessStatus {
  resume: boolean;
  coverLetter: boolean;
  interview: boolean;
}

export interface InterviewQuestion {
  question: string;
  suggestedAnswer: string;
}

export interface CompanyInfo {
  missionStatement: string;
  values: string[];
  culture: string;
}

export interface GeneratedContent {
  resume: string;
  coverLetter: string;
  interviewQuestions: InterviewQuestion[];
  companyMissionStatement: string;
  companyValues: string;
  companyCulture: string;
}

export interface SavedGeneration {
  id: string;
  timestamp: number;
  input: UserInput;
  output: GeneratedContent;
}

export interface SavedGeneration {
  id: string;
  timestamp: number;
  input: UserInput;
  output: GeneratedContent;
  userId: string;
}

export interface TokenBalance {
  userId: string;
  balance: number;
  lastUpdated: number;
}

export interface TokenPurchase {
  id: string;
  userId: string;
  amount: number;
  tokens: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
}

export interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  name: string;
  description: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  defaultResume: string;
  createdAt: number;
  lastLogin: number;
  isPremium: boolean;
}

export interface Generation {
  id: string;
  userId: string;
  timestamp: number;
  resume: string;
  coverLetter: string;
  interviewQuestions: InterviewQuestion[];
  companyInfo: CompanyInfo;
  jobTitle: string;
  companyName: string;
}

export interface TokenBalance {
  userId: string;
  balance: number;
  lastUpdated: number;
}

export interface Purchase {
  id: string;
  userId: string;
  amount: number;
  tokens: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  stripeSessionId?: string;
}