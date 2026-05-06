// Writer Agent
// Specialized for content creation: Technical writing, documentation, blog posts

import { BasePlatformAgent } from './base-agent'
import { Bounty, BountyApplication, AgentDeployment } from '../types'
import { getSuperteamClient } from '../superteam-earn'

export class WriterAgent extends BasePlatformAgent {
  private platformClient: ReturnType<typeof getSuperteamClient>

  constructor(deployment: AgentDeployment, walletAddress?: string) {
    super(deployment)
    this.platformClient = getSuperteamClient(walletAddress)
  }

  /**
   * Discover writing bounties
   */
  async discoverBounties(): Promise<Bounty[]> {
    const writerSkills = [
      'Technical Writing',
      'Documentation',
      'Blog',
      'Content',
      'Copywriting',
      'Article',
      'Writing',
      'SEO',
      'Whitepaper',
      'Research',
      'Report',
    ]

    const response = await this.platformClient.getOpenListings({
      type: 'bounty',
      minReward: this.deployment.minReward,
    })

    if (!response.success || !response.data) {
      return []
    }

    // Filter bounties that match writing skills
    return response.data.filter((bounty) => {
      const bountySkillsLower = bounty.skills.map((s) => s.toLowerCase())
      const titleLower = bounty.title.toLowerCase()
      const descLower = (bounty.description || '').toLowerCase()

      // Check skills, title, or description for writing keywords
      return writerSkills.some(
        (skill) =>
          bountySkillsLower.some((bs) => bs.includes(skill.toLowerCase())) ||
          titleLower.includes(skill.toLowerCase()) ||
          descLower.includes(skill.toLowerCase())
      )
    })
  }

  /**
   * Submit written content
   */
  async submitWork(application: BountyApplication, content: string): Promise<boolean> {
    try {
      const response = await this.platformClient.submitWork({
        listingId: application.platformBountyId,
        walletAddress: '',
        content,
        additionalInfo: `Submitted by AI Writer Agent: ${this.deployment.name}`,
      })

      return response.success
    } catch (error) {
      console.error(`[${this.deployment.name}] Submit error:`, error)
      return false
    }
  }

  /**
   * Generate written content
   */
  async generateWorkContent(bounty: Bounty): Promise<string> {
    // Determine content type from bounty
    const contentType = this.determineContentType(bounty)
    
    switch (contentType) {
      case 'technical-docs':
        return this.generateTechnicalDocs(bounty)
      case 'blog-post':
        return this.generateBlogPost(bounty)
      case 'whitepaper':
        return this.generateWhitepaper(bounty)
      case 'case-study':
        return this.generateCaseStudy(bounty)
      default:
        return this.generateGenericContent(bounty)
    }
  }

  /**
   * Determine the type of content needed
   */
  private determineContentType(bounty: Bounty): string {
    const titleLower = bounty.title.toLowerCase()
    const descLower = (bounty.description || '').toLowerCase()
    const combined = `${titleLower} ${descLower}`

    if (combined.includes('documentation') || combined.includes('docs')) {
      return 'technical-docs'
    }
    if (combined.includes('blog') || combined.includes('article')) {
      return 'blog-post'
    }
    if (combined.includes('whitepaper') || combined.includes('white paper')) {
      return 'whitepaper'
    }
    if (combined.includes('case study') || combined.includes('success story')) {
      return 'case-study'
    }
    return 'general'
  }

  /**
   * Generate technical documentation
   */
  private generateTechnicalDocs(bounty: Bounty): string {
    return `
# ${bounty.title}

## Overview
${bounty.description || 'Comprehensive technical documentation for the project.'}

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

## Introduction
This documentation provides a comprehensive guide to understanding and using the system effectively.

## Getting Started

### Prerequisites
- Node.js 18+ or equivalent runtime
- Package manager (npm, pnpm, or yarn)
- Basic understanding of ${bounty.skills.slice(0, 3).join(', ') || 'the technology stack'}

### Quick Start
\`\`\`bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

## Installation
Detailed installation instructions for various environments.

### Local Development
Step-by-step guide for local setup.

### Production Deployment
Deployment instructions for production environments.

## Configuration
Configuration options and environment variables.

## Usage
Detailed usage examples and best practices.

## API Reference
Complete API documentation with endpoints, parameters, and responses.

## Troubleshooting
Common issues and their solutions.

## FAQ
Frequently asked questions and answers.

---
*Documentation prepared by ${this.deployment.name} (AI Writer Agent)*
`.trim()
  }

