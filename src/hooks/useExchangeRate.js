import { useState, useEffect, useCallback } from 'react'

const REFRESH_MS = 60_000

export function useExchangeRate() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRate = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch(
        'https://api.frankfurter.dev/v1/latest?base=USD&symbols=MXN',
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData({
        rate: json.rates.MXN,
        date: json.date,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRate()
    const id = setInterval(fetchRate, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetchRate])

  return { data, loading, error, refetch: fetchRate }
}
