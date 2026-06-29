'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [step, setStep]       = useState(1)
  const [formData, setFormData] = useState({ email: '', phone: '' })
  const [otp, setOtp]         = useState('')
  const [mockOtp, setMockOtp] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const requestOTP = async () => {
    if (!formData.email.trim() || !formData.phone.trim()) {
      setMessage('❌ Email and phone number are both required.')
      return
    }
    setLoading(true)
    setMessage('Sending verification code…')
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setMockOtp(data.otp)
        setMessage('✅ OTP sent! Enter the code below.')
        setStep(2)
      } else {
        setMessage('❌ ' + data.error)
      }
    } catch {
      setMessage('❌ Network error. Please try again.')
    }
    setLoading(false)
  }

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setMessage('❌ Please enter the full 6-digit code.')
      return
    }
    setLoading(true)
    setMessage('Verifying…')
    try {
      const res  = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage('✅ Login successful! Redirecting…')
        setTimeout(() => router.push('/dashboard'), 1200)
      } else {
        setMessage('❌ ' + data.error)
      }
    } catch {
      setMessage('❌ Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1f3c',
      backgroundImage: 'radial-gradient(circle at 15% 0%, rgba(200,150,60,0.12), transparent 45%), radial-gradient(circle at 90% 30%, rgba(200,150,60,0.06), transparent 40%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#f8f3e8',
        borderRadius: '20px',
        padding: '40px 36px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #c8963c, transparent 70%)' }} />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '30px', fontWeight: 700, color: '#10203c' }}>
            Ndak<span style={{ color: '#a3742a' }}>w</span>izera
          </div>
          <p style={{ fontSize: '11px', color: '#8d97b6', marginTop: '4px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
            Secure Access Portal
          </p>
        </div>

        {step === 1 && (
          <>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '22px' }}>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel" name="phone"
                value={formData.phone} onChange={handleChange}
                placeholder="+250788123456"
                style={inputStyle}
              />
              <p style={{ fontSize: '11px', color: '#9c9286', marginTop: '4px' }}>
                A 6-digit verification code will be sent to this number
              </p>
            </div>
            <button onClick={requestOTP} disabled={loading} style={btnGold(loading)}>
              {loading ? 'Sending…' : 'Send Verification Code'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b6256', marginTop: '18px' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: '#a3742a', fontWeight: 600, textDecoration: 'none' }}>
                Create Account
              </Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e3ede7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2e6b4f" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 118 0v3" />
                </svg>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#10203c', margin: '0 0 4px' }}>Verify Your Identity</h3>
              <p style={{ fontSize: '13px', color: '#6b6256', margin: 0 }}>
                6-digit code sent to <b>{formData.phone}</b>
              </p>
            </div>

            {mockOtp && (
              <div style={{ padding: '14px', background: '#fef9ec', border: '1.5px solid #c8963c', borderRadius: '10px', textAlign: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '10px', color: '#9c9286', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'JetBrains Mono', monospace" }}>
                  📱 Test OTP
                </p>
                <p style={{ fontSize: '30px', fontWeight: 700, color: '#10203c', letterSpacing: '8px', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                  {mockOtp}
                </p>
              </div>
            )}

            <input
              type="text" value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000" maxLength={6}
              style={{ ...inputStyle, fontSize: '22px', textAlign: 'center', letterSpacing: '6px', fontFamily: "'JetBrains Mono', monospace", marginBottom: '16px' }}
            />
            <button onClick={verifyOTP} disabled={loading} style={btnGreen(loading)}>
              {loading ? 'Verifying…' : 'Verify & Log In'}
            </button>
            <button onClick={() => { setStep(1); setOtp(''); setMockOtp(''); setMessage('') }}
              style={{ width: '100%', padding: '10px', background: 'transparent', color: '#6b6256', border: 'none', fontSize: '13px', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>
              ← Back
            </button>
          </>
        )}

        {message && (
          <div style={{
            marginTop: '16px', padding: '12px', borderRadius: '8px', fontSize: '13px', textAlign: 'center',
            background: message.includes('✅') ? '#e3ede7' : '#f1e3df',
            color: message.includes('✅') ? '#2e6b4f' : '#9c3b2c',
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '11.5px', fontWeight: 600,
  color: '#4a3f34', marginBottom: '5px', letterSpacing: '0.01em',
}
const inputStyle = {
  width: '100%', padding: '11px 13px',
  border: '1px solid #dcd2bc', borderRadius: '8px',
  fontSize: '14px', background: '#fffdf9', outline: 'none',
  fontFamily: "'Inter', sans-serif", color: '#241f18', boxSizing: 'border-box',
}
const btnGold = (loading) => ({
  width: '100%', padding: '13px', background: loading ? '#c9a96e' : '#a3742a',
  color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px',
  fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.01em',
})
const btnGreen = (loading) => ({
  width: '100%', padding: '13px', background: loading ? '#5a9e7d' : '#2e6b4f',
  color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px',
  fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.01em',
})