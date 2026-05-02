#!/usr/bin/env node
/**
 * gen-manifest.js
 *
 * Scans public/data/ for representatives_YYYY.json files and writes
 * public/data/representatives-manifest.json with years in descending order.
 *
 * Run this whenever you add or remove a year file:
 *   node scripts/gen-manifest.js
 */

import { readdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(__dirname, '../public/data')

const yearRe = /^representatives_(\d{4})\.json$/

const years = readdirSync(dataDir)
  .map((f) => {
    const m = f.match(yearRe)
    return m ? Number(m[1]) : null
  })
  .filter(Boolean)
  .sort((a, b) => b - a)

const manifestPath = resolve(dataDir, 'representatives-manifest.json')
writeFileSync(manifestPath, JSON.stringify(years, null, 2), 'utf8')

console.log(`📋  Manifest written → representatives-manifest.json`)
console.log(`    Years found (desc): ${years.join(', ')}`)
