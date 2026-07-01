import { NextResponse } from 'next/server'
import { createAdminClient, getSessionUser } from '@/lib/supabase-server'

// GET /api/admin/cases — list all cases for admin/legal_reviewer
export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'admin' && user.role !== 'legal_reviewer') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const limit  = parseInt(searchParams.get('limit') || '50', 10)

    const supabase = createAdminClient()

    let query = supabase
      .from('cases')
      .select(`
        id, case_code, subject_name, subject_national_id, subject_phone,
        subject_email, report_type, institutions, purpose, status,
        payment_status, expires_at, created_at, updated_at, requester_id
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status !== 'all') query = query.eq('status', status)

    const { data: cases, error } = await query

    if (error) {
      console.error('[admin/cases GET]', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Fetch requester names separately
    const requesterIds = [...new Set(cases.map(c => c.requester_id))]
    const { data: requesters } = await supabase
      .from('users')
      .select('id, full_name, phone_number')
      .in('id', requesterIds)

    const requesterMap = Object.fromEntries((requesters || []).map(r => [r.id, r]))
    const enriched = cases.map(c => ({
      ...c,
      requester: requesterMap[c.requester_id] || null,
    }))

    return NextResponse.json({ success: true, cases: enriched })
  } catch (err) {
    console.error('[admin/cases GET] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
