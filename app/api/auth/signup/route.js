import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { fullName, email, phone } = await request.json()
    
    if (!fullName || !email || !phone) {
      return NextResponse.json({ 
        success: false, 
        error: 'All fields are required' 
      })
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()
    
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User already exists with this phone number' 
      })
    }
    
    // Store OTP in auth_sessions
    const { data, error } = await supabase
      .from('auth_sessions')
      .insert({
        phone_number: phone,
        otp_code: otp,
        otp_expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        status: 'pending',
        metadata: { fullName, email } // Store signup data temporarily
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