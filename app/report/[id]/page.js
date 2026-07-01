'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'

const INST_ICONS = {
  NLA:    { icon: '🏡', color: '#166534', bg: '#dcfce7' },
  RRA:    { icon: '📋', color: '#92400e', bg: '#fef3c7' },
  RNP:    { icon: '🛡️', color: '#1e40af', bg: '#dbeafe' },
  RDB:    { icon: '🏢', color: '#6b21a8', bg: '#f3e8ff' },
  CREDIT: { icon: '💳', color: '#9f1239', bg: '#ffe4e6' },
}

export default function ReportPage() {
  const router  = useRouter()
  const params  = useParams()
  const id      = params.id

  const [phase, setPhase]   = useState('otp')  // otp | loading | report | error
  const [otp, setOtp]       = useState('')
  const [mockOtp, setMockOtp] = useState(null)
  const [report, setReport] = useState(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy]     = useState(false)
  const [caseCode, setCaseCode] = useState('')
  const [user, setUser]     = useState(null)

  // Check auth + request OTP on mount
  const init = useCallback(async () => {
    const res  = await fetch('/api/auth/me')
    if (res.status === 401) { router.replace('/login'); return }
    const data = await res.json()
    if (!data.user) { router.replace('/login'); return }
    setUser(data.user)

    // Request report OTP
    setBusy(true)
    setMessage('Sending verification code…')
    try {
      const r    = await fetch(`/api/reports/${id}`, { method: 'POST', credentials: 'include' })
      const resp = await r.json()
      if (resp.success) {
        setMockOtp(resp.otp)
        setMessage('Enter the 6-digit code to access this report.')
      } else {
        setPhase('error')
        setMessage(resp.error || 'Failed to request OTP.')
      }
    } catch {
      setPhase('error')
      setMessage('Network error. Please try again.')
    }
    setBusy(false)
  }, [id, router])

  useEffect(() => { init() }, [init])

  const verifyAndLoad = async () => {
    if (otp.length !== 6) { setMessage('Enter the full 6-digit code.'); return }
    setBusy(true)
    setPhase('loading')
    try {
      const r    = await fetch(`/api/reports/${id}?otp=${otp}`, { credentials: 'include' })
      const data = await r.json()
      if (data.success) {
        setReport(data.report)
        setCaseCode(data.report.case_code)
        setPhase('report')
      } else {
        setPhase('otp')
        setMessage('❌ ' + (data.error || 'Invalid OTP.'))
      }
    } catch {
      setPhase('otp')
      setMessage('❌ Network error.')
    }
    setBusy(false)
  }

  // ─── Loading ─────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <Shell>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #dcd2bc', borderTopColor: '#a3742a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b6256', fontSize: '14px' }}>Loading your report…</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </Shell>
    )
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <Shell>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
          <h3 style={{ color: '#10203c', fontFamily: "'Fraunces', serif", marginBottom: '8px' }}>Report Unavailable</h3>
          <p style={{ color: '#6b6256', fontSize: '13px', marginBottom: '24px' }}>{message}</p>
          <button onClick={() => router.push('/dashboard')}
            style={{ padding: '10px 22px', background: '#a3742a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      </Shell>
    )
  }

  // ─── OTP gate ────────────────────────────────────────────────────────────
  if (phase === 'otp') {
    return (
      <Shell>
        <div style={{ maxWidth: '420px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#e3ede7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#2e6b4f" strokeWidth="2" style={{ width: '26px', height: '26px' }}>
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 118 0v3" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 600, color: '#10203c', margin: '0 0 6px' }}>
              Verify to View Report
            </h2>
            <p style={{ fontSize: '13px', color: '#6b6256', margin: 0 }}>
              {message || 'Enter the 6-digit code sent to your phone.'}
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
            onKeyDown={e => e.key === 'Enter' && verifyAndLoad()}
            style={{ width: '100%', padding: '14px', border: '1.5px solid #dcd2bc', borderRadius: '10px', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', fontFamily: "'JetBrains Mono', monospace", background: '#fffdf9', outline: 'none', boxSizing: 'border-box', marginBottom: '14px', color: '#10203c' }}
          />

          <button onClick={verifyAndLoad} disabled={busy || otp.length !== 6}
            style={{ width: '100%', padding: '13px', background: busy ? '#5a9e7d' : '#2e6b4f', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: busy ? 'not-allowed' : 'pointer' }}>
            {busy ? 'Verifying…' : 'View Report'}
          </button>

          <button onClick={() => router.push('/dashboard')}
            style={{ width: '100%', padding: '10px', background: 'transparent', color: '#6b6256', border: 'none', fontSize: '13px', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>
            ← Back to Dashboard
          </button>
        </div>
      </Shell>
    )
  }

  // ─── Report view ─────────────────────────────────────────────────────────
  if (phase === 'report' && report) {
    const expiresIn = report.expires_at
      ? (() => {
          const diff = new Date(report.expires_at) - Date.now()
          if (diff <= 0) return 'Expired'
          const h = Math.floor(diff / 3_600_000)
          const m = Math.floor((diff % 3_600_000) / 60_000)
          return h > 0 ? `${h}h ${m}m remaining` : `${m}m remaining`
        })()
      : null

    return (
      <Shell>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 700, color: '#a3742a' }}>
                {report.case_code}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: '#dcfce7', color: '#166534' }}>
                Verified
              </span>
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 600, color: '#10203c', margin: '0 0 4px' }}>
              Verification Report
            </h1>
            <p style={{ fontSize: '12px', color: '#9c9286', margin: 0 }}>
              Generated: {new Date(report.generated_at).toLocaleString('en-GB')}
              {expiresIn && ` · Expires in: ${expiresIn}`}
            </p>
          </div>
          <button onClick={() => router.push('/dashboard')}
            style={{ padding: '8px 14px', background: 'transparent', border: '1px solid #dcd2bc', borderRadius: '8px', fontSize: '12px', color: '#6b6256', cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>

        {/* Subject */}
        <Section title="Subject Information">
          <Grid>
            <Field label="Full Name" value={report.subject_name} />
            <Field label="National ID" value={report.subject_national_id || '—'} />
            <Field label="Phone" value={report.subject_phone || '—'} />
            <Field label="Email" value={report.subject_email || '—'} />
            <Field label="Report Type" value={report.report_type?.toUpperCase()} />
            <Field label="Purpose" value={report.purpose || '—'} />
          </Grid>
        </Section>

        {/* Institution findings */}
        <div style={{ marginBottom: '8px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 600, color: '#9c9286', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px', fontFamily: "'JetBrains Mono', monospace" }}>
            Institution Findings
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(report.findings || {}).map(([key, finding]) => (
              <FindingCard key={key} id={key} finding={finding} />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ marginTop: '28px', padding: '14px 16px', background: '#fef9ec', border: '1px solid #c8963c', borderRadius: '10px', fontSize: '12px', color: '#6b6256' }}>
          ⚠️ This report is valid for 24 hours from approval. All findings are sourced from official Rwandan government institutions. Ndakwizera is not liable for decisions made based on this report.
        </div>
      </Shell>
    )
  }

  return null
}

function Shell({ children }) {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', background: '#f8f3e8', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: '#10203c', borderBottom: '1px solid rgba(200,150,60,0.2)', padding: '0 20px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 700, color: '#f8f3e8', cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
            Ndak<span style={{ color: '#c8963c' }}>w</span>izera
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 20px' }}>
        {children}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #dcd2bc', borderRadius: '14px', padding: '20px', marginBottom: '14px' }}>
      <h2 style={{ fontSize: '11px', fontWeight: 600, color: '#9c9286', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace", margin: '0 0 16px' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function Grid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>{children}</div>
}

function Field({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: '10px', fontWeight: 600, color: '#9c9286', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px', fontFamily: "'JetBrains Mono', monospace" }}>{label}</p>
      <p style={{ fontSize: '13px', color: '#241f18', fontWeight: 500, margin: 0 }}>{value}</p>
    </div>
  )
}

function FindingCard({ id, finding }) {
  const cfg = INST_ICONS[id] || { icon: '📄', color: '#374151', bg: '#f3f4f6' }
  const isVerified = finding.status === 'verified'

  return (
    <div style={{ background: '#fff', border: '1px solid #dcd2bc', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f0ebe0' }}>
        <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
          {cfg.icon}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#10203c', margin: 0 }}>{finding.institution}</p>
        </div>
        <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: isVerified ? '#dcfce7' : '#fee2e2', color: isVerified ? '#166534' : '#991b1b' }}>
          {isVerified ? '✓ Verified' : '✗ Not Verified'}
        </span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        {Object.entries(finding.data || {}).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f8f4ee', fontSize: '13px', gap: '16px' }}>
            <span style={{ color: '#6b6256', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
            <span style={{ color: '#241f18', fontWeight: 500, textAlign: 'right' }}>{String(val)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
