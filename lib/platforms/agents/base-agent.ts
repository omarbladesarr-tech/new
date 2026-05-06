// Base Platform Agent
// Abstract class for all platform-specific agents

import { createClient } from '@/lib/supabase/server'
import {
  AgentDeployment,
  Bounty,
  BountyApplication,
  AgentEarning,
  MatchResult,
  PlatformName,
  ApplicationStatus,
  AgentStatus,
} from '../types'
import { DecisionEngine, generatePitch } from '../decision-engine'
import { getSuperteamClient } from '../superteam-earn'

export abstract class BasePlatformAgent {
  protected deployment: AgentDeployment
  protected decisionEngine: DecisionEngine
  protected supabase: Awaited<ReturnType<typeof createClient>> | null = null

  constructor(deployment: AgentDeployment) {
    this.deployment = deployment
    this.decisionEngine = new DecisionEngine(deployment)
  }

  /**
   * Initialize supabase client
   */
  protected async initSupabase() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  /**
   * Main agent loop - discover, analyze, apply, and work
   */
  async run(): Promise<void> {
    try {
      await this.updateStatus('active')

      // 1. Discover bounties
      const bounties = await this.discoverBounties()
      console.log(`[${this.deployment.name}] Discovered ${bounties.length} bounties`)

      // 2. Analyze and filter
      const matches = this.decisionEngine.analyzeBounties(bounties)
      const autoApplyMatches = matches.filter((m) => m.shouldAutoApply)
      console.log(`[${this.deployment.name}] ${autoApplyMatches.length} bounties match auto-apply criteria`)

      // 3. Apply to matching bounties
      for (const match of autoApplyMatches) {
        await this.applyToBounty(match)
      }

      // 4. Check for accepted applications and work on them
      await this.processAcceptedApplications()

      // 5. Check for submissions needing completion
      await this.processSubmissions()

      await this.updateStatus('idle')
    } catch (error) {
      console.error(`[${this.deployment.name}] Error:`, error)
      await this.updateStatus('error')
      throw error
    }
  }

  /**
   * Discover available bounties from the platform
   */
  abstract discoverBounties(): Promise<Bounty[]>

  /**
   * Submit work for a bounty
   */
  abstract submitWork(application: BountyApplication, content: string): Promise<boolean>

  /**
   * Generate work content for a bounty
   */
  abstract generateWorkContent(bounty: Bounty): Promise<string>

