// Decision Engine for AI Agent Bounty Matching
// Scores bounties and determines auto-apply eligibility

import {
  Bounty,
  AgentDeployment,
  AgentConfig,
  MatchResult,
  DecisionContext,
  AGENT_SKILLS,
} from './types'

// Weights for scoring components
const SCORING_WEIGHTS = {
  skillMatch: 0.35,
  rewardValue: 0.25,
  deadlineFit: 0.15,
  sponsorReputation: 0.10,
  competitionLevel: 0.10,
  typePreference: 0.05,
}

/**
 * Main decision engine for bounty matching
 */
export class DecisionEngine {
  private agent: AgentDeployment
  private config: AgentConfig

  constructor(agent: AgentDeployment) {
    this.agent = agent
    this.config = agent.config
  }

  /**
   * Analyze a bounty and determine match score
   */
  analyzeBounty(bounty: Bounty, context?: Partial<DecisionContext>): MatchResult {
    const reasons: string[] = []
    let totalScore = 0

    // 1. Skill Match Score (35%)
    const skillScore = this.calculateSkillMatch(bounty.skills)
    totalScore += skillScore * SCORING_WEIGHTS.skillMatch
    if (skillScore >= 70) {
      reasons.push(`Strong skill match (${skillScore}%)`)
    } else if (skillScore >= 40) {
      reasons.push(`Moderate skill match (${skillScore}%)`)
    }

    // 2. Reward Value Score (25%)
    const rewardScore = this.calculateRewardScore(bounty.rewardAmount)
    totalScore += rewardScore * SCORING_WEIGHTS.rewardValue
    if (bounty.rewardAmount >= this.agent.minReward * 2) {
      reasons.push(`High reward: $${bounty.rewardAmount}`)
    } else if (bounty.rewardAmount >= this.agent.minReward) {
      reasons.push(`Meets minimum reward: $${bounty.rewardAmount}`)
    }

    // 3. Deadline Fit Score (15%)
    const deadlineScore = this.calculateDeadlineScore(bounty.deadline)
    totalScore += deadlineScore * SCORING_WEIGHTS.deadlineFit
    if (deadlineScore >= 80) {
      reasons.push('Comfortable deadline')
    }

    // 4. Sponsor Reputation Score (10%)
    const sponsorScore = this.calculateSponsorScore(bounty.sponsorName)
    totalScore += sponsorScore * SCORING_WEIGHTS.sponsorReputation
    if (sponsorScore >= 80 && bounty.sponsorName) {
      reasons.push(`Trusted sponsor: ${bounty.sponsorName}`)
    }

    // 5. Competition Level Score (10%)
    const competitionScore = this.calculateCompetitionScore(bounty.applicants)
    totalScore += competitionScore * SCORING_WEIGHTS.competitionLevel
    if (competitionScore >= 70) {
      reasons.push('Low competition')
    }

    // 6. Type Preference Score (5%)
    const typeScore = this.calculateTypeScore(bounty.type)
    totalScore += typeScore * SCORING_WEIGHTS.typePreference

    // Round final score
    const finalScore = Math.round(totalScore)

    // Check workload constraints
    const currentWorkload = context?.currentWorkload || 0
    const canTakeMore = currentWorkload < this.agent.maxConcurrentJobs

    // Determine auto-apply eligibility
    const shouldAutoApply = 
      this.agent.autonomyLevel === 'full' &&
      finalScore >= this.config.autoApplyThreshold &&
      bounty.rewardAmount >= this.agent.minReward &&
      canTakeMore &&
      !this.isExcludedSponsor(bounty.sponsorName)

    if (!canTakeMore) {
      reasons.push('At max concurrent jobs')
    }

    if (this.isExcludedSponsor(bounty.sponsorName)) {
      reasons.push('Sponsor excluded')
    }

    return {
      bounty,
      score: finalScore,
      reasons,
      shouldAutoApply,
    }
  }

  /**
   * Batch analyze multiple bounties
   */
  analyzeBounties(bounties: Bounty[], context?: Partial<DecisionContext>): MatchResult[] {
    return bounties
      .map((bounty) => this.analyzeBounty(bounty, context))
      .sort((a, b) => b.score - a.score)
  }

  /**
   * Get top matches for auto-apply
   */
  getAutoApplyMatches(bounties: Bounty[], maxMatches: number = 5): MatchResult[] {
    const analyzed = this.analyzeBounties(bounties)
    return analyzed.filter((m) => m.shouldAutoApply).slice(0, maxMatches)
  }

  /**
   * Calculate skill match percentage
   */
  private calculateSkillMatch(bountySkills: string[]): number {
    if (!bountySkills.length) return 50 // Neutral if no skills specified

    const agentSkills = this.agent.skills.map((s) => s.toLowerCase())
    const requiredSkills = bountySkills.map((s) => s.toLowerCase())

    // Direct matches
    const directMatches = requiredSkills.filter((skill) =>
      agentSkills.some((as) => as.includes(skill) || skill.includes(as))
    ).length

    // Category matches (e.g., "Frontend" matches "React")
    const categoryMatches = this.getCategoryMatches(requiredSkills)

    const totalMatches = directMatches + categoryMatches * 0.5
    const matchPercent = Math.min(100, (totalMatches / requiredSkills.length) * 100)

    return matchPercent
  }

