'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCases } from '@/lib/use-cases'

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#92400e', bg: '#fef3c7' },
  processing: { label: 'Processing', color: '#1e40af', bg: '#dbeafe' },
  completed:  { label: 'Completed',  color: '#166534', bg: '#dcfce7' },
  failed:     { label: 'Failed',     color: '#991b1b', bg: '#fee2e2' },
  expired:    { label: 'Expired',    color: '#6b7280', bg: '#f3f4f6' },
}

export default function DashboardPage() {
  const router = useRouter()
  const { cases, loading, error, fetch: loadCases } = useCases()
  const [user, setUser]             = useState(null)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => {
      if (r.status === 401) { router.replace('/login'); return null }
      return r.json()
    }).then(data => {
      if (data?.user) setUser(data.user)
    })
    loadCases()
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
  }

  const isStaff      = user?.role === 'admin' || user?.role === 'legal_reviewer'
  const activeCases  = cases.filter(c => !c.is_expired && c.status !== 'expired')
  const expiredCases = cases.filter(c => c.is_expired  || c.status === 'expired')

  return (
    <div style={{ minHeight: '100vh', background: '#f8f3e8', fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <div style={{ background: '#10203c', borderBottom: '1px solid rgba(200,150,60,0.2)', padding: '0 20px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 700, color: '#f8f3e8' }}>
              Ndak<span style={{ color: '#c8963c' }}>w</span>izera
            </div>
            {user && (
              <span style={{ fontSize: '12px', color: '#8d97b6', fontFamily: "'JetBrains Mono', monospace" }}>
                / {user.fullName}
              </span>
            )}
            {isStaff && (
              <span style={{ fontSize: '11px', color: '#c8963c', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(200,150,60,0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                {user.role === 'admin' ? 'ADMIN' : 'REVIEWER'}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isStaff && (
              <button onClick={() => router.push('/admin')}
                style={{ padding: '8px 14px', background: 'rgba(200,150,60,0.15)', color: '#c8963c', border: '1px solid rgba(200,150,60,0.3)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                Admin Panel →
              </button>
            )}
            <button onClick={() => router.push('/request')}
              style={{ padding: '8px 16px', background: '#a3742a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              + New Request
            </button>
            <button onClick={handleLogout} disabled={loggingOut}
              style={{ padding: '8px 14px', background: 'transparent', color: '#8d97b6', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
              {loggingOut ? '…' : 'Log out'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px' }}>

        {user && (
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: 600, color: '#10203c', margin: '0 0 4px' }}>
              Welcome back, {user.fullName?.split(' ')[0]}
            </h1>
            <p style={{ fontSize: '13px', color: '#6b6256', margin: 0 }}>
              Your verification requests and report access windows
            </p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9c9286' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #dcd2bc', borderTopColor: '#a3742a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            Loading your cases…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && (
          <div style={{ background: '#f1e3df', border: '1px solid #e2bab3', borderRadius: '12px', padding: '16px', color: '#9c3b2c', fontSize: '13px', marginBottom: '20px' }}>
            {error} —{' '}
            <button onClick={loadCases} style={{ color: '#9c3b2c', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
          </div>
        )}

        {!loading && !error && cases.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", color: '#10203c', marginBottom: '6px' }}>No cases yet</h3>
            <p style={{ color: '#9c9286', fontSize: '14px', marginBottom: '24px' }}>Submit your first verification request to get started.</p>
            <button onClick={() => router.push('/request')}
              style={{ padding: '12px 24px', background: '#a3742a', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Submit a Request
            </button>
          </div>
        )}

        {activeCases.length > 0 && (
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 600, color: '#9c9286', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
              Active Cases ({activeCases.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeCases.map(c => <CaseCard key={c.id} case_={c} router={router} onRefresh={loadCases} />)}
            </div>
          </section>
        )}

        {expiredCases.length > 0 && (
          <section style={{ opacity: 0.65 }}>
            <h2 style={{ fontSize: '11px', fontWeight: 600, color: '#9c9286', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
              Expired ({expiredCases.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {expiredCases.map(c => <CaseCard key={c.id} case_={c} router={router} onRefresh={loadCases} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function CaseCard({ case_: c, router, onRefresh }) {
  const [paying,   setPaying]   = useState(false)
  const [payError, setPayError] = useState(null)

  const key         = c.is_expired ? 'expired' : (c.status || 'pending')
  const cfg         = STATUS_CONFIG[key] || STATUS_CONFIG.pending
  const isCompleted = c.status === 'completed' && !c.is_expired
  const isPaid      = c.payment_status === 'paid'
  const isViewable  = isCompleted && isPaid

  const expiresIn = () => {
    if (!c.expires_at) return null
    const diff = new Date(c.expires_at) - Date.now()
    if (diff <= 0) return 'Expired'
    const h = Math.floor(diff / 3_600_000)
    const m = Math.floor((diff % 3_600_000) / 60_000)
    return h > 0 ? `${h}h ${m}m remaining` : `${m}m remaining`
  }

  const handlePay = async () => {
    setPaying(true)
    setPayError(null)
    try {
      const res  = await fetch(`/api/cases/${c.id}/pay`, {
        method:      'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        // Redirect straight to report — payment recorded, gate will now pass
        router.push(`/report/${c.id}`)
      } else {
        setPayError(data.error || 'Payment failed. Please try again.')
        setPaying(false)
      }
    } catch {
      setPayError('Network error. Please try again.')
      setPaying(false)
    }
  }

  // Left border: green = viewable, gold = completed but unpaid, default otherwise
  const borderLeft = isViewable
    ? '3px solid #2e6b4f'
    : isCompleted
      ? '3px solid #c8963c'
      : '1px solid #dcd2bc'

  return (
    <div style={{
      background: '#fff', border: '1px solid #dcd2bc', borderRadius: '14px',
      padding: '18px 20px', display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', gap: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      borderLeft,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 600, color: '#10203c' }}>
            {c.case_code}
          </span>
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: cfg.bg, color: cfg.color }}>
            {cfg.label}
          </span>
          {/* Payment status badge — only shown on completed cases */}
          {isCompleted && (
            <span style={{
              fontSize: '10px', fontWeight: 600, padding: '2px 8px',
              borderRadius: '999px',
              background: isPaid ? '#dcfce7' : '#fef3c7',
              color:      isPaid ? '#166534' : '#92400e',
            }}>
              {isPaid ? '✓ Paid' : 'Payment due'}
            </span>
          )}
        </div>

        <p style={{ fontSize: '14px', color: '#241f18', fontWeight: 500, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {c.subject_name}
        </p>
        <p style={{ fontSize: '11.5px', color: '#9c9286', margin: 0 }}>
          {c.report_type === 'full' ? 'Full Report' : c.report_type}
          {' · '}{c.institutions?.join(', ')}
          {' · '}{new Date(c.created_at).toLocaleDateString('en-GB')}
        </p>
        {c.expires_at && (
          <p style={{ fontSize: '11.5px', marginTop: '4px', color: c.is_expired ? '#9c3b2c' : '#a3742a', fontFamily: "'JetBrains Mono', monospace" }}>
            {expiresIn()}
          </p>
        )}
        {payError && (
          <p style={{ fontSize: '11.5px', color: '#9c3b2c', marginTop: '6px' }}>{payError}</p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0, alignItems: 'flex-end' }}>

        {/* completed + paid → View Report */}
        {isViewable && (
          <button onClick={() => router.push(`/report/${c.id}`)}
            style={{ padding: '9px 16px', background: '#2e6b4f', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            📄 View Report
          </button>
        )}

        {/* completed + unpaid → Pay & Access Report */}
        {isCompleted && !isPaid && (
          <button onClick={handlePay} disabled={paying}
            style={{ padding: '9px 16px', background: paying ? '#c9a96e' : '#a3742a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: paying ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
            {paying ? 'Processing…' : '💳 Pay & Access Report'}
          </button>
        )}

        {/* expired → Re-request */}
        {c.is_expired && (
          <button onClick={() => router.push('/request')}
            style={{ padding: '8px 14px', background: 'transparent', color: '#6b6256', border: '1px solid #dcd2bc', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Re-request
          </button>
        )}

        {/* pending / processing → in review */}
        {(c.status === 'pending' || c.status === 'processing') && !c.is_expired && (
          <span style={{ fontSize: '11px', color: '#9c9286' }}>In review…</span>
        )}

        {/* failed → Resubmit */}
        {c.status === 'failed' && (
          <button onClick={() => router.push('/request')}
            style={{ padding: '8px 14px', background: 'transparent', color: '#9c3b2c', border: '1px solid #e2bab3', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Resubmit
          </button>
        )}
      </div>
    </div>
  )
}
