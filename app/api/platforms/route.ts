import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createOrchestrator } from '@/lib/platforms/platform-orchestrator'
import { PLATFORM_INFO } from '@/lib/platforms/agents'
import { PlatformName } from '@/lib/platforms/types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orchestrator = createOrchestrator(user.id)
    const connections = await orchestrator.getPlatformConnections()

    // Combine platform info with connection status
    const platforms = Object.entries(PLATFORM_INFO).map(([key, info]) => {
      const connection = connections.find((c) => c.platform === key)
      return {
        id: key,
        ...info,
        connected: connection?.status === 'connected',
        walletAddress: connection?.walletAddress,
        connectedAt: connection?.connectedAt,
      }
    })

    return NextResponse.json({ platforms })
  } catch (error) {
    console.error('Error fetching platforms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
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
    const { platform, walletAddress, credentials } = body

    if (!platform || !PLATFORM_INFO[platform as PlatformName]) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    const orchestrator = createOrchestrator(user.id)
    const connection = await orchestrator.connectPlatform(
      platform as PlatformName,
      walletAddress,
      credentials
    )

    return NextResponse.json({ connection })
  } catch (error) {
    console.error('Error connecting platform:', error)
    return NextResponse.json(
      { error: 'Failed to connect platform' },
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
    const platform = searchParams.get('platform')

    if (!platform || !PLATFORM_INFO[platform as PlatformName]) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    const orchestrator = createOrchestrator(user.id)
    await orchestrator.disconnectPlatform(platform as PlatformName)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting platform:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect platform' },
      { status: 500 }
    )
  }
}
