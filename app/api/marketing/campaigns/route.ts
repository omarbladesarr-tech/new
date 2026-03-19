import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase.from('marketing_campaigns').select('*').eq('user_id', user.id)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: campaigns, error } = await query
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name,
      channel = 'email',
      template_id,
      target_audience,
      scheduled_for,
      budget_limit,
    } = body

    // Check if campaign needs approval (budget > $100/day)
    const dailyBudget = budget_limit ? budget_limit / 30 : 0 // Approximate daily
    const requiresApproval = dailyBudget > 100

    const { data: campaign, error } = await supabase
      .from('marketing_campaigns')
      .insert([
        {
          user_id: user.id,
          name,
          channel,
          template_id,
          target_audience,
          scheduled_for,
          budget_limit,
          status: requiresApproval ? 'pending_approval' : 'draft',
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Create approval if needed
    if (requiresApproval) {
      await supabase.from('approvals').insert([
        {
          user_id: user.id,
          campaign_id: campaign.id,
          type: 'campaign',
          amount: budget_limit,
          reason: `Campaign budget exceeds $100/day limit`,
          status: 'pending',
        },
      ])
    }

    return NextResponse.json({ campaign }, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
