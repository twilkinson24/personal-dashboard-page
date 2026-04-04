import { BookOpen } from 'lucide-react'
import { usePhraseOfDay } from '../hooks/usePhraseOfDay'
import { CardShell } from './CardShell'

const LANG_META = {
  german: { flag: '🇩🇪', label: 'German', labelBadge: 'bg-yellow-900/60 text-yellow-300' },
  spanish: { flag: '🇲🇽', label: 'Spanish', labelBadge: 'bg-green-900/60 text-green-300' },
}

function SpanishEntry({ entry }) {
  return (
    <div className="space-y-1.5">
      <p className="text-white text-base font-semibold leading-snug italic">
        &ldquo;{entry.phrase}&rdquo;
      </p>
      <p className="text-slate-300 text-sm">{entry.note}</p>
      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 capitalize">
        {entry.type}
      </span>
    </div>
  )
}

function GermanEntry({ entry }) {
  return (
    <div className="space-y-1.5">
      <p className="text-white text-2xl font-bold tracking-tight">{entry.word}</p>
      <p className="text-slate-300 text-sm">{entry.translation}</p>
    </div>
  )
}

function LangPanel({ lang, entry }) {
  const meta = LANG_META[lang]

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-700/40 border border-slate-700">
      <div className="flex items-center gap-2">
        <span className="text-xl" role="img" aria-label={meta.label}>
          {meta.flag}
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.labelBadge}`}>
          {meta.label}
        </span>
      </div>

      {lang === 'german' && <GermanEntry entry={entry} />}
      {lang === 'spanish' && <SpanishEntry entry={entry} />}
    </div>
  )
}

export function PhrasesCard() {
  const { spanish, german } = usePhraseOfDay()

  return (
    <CardShell title="Phrase / Word of the Day" icon={BookOpen}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <LangPanel lang="german" entry={german} />
        <LangPanel lang="spanish" entry={spanish} />
      </div>
    </CardShell>
  )
}
