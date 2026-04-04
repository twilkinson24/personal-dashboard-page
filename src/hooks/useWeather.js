import { useState, useEffect, useCallback } from 'react'

const REFRESH_MS = 10 * 60_000

const CITIES = [
  {
    name: 'Guadalajara',
    lat: 20.6597,
    lon: -103.3496,
    timezone: 'America/Mexico_City',
    includeForecast: true,
  },
  {
    name: 'Chicago',
    lat: 41.8781,
    lon: -87.6298,
    timezone: 'America/Chicago',
    includeForecast: false,
  },
  {
    name: 'Detroit',
    lat: 42.3314,
    lon: -83.0458,
    timezone: 'America/Detroit',
    includeForecast: false,
  },
]

// WMO weather code → human-readable label
export function weatherLabel(code) {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly Cloudy'
  if (code <= 49) return 'Foggy'
  if (code <= 59) return 'Drizzle'
  if (code <= 69) return 'Rain'
  if (code <= 79) return 'Snow'
  if (code <= 82) return 'Showers'
  if (code <= 86) return 'Snow Showers'
  if (code <= 99) return 'Thunderstorm'
  return 'Unknown'
}

async function fetchCity(city) {
  const dailyParams = city.includeForecast
    ? '&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=2'
    : ''
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m` +
    dailyParams +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph` +
    `&timezone=${encodeURIComponent(city.timezone)}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status} for ${city.name}`)
  const json = await res.json()

  const result = {
    name: city.name,
    temp: json.current.temperature_2m,
    weatherCode: json.current.weather_code,
    windSpeed: json.current.wind_speed_10m,
    humidity: json.current.relative_humidity_2m,
  }

  if (city.includeForecast && json.daily) {
    // index 1 = tomorrow
    result.tomorrow = {
      weatherCode: json.daily.weather_code[1],
      tempMax: json.daily.temperature_2m_max[1],
      tempMin: json.daily.temperature_2m_min[1],
    }
  }

  return result
}

export function useWeather() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      setError(null)
      const results = await Promise.all(CITIES.map(fetchCity))
      setData(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const id = setInterval(fetchAll, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetchAll])

  return { data, loading, error, refetch: fetchAll }
}
