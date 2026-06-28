import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, phone } = await request.json()
    
    if (!email || !phone) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and phone are required' 
      })
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('phone', phone)
      .single()
    
    if (userError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'No account found with these credentials' 
      })
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP in auth_sessions
    const { data, error } = await supabase
      .from('auth_sessions')
      .insert({
        phone_number: phone,
        otp_code: otp,
        otp_expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        status: 'pending',
        metadata: { email }
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent',
      otp: otp // Mock OTP for testing
    })
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message })
  }
}