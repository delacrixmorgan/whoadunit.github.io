#!/usr/bin/env node
/**
 * split-by-year.js
 *
 * Reads public/data/representatives.json, groups entries by electedYear,
 * writes public/data/representatives_YYYY.json for each year,
 * then regenerates public/data/representatives-manifest.json.
 *
 * Usage:
 *   node scripts/split-by-year.js
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(__dirname, '../public/data')

// --- 1. Read source file ---
const source = JSON.parse(readFileSync(resolve(dataDir, 'representatives.json'), 'utf8'))

// --- 2. Group by electedYear ---
const byYear = {}
for (const rep of source) {
  const year = rep.electedYear
  if (!byYear[year]) byYear[year] = []
  byYear[year].push(rep)
}

// --- 3. Write per-year files ---
mkdirSync(dataDir, { recursive: true })
for (const [year, reps] of Object.entries(byYear)) {
  const outPath = resolve(dataDir, `representatives_${year}.json`)
  writeFileSync(outPath, JSON.stringify(reps, null, 2), 'utf8')
  console.log(`✅  Wrote ${reps.length} entries → representatives_${year}.json`)
}

// --- 4. Regenerate manifest (run after this script or call gen-manifest directly) ---
const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)
const manifestPath = resolve(dataDir, 'representatives-manifest.json')
writeFileSync(manifestPath, JSON.stringify(years, null, 2), 'utf8')
console.log(`📋  Manifest updated → representatives-manifest.json  (years: ${years.join(', ')})`)
