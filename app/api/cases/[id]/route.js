import { NextResponse } from 'next/server'
import { getSessionUser, createAdminClient } from '@/lib/supabase-server'

// ─────────────────────────────────────────────
// GET /api/cases/[id]  — Fetch a single case with full detail
// ─────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'Case ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch the case — only if it belongs to this user (or user is admin)
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = userProfile?.role === 'admin'

    let query = supabase
      .from('cases')
      .select(`
        id,
        case_code,
        requester_id,
        subject_name,
        subject_national_id,
        subject_phone,
        subject_email,
        report_type,
        institutions,
        purpose,
        status,
        payment_status,
        payment_ref,
        expires_at,
        created_at,
        updated_at,
        institution_responses (
          id,
          institution,
          status,
          responded_at,
          error_message
        )
      `)
      .eq('id', id)
      .single()

    // Non-admins can only see their own cases
    if (!isAdmin) {
      query = supabase
        .from('cases')
        .select(`
          id,
          case_code,
          requester_id,
          subject_name,
          subject_national_id,
          subject_phone,
          subject_email,
          report_type,
          institutions,
          purpose,
          status,
          payment_status,
          payment_ref,
          expires_at,
          created_at,
          updated_at,
          institution_responses (
            id,
            institution,
            status,
            responded_at,
            error_message
          )
        `)
        .eq('id', id)
        .eq('requester_id', user.id)
        .single()
    }

    const { data: caseData, error } = await query

    if (error || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    // Add expiry flag
    const now = new Date()
    const result = {
      ...caseData,
      is_expired: caseData.expires_at ? new Date(caseData.expires_at) < now : false,
      report_available: caseData.status === 'completed' && !( caseData.expires_at && new Date(caseData.expires_at) < now ),
    }

    return NextResponse.json({ case: result })
  } catch (err) {
    console.error('[GET /api/cases/[id]] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// PATCH /api/cases/[id]  — Update case status (admin only)
// ─────────────────────────────────────────────
export async function PATCH(request, { params }) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Only admins can update case status
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { status, payment_status, payment_ref } = body

    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'expired']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 })
    }

    const updates = {}
    if (status) updates.status = status
    if (payment_status) updates.payment_status = payment_status
    if (payment_ref) updates.payment_ref = payment_ref

    // When marking as completed, set expires_at to 24 hours from now
    if (status === 'completed') {
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)
      updates.expires_at = expiresAt.toISOString()
    }

    const { data: updatedCase, error } = await supabase
      .from('cases')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update case' }, { status: 500 })
    }

    // Log the admin action
    await supabase.from('audit_log').insert({
      actor_id: user.id,
      action: `case.status_updated.${status || 'unknown'}`,
      entity_type: 'case',
      entity_id: id,
      metadata: updates,
    })

    return NextResponse.json({ case: updatedCase })
  } catch (err) {
    console.error('[PATCH /api/cases/[id]] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}