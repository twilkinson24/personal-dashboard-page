import { useState, useEffect, useCallback } from 'react'

const SYMBOLS = ['SPY', 'SCHG', 'SCHF', 'SCHE']
const REFRESH_MS = 60_000

export function useStocks() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStocks = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch(`/api/stocks?symbols=${SYMBOLS.join(',')}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStocks()
    const id = setInterval(fetchStocks, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetchStocks])

  return { data, loading, error, refetch: fetchStocks }
}
