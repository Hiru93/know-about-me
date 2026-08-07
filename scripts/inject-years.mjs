import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Keep in sync with CAREER_START_DATE in src/App.tsx
const CAREER_START_DATE = new Date('2017-05-01')

function getYearsOfExperience (from, to = new Date()) {
  const years = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  return Math.floor(years)
}

const indexHtmlPath = fileURLToPath(new URL('../dist/index.html', import.meta.url))
const html = readFileSync(indexHtmlPath, 'utf-8')
const patched = html.replaceAll('%YEARS_OF_EXPERIENCE%', String(getYearsOfExperience(CAREER_START_DATE)))
writeFileSync(indexHtmlPath, patched)
