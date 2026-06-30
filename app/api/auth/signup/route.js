import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { fullName, phone, nationalId } = await request.json()

    if (!fullName?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full name and phone number are required.' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', phone.trim())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this phone number already exists. Please log in.' },
        { status: 409 }
      )
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    await supabase
      .from('auth_sessions')
      .delete()
      .eq('phone_number', phone.trim())

    const { error: sessionErr } = await supabase
      .from('auth_sessions')
      .insert({
        phone_number:   phone.trim(),
        otp_code:       otp,
        otp_expires_at: expiresAt,
        status:         'pending',
        metadata: {
          fullName:   fullName.trim(),
          nationalId: nationalId?.trim() || null,
          action:     'signup',
        },
      })

    if (sessionErr) {
      console.error('[signup] auth_sessions insert:', sessionErr)
      return NextResponse.json(
        { success: false, error: 'Failed to generate OTP. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, otp, message: 'OTP sent to ' + phone })

  } catch (err) {
    console.error('[signup] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
