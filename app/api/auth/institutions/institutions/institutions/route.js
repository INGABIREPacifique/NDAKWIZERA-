import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const institution = params.institution
  
  // Mock responses for each institution
  const responses = {
    nla: {
      land_records: {
        exists: true,
        owner: 'Jean Pierre Niyonzima',
        location: 'Kigali, Gasabo',
        size: '2500 sqm',
        registration_date: '2022-03-15',
        status: 'registered'
      }
    },
    rdb: {
      business_records: {
        exists: true,
        company_name: 'NDAKWIZERA LTD',
        registration_number: 'RW-2024-001234',
        incorporation_date: '2024-01-10',
        status: 'active'
      }
    },
    rra: {
      tax_records: {
        exists: true,
        tin: '1234567890',
        taxpayer_name: 'NDAKWIZERA LTD',
        compliance_status: 'compliant',
        last_filing: '2026-05-15'
      }
    },
    rnp: {
      vehicle_records: {
        exists: true,
        plate_number: 'RAB 123 X',
        owner: 'Jean Pierre Niyonzima',
        make: 'Toyota',
        model: 'Land Cruiser',
        year: '2023',
        status: 'registered'
      }
    },
    crb: {
      credit_records: {
        exists: true,
        has_loans: true,
        loan_count: 2,
        total_outstanding: 15000000,
        repayment_status: 'good'
      }
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const response = responses[institution.toLowerCase()] || {
    error: 'Institution not found',
    available: ['nla', 'rdb', 'rra', 'rnp', 'crb']
  }
  
  return NextResponse.json({
    success: true,
    institution: institution,
    data: response,
    timestamp: new Date().toISOString()
  })
}