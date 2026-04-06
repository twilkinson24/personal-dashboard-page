import { CalendarDays, MapPin, Home, Plane } from 'lucide-react'
import { useYankeesNextGame } from '../hooks/useYankeesNextGame'
import { CardShell, ErrorBanner, Skeleton } from './CardShell'

function formatGameTime(isoDate) {
  const date = new Date(isoDate)
  const dateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)

  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date)

  return { dateStr, timeStr }
}

export function YankeesCard() {
  const { data, loading, error, refetch } = useYankeesNextGame()

  return (
    <CardShell
      title="Yankees — Next Game"
      icon={CalendarDays}
      onRefetch={refetch}
      loading={loading}
    >
      {error && <ErrorBanner message={error} />}

      {loading && !data && !error && (
        <div className="space-y-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {!loading && !error && data === null && (
        <p className="text-slate-400 text-sm">No upcoming games scheduled.</p>
      )}

      {data && (
        <div className="space-y-3">
          {/* Opponent + home/away badge */}
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-white leading-tight">
              {data.opponent}
            </p>
            <span
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                data.isHome
                  ? 'bg-blue-900/60 text-blue-300'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {data.isHome ? (
                <>
                  <Home size={11} />
                  Home
                </>
              ) : (
                <>
                  <Plane size={11} />
                  Away
                </>
              )}
            </span>
          </div>

          {/* Series label if present */}
          {data.seriesDescription && (
            <p className="text-slate-400 text-xs -mt-1">{data.seriesDescription}</p>
          )}

          {/* Date + time */}
          <div className="space-y-1">
            {(() => {
              const { dateStr, timeStr } = formatGameTime(data.gameDate)
              return (
                <>
                  <p className="text-slate-200 text-sm font-medium">{dateStr}</p>
                  <p className="text-slate-400 text-sm">{timeStr}</p>
                </>
              )
            })()}
          </div>

          {/* Venue */}
          {data.venue && (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <MapPin size={12} className="shrink-0" />
              <span>{data.venue}</span>
            </div>
          )}

          {/* Status badge for postponed/suspended/etc */}
          {data.status && data.status !== 'Scheduled' && data.status !== 'Pre-Game' && (
            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-300">
              {data.status}
            </span>
          )}
        </div>
      )}
    </CardShell>
  )
}
