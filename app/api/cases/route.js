import { NextResponse } from 'next/server'
import { getSessionUser, createAdminClient } from '@/lib/supabase-server'

// ─────────────────────────────────────────────
// POST /api/cases  — Submit a new verification case
// ─────────────────────────────────────────────
export async function POST(request) {
  try {
    // 1. Authenticate
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse body
    const body = await request.json()
    const {
      subject_name,
      subject_national_id,
      subject_phone,
      subject_email,
      report_type = 'full',
      institutions = [],
      purpose,
    } = body

    // 3. Validate required fields
    if (!subject_name || subject_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'subject_name is required (min 2 characters)' },
        { status: 400 }
      )
    }

    if (!Array.isArray(institutions) || institutions.length === 0) {
      return NextResponse.json(
        { error: 'At least one institution must be selected' },
        { status: 400 }
      )
    }

    const validInstitutions = ['NLA', 'RRA', 'RNP', 'RDB', 'CREDIT']
    const invalidInst = institutions.filter(i => !validInstitutions.includes(i))
    if (invalidInst.length > 0) {
      return NextResponse.json(
        { error: `Invalid institutions: ${invalidInst.join(', ')}` },
        { status: 400 }
      )
    }

    const validReportTypes = ['full', 'land', 'tax', 'criminal', 'business', 'credit']
    if (!validReportTypes.includes(report_type)) {
      return NextResponse.json(
        { error: `Invalid report_type: ${report_type}` },
        { status: 400 }
      )
    }

    // 4. Insert case using admin client (service role)
    // We trust the user.id from the session — don't accept it from the body
    const supabase = createAdminClient()

    const { data: newCase, error: insertError } = await supabase
      .from('cases')
      .insert({
        requester_id: user.id,   // <-- always from session, never from body
        subject_name: subject_name.trim(),
        subject_national_id: subject_national_id?.trim() || null,
        subject_phone: subject_phone?.trim() || null,
        subject_email: subject_email?.trim() || null,
        report_type,
        institutions,
        purpose: purpose?.trim() || null,
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select()
      .single()

    if (insertError) {
      console.error('[POST /api/cases] insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create case', detail: insertError.message },
        { status: 500 }
      )
    }

    // 5. Log the action
    await supabase.from('audit_log').insert({
      actor_id: user.id,
      action: 'case.submitted',
      entity_type: 'case',
      entity_id: newCase.id,
      metadata: { report_type, institutions },
    })

    // 6. Create pending institution_response rows (one per institution)
    const institutionRows = institutions.map(inst => ({
      case_id: newCase.id,
      institution: inst,
      status: 'pending',
    }))
    await supabase.from('institution_responses').insert(institutionRows)

    return NextResponse.json(
      {
        message: 'Case submitted successfully',
        case: {
          id: newCase.id,
          case_code: newCase.case_code,
          status: newCase.status,
          report_type: newCase.report_type,
          institutions: newCase.institutions,
          created_at: newCase.created_at,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/cases] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// GET /api/cases  — List all cases for the logged-in user
// ─────────────────────────────────────────────
export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Optional query params: ?status=pending&limit=20&offset=0
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createAdminClient()

    let query = supabase
      .from('cases')
      .select(`
        id,
        case_code,
        subject_name,
        report_type,
        institutions,
        status,
        payment_status,
        expires_at,
        created_at,
        updated_at
      `)
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    const { data: cases, error, count } = await query

    if (error) {
      console.error('[GET /api/cases] query error:', error)
      return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 })
    }

    // Annotate each case with a human-readable is_expired flag
    const now = new Date()
    const annotated = (cases || []).map(c => ({
      ...c,
      is_expired: c.expires_at ? new Date(c.expires_at) < now : false,
    }))

    return NextResponse.json({
      cases: annotated,
      pagination: { limit, offset, total: count },
    })
  } catch (err) {
    console.error('[GET /api/cases] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}