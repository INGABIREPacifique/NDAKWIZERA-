import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { phone } = await request.json()
    console.log('Request received for phone:', phone)
    
    // Generate a simple mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Just return the OTP (skip Supabase for now)
    return NextResponse.json({ 
      success: true, 
      otp: otp,
      message: 'Mock OTP generated'
    })
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    })
  }
}