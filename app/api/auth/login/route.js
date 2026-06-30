import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { phone } = await request.json()

    if (!phone?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required.' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, full_name, phone_number, national_id, role')
      .eq('phone_number', phone.trim())
      .maybeSingle()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'No account found with this phone number. Please sign up first.' },
        { status: 404 }
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
        metadata:       { userId: user.id, action: 'login' },
      })

    if (sessionErr) {
      console.error('[login] auth_sessions insert:', sessionErr)
      return NextResponse.json(
        { success: false, error: 'Failed to generate OTP. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, otp, message: 'OTP sent to ' + phone })

  } catch (err) {
    console.error('[login] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
