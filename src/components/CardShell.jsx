import { AlertCircle, RefreshCw } from 'lucide-react'

export function CardShell({ title, icon: Icon, children, onRefetch, loading }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-lg border border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm uppercase tracking-wider">
          {Icon && <Icon size={16} className="text-slate-400" />}
          {title}
        </div>
        {onRefetch && (
          <button
            onClick={onRefetch}
            disabled={loading}
            className="text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-40"
            aria-label="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

export function ErrorBanner({ message }) {
  return (
    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/40 rounded-lg px-3 py-2">
      <AlertCircle size={14} className="shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-slate-700 rounded-lg animate-pulse ${className}`}
    />
  )
}
