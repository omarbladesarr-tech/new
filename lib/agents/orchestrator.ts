import { createClient } from '@/lib/supabase/server'

export interface AgentTask {
  id: string
  agent_id: string
  type: 'order_processing' | 'product_listing' | 'customer_support' | 'marketing' | 'research'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  data: Record<string, any>
  priority: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
  completed_at?: string
}

export interface AgentLog {
  id: string
  agent_id: string
  task_id?: string
  action: string
  status: 'success' | 'error' | 'warning'
  message: string
  metadata: Record<string, any>
  timestamp: string
}

export class MasterOrchestrator {
  private supabase: any
  private userId: string

  constructor(supabase: any, userId: string) {
    this.supabase = supabase
    this.userId = userId
  }

  /**
   * Distribute task to appropriate agent based on type
   */
  async distributeTask(task: AgentTask): Promise<void> {
    try {
      // Get available agents based on task type
      const agents = await this.getAvailableAgents(task.type)

      if (agents.length === 0) {
        await this.logAction('system', 'no_available_agents', 'error', 
          `No available agents for task type: ${task.type}`, 
          { task_id: task.id })
        return
      }

      // Select agent based on current load
      const agent = this.selectAgent(agents)

      // Log task assignment
      await this.logAction(agent.id, task.id, 'success', 
        `Task assigned to agent: ${agent.name}`, 
        { agent_id: agent.id })

      // Update task status
      await this.supabase
        .from('agent_tasks')
        .update({ status: 'in_progress', assigned_agent_id: agent.id })
        .eq('id', task.id)
    } catch (error) {
      console.error('Error distributing task:', error)
      await this.logAction('system', task.id, 'error', 
        'Failed to distribute task', 
        { error: String(error) })
    }
  }

  /**
   * Get available agents for a specific task type
   */
  private async getAvailableAgents(taskType: string): Promise<any[]> {
    const agentMapping: Record<string, string[]> = {
      order_processing: ['order-fulfillment'],
      product_listing: ['product-listing'],
      customer_support: ['customer-service'],
      marketing: ['marketing'],
      research: ['research'],
    }

    const agentRoles = agentMapping[taskType] || []

    const { data: agents } = await this.supabase
      .from('agents')
      .select('*')
      .eq('user_id', this.userId)
      .in('id', agentRoles)
      .eq('status', 'active')

    return agents || []
  }

  /**
   * Select agent with lowest current load
   */
  private selectAgent(agents: any[]): any {
    // For now, return first available agent
    // In production, implement load balancing based on active tasks
    return agents[0]
  }

  /**
   * Log agent action
   */
  async logAction(
    agentId: string,
    taskId: string | undefined,
    status: 'success' | 'error' | 'warning',
    message: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await this.supabase.from('agent_logs').insert([
        {
          user_id: this.userId,
          agent_id: agentId,
          task_id: taskId,
          action: message,
          status,
          metadata,
          created_at: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error('Error logging action:', error)
    }
  }

  /**
   * Monitor agent health
   */
  async monitorAgentHealth(): Promise<Record<string, any>> {
    try {
      const { data: agents } = await this.supabase
        .from('agents')
        .select('*')
        .eq('user_id', this.userId)

      const healthData: Record<string, any> = {}

      for (const agent of agents || []) {
        const { data: logs } = await this.supabase
          .from('agent_logs')
          .select('status')
          .eq('agent_id', agent.id)
          .order('created_at', { ascending: false })
          .limit(100)

        const logs_array = logs || []
        const successCount = logs_array.filter((l: any) => l.status === 'success').length
        const errorCount = logs_array.filter((l: any) => l.status === 'error').length
        const successRate = logs_array.length > 0 ? (successCount / logs_array.length) * 100 : 0

        healthData[agent.id] = {
          name: agent.name,
          status: agent.status,
          success_rate: successRate,
          recent_errors: errorCount,
          last_activity: logs_array[0]?.created_at,
        }
      }

      return healthData
    } catch (error) {
      console.error('Error monitoring agent health:', error)
      return {}
    }
  }
}

/**
 * Process order through fulfillment agent
 */
export async function processOrder(supabase: any, userId: string, orderId: string) {
  const orchestrator = new MasterOrchestrator(supabase, userId)

  try {
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (!order) {
      await orchestrator.logAction('order-fulfillment', orderId, 'error', 
        'Order not found', {})
      return
    }

    // Log order processing start
    await orchestrator.logAction('order-fulfillment', orderId, 'success', 
      'Processing order', { total: order.total_amount })

    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', orderId)

    // Create fulfillment task
    await supabase.from('fulfillment_tasks').insert([
      {
        user_id: userId,
        order_id: orderId,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ])

    await orchestrator.logAction('order-fulfillment', orderId, 'success', 
      'Fulfillment task created', {})
  } catch (error) {
    console.error('Error processing order:', error)
    await orchestrator.logAction('order-fulfillment', orderId, 'error', 
      'Error processing order', { error: String(error) })
  }
}
