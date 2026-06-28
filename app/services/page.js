'use client'

import Link from 'next/link'

export default function ServicesPage() {
  const services = [
    {
      slug: 'land',
      title: 'Land Verification',
      description: 'Verify land ownership, boundaries, and legal status through NLA records.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18M5 20V10l7-6 7 6v10M9 20v-6h6v6" />
        </svg>
      )
    },
    {
      slug: 'property',
      title: 'Property Verification',
      description: 'Verify house, building, and property ownership records.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5M5 10v10h14V10M9 20v-6h6v6" />
        </svg>
      )
    },
    {
      slug: 'vehicle',
      title: 'Vehicle Verification',
      description: 'Verify vehicle ownership, registration, and loan status.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-5a2 2 0 012-1.5h10A2 2 0 0119 8l2 5M3 13v5a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-5M3 13h18M7 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm13 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      )
    },
    {
      slug: 'business',
      title: 'Business Verification',
      description: 'Verify business registration, directors, and financial standing.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V7a1 1 0 011-1h6a1 1 0 011 1v14M16 21V11a1 1 0 011-1h3a1 1 0 011 1v10M9 9h0M9 13h0M9 17h0" />
        </svg>
      )
    },
    {
      slug: 'loans',
      title: 'Loan Verification',
      description: 'Verify personal and business loan records from financial institutions.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0d1f3c] px-4 py-16 text-center">
        <Link href="/" className="text-[#c8963c] hover:text-[#e3b96a] transition-colors text-sm font-medium mb-4 inline-block">
          ← Back to Home
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#f5efe0] mb-3">Our Services</h1>
        <p className="text-[#d4cfc5] max-w-xl mx-auto">Verify assets and liabilities through Rwanda's trusted institutions</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="bg-white rounded-2xl p-6 border border-[#e5e7eb] hover:border-[#c8963c]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#fdf6ea] text-[#a3742a] flex items-center justify-center mb-4 group-hover:bg-[#c8963c] group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0d1f3c] mb-2">{service.title}</h3>
              <p className="text-sm text-[#4b5563] leading-relaxed">{service.description}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-[#a3742a] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Learn More
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}