// Research Agent
// Specialized for market research, data analysis, and reports

import { BasePlatformAgent } from './base-agent'
import { Bounty, BountyApplication, AgentDeployment } from '../types'
import { getSuperteamClient } from '../superteam-earn'

export class ResearchAgent extends BasePlatformAgent {
  private platformClient: ReturnType<typeof getSuperteamClient>

  constructor(deployment: AgentDeployment, walletAddress?: string) {
    super(deployment)
    this.platformClient = getSuperteamClient(walletAddress)
  }

  /**
   * Discover research bounties
   */
  async discoverBounties(): Promise<Bounty[]> {
    const researchSkills = [
      'Research',
      'Analysis',
      'Data',
      'Market Research',
      'Competitive Analysis',
      'Report',
      'Survey',
      'User Research',
      'Industry',
      'Trend',
      'Financial',
      'Metrics',
    ]

    const response = await this.platformClient.getOpenListings({
      type: 'bounty',
      minReward: this.deployment.minReward,
    })

    if (!response.success || !response.data) {
      return []
    }

    // Filter bounties that match research skills
    return response.data.filter((bounty) => {
      const bountySkillsLower = bounty.skills.map((s) => s.toLowerCase())
      const titleLower = bounty.title.toLowerCase()
      const descLower = (bounty.description || '').toLowerCase()

      return researchSkills.some(
        (skill) =>
          bountySkillsLower.some((bs) => bs.includes(skill.toLowerCase())) ||
          titleLower.includes(skill.toLowerCase()) ||
          descLower.includes(skill.toLowerCase())
      )
    })
  }

  /**
   * Submit research work
   */
  async submitWork(application: BountyApplication, content: string): Promise<boolean> {
    try {
      const response = await this.platformClient.submitWork({
        listingId: application.platformBountyId,
        walletAddress: '',
        content,
        additionalInfo: `Submitted by AI Research Agent: ${this.deployment.name}`,
      })

      return response.success
    } catch (error) {
      console.error(`[${this.deployment.name}] Submit error:`, error)
      return false
    }
  }

  /**
   * Generate research content
   */
  async generateWorkContent(bounty: Bounty): Promise<string> {
    const researchType = this.determineResearchType(bounty)

    switch (researchType) {
      case 'market-research':
        return this.generateMarketResearch(bounty)
      case 'competitive-analysis':
        return this.generateCompetitiveAnalysis(bounty)
      case 'data-analysis':
        return this.generateDataAnalysis(bounty)
      case 'user-research':
        return this.generateUserResearch(bounty)
      default:
        return this.generateGeneralResearch(bounty)
    }
  }

  /**
   * Determine research type
   */
  private determineResearchType(bounty: Bounty): string {
    const combined = `${bounty.title} ${bounty.description || ''}`.toLowerCase()

    if (combined.includes('market')) return 'market-research'
    if (combined.includes('competitive') || combined.includes('competitor')) return 'competitive-analysis'
    if (combined.includes('data') || combined.includes('analytics')) return 'data-analysis'
    if (combined.includes('user') || combined.includes('customer')) return 'user-research'
    return 'general'
  }

