import { ExchangeRateCard } from './components/ExchangeRateCard'
import { CryptoCard } from './components/CryptoCard'
import { StocksCard } from './components/StocksCard'
import { WeatherCard } from './components/WeatherCard'
import { WorldClocksCard } from './components/WorldClocksCard'
import { PhrasesCard } from './components/PhrasesCard'
import { YankeesCard } from './components/YankeesCard'

function Header() {
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
      <p className="text-slate-400 mt-1 text-sm">{today}</p>
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Phrase / Word of the day */}
        <div className="mb-5">
          <PhrasesCard />
        </div>

        {/* Top row: weather + clocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <WeatherCard />
          <WorldClocksCard />
        </div>

        {/* Bottom row: exchange rate, crypto, stocks, Yankees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ExchangeRateCard />
          <CryptoCard />
          <StocksCard />
          <YankeesCard />
        </div>
      </div>
    </div>
  )
}
