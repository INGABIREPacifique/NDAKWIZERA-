'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCaseSubmit } from '@/lib/use-cases'

// ─── Step definitions ───────────────────────────────────────────────────────
const INSTITUTIONS = [
  { id: 'NLA',    label: 'National Land Authority',     description: 'Land & property ownership records' },
  { id: 'RRA',    label: 'Rwanda Revenue Authority',    description: 'Tax compliance & liabilities' },
  { id: 'RNP',    label: 'Rwanda National Police',      description: 'Criminal background check' },
  { id: 'RDB',    label: 'Rwanda Development Board',    description: 'Business registration records' },
  { id: 'CREDIT', label: 'Credit Bureau',               description: 'Loan & credit history' },
]

const REPORT_TYPES = [
  { id: 'full',     label: 'Full Report',     description: 'All institutions — most comprehensive' },
  { id: 'land',     label: 'Land Only',       description: 'NLA land & property records' },
  { id: 'tax',      label: 'Tax Only',        description: 'RRA tax compliance' },
  { id: 'criminal', label: 'Criminal Only',   description: 'RNP criminal background' },
  { id: 'business', label: 'Business Only',   description: 'RDB company records' },
  { id: 'credit',   label: 'Credit Only',     description: 'Credit bureau check' },
]

// ─── Main component ─────────────────────────────────────────────────────────
export default function RequestPage() {
  const router = useRouter()
  const { submit, loading, error } = useCaseSubmit()

  const [step, setStep] = useState(1)  // 1 = subject info, 2 = institutions, 3 = review
  const [form, setForm] = useState({
    subject_name: '',
    subject_national_id: '',
    subject_phone: '',
    subject_email: '',
    report_type: 'full',
    institutions: ['NLA', 'RRA', 'RNP', 'RDB', 'CREDIT'],
    purpose: '',
  })
  const [submitted, setSubmitted] = useState(null)

  // ── Handlers ──────────────────────────────────────────────────────────────
  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const toggleInstitution = (id) => {
    setForm(prev => ({
      ...prev,
      institutions: prev.institutions.includes(id)
        ? prev.institutions.filter(i => i !== id)
        : [...prev.institutions, id],
    }))
  }

  const handleReportTypeChange = (type) => {
    // Auto-select relevant institutions based on report type
    const typeToInstitutions = {
      full:     ['NLA', 'RRA', 'RNP', 'RDB', 'CREDIT'],
      land:     ['NLA'],
      tax:      ['RRA'],
      criminal: ['RNP'],
      business: ['RDB'],
      credit:   ['CREDIT'],
    }
    setForm(prev => ({
      ...prev,
      report_type: type,
      institutions: typeToInstitutions[type] || prev.institutions,
    }))
  }

  const handleSubmit = async () => {
    const result = await submit(form)
    if (result) {
      setSubmitted(result.case)
    }
  }

  const canProceedStep1 = form.subject_name.trim().length >= 2
  const canProceedStep2 = form.institutions.length > 0

  // ── Confirmation screen ───────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Case Submitted</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your verification request has been received and is now being processed.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Case Code</p>
            <p className="text-lg font-mono font-semibold text-gray-900">{submitted.case_code}</p>
            <p className="text-xs text-gray-400 mt-3 uppercase tracking-wide mb-1">Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pending Review
            </span>
            <p className="text-xs text-gray-400 mt-3">
              You will receive an OTP to view the report once it's ready (within 24 hours).
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            View My Cases
          </button>
        </div>
      </div>
    )
  }

  // ── Step progress bar ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {['Subject Info', 'Institutions', 'Review & Submit'].map((label, i) => {
            const n = i + 1
            const active = step === n
            const done = step > n
            return (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${done  ? 'bg-blue-600 text-white' : ''}
                  ${active ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                  ${!done && !active ? 'bg-gray-200 text-gray-500' : ''}
                `}>
                  {done ? '✓' : n}
                </div>
                <span className={`text-sm hidden sm:block ${active ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
                {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-2 hidden sm:block w-8" />}
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">

          {/* ── Step 1: Subject Information ── */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Subject Information</h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter the details of the person you want to verify.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.subject_name}
                    onChange={e => updateField('subject_name', e.target.value)}
                    placeholder="e.g. Jean Paul Habimana"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    National ID Number
                  </label>
                  <input
                    type="text"
                    value={form.subject_national_id}
                    onChange={e => updateField('subject_national_id', e.target.value)}
                    placeholder="16-digit Rwanda National ID"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={form.subject_phone}
                      onChange={e => updateField('subject_phone', e.target.value)}
                      placeholder="+250 7XX XXX XXX"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.subject_email}
                      onChange={e => updateField('subject_email', e.target.value)}
                      placeholder="subject@example.com"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose of Request
                  </label>
                  <textarea
                    value={form.purpose}
                    onChange={e => updateField('purpose', e.target.value)}
                    placeholder="e.g. Due diligence before a business partnership"
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Next: Choose Institutions →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Report Type + Institutions ── */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Report Configuration</h2>
              <p className="text-sm text-gray-500 mb-6">
                Choose what type of report you need and which institutions to query.
              </p>

              {/* Report type selector */}
              <p className="text-sm font-medium text-gray-700 mb-3">Report Type</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {REPORT_TYPES.map(rt => (
                  <button
                    key={rt.id}
                    onClick={() => handleReportTypeChange(rt.id)}
                    className={`text-left p-3 rounded-xl border text-sm transition-all
                      ${form.report_type === rt.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    <div className="font-medium">{rt.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-tight">{rt.description}</div>
                  </button>
                ))}
              </div>

              {/* Institution multi-select */}
              <p className="text-sm font-medium text-gray-700 mb-3">
                Institutions to Query
                <span className="text-gray-400 font-normal ml-1">
                  ({form.institutions.length} selected)
                </span>
              </p>
              <div className="space-y-2">
                {INSTITUTIONS.map(inst => {
                  const checked = form.institutions.includes(inst.id)
                  return (
                    <label
                      key={inst.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all
                        ${checked
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleInstitution(inst.id)}
                        className="mt-0.5 rounded text-blue-600"
                      />
                      <div>
                        <div className={`text-sm font-medium ${checked ? 'text-blue-700' : 'text-gray-800'}`}>
                          {inst.label}
                        </div>
                        <div className="text-xs text-gray-400">{inst.description}</div>
                      </div>
                    </label>
                  )
                })}
              </div>

              {form.institutions.length === 0 && (
                <p className="text-sm text-red-500 mt-2">Please select at least one institution.</p>
              )}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Next: Review →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Review & Submit ── */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Review Your Request</h2>
              <p className="text-sm text-gray-500 mb-6">
                Confirm the details before submitting. Reports expire 24 hours after completion.
              </p>

              <div className="space-y-4">
                <ReviewSection title="Subject">
                  <ReviewRow label="Full Name" value={form.subject_name} />
                  {form.subject_national_id && <ReviewRow label="National ID" value={form.subject_national_id} />}
                  {form.subject_phone && <ReviewRow label="Phone" value={form.subject_phone} />}
                  {form.subject_email && <ReviewRow label="Email" value={form.subject_email} />}
                  {form.purpose && <ReviewRow label="Purpose" value={form.purpose} />}
                </ReviewSection>

                <ReviewSection title="Report Configuration">
                  <ReviewRow
                    label="Report Type"
                    value={REPORT_TYPES.find(r => r.id === form.report_type)?.label}
                  />
                  <ReviewRow
                    label="Institutions"
                    value={form.institutions
                      .map(id => INSTITUTIONS.find(i => i.id === id)?.label)
                      .join(', ')}
                  />
                </ReviewSection>
              </div>

              {/* Consent */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 leading-relaxed">
                By submitting this request, you confirm you have a legitimate legal basis to request
                this information, and consent to Ndakwizera querying the above institutions on your
                behalf. This report will expire 24 hours after it is generated.
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors disabled:opacity-40"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-8 py-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Small helper components ──────────────────────────────────────────────────
function ReviewSection({ title, children }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex px-4 py-3 gap-4">
      <span className="text-sm text-gray-400 w-32 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value || '—'}</span>
    </div>
  )
}