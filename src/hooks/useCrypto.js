import { useState, useEffect, useCallback } from 'react'

const REFRESH_MS = 60_000

export function useCrypto() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPrice = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData({
        price: json.bitcoin.usd,
        change24h: json.bitcoin.usd_24h_change,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrice()
    const id = setInterval(fetchPrice, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetchPrice])

  return { data, loading, error, refetch: fetchPrice }
}
