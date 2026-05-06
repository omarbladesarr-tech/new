// Platform types for AI agent freelance marketplaces

export type PlatformName = 'superteam-earn' | 'dealwork' | 'clawgig' | 'toku'

export type AgentType = 'developer' | 'writer' | 'research'

export type AgentStatus = 'idle' | 'active' | 'working' | 'paused' | 'error'

export type ApplicationStatus = 
  | 'discovered' 
  | 'applied' 
  | 'accepted' 
  | 'in_progress' 
  | 'submitted' 
  | 'completed' 
  | 'rejected' 
  | 'failed'

export type AutonomyLevel = 'full' | 'semi' | 'manual'

// Platform configuration
export interface PlatformConfig {
  name: PlatformName
  displayName: string
  apiBaseUrl: string
  feePercent: number
  paymentMethod: 'USDC' | 'USD' | 'SOL'
  supportsAgents: boolean
  features: string[]
}

export const PLATFORM_CONFIGS: Record<PlatformName, PlatformConfig> = {
  'superteam-earn': {
    name: 'superteam-earn',
    displayName: 'Superteam Earn',
    apiBaseUrl: 'https://earn.superteam.fun/api',
    feePercent: 0,
    paymentMethod: 'USDC',
    supportsAgents: true,
    features: ['bounties', 'grants', 'projects'],
  },
  'dealwork': {
    name: 'dealwork',
    displayName: 'Dealwork.ai',
    apiBaseUrl: 'https://dealwork.ai/api/v1',
    feePercent: 3,
    paymentMethod: 'USDC',
    supportsAgents: true,
    features: ['micro-tasks', 'projects', 'a2a-contracts'],
  },
  'clawgig': {
    name: 'clawgig',
    displayName: 'ClawGig',
    apiBaseUrl: 'https://api.clawgig.com/v1',
    feePercent: 10,
    paymentMethod: 'USDC',
    supportsAgents: true,
    features: ['ai-only', 'crypto-native'],
  },
  'toku': {
    name: 'toku',
    displayName: 'Toku',
    apiBaseUrl: 'https://api.toku.work/v1',
    feePercent: 15,
    paymentMethod: 'USD',
    supportsAgents: true,
    features: ['webhooks', 'real-time-alerts'],
  },
}

// Bounty/Job types
export interface Bounty {
  id: string
  platformBountyId: string
  platform: PlatformName
  title: string
  description: string
  requirements?: string
  rewardAmount: number
  rewardToken: string
  skills: string[]
  deadline?: Date
  sponsorName?: string
  sponsorLogo?: string
  type: 'bounty' | 'project' | 'grant'
  status: 'open' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  applicants?: number
  createdAt: Date
  url?: string
}

// Agent deployment
export interface AgentDeployment {
  id: string
  userId: string
  agentType: AgentType
  platform: PlatformName
  name: string
  status: AgentStatus
  config: AgentConfig
  skills: string[]
  autonomyLevel: AutonomyLevel
  minReward: number
  maxConcurrentJobs: number
  totalEarnings: number
  jobsCompleted: number
  successRate: number
  createdAt: Date
  updatedAt: Date
}

export interface AgentConfig {
  autoApplyThreshold: number // Match score threshold for auto-apply (0-100)
  preferredSkills: string[]
  excludedSponsors: string[]
  maxBidAmount?: number
  workingHours?: { start: number; end: number }
  notifyOnApplication: boolean
  notifyOnAcceptance: boolean
  notifyOnCompletion: boolean
}

// Bounty application
export interface BountyApplication {
  id: string
  deploymentId: string
  platformBountyId: string
  title: string
  description?: string
  rewardAmount: number
  rewardToken: string
  skillsRequired: string[]
  deadline?: Date
  matchScore: number
  status: ApplicationStatus
  pitch?: string
  submissionContent?: string
  sponsorName?: string
  sponsorLogo?: string
  appliedAt?: Date
  submittedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Earnings tracking
export interface AgentEarning {
  id: string
  deploymentId: string
  applicationId?: string
  grossAmount: number
  platformFee: number
  platformFeePercent: number
  serviceShare: number
  serviceSharePercent: number
  clientShare: number
  netAmount: number
  currency: string
  txHash?: string
  status: 'pending' | 'confirmed' | 'paid_out' | 'failed'
  paidAt?: Date
  createdAt: Date
}

// Platform connection
export interface PlatformConnection {
  id: string
  userId: string
  platform: PlatformName
  credentials: Record<string, string>
  agentProfileId?: string
  walletAddress?: string
  status: 'connected' | 'disconnected' | 'error'
  connectedAt: Date
  updatedAt: Date
}

// Revenue share config
export interface RevenueShareConfig {
  id: string
  userId: string
  platform: PlatformName
  platformFeePercent: number
  serviceSharePercent: number
  isClientService: boolean
  createdAt: Date
  updatedAt: Date
}

// Decision engine types
export interface MatchResult {
  bounty: Bounty
  score: number
  reasons: string[]
  shouldAutoApply: boolean
}

export interface DecisionContext {
  agent: AgentDeployment
  bounty: Bounty
  currentWorkload: number
  recentSuccessRate: number
}

// API response types
export interface PlatformApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    hasMore: boolean
  }
}

// Agent skills by type
export const AGENT_SKILLS: Record<AgentType, string[]> = {
  developer: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Solana',
    'Rust',
    'Smart Contracts',
    'Web3',
    'API Development',
    'Database Design',
    'Frontend',
    'Backend',
    'Full Stack',
  ],
  writer: [
    'Technical Writing',
    'Documentation',
    'Blog Posts',
    'Copywriting',
    'Content Strategy',
    'SEO Writing',
    'Research Articles',
    'Whitepapers',
    'Case Studies',
  ],
  research: [
    'Market Research',
    'Data Analysis',
    'Competitive Analysis',
    'User Research',
    'Industry Reports',
    'Trend Analysis',
    'Financial Analysis',
    'Technical Research',
  ],
}
