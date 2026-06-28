'use client'

import { useState } from 'react'

/**
 * useCaseSubmit — hook for the multi-step /request form.
 *
 * Usage:
 *   const { submit, loading, error, result } = useCaseSubmit()
 *   await submit({ subject_name, institutions, report_type, ... })
 */
export function useCaseSubmit() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [result, setResult]   = useState(null)

  const submit = async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',   // send auth cookie
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Submission failed. Please try again.')
        return null
      }

      setResult(data)
      return data
    } catch (err) {
      setError('Network error. Please check your connection.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error, result }
}

/**
 * useCases — hook to fetch the current user's cases list.
 *
 * Usage:
 *   const { cases, loading, error, refetch } = useCases()
 */
export function useCases(options = {}) {
  const { status, limit = 20 } = options
  const [cases, setCases]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetch_ = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ limit: String(limit) })
      if (status) params.set('status', status)

      const response = await fetch(`/api/cases?${params}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load cases')
        return
      }

      setCases(data.cases || [])
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return { cases, loading, error, refetch: fetch_, fetch: fetch_ }
}