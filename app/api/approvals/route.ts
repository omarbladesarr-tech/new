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
    const status = searchParams.get('status') || 'pending'

    const { data: approvals, error } = await supabase
      .from('approvals')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ approvals })
  } catch (error) {
    console.error('Error fetching approvals:', error)
    return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 })
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
    const { type, amount, reason, reference_id } = body

    const { data: approval, error } = await supabase
      .from('approvals')
      .insert([
        {
          user_id: user.id,
          type,
          amount,
          reason,
          reference_id,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ approval }, { status: 201 })
  } catch (error) {
    console.error('Error creating approval:', error)
    return NextResponse.json({ error: 'Failed to create approval' }, { status: 500 })
  }
}
