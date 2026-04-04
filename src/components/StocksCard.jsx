import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react'
import { useStocks } from '../hooks/useStocks'
import { CardShell, ErrorBanner, Skeleton } from './CardShell'

function StockRow({ quote }) {
  const change = quote.d ?? 0
  const changePct = quote.dp ?? 0
  const isPositive = change >= 0

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-700 last:border-0">
      <div className="flex items-center gap-2">
        <span className="font-bold text-white text-sm w-12">{quote.symbol}</span>
        <span className="text-slate-400 text-sm tabular-nums">
          ${quote.c?.toFixed(2) ?? '—'}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp size={13} className="text-emerald-400" />
        ) : (
          <TrendingDown size={13} className="text-red-400" />
        )}
        <span
          className={`text-xs font-medium tabular-nums ${
            isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {isPositive ? '+' : ''}
          {changePct.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

export function StocksCard() {
  const { data, loading, error, refetch } = useStocks()

  return (
    <CardShell title="Stocks" icon={BarChart2} onRefetch={refetch} loading={loading}>
      {error && <ErrorBanner message={error} />}

      {loading && !data && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      )}

      {data && (
        <div className="divide-y divide-slate-700">
          {data.map((quote) => (
            <StockRow key={quote.symbol} quote={quote} />
          ))}
        </div>
      )}
    </CardShell>
  )
}
