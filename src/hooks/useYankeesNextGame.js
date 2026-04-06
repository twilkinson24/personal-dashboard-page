import { useState, useEffect, useCallback } from 'react'

const REFRESH_MS = 30 * 60_000
const YANKEES_TEAM_ID = 147

export function useYankeesNextGame() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGame = useCallback(async () => {
    try {
      setError(null)
      // Request the next 30 days of schedule to find the next upcoming game
      const today = new Date().toISOString().slice(0, 10)
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)

      const url =
        `https://statsapi.mlb.com/api/v1/schedule` +
        `?teamId=${YANKEES_TEAM_ID}&sportId=1` +
        `&startDate=${today}&endDate=${endDate}` +
        `&gameType=R,F,D,L,W` // Regular season + postseason

      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()

      // Flatten all games across all dates
      const games = (json.dates ?? []).flatMap((d) => d.games ?? [])

      // Find the first game that hasn't started yet (or is scheduled)
      const now = Date.now()
      const next = games.find((g) => {
        const status = g.status?.abstractGameState
        if (status === 'Final') return false
        return new Date(g.gameDate).getTime() >= now
      })

      if (!next) {
        setData(null)
        return
      }

      const isHome = next.teams?.home?.team?.id === YANKEES_TEAM_ID
      const opponent = isHome
        ? next.teams?.away?.team?.name
        : next.teams?.home?.team?.name

      setData({
        gameDate: next.gameDate,
        isHome,
        opponent,
        venue: next.venue?.name ?? null,
        status: next.status?.detailedState ?? null,
        seriesDescription: next.seriesDescription ?? null,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGame()
    const id = setInterval(fetchGame, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetchGame])

  return { data, loading, error, refetch: fetchGame }
}
