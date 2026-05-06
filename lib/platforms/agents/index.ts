// Agent Factory and Exports
// Central module for creating and managing platform agents

import { AgentDeployment, AgentType, PlatformName } from '../types'
import { BasePlatformAgent } from './base-agent'
import { DeveloperAgent, createDeveloperAgent } from './developer-agent'
import { WriterAgent, createWriterAgent } from './writer-agent'
import { ResearchAgent, createResearchAgent } from './research-agent'

export { BasePlatformAgent } from './base-agent'
export { DeveloperAgent, createDeveloperAgent } from './developer-agent'
export { WriterAgent, createWriterAgent } from './writer-agent'
export { ResearchAgent, createResearchAgent } from './research-agent'

/**
 * Factory function to create the appropriate agent based on type
 */
export function createAgent(
  deployment: AgentDeployment,
  walletAddress?: string
): BasePlatformAgent {
  switch (deployment.agentType) {
    case 'developer':
      return createDeveloperAgent(deployment, walletAddress)
    case 'writer':
      return createWriterAgent(deployment, walletAddress)
    case 'research':
      return createResearchAgent(deployment, walletAddress)
    default:
      throw new Error(`Unknown agent type: ${deployment.agentType}`)
  }
}

/**
 * Agent type display information
 */
export const AGENT_TYPE_INFO: Record<
  AgentType,
  {
    name: string
    description: string
    icon: string
    skills: string[]
    suggestedMinReward: number
  }
> = {
  developer: {
    name: 'Developer Agent',
    description: 'Specialized in code, smart contracts, and technical implementations',
    icon: 'Code',
    skills: [
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Solana',
      'Rust',
      'Smart Contracts',
      'Web3',
      'API Development',
    ],
    suggestedMinReward: 100,
  },
  writer: {
    name: 'Writer Agent',
    description: 'Expert in technical writing, documentation, and content creation',
    icon: 'FileText',
    skills: [
      'Technical Writing',
      'Documentation',
      'Blog Posts',
      'Copywriting',
      'Content Strategy',
      'Whitepapers',
      'Case Studies',
    ],
    suggestedMinReward: 50,
  },
  research: {
    name: 'Research Agent',
    description: 'Focused on market research, data analysis, and strategic insights',
    icon: 'Search',
    skills: [
      'Market Research',
      'Data Analysis',
      'Competitive Analysis',
      'User Research',
      'Industry Reports',
      'Trend Analysis',
    ],
    suggestedMinReward: 75,
  },
}

/**
 * Platform display information
 */
export const PLATFORM_INFO: Record<
  PlatformName,
  {
    name: string
    description: string
    feePercent: number
    paymentMethod: string
    color: string
    recommended: boolean
  }
> = {
  'superteam-earn': {
    name: 'Superteam Earn',
    description: '0% fees, high-quality bounties from the Solana ecosystem',
    feePercent: 0,
    paymentMethod: 'USDC',
    color: '#14F195',
    recommended: true,
  },
  dealwork: {
    name: 'Dealwork.ai',
    description: 'AI-native platform with micro-tasks to full projects',
    feePercent: 3,
    paymentMethod: 'USDC',
    color: '#6366F1',
    recommended: false,
  },
  clawgig: {
    name: 'ClawGig',
    description: 'AI-only freelance platform on Solana',
    feePercent: 10,
    paymentMethod: 'USDC',
    color: '#F59E0B',
    recommended: false,
  },
  toku: {
    name: 'Toku',
    description: 'Traditional freelance platform with AI support',
    feePercent: 15,
    paymentMethod: 'USD',
    color: '#3B82F6',
    recommended: false,
  },
}

/**
 * Calculate net earnings after fees
 */
export function calculateNetEarnings(
  grossAmount: number,
  platform: PlatformName,
  serviceSharePercent: number = 20
): {
  gross: number
  platformFee: number
  platformFeePercent: number
  serviceShare: number
  serviceSharePercent: number
  net: number
} {
  const platformFeePercent = PLATFORM_INFO[platform].feePercent
  const platformFee = grossAmount * (platformFeePercent / 100)
  const serviceShare = grossAmount * (serviceSharePercent / 100)
  const net = grossAmount - platformFee - serviceShare

  return {
    gross: grossAmount,
    platformFee,
    platformFeePercent,
    serviceShare,
    serviceSharePercent,
    net,
  }
}
