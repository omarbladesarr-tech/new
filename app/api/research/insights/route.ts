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
    const category = searchParams.get('category')

    let query = supabase.from('market_insights').select('*').eq('user_id', user.id)

    if (category) {
      query = query.eq('category', category)
    }

    const { data: insights, error } = await query
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 })
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
    const { title, category, content, trend_direction, confidence_score, data_sources } = body

    const { data: insight, error } = await supabase
      .from('market_insights')
      .insert([
        {
          user_id: user.id,
          title,
          category,
          content,
          trend_direction,
          confidence_score,
          data_sources,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ insight }, { status: 201 })
  } catch (error) {
    console.error('Error creating insight:', error)
    return NextResponse.json({ error: 'Failed to create insight' }, { status: 500 })
  }
}
