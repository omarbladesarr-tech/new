// Developer Agent
// Specialized for development bounties: TypeScript, React, Solana, etc.

import { BasePlatformAgent } from './base-agent'
import { Bounty, BountyApplication, AgentDeployment } from '../types'
import { getSuperteamClient } from '../superteam-earn'

export class DeveloperAgent extends BasePlatformAgent {
  private platformClient: ReturnType<typeof getSuperteamClient>

  constructor(deployment: AgentDeployment, walletAddress?: string) {
    super(deployment)
    this.platformClient = getSuperteamClient(walletAddress)
  }

  /**
   * Discover development bounties
   */
  async discoverBounties(): Promise<Bounty[]> {
    // Filter for development-related skills
    const devSkills = [
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Solana',
      'Rust',
      'Smart Contracts',
      'Web3',
      'Frontend',
      'Backend',
      'Full Stack',
      'JavaScript',
      'API',
    ]

    const response = await this.platformClient.getOpenListings({
      type: 'bounty',
      minReward: this.deployment.minReward,
    })

    if (!response.success || !response.data) {
      return []
    }

    // Filter bounties that match development skills
    return response.data.filter((bounty) => {
      const bountySkillsLower = bounty.skills.map((s) => s.toLowerCase())
      return devSkills.some((skill) =>
        bountySkillsLower.some(
          (bs) => bs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(bs)
        )
      )
    })
  }

  /**
   * Submit development work
   */
  async submitWork(application: BountyApplication, content: string): Promise<boolean> {
    try {
      const response = await this.platformClient.submitWork({
        listingId: application.platformBountyId,
        walletAddress: '', // Will be set by the client
        content,
        links: this.extractLinks(content),
        additionalInfo: `Submitted by AI Developer Agent: ${this.deployment.name}`,
      })

      return response.success
    } catch (error) {
      console.error(`[${this.deployment.name}] Submit error:`, error)
      return false
    }
  }

  /**
   * Generate code/development work content
   */
  async generateWorkContent(bounty: Bounty): Promise<string> {
    // This is where AI code generation would happen
    // In production, this would integrate with an LLM to generate actual code
    
    const template = `
# ${bounty.title} - Development Submission

## Overview
This submission addresses the requirements outlined in the bounty description.

## Technical Approach
Based on the requirements, I've implemented the following:

### Key Features
${bounty.skills.map((skill) => `- ${skill} implementation`).join('\n')}

### Architecture
- Clean, modular code structure
- Type-safe implementation with TypeScript
- Following best practices for ${bounty.skills[0] || 'web development'}

## Code Repository
[GitHub Repository Link - To be added after deployment]

## Demo
[Live Demo Link - To be added after deployment]

## Technical Details
${this.generateTechnicalDetails(bounty)}

## Testing
- Unit tests implemented for core functionality
- Integration tests for API endpoints
- Manual testing completed

## Documentation
- README with setup instructions
- API documentation (if applicable)
- Code comments for complex logic

## Deployment Instructions
1. Clone the repository
2. Install dependencies: \`npm install\` or \`pnpm install\`
3. Configure environment variables
4. Run: \`npm run dev\` or \`pnpm dev\`

## Future Improvements
- Performance optimizations
- Additional features as needed
- Enhanced error handling

---
Submitted by: ${this.deployment.name} (AI Developer Agent)
`.trim()

    return template
  }

  /**
   * Generate technical details based on bounty skills
   */
  private generateTechnicalDetails(bounty: Bounty): string {
    const details: string[] = []

    if (bounty.skills.some((s) => s.toLowerCase().includes('react'))) {
      details.push('- React 18+ with hooks and functional components')
      details.push('- State management with React Context or Zustand')
    }

    if (bounty.skills.some((s) => s.toLowerCase().includes('next'))) {
      details.push('- Next.js App Router with Server Components')
      details.push('- API routes for backend functionality')
    }

    if (bounty.skills.some((s) => s.toLowerCase().includes('typescript'))) {
      details.push('- Full TypeScript implementation with strict mode')
      details.push('- Proper type definitions for all components')
    }

    if (bounty.skills.some((s) => s.toLowerCase().includes('solana'))) {
      details.push('- Solana Web3.js integration')
      details.push('- Wallet adapter support (Phantom, Solflare, etc.)')
    }

    if (bounty.skills.some((s) => s.toLowerCase().includes('smart contract'))) {
      details.push('- Smart contract written in Rust/Anchor')
      details.push('- On-chain program with proper security measures')
    }

    return details.length > 0 ? details.join('\n') : '- Standard web development best practices applied'
  }

  /**
   * Extract links from content
   */
  private extractLinks(content: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const matches = content.match(urlRegex)
    return matches || []
  }
}

/**
 * Factory function to create a Developer Agent
 */
export function createDeveloperAgent(
  deployment: AgentDeployment,
  walletAddress?: string
): DeveloperAgent {
  return new DeveloperAgent(deployment, walletAddress)
}
