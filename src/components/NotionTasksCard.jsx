import { ListChecks, Circle, RotateCcw } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { CardShell, ErrorBanner, Skeleton } from './CardShell'

export function NotionTasksCard() {
  const { data, loading, error, refetch } = useTasks()

  return (
    <CardShell title="Priorities" icon={ListChecks} onRefetch={refetch} loading={loading}>
      {error && (
        <div className="space-y-3">
          <ErrorBanner message={error} />
          <button
            onClick={refetch}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw size={14} />
            Retry
          </button>
        </div>
      )}

      {loading && !data && (
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-4/6" />
        </div>
      )}

      {data && data.length === 0 && (
        <p className="text-slate-500 text-sm">No tasks</p>
      )}

      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((task) => (
            <li key={task.id} className="flex items-start gap-2 text-sm">
              <Circle size={14} className="text-slate-500 mt-0.5 shrink-0" />
              <span className="text-slate-200">
                {task.client ? (
                  <>
                    <span className="text-slate-400">{task.client}:</span>{' '}
                    {task.task}
                  </>
                ) : (
                  task.task
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  )
}
