import { NextResponse } from 'next/server'
import { createAdminClient, getSessionUser } from '@/lib/supabase-server'

const VALID_REPORT_TYPES = ['full', 'land', 'tax', 'criminal', 'business', 'credit']

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to submit a request.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      subject_name,
      subject_national_id,
      subject_phone,
      subject_email,
      report_type,
      institutions,
      purpose,
    } = body

    if (!subject_name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Subject name is required.' },
        { status: 400 }
      )
    }

    const finalReportType = VALID_REPORT_TYPES.includes(report_type) ? report_type : 'full'

    const supabase = createAdminClient()

    const { data: newCase, error } = await supabase
      .from('cases')
      .insert({
        requester_id:        user.id,
        subject_name:        subject_name.trim(),
        subject_national_id: subject_national_id?.trim() || null,
        subject_phone:       subject_phone?.trim() || null,
        subject_email:       subject_email?.trim() || null,
        report_type:         finalReportType,
        institutions:        Array.isArray(institutions) ? institutions : [],
        purpose:             purpose?.trim() || null,
      })
      .select('id, case_code, subject_name, report_type, status, created_at')
      .single()

    if (error) {
      console.error('[cases POST] insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to submit request. ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, case: newCase }, { status: 201 })

  } catch (err) {
    console.error('[cases POST] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to view requests.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const supabase = createAdminClient()

    let query = supabase
      .from('cases')
      .select('id, case_code, subject_name, report_type, status, payment_status, expires_at, created_at')
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) query = query.eq('status', status)

    const { data: cases, error } = await query

    if (error) {
      console.error('[cases GET] fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to load requests.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, cases })

  } catch (err) {
    console.error('[cases GET] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
