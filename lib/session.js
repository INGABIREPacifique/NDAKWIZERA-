import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'ndak_session'
const SECRET = process.env.SESSION_SECRET || 'ndakwizera-dev-secret-change-in-prod'

function sign(payload) {
  const json = JSON.stringify(payload)
  const b64  = Buffer.from(json).toString('base64url')
  const mac  = createHmac('sha256', SECRET).update(b64).digest('base64url')
  return `${b64}.${mac}`
}

function verify(token) {
  if (!token) return null
  const [b64, mac] = token.split('.')
  if (!b64 || !mac) return null
  const expected = createHmac('sha256', SECRET).update(b64).digest('base64url')
  try {
    const a = Buffer.from(mac)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  try {
    return JSON.parse(Buffer.from(b64, 'base64url').toString())
  } catch {
    return null
  }
}

export async function setSession(user) {
  const payload = {
    id:          user.id,
    fullName:    user.full_name,
    phoneNumber: user.phone_number,
    nationalId:  user.national_id,
    role:        user.role || 'citizen',
    iat:         Date.now(),
  }
  const token = sign(payload)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   60 * 60 * 24 * 7,
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return verify(token)
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