  /**
   * Generate blog post
   */
  private generateBlogPost(bounty: Bounty): string {
    return `
# ${bounty.title}

*A comprehensive exploration of ${bounty.skills[0] || 'the topic'}*

## Introduction

In today's rapidly evolving landscape, understanding ${bounty.title.toLowerCase()} has become increasingly important. This article explores the key concepts, best practices, and practical applications.

## The Current Landscape

${bounty.description || 'The industry continues to evolve with new developments and opportunities.'}

### Key Trends
- Innovation in ${bounty.skills[0] || 'technology'}
- Growing adoption and community support
- Enhanced developer experience

## Deep Dive

### Understanding the Fundamentals
Before diving into advanced topics, it's essential to grasp the core concepts.

### Practical Applications
Real-world use cases and implementations that demonstrate value.

### Best Practices
Expert recommendations for optimal results:

1. **Start with clear objectives** - Define your goals before implementation
2. **Follow established patterns** - Leverage community-tested approaches
3. **Iterate and improve** - Continuous refinement leads to better outcomes

## Case Studies

### Success Story 1
A practical example of successful implementation.

### Success Story 2
Another demonstration of effective application.

## Looking Ahead

The future holds exciting possibilities as the ecosystem continues to mature and expand.

## Conclusion

${bounty.title} represents an important development in the space. By understanding the key concepts and following best practices, you can effectively leverage these capabilities for your own projects.

---

*Want to learn more? Follow for updates and insights.*

*Article written by ${this.deployment.name} (AI Writer Agent)*
`.trim()
  }

  /**
   * Generate whitepaper
   */
  private generateWhitepaper(bounty: Bounty): string {
    return `
# ${bounty.title}

## Whitepaper v1.0

### Abstract
${bounty.description || 'This whitepaper presents a comprehensive analysis and proposed solution.'}

---

## Table of Contents
1. Executive Summary
2. Problem Statement
3. Proposed Solution
4. Technical Architecture
5. Implementation Roadmap
6. Economic Model
7. Conclusion
8. References

---

## 1. Executive Summary
A high-level overview of the proposal and its key benefits.

## 2. Problem Statement
### Current Challenges
- Challenge 1: Description and impact
- Challenge 2: Description and impact
- Challenge 3: Description and impact

### Market Analysis
Analysis of the current market conditions and opportunities.

## 3. Proposed Solution
### Core Innovation
Description of the proposed solution and its unique value proposition.

### Key Features
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## 4. Technical Architecture
### System Overview
High-level architecture diagram and explanation.

### Components
Detailed breakdown of system components.

### Security Considerations
Security measures and best practices implemented.

## 5. Implementation Roadmap
### Phase 1: Foundation (Q1)
- Milestone 1.1
- Milestone 1.2

### Phase 2: Development (Q2-Q3)
- Milestone 2.1
- Milestone 2.2

### Phase 3: Launch (Q4)
- Milestone 3.1
- Milestone 3.2

## 6. Economic Model
### Token Economics (if applicable)
Distribution, utility, and governance structure.

### Revenue Model
Sustainable business model description.

## 7. Conclusion
Summary of key points and call to action.

## 8. References
- Reference 1
- Reference 2
- Reference 3

---

*Whitepaper prepared by ${this.deployment.name} (AI Writer Agent)*
`.trim()
  }

  /**
   * Generate case study
   */
  private generateCaseStudy(bounty: Bounty): string {
    return `
# Case Study: ${bounty.title}

## Executive Summary
${bounty.description || 'An in-depth analysis of a successful implementation.'}

## Background
### The Challenge
Description of the initial situation and challenges faced.

### Objectives
- Primary objective
- Secondary objectives
- Success metrics

## Solution
### Approach
The methodology and approach taken to address the challenges.

### Implementation
Step-by-step description of the implementation process.

### Technologies Used
${bounty.skills.map((skill) => `- ${skill}`).join('\n')}

## Results
### Key Metrics
- Metric 1: Before vs After
- Metric 2: Before vs After
- Metric 3: Before vs After

### Qualitative Outcomes
- Improved user experience
- Enhanced efficiency
- Better scalability

## Lessons Learned
### What Worked Well
- Success factor 1
- Success factor 2

### Areas for Improvement
- Learning 1
- Learning 2

## Conclusion
Summary of the case study and its implications for similar projects.

---

*Case study prepared by ${this.deployment.name} (AI Writer Agent)*
`.trim()
  }

  /**
   * Generate generic content
   */
  private generateGenericContent(bounty: Bounty): string {
    return `
# ${bounty.title}

## Introduction
${bounty.description || 'A comprehensive overview of the topic.'}

## Key Points

### Section 1
Detailed exploration of the first key aspect.

### Section 2
Analysis of the second important element.

### Section 3
Discussion of additional considerations.

## Recommendations
Based on the analysis, the following recommendations are proposed:

1. Recommendation 1
2. Recommendation 2
3. Recommendation 3

## Conclusion
Summary of key findings and next steps.

---

*Content prepared by ${this.deployment.name} (AI Writer Agent)*
`.trim()
  }
}

/**
 * Factory function to create a Writer Agent
 */
export function createWriterAgent(
  deployment: AgentDeployment,
  walletAddress?: string
): WriterAgent {
  return new WriterAgent(deployment, walletAddress)
}
