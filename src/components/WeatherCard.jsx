import { Cloud, Wind, Droplets, Thermometer } from 'lucide-react'
import { useWeather, weatherLabel } from '../hooks/useWeather'
import { CardShell, ErrorBanner, Skeleton } from './CardShell'

function WeatherCodeIcon({ code }) {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 49) return '🌫️'
  if (code <= 59) return '🌦️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 86) return '🌨️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

function CityRow({ city }) {
  const isGuadalajara = city.name === 'Guadalajara'

  return (
    <div className="py-3 border-b border-slate-700 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={weatherLabel(city.weatherCode)}>
            <WeatherCodeIcon code={city.weatherCode} />
          </span>
          <div>
            <p className="font-semibold text-white text-sm">{city.name}</p>
            <p className="text-slate-400 text-xs">{weatherLabel(city.weatherCode)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white tabular-nums">
            {Math.round(city.temp)}°F
          </p>
          <div className="flex items-center justify-end gap-2 mt-0.5 text-slate-500 text-xs">
            <span className="flex items-center gap-0.5">
              <Wind size={10} />
              {Math.round(city.windSpeed)} mph
            </span>
            <span className="flex items-center gap-0.5">
              <Droplets size={10} />
              {city.humidity}%
            </span>
          </div>
        </div>
      </div>

      {isGuadalajara && city.tomorrow && (
        <div className="mt-2 ml-8 bg-slate-700/50 rounded-lg px-3 py-2 flex items-center justify-between">
          <div className="text-slate-400 text-xs font-medium">Tomorrow</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-base">
              <WeatherCodeIcon code={city.tomorrow.weatherCode} />
            </span>
            <span className="text-slate-300">{weatherLabel(city.tomorrow.weatherCode)}</span>
            <span className="text-slate-400">
              {Math.round(city.tomorrow.tempMax)}° / {Math.round(city.tomorrow.tempMin)}°
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export function WeatherCard() {
  const { data, loading, error, refetch } = useWeather()

  return (
    <CardShell title="Weather" icon={Cloud} onRefetch={refetch} loading={loading}>
      {error && <ErrorBanner message={error} />}

      {loading && !data && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {data && (
        <div>
          {data.map((city) => (
            <CityRow key={city.name} city={city} />
          ))}
        </div>
      )}
    </CardShell>
  )
}
