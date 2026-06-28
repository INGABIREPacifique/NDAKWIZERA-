'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Form, 2: OTP Verification
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  })
  const [otp, setOtp] = useState('')
  const [mockOtp, setMockOtp] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const requestOTP = async () => {
    setLoading(true)
    setMessage('Sending OTP...')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (data.success) {
        setMockOtp(data.otp)
        setMessage('✅ OTP sent! Check the mock OTP below.')
        setStep(2)
      } else {
        setMessage('❌ Error: ' + data.error)
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message)
    }
    setLoading(false)
  }

  const verifyOTP = async () => {
    setLoading(true)
    setMessage('Verifying...')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: formData.phone, 
          otp: otp 
        })
      })
      const data = await res.json()
      
      if (data.success) {
        setMessage('✅ Account created successfully!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setMessage('❌ Invalid OTP')
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1f3c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#f5efe0',
        borderRadius: '20px',
        padding: '40px 36px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#0d1f3c'
          }}>
            Ndak<span style={{ color: '#a3742a' }}>w</span>izera
          </div>
          <p style={{
            fontSize: '13px',
            color: '#6b6256',
            marginTop: '4px'
          }}>
            Create your account
          </p>
        </div>

        {/* Step 1: Sign Up Form */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#4a3f34',
                marginBottom: '5px'
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jean Pierre Niyonzima"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #dcd2bc',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#fffdf9',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#4a3f34',
                marginBottom: '5px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #dcd2bc',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#fffdf9',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#4a3f34',
                marginBottom: '5px'
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+250788123456"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #dcd2bc',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#fffdf9',
                  outline: 'none'
                }}
              />
              <p style={{
                fontSize: '11px',
                color: '#9c9286',
                marginTop: '4px'
              }}>
                We'll send a verification code to this number
              </p>
            </div>

            <button
              onClick={requestOTP}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: '#a3742a',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#c8963c'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#a3742a'
              }}
            >
              {loading ? 'Sending...' : 'Create Account'}
            </button>

            <p style={{
              textAlign: 'center',
              fontSize: '13px',
              color: '#6b6256',
              marginTop: '16px'
            }}>
              Already have an account?{' '}
              <Link href="/login" style={{
                color: '#a3742a',
                fontWeight: 600,
                textDecoration: 'none'
              }}>
                Log In
              </Link>
            </p>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div>
            <div style={{
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#e3ede7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2e6b4f" strokeWidth="2" style={{ width: '28px', height: '28px' }}>
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 118 0v3" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#0d1f3c',
                marginBottom: '4px'
              }}>
                Verify Your Phone
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#6b6256'
              }}>
                Enter the 6-digit code sent to {formData.phone}
              </p>
            </div>

            {mockOtp && (
              <div style={{
                padding: '16px',
                background: '#f0f7ff',
                border: '2px solid #a3742a',
                borderRadius: '10px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontSize: '11px',
                  color: '#6b6256',
                  marginBottom: '4px'
                }}>
                  📱 Mock OTP (for testing)
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#0d1f3c',
                  letterSpacing: '8px'
                }}>
                  {mockOtp}
                </p>
              </div>
            )}

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid #dcd2bc',
                borderRadius: '8px',
                fontSize: '18px',
                textAlign: 'center',
                letterSpacing: '4px',
                background: '#fffdf9',
                outline: 'none',
                marginBottom: '16px'
              }}
            />

            <button
              onClick={verifyOTP}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: '#2e6b4f',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#3d8a66'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#2e6b4f'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <button
              onClick={() => {
                setStep(1)
                setMockOtp('')
                setOtp('')
                setMessage('')
              }}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                color: '#6b6256',
                border: 'none',
                fontSize: '13px',
                cursor: 'pointer',
                marginTop: '12px',
                textDecoration: 'underline'
              }}
            >
              ← Back to sign up
            </button>
          </div>
        )}

        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: message.includes('✅') ? '#e3ede7' : '#f1e3df',
            borderRadius: '8px',
            fontSize: '13px',
            color: message.includes('✅') ? '#2e6b4f' : '#9c3b2c',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}