  /**
   * Get category-based skill matches
   */
  private getCategoryMatches(requiredSkills: string[]): number {
    const categoryMap: Record<string, string[]> = {
      frontend: ['react', 'vue', 'angular', 'css', 'html', 'tailwind', 'next.js'],
      backend: ['node.js', 'python', 'rust', 'go', 'api', 'database'],
      web3: ['solana', 'ethereum', 'smart contracts', 'blockchain', 'crypto'],
      writing: ['content', 'documentation', 'blog', 'technical writing'],
      research: ['analysis', 'data', 'market research', 'report'],
    }

    let matches = 0
    const agentSkills = this.agent.skills.map((s) => s.toLowerCase())

    for (const skill of requiredSkills) {
      for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some((k) => skill.includes(k) || k.includes(skill))) {
          if (agentSkills.some((as) => keywords.some((k) => as.includes(k)))) {
            matches++
            break
          }
        }
      }
    }

    return matches
  }

  /**
   * Calculate reward score based on agent preferences
   */
  private calculateRewardScore(rewardAmount: number): number {
    const minReward = this.agent.minReward
    const idealReward = minReward * 3

    if (rewardAmount >= idealReward) return 100
    if (rewardAmount >= minReward * 2) return 85
    if (rewardAmount >= minReward) return 70
    if (rewardAmount >= minReward * 0.8) return 50
    return 30
  }

  /**
   * Calculate deadline score
   */
  private calculateDeadlineScore(deadline?: Date): number {
    if (!deadline) return 70 // Neutral for no deadline

    const now = new Date()
    const daysUntilDeadline = Math.floor(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysUntilDeadline < 1) return 20 // Too rushed
    if (daysUntilDeadline < 3) return 50
    if (daysUntilDeadline < 7) return 75
    if (daysUntilDeadline < 14) return 90
    return 100
  }

  /**
   * Calculate sponsor reputation score
   */
  private calculateSponsorScore(sponsorName?: string): number {
    if (!sponsorName) return 60

    // Known good sponsors (can be expanded with historical data)
    const trustedSponsors = [
      'superteam',
      'solana',
      'phantom',
      'magic eden',
      'metaplex',
      'jupiter',
      'marinade',
    ]

    const lowerName = sponsorName.toLowerCase()
    if (trustedSponsors.some((s) => lowerName.includes(s))) {
      return 95
    }

    return 70 // Default for unknown sponsors
  }

  /**
   * Calculate competition score
   */
  private calculateCompetitionScore(applicants?: number): number {
    if (applicants === undefined) return 60

    if (applicants === 0) return 100
    if (applicants < 5) return 85
    if (applicants < 10) return 70
    if (applicants < 20) return 55
    if (applicants < 50) return 40
    return 25
  }

  /**
   * Calculate type preference score
   */
  private calculateTypeScore(type: 'bounty' | 'project' | 'grant'): number {
    // Bounties are typically faster/easier for agents
    const typeScores = {
      bounty: 90,
      project: 70,
      grant: 50,
    }
    return typeScores[type] || 60
  }

  /**
   * Check if sponsor is excluded
   */
  private isExcludedSponsor(sponsorName?: string): boolean {
    if (!sponsorName || !this.config.excludedSponsors?.length) return false
    const lowerName = sponsorName.toLowerCase()
    return this.config.excludedSponsors.some((s) => 
      lowerName.includes(s.toLowerCase())
    )
  }
}

/**
 * Generate an application pitch for a bounty
 */
export function generatePitch(
  agent: AgentDeployment,
  bounty: Bounty,
  matchResult: MatchResult
): string {
  const skillHighlights = agent.skills
    .filter((skill) =>
      bounty.skills.some(
        (bs) =>
          bs.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(bs.toLowerCase())
      )
    )
    .slice(0, 3)

  const pitch = `
Hi! I'm ${agent.name}, an AI agent specialized in ${agent.agentType} tasks.

**Why I'm a great fit:**
${matchResult.reasons.slice(0, 3).map((r) => `- ${r}`).join('\n')}

**Relevant skills:**
${skillHighlights.map((s) => `- ${s}`).join('\n')}

**Track record:**
- ${agent.jobsCompleted} jobs completed
- ${agent.successRate.toFixed(0)}% success rate
- $${agent.totalEarnings.toFixed(2)} total earned

I'm ready to start immediately and deliver high-quality work before the deadline.
`.trim()

  return pitch
}

/**
 * Create default agent config
 */
export function createDefaultConfig(agentType: string): AgentConfig {
  return {
    autoApplyThreshold: 75,
    preferredSkills: AGENT_SKILLS[agentType as keyof typeof AGENT_SKILLS] || [],
    excludedSponsors: [],
    notifyOnApplication: true,
    notifyOnAcceptance: true,
    notifyOnCompletion: true,
  }
}
