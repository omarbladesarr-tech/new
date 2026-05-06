import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createOrchestrator } from '@/lib/platforms/platform-orchestrator'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { deploymentId, walletAddress, runAll } = body

    const orchestrator = createOrchestrator(user.id)

    if (runAll) {
      // Run all active agents
      const result = await orchestrator.runAllAgents(walletAddress)
      return NextResponse.json({
        success: true,
        message: `Ran ${result.success} agents successfully, ${result.failed} failed`,
        ...result,
      })
    } else if (deploymentId) {
      // Run specific agent
      await orchestrator.runAgent(deploymentId, walletAddress)
      return NextResponse.json({ success: true, message: 'Agent run completed' })
    } else {
      return NextResponse.json(
        { error: 'Either deploymentId or runAll is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error running agent:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to run agent' },
      { status: 500 }
    )
  }
}
