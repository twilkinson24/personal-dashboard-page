import { DollarSign } from 'lucide-react'
import { useExchangeRate } from '../hooks/useExchangeRate'
import { CardShell, ErrorBanner, Skeleton } from './CardShell'

export function ExchangeRateCard() {
  const { data, loading, error, refetch } = useExchangeRate()

  return (
    <CardShell title="USD → MXN" icon={DollarSign} onRefetch={refetch} loading={loading}>
      {error && <ErrorBanner message={error} />}

      {loading && !data && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      )}

      {data && (
        <div>
          <p className="text-4xl font-bold text-white tabular-nums">
            {data.rate.toFixed(4)}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            1 USD = {data.rate.toFixed(4)} MXN
          </p>
          <p className="text-slate-500 text-xs mt-2">As of {data.date}</p>
        </div>
      )}
    </CardShell>
  )
}
