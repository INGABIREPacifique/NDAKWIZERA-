import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { setSession } from '@/lib/session'

export async function POST(request) {
  try {
    const { phone, otp } = await request.json()

    if (!phone?.trim() || !otp?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Phone and OTP are required.' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: session, error: sessionErr } = await supabase
      .from('auth_sessions')
      .select('*')
      .eq('phone_number', phone.trim())
      .eq('otp_code', otp.trim())
      .eq('status', 'pending')
      .gt('otp_expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (sessionErr || !session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP. Please try again.' },
        { status: 401 }
      )
    }

    await supabase
      .from('auth_sessions')
      .update({ status: 'used' })
      .eq('id', session.id)

    const { action, userId, fullName, nationalId } = session.metadata || {}
    let user

    if (action === 'signup') {
      const { data: newUser, error: insertErr } = await supabase
        .from('users')
        .insert({
          full_name:    fullName,
          phone_number: phone.trim(),
          national_id:  nationalId || null,
          is_verified:  true,
        })
        .select('id, full_name, phone_number, national_id, role')
        .single()

      if (insertErr) {
        console.error('[verify-otp] user insert:', insertErr)
        return NextResponse.json(
          { success: false, error: 'Failed to create account. ' + insertErr.message },
          { status: 500 }
        )
      }
      user = newUser
    } else {
      const { data: existingUser, error: fetchErr } = await supabase
        .from('users')
        .select('id, full_name, phone_number, national_id, role')
        .eq('id', userId)
        .single()

      if (fetchErr || !existingUser) {
        return NextResponse.json(
          { success: false, error: 'Account not found.' },
          { status: 404 }
        )
      }

      await supabase
        .from('users')
        .update({ is_verified: true, updated_at: new Date().toISOString() })
        .eq('id', existingUser.id)

      user = existingUser
    }

    await setSession(user)

    return NextResponse.json({
      success: true,
      message: action === 'signup' ? 'Account created successfully!' : 'Login successful!',
      user: {
        id:          user.id,
        fullName:    user.full_name,
        phoneNumber: user.phone_number,
        nationalId:  user.national_id,
        role:        user.role,
      },
    })

  } catch (err) {
    console.error('[verify-otp] unexpected:', err)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
