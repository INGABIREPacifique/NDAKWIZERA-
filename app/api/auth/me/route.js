import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/supabase-server'

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      id:          user.id,
      fullName:    user.fullName,
      phoneNumber: user.phoneNumber,
      nationalId:  user.nationalId,
      role:        user.role,
    },
  })
}
