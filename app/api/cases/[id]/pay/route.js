import { NextResponse } from 'next/server'
import { createAdminClient, getSessionUser } from '@/lib/supabase-server'

// POST /api/cases/[id]/pay
// Mock payment endpoint — flips payment_status to 'paid' for testing.
// Replace this with a real MoMo / card gateway call in Phase 3.
// Ownership-checked: only the requester can pay for their own case.
export async function POST(request, { params }) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const supabase = createAdminClient()

    // Fetch case and verify ownership
    const { data: caseRow, error: fetchErr } = await supabase
      .from('cases')
      .select('id, case_code, requester_id, status, payment_status')
      .eq('id', id)
      .single()

    if (fetchErr || !caseRow) {
      return NextResponse.json(
        { success: false, error: 'Case not found.' },
        { status: 404 }
      )
    }

    if (caseRow.requester_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to pay for this case.' },
        { status: 403 }
      )
    }

    // Only completed cases can be paid — no point paying for pending/processing/failed
    if (caseRow.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: `Cannot pay for a case with status: ${caseRow.status}.` },
        { status: 400 }
      )
    }

    // Idempotent — already paid is fine, just return success
    if (caseRow.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        already_paid: true,
        message: 'Case is already paid.',
        case: { id: caseRow.id, case_code: caseRow.case_code, payment_status: 'paid' },
      })
    }

    // Flip payment_status to 'paid'
    const { data: updated, error: updateErr } = await supabase
      .from('cases')
      .update({
        payment_status: 'paid',
        updated_at:     new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, case_code, status, payment_status')
      .single()

    if (updateErr) {
      console.error('[cases/:id/pay POST] update error:', updateErr)
      return NextResponse.json(
        { success: false, error: 'Payment processing failed. ' + updateErr.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment recorded. You can now access the report.',
      case:    updated,
    })

  } catch (err) {
    console.error('[cases/:id/pay POST] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
