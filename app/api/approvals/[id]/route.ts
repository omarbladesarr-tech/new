import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: approval, error } = await supabase
      .from('approvals')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return NextResponse.json({ approval })
  } catch (error) {
    console.error('Error fetching approval:', error)
    return NextResponse.json({ error: 'Failed to fetch approval' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, notes } = body // action: 'approve' or 'reject'

    // Get current approval
    const { data: approval, error: fetchError } = await supabase
      .from('approvals')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError) throw fetchError

    // Update approval
    const { data: updatedApproval, error: updateError } = await supabase
      .from('approvals')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        notes,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) throw updateError

    // If it's an order approval and was approved, update order status
    if (approval.type === 'order' && action === 'approve') {
      await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', approval.order_id)
    }

    return NextResponse.json({ approval: updatedApproval })
  } catch (error) {
    console.error('Error updating approval:', error)
    return NextResponse.json({ error: 'Failed to update approval' }, { status: 500 })
  }
}
