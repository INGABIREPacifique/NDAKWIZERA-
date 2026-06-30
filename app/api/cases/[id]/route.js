import { NextResponse } from 'next/server'
import { createAdminClient, getSessionUser } from '@/lib/supabase-server'

export async function GET(request, { params }) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to view this request.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const supabase = createAdminClient()

    const { data: caseRow, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !caseRow) {
      return NextResponse.json(
        { success: false, error: 'Request not found.' },
        { status: 404 }
      )
    }

    const isOwner = caseRow.requester_id === user.id
    const isStaff = user.role === 'admin' || user.role === 'legal_reviewer'

    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { success: false, error: 'You do not have access to this request.' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, case: caseRow })

  } catch (err) {
    console.error('[cases/:id GET] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
