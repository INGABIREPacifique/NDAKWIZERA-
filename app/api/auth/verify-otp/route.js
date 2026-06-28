import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { phone, otp } = await request.json()
    console.log('Verifying OTP for phone:', phone, 'OTP:', otp)
    
    // Simple verification (just check if OTP is 6 digits)
    if (otp && otp.length === 6) {
      return NextResponse.json({ 
        success: true, 
        message: 'OTP verified successfully (mock)'
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid OTP' 
      })
    }
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    })
  }
}