  /**
   * Generate market research report
   */
  private generateMarketResearch(bounty: Bounty): string {
    return `
# Market Research Report: ${bounty.title}

## Executive Summary
${bounty.description || 'Comprehensive market analysis and insights.'}

---

## Table of Contents
1. Market Overview
2. Market Size & Growth
3. Key Trends
4. Target Segments
5. Competitive Landscape
6. Opportunities & Challenges
7. Recommendations
8. Appendix

---

## 1. Market Overview

### Industry Background
Overview of the industry context and recent developments.

### Market Definition
Clear definition of the market scope and boundaries.

### Key Players
- Major players and their market positions
- Emerging challengers
- Regional leaders

## 2. Market Size & Growth

### Current Market Size
- Global market value: $X billion
- Annual growth rate: X%
- Key growth drivers

### Market Projections (5-Year Forecast)
| Year | Market Size | Growth Rate |
|------|-------------|-------------|
| 2026 | $X.X B | X% |
| 2027 | $X.X B | X% |
| 2028 | $X.X B | X% |
| 2029 | $X.X B | X% |
| 2030 | $X.X B | X% |

### Regional Breakdown
- North America: X%
- Europe: X%
- Asia-Pacific: X%
- Rest of World: X%

## 3. Key Trends

### Trend 1: [Technology Advancement]
Description and impact on the market.

### Trend 2: [Consumer Behavior Shift]
Description and implications.

### Trend 3: [Regulatory Changes]
Description and market effects.

### Trend 4: [Innovation Drivers]
Description and opportunities.

## 4. Target Segments

### Segment A
- Demographics
- Needs and pain points
- Buying behavior

### Segment B
- Demographics
- Needs and pain points
- Buying behavior

### Segment C
- Demographics
- Needs and pain points
- Buying behavior

## 5. Competitive Landscape

### Market Share Analysis
Visual representation of competitive positioning.

### Competitor Profiles
Brief profiles of key competitors.

### Competitive Advantages
- Product differentiation
- Pricing strategies
- Distribution channels

## 6. Opportunities & Challenges

### Opportunities
1. Market expansion opportunity
2. Technology leverage opportunity
3. Partnership opportunity

### Challenges
1. Market barrier
2. Competitive threat
3. Regulatory challenge

## 7. Recommendations

### Strategic Recommendations
1. **Short-term (0-6 months):** Action items
2. **Medium-term (6-18 months):** Strategic initiatives
3. **Long-term (18+ months):** Vision alignment

### Implementation Priorities
Prioritized list of recommended actions.

## 8. Appendix

### Methodology
Research methodology and data sources.

### Data Sources
- Primary research
- Secondary sources
- Industry reports

---

*Research conducted by ${this.deployment.name} (AI Research Agent)*
*Report Date: ${new Date().toISOString().split('T')[0]}*
`.trim()
  }

  /**
   * Generate competitive analysis
   */
  private generateCompetitiveAnalysis(bounty: Bounty): string {
    return `
# Competitive Analysis: ${bounty.title}

## Executive Summary
${bounty.description || 'In-depth competitive landscape analysis.'}

---

## Competitive Overview

### Market Position Map
Analysis of competitive positioning based on key factors.

### Key Competitors Identified
1. Competitor A - Market Leader
2. Competitor B - Fast Follower
3. Competitor C - Niche Player
4. Competitor D - Emerging Challenger

---

## Detailed Competitor Analysis

### Competitor A

#### Company Overview
- Founded: Year
- Headquarters: Location
- Employees: X,XXX
- Funding: $XX million

#### Product/Service Offering
- Core products
- Key features
- Pricing model

#### Strengths
- Strength 1
- Strength 2
- Strength 3

#### Weaknesses
- Weakness 1
- Weakness 2

#### Market Strategy
Analysis of their go-to-market approach.

---

### Competitor B
[Similar structure as above]

---

### Competitor C
[Similar structure as above]

---

## Comparison Matrix

| Feature | Competitor A | Competitor B | Competitor C | Our Position |
|---------|--------------|--------------|--------------|--------------|
| Feature 1 | ✅ | ✅ | ❌ | ✅ |
| Feature 2 | ✅ | ❌ | ✅ | ✅ |
| Feature 3 | ❌ | ✅ | ✅ | ✅ |
| Pricing | $$$ | $$ | $ | $$ |

## SWOT Analysis

### Strengths
- Key strength 1
- Key strength 2

### Weaknesses
- Area for improvement 1
- Area for improvement 2

### Opportunities
- Market opportunity 1
- Market opportunity 2

### Threats
- Competitive threat 1
- Market threat 2

## Strategic Recommendations

### Differentiation Strategy
How to stand out in the competitive landscape.

### Competitive Response Plan
Actions to address competitive threats.

---

*Analysis prepared by ${this.deployment.name} (AI Research Agent)*
`.trim()
  }

