import { NextResponse } from 'next/server'
import { createAdminClient, getSessionUser } from '@/lib/supabase-server'

// PATCH /api/admin/cases/[id] — approve or reject a case
export async function PATCH(request, { params }) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'admin' && user.role !== 'legal_reviewer') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { action, note } = await request.json()

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action. Use approve or reject.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const updates = {
      status:     action === 'approve' ? 'processing' : 'failed',
      updated_at: new Date().toISOString(),
    }

    // Set 24h expiry on approval
    if (action === 'approve') {
      updates.expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    const { data: updated, error } = await supabase
      .from('cases')
      .update(updates)
      .eq('id', id)
      .select('id, case_code, status, expires_at')
      .single()

    if (error) {
      console.error('[admin/cases PATCH]', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, case: updated, action })
  } catch (err) {
    console.error('[admin/cases/:id PATCH] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
