import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { CardShell } from './CardShell'

const ZONES = [
  { label: 'Mexico City', tz: 'America/Mexico_City' },
  { label: 'Denver', tz: 'America/Denver' },
  { label: 'Chicago', tz: 'America/Chicago' },
  { label: 'New York', tz: 'America/New_York' },
  { label: 'Los Angeles', tz: 'America/Los_Angeles' },
]

function formatTime(date, tz) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)
}

function formatDate(date, tz) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function getOffset(tz) {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'short',
  })
  const parts = formatter.formatToParts(now)
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
}

export function WorldClocksCard() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <CardShell title="World Clocks" icon={Clock}>
      <div className="space-y-0 divide-y divide-slate-700">
        {ZONES.map((zone) => (
          <div key={zone.tz} className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-white text-sm font-medium">{zone.label}</p>
              <p className="text-slate-500 text-xs">{getOffset(zone.tz)}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-mono text-sm tabular-nums">
                {formatTime(now, zone.tz)}
              </p>
              <p className="text-slate-500 text-xs">{formatDate(now, zone.tz)}</p>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
