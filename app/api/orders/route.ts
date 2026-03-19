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
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase.from('orders').select('*').eq('user_id', user.id)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
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
      customer_email,
      customer_name,
      total_amount,
      items,
      shipping_address,
      status = 'pending',
    } = body

    // Check if order needs approval based on amount
    const requiresApproval = total_amount > 500

    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          customer_email,
          customer_name,
          total_amount,
          items,
          shipping_address,
          status: requiresApproval ? 'pending_approval' : status,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // If approval is required, create approval record
    if (requiresApproval) {
      await supabase.from('approvals').insert([
        {
          user_id: user.id,
          order_id: order.id,
          type: 'order',
          amount: total_amount,
          reason: `High-value order (>${500})`,
          status: 'pending',
        },
      ])
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
