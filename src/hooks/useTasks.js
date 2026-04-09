import { useState, useEffect, useCallback } from 'react'

const REFRESH_MS = 300_000

export function useTasks() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
    const id = setInterval(fetchTasks, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetchTasks])

  return { data, loading, error, refetch: fetchTasks }
}
