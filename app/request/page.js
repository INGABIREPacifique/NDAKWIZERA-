'use client'
import { Suspense } from 'react'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

function RequestPageInner() {
  const searchParams = useSearchParams()
  const serviceSlug = searchParams.get('service') || 'property'

  const [step, setStep] = useState(1)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    fullName: '', nationalId: '', phone: '', email: '',
    purpose: '', assetType: '', description: '', documents: null
  })

  const services = {
    land: { title: 'Land Verification', details: 'Get official verification of land titles, ownership history, and any encumbrances registered with the National Land Authority.', institutions: ['National Land Authority (NLA)', 'RDB (Property Records)'], requirements: ['Land title deed', 'National ID', 'Consent letter from all parties'], processingTime: '3–5 business days', cost: '15,000 RWF', providedBy: 'NLA' },
    property: { title: 'Property Verification', details: 'Access RDB property records to confirm ownership, valuation, and any registered claims on residential or commercial properties.', institutions: ['RDB (Property Records)', 'Local Government'], requirements: ['Property registration number', 'National ID', 'Proof of relationship'], processingTime: '3–5 business days', cost: '15,000 RWF', providedBy: 'RDB' },
    vehicle: { title: 'Vehicle Verification', details: 'Check RRA and RNP records for vehicle registration, ownership history, and any outstanding loans or legal claims.', institutions: ['RRA (Vehicle Registration)', 'RNP (Traffic Police)', 'Credit Bureau'], requirements: ['Vehicle registration number', 'National ID', 'Vehicle logbook'], processingTime: '2–4 business days', cost: '15,000 RWF', providedBy: 'RRA' },
    business: { title: 'Business Verification', details: 'Access RDB business records, check director information, and review any registered charges or legal compliance status.', institutions: ['RDB (Business Registry)', 'RRA (Tax Records)', 'Credit Bureau'], requirements: ['Business registration number', 'Company name', 'Director information'], processingTime: '3–5 business days', cost: '15,000 RWF', providedBy: 'RDB' },
    loans: { title: 'Loan Verification', details: 'Access credit bureau and bank records to verify loan history, outstanding balances, and credit standing.', institutions: ['Credit Bureau', 'Commercial Banks', 'Microfinance Institutions'], requirements: ['National ID', 'Loan reference number', 'Consent from borrower'], processingTime: '2–4 business days', cost: '15,000 RWF', providedBy: 'CRB' }
  }

  const service = services[serviceSlug] || services.property

  const icons = {
    clock: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" strokeLinecap="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" /></svg>,
    tag: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41L11 4H4v7l9.59 9.59a2 2 0 002.82 0l4.18-4.18a2 2 0 000-2.82z" /><circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" /></svg>,
    building: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 21V7a1 1 0 011-1h6a1 1 0 011 1v14M16 21V11a1 1 0 011-1h3a1 1 0 011 1v10M9 9h0M9 13h0M9 17h0" /></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    checkSmall: <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    upload: <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
  }

  const assetTypes = [
    { value: 'land', label: 'Land' }, { value: 'house', label: 'House / Property' },
    { value: 'vehicle', label: 'Vehicle' }, { value: 'business', label: 'Business' }, { value: 'loan', label: 'Loan' }
  ]
  const purposes = [
    { value: 'spousal_consent', label: 'Spousal Consent' }, { value: 'family_dispute', label: 'Family Dispute Resolution' },
    { value: 'inheritance', label: 'Inheritance Claim' }, { value: 'loan_application', label: 'Loan Application' }, { value: 'legal_compliance', label: 'Legal Compliance' }
  ]

  const handleNext = () => {
    if (step === 1 && (!formData.fullName || !formData.nationalId || !formData.phone)) { setMessage('Please fill in all required fields'); return }
    if (step === 2 && !formData.assetType) { setMessage('Please select an asset type'); return }
    if (step === 3 && !formData.purpose) { setMessage('Please select a purpose'); return }
    setMessage(''); setStep(step + 1)
  }
  const handleBack = () => { setStep(step - 1); setMessage('') }

  const submitCase = async () => {
    setMessage('Submitting...')
    try {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      const caseCode = 'NDK-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
      const { error } = await supabase.from('cases').insert({
        case_code: caseCode, full_name: formData.fullName, national_id: formData.nationalId, phone: formData.phone,
        email: formData.email || null, purpose: formData.purpose, asset_type: formData.assetType,
        description: formData.description, document_name: formData.documents ? formData.documents.name : null,
        status: 'submitted', submitted_at: new Date().toISOString()
      }).select()
      if (error) { setMessage('Error: ' + error.message); return }
      setStep(4); setMessage('')
    } catch (error) { setMessage('Error: ' + error.message) }
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Fixed top-left back link — independent of the centered form below */}
      <Link href={`/services/${serviceSlug}`} className="fixed top-4 left-4 md:left-6 z-20 text-[#c8963c] hover:text-[#a3742a] transition-colors inline-flex items-center gap-1.5 text-sm font-medium bg-white/90 px-3 py-1.5 rounded-lg shadow-sm">
        ← Back to Services
      </Link>
      {/* ===== BACKGROUND LAYER: full-width service detail content, blurred + dimmed, non-interactive ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className="py-8">
          <div className="w-full px-6 md:px-10 max-w-5xl mx-auto mt-10">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="p-8 border-b border-gray-200 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800">{service.title}</h2>
                <p className="text-base text-gray-600 mt-2">{service.details}</p>
              </div>
              <div className="p-6 bg-gray-50 flex flex-wrap gap-6 text-sm border-b border-gray-200">
                <div className="flex items-center gap-2"><span className="text-[#a3742a]">{icons.clock}</span><span className="text-gray-500">Processing Time:</span><span className="font-medium text-gray-800">{service.processingTime}</span></div>
                <div className="flex items-center gap-2"><span className="text-[#a3742a]">{icons.tag}</span><span className="text-gray-500">Price:</span><span className="font-medium text-[#c8963c]">{service.cost}</span></div>
                <div className="flex items-center gap-2"><span className="text-[#a3742a]">{icons.building}</span><span className="text-gray-500">Provided by:</span><span className="border border-gray-300 rounded px-2 py-0.5 text-xs font-semibold text-gray-800">{service.providedBy}</span></div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="text-xs font-semibold text-[#a3742a] uppercase tracking-wider mb-3">Institutions Involved</h4>
                    <ul className="space-y-2.5">
                      {service.institutions.map((inst, i) => <li key={i} className="text-sm text-gray-700 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#c8963c] flex-shrink-0"></span>{inst}</li>)}
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="text-xs font-semibold text-[#a3742a] uppercase tracking-wider mb-3">What You Need</h4>
                    <ul className="space-y-2.5">
                      {service.requirements.map((req, i) => <li key={i} className="text-sm text-gray-700 flex items-center gap-2"><span className="text-[#2e6b4f] flex-shrink-0">{icons.checkSmall}</span>{req}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* extra white wash on top of the blur for readability of the centered form */}
        <div className="absolute inset-0 bg-white/10"></div>
      </div>

      {/* ===== FOREGROUND: centered floating form ===== */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-gray-800">Submit Verification Request</h1>
                <p className="text-xs text-gray-500">{service.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s === step ? 'bg-[#c8963c] text-white' : s < step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {s < step ? icons.check : s}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-gray-800">Legal Representative's Information</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Identification document type *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c8963c] focus:outline-none text-gray-800">
                      <option>Rwanda National ID</option><option>Passport</option><option>Refugee ID</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Identification document number *</label>
                    <input type="text" value={formData.nationalId} onChange={(e) => setFormData({...formData, nationalId: e.target.value})} placeholder="Enter your ID number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c8963c] focus:outline-none text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Enter your full name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c8963c] focus:outline-none text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+250 788 123 456" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c8963c] focus:outline-none text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Enter email address" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c8963c] focus:outline-none text-gray-800" />
                  </div>
                  <button onClick={handleNext} className="w-full mt-2 bg-[#c8963c] text-white font-semibold py-2.5 rounded-lg hover:bg-[#a3742a] transition-all">Continue</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-gray-800">Information About The Asset</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type *</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {assetTypes.map((asset) => (
                        <button key={asset.value} onClick={() => setFormData({...formData, assetType: asset.value})} className={`p-3 rounded-lg border-2 text-center transition-all ${formData.assetType === asset.value ? 'border-[#c8963c] bg-[#fdf6ea]' : 'border-gray-200 hover:border-[#c8963c]/50'}`}>
                          <div className="text-sm font-medium text-gray-800">{asset.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the asset..." rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c8963c] focus:outline-none text-gray-800 resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleBack} className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition-all">Back</button>
                    <button onClick={handleNext} className="flex-1 bg-[#c8963c] text-white font-semibold py-2.5 rounded-lg hover:bg-[#a3742a] transition-all">Continue</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-gray-800">Purpose and Documents</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                    <select value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c8963c] focus:outline-none text-gray-800">
                      <option value="">Select purpose...</option>
                      {purposes.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#c8963c] transition-colors cursor-pointer">
                      <input type="file" className="hidden" id="fileUpload" onChange={(e) => setFormData({...formData, documents: e.target.files[0]})} />
                      <label htmlFor="fileUpload" className="cursor-pointer block">
                        <div className="flex justify-center text-gray-300 mb-1">{icons.upload}</div>
                        <p className="text-gray-600 text-sm">{formData.documents ? formData.documents.name : 'Click to upload supporting documents'}</p>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button onClick={handleBack} className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition-all">Back</button>
                    <button onClick={submitCase} className="flex-1 bg-[#c8963c] text-white font-semibold py-2.5 rounded-lg hover:bg-[#a3742a] transition-all">Submit Request</button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">Request Submitted</h2>
                  <p className="text-gray-600 mb-4 text-sm">Your case has been submitted for legal review.</p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-200">
                    <p className="text-xs text-gray-500">Case Code</p>
                    <p className="font-mono font-bold text-[#c8963c] text-lg">
                      NDK-{Date.now().toString(36).toUpperCase()}-{Math.random().toString(36).substring(2, 6).toUpperCase()}
                    </p>
                  </div>
                  <Link href="/services" className="inline-block bg-[#c8963c] text-white font-semibold px-7 py-2.5 rounded-lg hover:bg-[#a3742a] transition-all">Back to Services</Link>
                </div>
              )}

              {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>{message}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RequestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RequestPageInner />
    </Suspense>
  )
}
