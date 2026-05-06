// Platform Orchestrator
// Manages all agent deployments and coordinates platform activities

import { createClient } from '@/lib/supabase/server'
import {
  AgentDeployment,
  PlatformConnection,
  BountyApplication,
  AgentEarning,
  PlatformName,
  AgentType,
  AgentStatus,
} from './types'
import { createAgent, AGENT_TYPE_INFO, PLATFORM_INFO } from './agents'
import { createDefaultConfig } from './decision-engine'

export class PlatformOrchestrator {
  private supabase: Awaited<ReturnType<typeof createClient>> | null = null
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  /**
   * Initialize supabase client
   */
  private async initSupabase() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  /**
   * Get all platform connections for user
   */
  async getPlatformConnections(): Promise<PlatformConnection[]> {
    const supabase = await this.initSupabase()
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', this.userId)

    if (error) throw error
    return (data || []) as PlatformConnection[]
  }

  /**
   * Connect to a platform
   */
  async connectPlatform(
    platform: PlatformName,
    walletAddress?: string,
    credentials?: Record<string, string>
  ): Promise<PlatformConnection> {
    const supabase = await this.initSupabase()

    const { data, error } = await supabase
      .from('platform_connections')
      .upsert(
        {
          user_id: this.userId,
          platform,
          wallet_address: walletAddress,
          credentials: credentials || {},
          status: 'connected',
          connected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,platform' }
      )
      .select()
      .single()

    if (error) throw error
    return data as PlatformConnection
  }

  /**
   * Disconnect from a platform
   */
  async disconnectPlatform(platform: PlatformName): Promise<void> {
    const supabase = await this.initSupabase()
    await supabase
      .from('platform_connections')
      .update({ status: 'disconnected', updated_at: new Date().toISOString() })
      .eq('user_id', this.userId)
      .eq('platform', platform)
  }

  /**
   * Get all agent deployments
   */
  async getAgentDeployments(): Promise<AgentDeployment[]> {
    const supabase = await this.initSupabase()
    const { data, error } = await supabase
      .from('agent_deployments')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      agentType: d.agent_type,
      platform: d.platform,
      name: d.name,
      status: d.status,
      config: d.config,
      skills: d.skills,
      autonomyLevel: d.autonomy_level,
      minReward: d.min_reward,
      maxConcurrentJobs: d.max_concurrent_jobs,
      totalEarnings: d.total_earnings,
      jobsCompleted: d.jobs_completed,
      successRate: d.success_rate,
      createdAt: new Date(d.created_at),
      updatedAt: new Date(d.updated_at),
    }))
  }

  /**
   * Deploy a new agent
   */
  async deployAgent(
    agentType: AgentType,
    platform: PlatformName,
    name: string,
    options?: {
      skills?: string[]
      minReward?: number
      maxConcurrentJobs?: number
      autonomyLevel?: 'full' | 'semi' | 'manual'
    }
  ): Promise<AgentDeployment> {
    const supabase = await this.initSupabase()
    const agentInfo = AGENT_TYPE_INFO[agentType]

    const { data, error } = await supabase
      .from('agent_deployments')
      .insert({
        user_id: this.userId,
        agent_type: agentType,
        platform,
        name,
        status: 'idle' as AgentStatus,
        config: createDefaultConfig(agentType),
        skills: options?.skills || agentInfo.skills,
        autonomy_level: options?.autonomyLevel || 'full',
        min_reward: options?.minReward || agentInfo.suggestedMinReward,
        max_concurrent_jobs: options?.maxConcurrentJobs || 3,
        total_earnings: 0,
        jobs_completed: 0,
        success_rate: 0,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      agentType: data.agent_type,
      platform: data.platform,
      name: data.name,
      status: data.status,
      config: data.config,
      skills: data.skills,
      autonomyLevel: data.autonomy_level,
      minReward: data.min_reward,
      maxConcurrentJobs: data.max_concurrent_jobs,
      totalEarnings: data.total_earnings,
      jobsCompleted: data.jobs_completed,
      successRate: data.success_rate,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  /**
   * Update agent configuration
   */
  async updateAgent(
    deploymentId: string,
    updates: Partial<{
      name: string
      status: AgentStatus
      config: any
      skills: string[]
      autonomyLevel: 'full' | 'semi' | 'manual'
      minReward: number
      maxConcurrentJobs: number
    }>
  ): Promise<void> {
    const supabase = await this.initSupabase()
    
    const updateData: any = { updated_at: new Date().toISOString() }
    if (updates.name) updateData.name = updates.name
    if (updates.status) updateData.status = updates.status
    if (updates.config) updateData.config = updates.config
    if (updates.skills) updateData.skills = updates.skills
    if (updates.autonomyLevel) updateData.autonomy_level = updates.autonomyLevel
    if (updates.minReward !== undefined) updateData.min_reward = updates.minReward
    if (updates.maxConcurrentJobs !== undefined) updateData.max_concurrent_jobs = updates.maxConcurrentJobs

    await supabase
      .from('agent_deployments')
      .update(updateData)
      .eq('id', deploymentId)
      .eq('user_id', this.userId)
  }

  /**
   * Delete an agent deployment
   */
  async deleteAgent(deploymentId: string): Promise<void> {
    const supabase = await this.initSupabase()
    await supabase
      .from('agent_deployments')
      .delete()
      .eq('id', deploymentId)
      .eq('user_id', this.userId)
  }

  /**
   * Run a specific agent
   */
  async runAgent(deploymentId: string, walletAddress?: string): Promise<void> {
    const supabase = await this.initSupabase()
    
    // Get deployment
    const { data: deployment, error } = await supabase
      .from('agent_deployments')
      .select('*')
      .eq('id', deploymentId)
      .eq('user_id', this.userId)
      .single()

    if (error || !deployment) throw new Error('Agent not found')

    // Convert to AgentDeployment type
    const agentDeployment: AgentDeployment = {
      id: deployment.id,
      userId: deployment.user_id,
      agentType: deployment.agent_type,
      platform: deployment.platform,
      name: deployment.name,
      status: deployment.status,
      config: deployment.config,
      skills: deployment.skills,
      autonomyLevel: deployment.autonomy_level,
      minReward: deployment.min_reward,
      maxConcurrentJobs: deployment.max_concurrent_jobs,
      totalEarnings: deployment.total_earnings,
      jobsCompleted: deployment.jobs_completed,
      successRate: deployment.success_rate,
      createdAt: new Date(deployment.created_at),
      updatedAt: new Date(deployment.updated_at),
    }

    // Create and run agent
    const agent = createAgent(agentDeployment, walletAddress)
    await agent.run()
  }

  /**
   * Run all active agents
   */
  async runAllAgents(walletAddress?: string): Promise<{ success: number; failed: number }> {
    const deployments = await this.getAgentDeployments()
    const activeDeployments = deployments.filter((d) => d.status !== 'paused')

    let success = 0
    let failed = 0

    for (const deployment of activeDeployments) {
      try {
        await this.runAgent(deployment.id, walletAddress)
        success++
      } catch (error) {
        console.error(`Failed to run agent ${deployment.name}:`, error)
        failed++
      }
    }

    return { success, failed }
  }

  /**
   * Get all bounty applications
   */
  async getApplications(filters?: {
    status?: string
    deploymentId?: string
    platform?: PlatformName
  }): Promise<BountyApplication[]> {
    const supabase = await this.initSupabase()
    
    let query = supabase
      .from('bounty_applications')
      .select('*, agent_deployments!inner(user_id, platform)')
      .eq('agent_deployments.user_id', this.userId)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.deploymentId) {
      query = query.eq('deployment_id', filters.deploymentId)
    }
    if (filters?.platform) {
      query = query.eq('agent_deployments.platform', filters.platform)
    }

    const { data, error } = await query

    if (error) throw error
    return (data || []) as BountyApplication[]
  }

  /**
   * Get earnings summary
   */
  async getEarningsSummary(): Promise<{
    totalGross: number
    totalNet: number
    totalPlatformFees: number
    totalServiceShare: number
    byPlatform: Record<PlatformName, { gross: number; net: number; count: number }>
    byAgent: Record<string, { gross: number; net: number; count: number }>
  }> {
    const supabase = await this.initSupabase()
    
    const { data: earnings, error } = await supabase
      .from('agent_earnings')
      .select('*, agent_deployments!inner(user_id, platform, name)')
      .eq('agent_deployments.user_id', this.userId)

    if (error) throw error

    const summary = {
      totalGross: 0,
      totalNet: 0,
      totalPlatformFees: 0,
      totalServiceShare: 0,
      byPlatform: {} as Record<PlatformName, { gross: number; net: number; count: number }>,
      byAgent: {} as Record<string, { gross: number; net: number; count: number }>,
    }

    for (const earning of earnings || []) {
      summary.totalGross += Number(earning.gross_amount) || 0
      summary.totalNet += Number(earning.net_amount) || 0
      summary.totalPlatformFees += Number(earning.platform_fee) || 0
      summary.totalServiceShare += Number(earning.service_share) || 0

      const platform = earning.agent_deployments?.platform as PlatformName
      if (platform) {
        if (!summary.byPlatform[platform]) {
          summary.byPlatform[platform] = { gross: 0, net: 0, count: 0 }
        }
        summary.byPlatform[platform].gross += Number(earning.gross_amount) || 0
        summary.byPlatform[platform].net += Number(earning.net_amount) || 0
        summary.byPlatform[platform].count++
      }

      const agentName = earning.agent_deployments?.name
      if (agentName) {
        if (!summary.byAgent[agentName]) {
          summary.byAgent[agentName] = { gross: 0, net: 0, count: 0 }
        }
        summary.byAgent[agentName].gross += Number(earning.gross_amount) || 0
        summary.byAgent[agentName].net += Number(earning.net_amount) || 0
        summary.byAgent[agentName].count++
      }
    }

    return summary
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 20): Promise<any[]> {
    const supabase = await this.initSupabase()
    
    const { data, error } = await supabase
      .from('agent_logs')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }
}

/**
 * Create orchestrator instance for a user
 */
export function createOrchestrator(userId: string): PlatformOrchestrator {
  return new PlatformOrchestrator(userId)
}
