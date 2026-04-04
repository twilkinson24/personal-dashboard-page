import { Bitcoin, TrendingUp, TrendingDown } from 'lucide-react'
import { useCrypto } from '../hooks/useCrypto'
import { CardShell, ErrorBanner, Skeleton } from './CardShell'

export function CryptoCard() {
  const { data, loading, error, refetch } = useCrypto()
  const isPositive = data?.change24h >= 0

  return (
    <CardShell title="Bitcoin" icon={Bitcoin} onRefetch={refetch} loading={loading}>
      {error && <ErrorBanner message={error} />}

      {loading && !data && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}

      {data && (
        <div>
          <p className="text-4xl font-bold text-white tabular-nums">
            ${data.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp size={14} className="text-emerald-400" />
            ) : (
              <TrendingDown size={14} className="text-red-400" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isPositive ? '+' : ''}
              {data.change24h.toFixed(2)}% (24h)
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-2">BTC / USD</p>
        </div>
      )}
    </CardShell>
  )
}