  /**
   * Generate data analysis report
   */
  private generateDataAnalysis(bounty: Bounty): string {
    return `
# Data Analysis Report: ${bounty.title}

## Executive Summary
${bounty.description || 'Data-driven insights and analysis.'}

---

## Analysis Overview

### Objectives
- Primary objective of the analysis
- Key questions to answer
- Success metrics

### Data Sources
- Source 1: Description
- Source 2: Description
- Source 3: Description

### Methodology
Description of analytical methods used.

---

## Key Findings

### Finding 1: [Key Insight]
**Insight:** Description of the finding
**Impact:** Business implication
**Confidence:** High/Medium/Low

### Finding 2: [Key Insight]
**Insight:** Description of the finding
**Impact:** Business implication
**Confidence:** High/Medium/Low

### Finding 3: [Key Insight]
**Insight:** Description of the finding
**Impact:** Business implication
**Confidence:** High/Medium/Low

---

## Data Visualizations

### Chart 1: [Metric Over Time]
\`\`\`
[Description of trend visualization]
\`\`\`

### Chart 2: [Distribution Analysis]
\`\`\`
[Description of distribution visualization]
\`\`\`

### Chart 3: [Comparison Analysis]
\`\`\`
[Description of comparison visualization]
\`\`\`

---

## Statistical Summary

| Metric | Value | Change | Benchmark |
|--------|-------|--------|-----------|
| Metric 1 | X.XX | +X% | Industry avg |
| Metric 2 | X.XX | -X% | Industry avg |
| Metric 3 | X.XX | +X% | Industry avg |

---

## Recommendations

### Data-Driven Actions
1. **Immediate:** Action based on finding 1
2. **Short-term:** Action based on finding 2
3. **Long-term:** Action based on finding 3

### Next Steps
- Additional analysis needed
- Data collection improvements
- Monitoring recommendations

---

## Appendix

### Data Dictionary
Definitions of key terms and metrics.

### Methodology Details
Detailed description of analytical approach.

---

*Analysis conducted by ${this.deployment.name} (AI Research Agent)*
`.trim()
  }

  /**
   * Generate user research report
   */
  private generateUserResearch(bounty: Bounty): string {
    return `
# User Research Report: ${bounty.title}

## Executive Summary
${bounty.description || 'User insights and behavioral analysis.'}

---

## Research Objectives
- Understand user needs and pain points
- Identify usage patterns
- Discover improvement opportunities

## Methodology

### Research Methods
- User interviews (N=X)
- Surveys (N=X)
- Usability testing
- Behavioral analytics

### Participant Profile
- Demographics
- User segments
- Selection criteria

---

## Key Findings

### User Personas

#### Persona 1: [Name]
- **Demographics:** Age, role, background
- **Goals:** What they want to achieve
- **Pain Points:** Current frustrations
- **Behaviors:** How they interact with the product

#### Persona 2: [Name]
- **Demographics:** Age, role, background
- **Goals:** What they want to achieve
- **Pain Points:** Current frustrations
- **Behaviors:** How they interact with the product

---

### User Journey Map

\`\`\`
Awareness → Consideration → Decision → Onboarding → Active Use → Advocacy
\`\`\`

#### Pain Points by Stage
1. **Awareness:** Challenge description
2. **Consideration:** Challenge description
3. **Decision:** Challenge description
4. **Onboarding:** Challenge description
5. **Active Use:** Challenge description

---

### Key Insights

#### Insight 1
**Finding:** User behavior or need
**Evidence:** Supporting data
**Opportunity:** How to address

#### Insight 2
**Finding:** User behavior or need
**Evidence:** Supporting data
**Opportunity:** How to address

#### Insight 3
**Finding:** User behavior or need
**Evidence:** Supporting data
**Opportunity:** How to address

---

## Recommendations

### Priority 1: [High Impact]
- Description
- Expected impact
- Implementation effort

### Priority 2: [Medium Impact]
- Description
- Expected impact
- Implementation effort

### Priority 3: [Quick Win]
- Description
- Expected impact
- Implementation effort

---

*Research conducted by ${this.deployment.name} (AI Research Agent)*
`.trim()
  }

  /**
   * Generate general research report
   */
  private generateGeneralResearch(bounty: Bounty): string {
    return `
# Research Report: ${bounty.title}

## Executive Summary
${bounty.description || 'Comprehensive research findings and analysis.'}

---

## Research Overview

### Objectives
Clear statement of research goals.

### Scope
Definition of research boundaries.

### Methodology
Description of research approach.

---

## Findings

### Finding 1
Detailed description with supporting evidence.

### Finding 2
Detailed description with supporting evidence.

### Finding 3
Detailed description with supporting evidence.

---

## Analysis

### Implications
What the findings mean for stakeholders.

### Trends
Patterns identified in the research.

### Gaps
Areas requiring further investigation.

---

## Recommendations

1. Recommendation based on findings
2. Recommendation based on findings
3. Recommendation based on findings

---

## Conclusion
Summary of key points and next steps.

---

*Research conducted by ${this.deployment.name} (AI Research Agent)*
`.trim()
  }
}

/**
 * Factory function to create a Research Agent
 */
export function createResearchAgent(
  deployment: AgentDeployment,
  walletAddress?: string
): ResearchAgent {
  return new ResearchAgent(deployment, walletAddress)
}
