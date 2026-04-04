import phrases from '../data/phrases.json'

function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date - start
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function usePhraseOfDay() {
  const day = dayOfYear()

  return {
    german: phrases.german[day % phrases.german.length],
    spanish: phrases.spanish[day % phrases.spanish.length],
  }
}
