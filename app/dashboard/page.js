'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function Dashboard() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    setLoading(true)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setCases(data || [])
    } catch (error) {
      console.error('Error fetching cases:', error)
      setMessage('❌ Error loading cases')
    }
    setLoading(false)
  }

  const updateCaseStatus = async (caseId, status) => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      
      let paymentData = {}
      
      if (status === 'approved') {
        const paymentCode = 'PAY-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
        const amount = 5000
        
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert({
            case_id: caseId,
            payment_code: paymentCode,
            amount: amount,
            status: 'pending',
            created_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (paymentError) throw paymentError
        
        paymentData = {
          payment_code: paymentCode,
          amount: amount
        }
      }
      
      const { error } = await supabase
        .from('cases')
        .update({ 
          status: status,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', caseId)
      
      if (error) throw error
      
      const message = status === 'approved' 
        ? `✅ Case approved! Payment code: ${paymentData.payment_code} | Amount: ${paymentData.amount} RWF`
        : `✅ Case ${status} successfully!`
      
      setMessage(message)
      fetchCases()
    } catch (error) {
      console.error('Error updating case:', error)
      setMessage('❌ Error updating case')
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      submitted: '#ff9800',
      approved: '#4caf50',
      denied: '#f44336',
      paid: '#2196f3',
      completed: '#9c27b0',
      expired: '#757575'
    }
    return {
      background: colors[status] || '#757575',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 30,
        borderBottom: '3px solid #1a3a5c',
        paddingBottom: 20
      }}>
        <div>
          <h1 style={{ color: '#1a3a5c', margin: 0 }}>⚖️ Legal Reviewer Dashboard</h1>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Manage and review asset verification requests</p>
        </div>
        <button
          onClick={fetchCases}
          style={{
            padding: '10px 20px',
            background: '#1a3a5c',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      {message && (
        <div style={{ 
          padding: 15, 
          marginBottom: 20, 
          background: message.includes('✅') ? '#e8f5e9' : '#fbe9e7',
          borderRadius: 8,
          border: `1px solid ${message.includes('✅') ? '#4caf50' : '#f44336'}`
        }}>
          {message}
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 15,
        marginBottom: 30
      }}>
        {['submitted', 'approved', 'denied', 'paid', 'completed'].map((status) => {
          const count = cases.filter(c => c.status === status).length
          return (
            <div key={status} style={{
              padding: 15,
              background: 'white',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              textAlign: 'center',
              borderBottom: `3px solid ${getStatusBadge(status).background}`
            }}>
              <div style={{ fontSize: 24, fontWeight: '700', color: '#1a3a5c' }}>{count}</div>
              <div style={{ fontSize: 12, color: '#666', textTransform: 'capitalize' }}>{status}</div>
            </div>
          )
        })}
      </div>

      {/* Cases Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>Loading cases...</div>
      ) : cases.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#666', background: '#f8f9fa', borderRadius: 8 }}>
          No cases found. Submit a case first at /request
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Case Code</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>User</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Asset Type</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Purpose</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Status</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Actions</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Document</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: 12, fontWeight: '600' }}>{caseItem.case_code}</td>
                  <td style={{ padding: 12 }}>{caseItem.user_id || 'N/A'}</td>
                  <td style={{ padding: 12, textTransform: 'capitalize' }}>{caseItem.asset_type}</td>
                  <td style={{ padding: 12, textTransform: 'capitalize' }}>{caseItem.purpose}</td>
                  <td style={{ padding: 12 }}>{caseItem.document_name || 'No file'}</td>
                  <td style={{ padding: 12 }}>
                    <span style={getStatusBadge(caseItem.status)}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    {caseItem.status === 'submitted' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => updateCaseStatus(caseItem.id, 'approved')}
                          style={{
                            padding: '6px 12px',
                            background: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateCaseStatus(caseItem.id, 'denied')}
                          style={{
                            padding: '6px 12px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          Deny
                        </button>
                      </div>
                    )}
                    {caseItem.status === 'approved' && (
                      <span style={{ fontSize: 12, color: '#2196f3' }}>⏳ Awaiting Payment</span>
                    )}
                    {caseItem.status === 'paid' && (
                      <span style={{ fontSize: 12, color: '#9c27b0' }}>🔄 Processing</span>
                    )}
                    {caseItem.status === 'completed' && (
                      <span style={{ fontSize: 12, color: '#4caf50' }}>✅ Complete</span>
                    )}
                    {caseItem.status === 'denied' && (
                      <span style={{ fontSize: 12, color: '#f44336' }}>❌ Denied</span>
                    )}
                    {caseItem.status === 'expired' && (
                      <span style={{ fontSize: 12, color: '#757575' }}>⏰ Expired</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}