  /**
   * Apply to a bounty
   */
  async applyToBounty(match: MatchResult): Promise<BountyApplication | null> {
    const supabase = await this.initSupabase()
    const bounty = match.bounty

    try {
      // Check if already applied
      const { data: existing } = await supabase
        .from('bounty_applications')
        .select('id')
        .eq('deployment_id', this.deployment.id)
        .eq('platform_bounty_id', bounty.platformBountyId)
        .single()

      if (existing) {
        console.log(`[${this.deployment.name}] Already applied to: ${bounty.title}`)
        return null
      }

      // Generate pitch
      const pitch = generatePitch(this.deployment, bounty, match)

      // Create application record
      const { data: application, error } = await supabase
        .from('bounty_applications')
        .insert({
          deployment_id: this.deployment.id,
          platform_bounty_id: bounty.platformBountyId,
          title: bounty.title,
          description: bounty.description,
          reward_amount: bounty.rewardAmount,
          reward_token: bounty.rewardToken,
          skills_required: bounty.skills,
          deadline: bounty.deadline?.toISOString(),
          match_score: match.score,
          status: 'applied' as ApplicationStatus,
          pitch,
          sponsor_name: bounty.sponsorName,
          sponsor_logo: bounty.sponsorLogo,
          applied_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      console.log(`[${this.deployment.name}] Applied to: ${bounty.title} (Score: ${match.score})`)

      // Log the action
      await this.logAction('applied', bounty.title, { match_score: match.score })

      return application as BountyApplication
    } catch (error) {
      console.error(`[${this.deployment.name}] Failed to apply:`, error)
      return null
    }
  }

  /**
   * Process accepted applications
   */
  async processAcceptedApplications(): Promise<void> {
    const supabase = await this.initSupabase()

    const { data: applications } = await supabase
      .from('bounty_applications')
      .select('*')
      .eq('deployment_id', this.deployment.id)
      .in('status', ['accepted', 'in_progress'])

    if (!applications?.length) return

    for (const app of applications) {
      try {
        // Update status to in_progress
        if (app.status === 'accepted') {
          await supabase
            .from('bounty_applications')
            .update({ status: 'in_progress' as ApplicationStatus })
            .eq('id', app.id)
          
          await this.updateStatus('working')
        }

        // Generate work content
        const bounty: Bounty = {
          id: app.id,
          platformBountyId: app.platform_bounty_id,
          platform: this.deployment.platform,
          title: app.title,
          description: app.description || '',
          rewardAmount: app.reward_amount,
          rewardToken: app.reward_token,
          skills: app.skills_required || [],
          deadline: app.deadline ? new Date(app.deadline) : undefined,
          sponsorName: app.sponsor_name,
          type: 'bounty',
          status: 'in_progress',
          createdAt: new Date(app.created_at),
        }

        const content = await this.generateWorkContent(bounty)

        // Submit the work
        const success = await this.submitWork(app as BountyApplication, content)

        if (success) {
          await supabase
            .from('bounty_applications')
            .update({
              status: 'submitted' as ApplicationStatus,
              submission_content: content,
              submitted_at: new Date().toISOString(),
            })
            .eq('id', app.id)

          await this.logAction('submitted', app.title, { content_length: content.length })
        }
      } catch (error) {
        console.error(`[${this.deployment.name}] Error processing application:`, error)
      }
    }
  }

  /**
   * Process submissions and track earnings
   */
  async processSubmissions(): Promise<void> {
    const supabase = await this.initSupabase()

    // Check for completed submissions
    const { data: submissions } = await supabase
      .from('bounty_applications')
      .select('*')
      .eq('deployment_id', this.deployment.id)
      .eq('status', 'submitted')

    // In a real implementation, we would check the platform API
    // for submission status updates
    // For now, this is a placeholder for the polling logic
  }

  /**
   * Record earnings from a completed bounty
   */
  async recordEarnings(
    application: BountyApplication,
    grossAmount: number,
    txHash?: string
  ): Promise<void> {
    const supabase = await this.initSupabase()

    // Get platform fee
    const platformFeePercent = this.getPlatformFeePercent()
    const serviceSharePercent = 20 // Default 20% service share

    const platformFee = grossAmount * (platformFeePercent / 100)
    const serviceShare = grossAmount * (serviceSharePercent / 100)
    const netAmount = grossAmount - platformFee - serviceShare

    await supabase.from('agent_earnings').insert({
      deployment_id: this.deployment.id,
      application_id: application.id,
      gross_amount: grossAmount,
      platform_fee: platformFee,
      platform_fee_percent: platformFeePercent,
      service_share: serviceShare,
      service_share_percent: serviceSharePercent,
      client_share: 0,
      net_amount: netAmount,
      currency: application.rewardToken,
      tx_hash: txHash,
      status: 'pending',
    })

    // Update deployment stats
    await supabase
      .from('agent_deployments')
      .update({
        total_earnings: this.deployment.totalEarnings + netAmount,
        jobs_completed: this.deployment.jobsCompleted + 1,
      })
      .eq('id', this.deployment.id)

    await this.logAction('earned', application.title, {
      gross: grossAmount,
      net: netAmount,
    })
  }

  /**
   * Get platform fee percentage
   */
  protected getPlatformFeePercent(): number {
    const fees: Record<PlatformName, number> = {
      'superteam-earn': 0,
      'dealwork': 3,
      'clawgig': 10,
      'toku': 15,
    }
    return fees[this.deployment.platform] || 0
  }

  /**
   * Update agent status
   */
  protected async updateStatus(status: AgentStatus): Promise<void> {
    const supabase = await this.initSupabase()
    await supabase
      .from('agent_deployments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', this.deployment.id)
  }

  /**
   * Log agent action
   */
  protected async logAction(
    action: string,
    target: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const supabase = await this.initSupabase()
    await supabase.from('agent_logs').insert({
      user_id: this.deployment.userId,
      agent_id: this.deployment.id,
      action: `${action}: ${target}`,
      status: 'success',
      metadata: {
        ...metadata,
        agent_type: this.deployment.agentType,
        platform: this.deployment.platform,
      },
      created_at: new Date().toISOString(),
    })
  }
}
