import { NextResponse } from 'next/server'
import { createAdminClient, getSessionUser } from '@/lib/supabase-server'

// GET /api/reports/[id] — fetch report after OTP verified (query param: otp)
export async function GET(request, { params }) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'You must be logged in.' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const otp = searchParams.get('otp')

    const supabase = createAdminClient()

    // Fetch the case
    const { data: caseRow, error: caseErr } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single()

    if (caseErr || !caseRow) {
      return NextResponse.json({ success: false, error: 'Case not found.' }, { status: 404 })
    }

    // Ownership check
    const isOwner = caseRow.requester_id === user.id
    const isStaff = user.role === 'admin' || user.role === 'legal_reviewer'
    if (!isOwner && !isStaff) {
      return NextResponse.json({ success: false, error: 'Access denied.' }, { status: 403 })
    }

    // Status check — only completed cases have reports
    if (caseRow.status !== 'completed') {
      return NextResponse.json({
        success: false,
        error: `Report not available. Case status: ${caseRow.status}.`,
        status: caseRow.status,
      }, { status: 403 })
    }

    // Expiry check
    if (caseRow.expires_at && new Date(caseRow.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Report has expired. Please submit a new request.', expired: true }, { status: 403 })
    }

    // OTP verification (skip for staff)
    if (!isStaff) {
      if (!otp) {
        return NextResponse.json({ success: false, error: 'OTP required to view this report.', requiresOtp: true }, { status: 403 })
      }

      const { data: session } = await supabase
        .from('auth_sessions')
        .select('id')
        .eq('phone_number', user.phoneNumber)
        .eq('otp_code', otp)
        .eq('status', 'pending')
        .eq('metadata->>action', 'report_view')
        .eq('metadata->>caseId', id)
        .gt('otp_expires_at', new Date().toISOString())
        .maybeSingle()

      if (!session) {
        return NextResponse.json({ success: false, error: 'Invalid or expired OTP.' }, { status: 401 })
      }

      // Mark OTP used
      await supabase.from('auth_sessions').update({ status: 'used' }).eq('id', session.id)
    }

    // Return report (in production this would include institution responses)
    return NextResponse.json({
      success: true,
      report: {
        case_code:          caseRow.case_code,
        subject_name:       caseRow.subject_name,
        subject_national_id: caseRow.subject_national_id,
        subject_phone:      caseRow.subject_phone,
        subject_email:      caseRow.subject_email,
        report_type:        caseRow.report_type,
        institutions:       caseRow.institutions,
        purpose:            caseRow.purpose,
        status:             caseRow.status,
        expires_at:         caseRow.expires_at,
        generated_at:       caseRow.updated_at,
        // Mock institution findings (replaced by real webhooks in Phase 3)
        findings: generateMockFindings(caseRow),
      },
    })

  } catch (err) {
    console.error('[reports/:id GET] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}

// POST /api/reports/[id] — request OTP to view report
export async function POST(request, { params }) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'You must be logged in.' }, { status: 401 })
    }

    const { id } = await params
    const supabase = createAdminClient()

    // Fetch and validate case
    const { data: caseRow } = await supabase
      .from('cases')
      .select('id, requester_id, status, expires_at')
      .eq('id', id)
      .single()

    if (!caseRow || caseRow.requester_id !== user.id) {
      return NextResponse.json({ success: false, error: 'Case not found.' }, { status: 404 })
    }
    if (caseRow.status !== 'completed') {
      return NextResponse.json({ success: false, error: 'Report not ready yet.' }, { status: 403 })
    }
    if (caseRow.expires_at && new Date(caseRow.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Report has expired.' }, { status: 403 })
    }

    const otp       = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

    await supabase.from('auth_sessions').delete().eq('phone_number', user.phoneNumber)
    await supabase.from('auth_sessions').insert({
      phone_number:   user.phoneNumber,
      otp_code:       otp,
      otp_expires_at: expiresAt,
      status:         'pending',
      metadata:       { action: 'report_view', caseId: id },
    })

    return NextResponse.json({ success: true, otp, message: `OTP sent to ${user.phoneNumber}` })

  } catch (err) {
    console.error('[reports/:id POST] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}

function generateMockFindings(c) {
  const findings = {}
  const insts = c.institutions || []

  if (insts.includes('NLA')) {
    findings.NLA = {
      institution: 'National Land Authority',
      status: 'verified',
      data: {
        parcels_found: 1,
        parcels: [{ parcel_id: 'RW/KIG/001/2019', location: 'Kigali, Gasabo', area_sqm: 450, registered_owner: c.subject_name, encumbrances: 'None' }]
      }
    }
  }
  if (insts.includes('RRA')) {
    findings.RRA = {
      institution: 'Rwanda Revenue Authority',
      status: 'verified',
      data: { tax_compliance: 'Compliant', outstanding_obligations: 'None', last_filing: '2025-12' }
    }
  }
  if (insts.includes('RNP')) {
    findings.RNP = {
      institution: 'Rwanda National Police',
      status: 'verified',
      data: { criminal_record: 'None found', wanted_status: 'Not wanted' }
    }
  }
  if (insts.includes('RDB')) {
    findings.RDB = {
      institution: 'Rwanda Development Board',
      status: 'verified',
      data: { businesses_registered: 0, directorships: 'None on record' }
    }
  }
  if (insts.includes('CREDIT')) {
    findings.CREDIT = {
      institution: 'Credit Bureau',
      status: 'verified',
      data: { credit_score: 'B+', active_loans: 0, loan_history: 'No defaults on record' }
    }
  }

  return findings
}
