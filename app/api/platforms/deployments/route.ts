import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createOrchestrator } from '@/lib/platforms/platform-orchestrator'
import { PLATFORM_INFO, AGENT_TYPE_INFO } from '@/lib/platforms/agents'
import { PlatformName, AgentType } from '@/lib/platforms/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orchestrator = createOrchestrator(user.id)
    const deployments = await orchestrator.getAgentDeployments()

    return NextResponse.json({ deployments })
  } catch (error) {
    console.error('Error fetching deployments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deployments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { agentType, platform, name, skills, minReward, maxConcurrentJobs, autonomyLevel } = body

    // Validate inputs
    if (!agentType || !AGENT_TYPE_INFO[agentType as AgentType]) {
      return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 })
    }
    if (!platform || !PLATFORM_INFO[platform as PlatformName]) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }
    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const orchestrator = createOrchestrator(user.id)
    const deployment = await orchestrator.deployAgent(
      agentType as AgentType,
      platform as PlatformName,
      name,
      {
        skills,
        minReward,
        maxConcurrentJobs,
        autonomyLevel,
      }
    )

    return NextResponse.json({ deployment })
  } catch (error) {
    console.error('Error deploying agent:', error)
    return NextResponse.json(
      { error: 'Failed to deploy agent' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { deploymentId, ...updates } = body

    if (!deploymentId) {
      return NextResponse.json({ error: 'Deployment ID required' }, { status: 400 })
    }

    const orchestrator = createOrchestrator(user.id)
    await orchestrator.updateAgent(deploymentId, updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating deployment:', error)
    return NextResponse.json(
      { error: 'Failed to update deployment' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const deploymentId = searchParams.get('id')

    if (!deploymentId) {
      return NextResponse.json({ error: 'Deployment ID required' }, { status: 400 })
    }

    const orchestrator = createOrchestrator(user.id)
    await orchestrator.deleteAgent(deploymentId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting deployment:', error)
    return NextResponse.json(
      { error: 'Failed to delete deployment' },
      { status: 500 }
    )
  }
}
