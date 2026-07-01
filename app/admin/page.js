'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_COLORS = {
  pending:    { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  processing: { bg: '#dbeafe', color: '#1e40af', label: 'Processing' },
  completed:  { bg: '#dcfce7', color: '#166534', label: 'Completed' },
  failed:     { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
  expired:    { bg: '#f3f4f6', color: '#6b7280', label: 'Expired' },
}

const TABS = [
  { key: 'pending',    label: 'Pending Review' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed',  label: 'Completed' },
  { key: 'failed',     label: 'Rejected' },
  { key: 'all',        label: 'All Cases' },
]

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser]     = useState(null)
  const [cases, setCases]   = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [acting, setActing] = useState(null) // case id being acted on
  const [toast, setToast]   = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadUser = useCallback(async () => {
    const res = await fetch('/api/auth/me')
    if (res.status === 401) { router.replace('/login'); return }
    const data = await res.json()
    if (!data.user || (data.user.role !== 'admin' && data.user.role !== 'legal_reviewer')) {
      router.replace('/dashboard')
      return
    }
    setUser(data.user)
  }, [router])

  const loadCases = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/cases?status=${activeTab}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setCases(data.cases)
    } catch {
      showToast('Failed to load cases', 'error')
    }
    setLoading(false)
  }, [activeTab])

  useEffect(() => { loadUser() }, [loadUser])
  useEffect(() => { if (user) loadCases() }, [user, loadCases])

  const handleAction = async (caseId, action) => {
    setActing(caseId)
    try {
      const res = await fetch(`/api/admin/cases/${caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(`Case ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
        loadCases()
      } else {
        showToast(data.error || 'Action failed', 'error')
      }
    } catch {
      showToast('Network error', 'error')
    }
    setActing(null)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f3e8', fontFamily: "'Inter', sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
          padding: '12px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          background: toast.type === 'success' ? '#2e6b4f' : '#9c3b2c',
          color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.msg}
        </div>
      )}

      {/* Nav */}
      <div style={{ background: '#10203c', borderBottom: '1px solid rgba(200,150,60,0.2)', padding: '0 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 700, color: '#f8f3e8' }}>
              Ndak<span style={{ color: '#c8963c' }}>w</span>izera
            </div>
            <span style={{ fontSize: '11px', color: '#c8963c', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(200,150,60,0.12)', padding: '2px 8px', borderRadius: '4px' }}>
              {user?.role === 'admin' ? 'ADMIN' : 'LEGAL REVIEWER'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user && <span style={{ fontSize: '12px', color: '#8d97b6' }}>{user.fullName}</span>}
            <button onClick={handleLogout}
              style={{ padding: '7px 14px', background: 'transparent', color: '#8d97b6', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
              Log out
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: 600, color: '#10203c', margin: '0 0 4px' }}>
            Case Management
          </h1>
          <p style={{ fontSize: '13px', color: '#6b6256', margin: 0 }}>
            Review, approve, and manage verification requests
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #dcd2bc', paddingBottom: '0' }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 16px', fontSize: '13px', fontWeight: activeTab === tab.key ? 600 : 400,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: activeTab === tab.key ? '#a3742a' : '#6b6256',
                borderBottom: activeTab === tab.key ? '2px solid #a3742a' : '2px solid transparent',
                marginBottom: '-1px', transition: 'all 0.15s',
              }}>
              {tab.label}
            </button>
          ))}
          <button onClick={loadCases} style={{ marginLeft: 'auto', padding: '6px 12px', background: 'transparent', border: '1px solid #dcd2bc', borderRadius: '6px', fontSize: '12px', color: '#6b6256', cursor: 'pointer', marginBottom: '4px' }}>
            ↻ Refresh
          </button>
        </div>

        {/* Cases */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9c9286' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #dcd2bc', borderTopColor: '#a3742a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            Loading cases…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
          </div>
        ) : cases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9c9286', fontSize: '14px' }}>
            No {activeTab === 'all' ? '' : activeTab} cases found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cases.map(c => <AdminCaseCard key={c.id} case_={c} acting={acting} onAction={handleAction} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminCaseCard({ case_: c, acting, onAction }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_COLORS[c.status] || STATUS_COLORS.pending
  const isPending = c.status === 'pending'
  const isActing  = acting === c.id

  return (
    <div style={{
      background: '#fff', border: '1px solid #dcd2bc', borderRadius: '14px',
      overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      borderLeft: isPending ? '3px solid #c8963c' : '1px solid #dcd2bc',
    }}>
      {/* Main row */}
      <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 700, color: '#10203c' }}>
              {c.case_code}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: cfg.bg, color: cfg.color }}>
              {cfg.label}
            </span>
            <span style={{ fontSize: '11px', color: '#9c9286', fontFamily: "'JetBrains Mono', monospace" }}>
              {c.report_type?.toUpperCase()} · {c.institutions?.join(', ')}
            </span>
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#10203c', margin: '0 0 4px' }}>
            Subject: {c.subject_name}
          </p>
          <p style={{ fontSize: '12px', color: '#6b6256', margin: 0 }}>
            Requested by: <b>{c.requester?.full_name || 'Unknown'}</b> ({c.requester?.phone_number || '—'})
            &nbsp;·&nbsp;{new Date(c.created_at).toLocaleString('en-GB')}
          </p>
        </div>
        <span style={{ fontSize: '12px', color: '#9c9286', flexShrink: 0 }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 20px 18px', borderTop: '1px solid #f0ebe0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '16px 0', fontSize: '13px' }}>
            <Detail label="National ID" value={c.subject_national_id || '—'} />
            <Detail label="Subject Phone" value={c.subject_phone || '—'} />
            <Detail label="Subject Email" value={c.subject_email || '—'} />
            <Detail label="Payment" value={c.payment_status || '—'} />
            {c.purpose && <div style={{ gridColumn: '1/-1' }}><Detail label="Purpose" value={c.purpose} /></div>}
            {c.expires_at && <Detail label="Expires At" value={new Date(c.expires_at).toLocaleString('en-GB')} />}
          </div>

          {isPending && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={e => { e.stopPropagation(); onAction(c.id, 'approve') }}
                disabled={isActing}
                style={{ flex: 1, padding: '10px', background: isActing ? '#5a9e7d' : '#2e6b4f', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: isActing ? 'not-allowed' : 'pointer' }}>
                {isActing ? 'Processing…' : '✓ Approve'}
              </button>
              <button
                onClick={e => { e.stopPropagation(); onAction(c.id, 'reject') }}
                disabled={isActing}
                style={{ flex: 1, padding: '10px', background: isActing ? '#d88' : '#9c3b2c', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: isActing ? 'not-allowed' : 'pointer' }}>
                {isActing ? 'Processing…' : '✗ Reject'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: '10px', fontWeight: 600, color: '#9c9286', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px', fontFamily: "'JetBrains Mono', monospace" }}>
        {label}
      </p>
      <p style={{ fontSize: '13px', color: '#241f18', margin: 0, fontWeight: 500 }}>{value}</p>
    </div>
  )
}
