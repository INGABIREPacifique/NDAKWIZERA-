'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCases } from '@/lib/use-cases'

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  completed:  { label: 'Completed',  color: 'bg-green-100 text-green-800' },
  failed:     { label: 'Failed',     color: 'bg-red-100 text-red-800' },
  expired:    { label: 'Expired',    color: 'bg-gray-100 text-gray-500' },
}

export default function DashboardPage() {
  const router = useRouter()
  const { cases, loading, error, fetch: loadCases } = useCases()

  useEffect(() => { loadCases() }, [])

  const activeCases   = cases.filter(c => !c.is_expired && c.status !== 'expired')
  const expiredCases  = cases.filter(c => c.is_expired || c.status === 'expired')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">My Cases</h1>
            <p className="text-sm text-gray-400">Verification requests and reports</p>
          </div>
          <button
            onClick={() => router.push('/request')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            + New Request
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            <span className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2" />
            Loading your cases…
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error} — <button onClick={loadCases} className="underline">Retry</button>
          </div>
        )}

        {!loading && !error && cases.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📋
            </div>
            <h3 className="text-gray-700 font-medium mb-1">No cases yet</h3>
            <p className="text-gray-400 text-sm mb-4">Submit your first verification request to get started.</p>
            <button
              onClick={() => router.push('/request')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              Submit a Request
            </button>
          </div>
        )}

        {/* Active cases */}
        {activeCases.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Active Cases ({activeCases.length})
            </h2>
            <div className="space-y-3">
              {activeCases.map(c => <CaseCard key={c.id} case_={c} router={router} />)}
            </div>
          </section>
        )}

        {/* Expired cases */}
        {expiredCases.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Expired ({expiredCases.length})
            </h2>
            <div className="space-y-3 opacity-60">
              {expiredCases.map(c => <CaseCard key={c.id} case_={c} router={router} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function CaseCard({ case_: c, router }) {
  const cfg = STATUS_CONFIG[c.is_expired ? 'expired' : c.status] || STATUS_CONFIG.pending
  const isViewable = c.status === 'completed' && !c.is_expired

  const expiresIn = () => {
    if (!c.expires_at) return null
    const diff = new Date(c.expires_at) - new Date()
    if (diff <= 0) return 'Expired'
    const hours = Math.floor(diff / 3_600_000)
    const mins  = Math.floor((diff % 3_600_000) / 60_000)
    return hours > 0 ? `${hours}h ${mins}m remaining` : `${mins}m remaining`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-sm font-semibold text-gray-700">{c.case_code}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <p className="text-sm text-gray-800 font-medium truncate">{c.subject_name}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span>{c.report_type === 'full' ? 'Full Report' : c.report_type}</span>
          <span>·</span>
          <span>{c.institutions?.join(', ')}</span>
          <span>·</span>
          <span>{new Date(c.created_at).toLocaleDateString()}</span>
        </div>
        {c.expires_at && (
          <p className={`text-xs mt-1 ${c.is_expired ? 'text-red-400' : 'text-amber-500'}`}>
            {expiresIn()}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 flex-shrink-0">
        {isViewable && (
          <button
            onClick={() => router.push(`/report/${c.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            View Report
          </button>
        )}
        {c.is_expired && (
          <button
            onClick={() => router.push('/request')}
            className="border border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Re-request
          </button>
        )}
        {c.status === 'pending' && (
          <span className="text-xs text-gray-400 text-right">Processing…</span>
        )}
      </div>
    </div>
  )
}