'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ServiceDetail() {
  const params = useParams()
  const slug = params.slug
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const icons = {
    clock: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
      </svg>
    ),
    tag: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41L11 4H4v7l9.59 9.59a2 2 0 002.82 0l4.18-4.18a2 2 0 000-2.82z" />
        <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
    building: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V7a1 1 0 011-1h6a1 1 0 011 1v14M16 21V11a1 1 0 011-1h3a1 1 0 011 1v10M9 9h0M9 13h0M9 17h0" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    doc: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 2h6a2 2 0 012 2v2H7V4a2 2 0 012-2zM5 7h14v13a2 2 0 01-2 2H7a2 2 0 01-2-2V7zM9 12h6M9 16h6" />
      </svg>
    )
  }

  const services = {
    land: {
      title: 'Land Verification',
      details: 'Get official verification of land titles, ownership history, and any encumbrances registered with the National Land Authority.',
      institutions: ['National Land Authority (NLA)', 'RDB (Property Records)'],
      requirements: ['Land title deed', 'National ID', 'Consent letter from all parties'],
      processingTime: '3–5 business days',
      cost: '15,000 RWF',
      providedBy: 'NLA'
    },
    property: {
      title: 'Property Verification',
      details: 'Access RDB property records to confirm ownership, valuation, and any registered claims on residential or commercial properties.',
      institutions: ['RDB (Property Records)', 'Local Government'],
      requirements: ['Property registration number', 'National ID', 'Proof of relationship'],
      processingTime: '3–5 business days',
      cost: '15,000 RWF',
      providedBy: 'RDB'
    },
    vehicle: {
      title: 'Vehicle Verification',
      details: 'Check RRA and RNP records for vehicle registration, ownership history, and any outstanding loans or legal claims.',
      institutions: ['RRA (Vehicle Registration)', 'RNP (Traffic Police)', 'Credit Bureau'],
      requirements: ['Vehicle registration number', 'National ID', 'Vehicle logbook'],
      processingTime: '2–4 business days',
      cost: '15,000 RWF',
      providedBy: 'RRA'
    },
    business: {
      title: 'Business Verification',
      details: 'Access RDB business records, check director information, and review any registered charges or legal compliance status.',
      institutions: ['RDB (Business Registry)', 'RRA (Tax Records)', 'Credit Bureau'],
      requirements: ['Business registration number', 'Company name', 'Director information'],
      processingTime: '3–5 business days',
      cost: '15,000 RWF',
      providedBy: 'RDB'
    },
    loans: {
      title: 'Loan Verification',
      details: 'Access credit bureau and bank records to verify loan history, outstanding balances, and credit standing.',
      institutions: ['Credit Bureau', 'Commercial Banks', 'Microfinance Institutions'],
      requirements: ['National ID', 'Loan reference number', 'Consent from borrower'],
      processingTime: '2–4 business days',
      cost: '15,000 RWF',
      providedBy: 'CRB'
    }
  }

  const service = services[slug]

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0d1f3c] mb-4">Service Not Found</h1>
          <Link href="/services" className="text-[#a3742a] hover:underline">Back to Services</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8">
      {/* Full-width container, left-padded only (not mx-auto centered) — matches the sketch:
          card starts near the left edge and spans most of the viewport width */}
      <div className="w-full px-6 md:px-10 max-w-5xl mx-auto">
        <Link href="/services" className="text-[#c8963c] hover:text-[#a3742a] transition-colors inline-block mb-6 text-sm font-medium">
          ← Back to Services
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-8 border-b border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800">{service.title}</h2>
            <p className="text-base text-gray-600 mt-2">{service.details}</p>
          </div>

          <div className="p-6 bg-gray-50 flex flex-wrap gap-6 text-sm border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-[#a3742a]">{icons.clock}</span>
              <span className="text-gray-500">Processing Time:</span>
              <span className="font-medium text-gray-800">{service.processingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#a3742a]">{icons.tag}</span>
              <span className="text-gray-500">Price:</span>
              <span className="font-medium text-[#c8963c]">{service.cost}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#a3742a]">{icons.building}</span>
              <span className="text-gray-500">Provided by:</span>
              <span className="border border-gray-300 rounded px-2 py-0.5 text-xs font-semibold text-gray-800">{service.providedBy}</span>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-xs font-semibold text-[#a3742a] uppercase tracking-wider mb-3">Institutions Involved</h4>
                <ul className="space-y-2.5">
                  {service.institutions.map((inst, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c8963c] flex-shrink-0"></span>
                      {inst}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-xs font-semibold text-[#a3742a] uppercase tracking-wider mb-3">What You Need</h4>
                <ul className="space-y-2.5">
                  {service.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-[#2e6b4f] flex-shrink-0">{icons.check}</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="#" className="inline-block text-sm text-[#a3742a] hover:text-[#c8963c] transition-colors mt-6 font-medium">
              Learn more about this service →
            </Link>
          </div>

          <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex justify-end">
            <Link
              href={`/request?service=${slug}`}
              className="bg-[#c8963c] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#a3742a] transition-all inline-flex items-center gap-2"
            >
              {icons.doc} Apply for this Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}