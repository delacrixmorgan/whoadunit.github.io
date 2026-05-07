# Scaling Static Data on GitHub Pages

This document outlines strategies for keeping the XLSX → Static JSON pipeline viable as the dataset grows, while remaining fully compatible with GitHub Pages (no server, no database backend).

---

## Current Architecture

```
XLSX → convert-xlsx-to-json.cjs → public/data/representatives_YYYY.json
                                   public/data/representatives-manifest.json
```

- One JSON file per election year (~5,900 lines / ~200KB raw for 2023)
- Client fetches all year files, merges them, searches in-memory
- GitHub Pages serves with gzip (~30-40KB over the wire per file)

---

## Part 1 — Scaling Static JSON (File Splitting Strategies)

### Strategy 1: Split by Year + State

Split each year file into per-state files. Users typically browse by state, so only the relevant file is fetched.

```
public/data/
├── manifest.json              → { years: [2023, 2022], states: [...] }
├── 2023/
│   ├── kedah.json
│   ├── selangor.json
│   └── ...
└── 2022/
    ├── kedah.json
    └── ...
```

**Impact:** Each file drops from ~200KB to ~10-15KB. Directory pages fetch only the state being viewed.

---

### Strategy 2: Index + Detail (Tiered Loading)

Separate lightweight listing data from full record detail.

```
public/data/
├── index_2023.json            ← name, party, state, seatCode, type (~20% of full size)
├── seats/
│   ├── P001.json              ← full record (pollingDistricts, contacts, etc.)
│   ├── P002.json
│   └── ...
```

**Flow:**
1. Listing/directory page loads only the index
2. Profile page fetches detail on demand (`seats/P008.json`)

**Impact:** Initial page load reduced by ~80%. Detail fetched lazily.

---

### Strategy 3: Normalize Repeated Data

Extract shared/repeated data into lookup tables.

```
public/data/
├── lookups/
│   ├── states.json            → { "KDH": "Kedah", ... }
│   ├── federal_seats.json     → { "P008": { "name": "Pokok Sena", "state": "KDH" } }
│   └── polling_districts.json → { "P008_N10": ["Paya Lengkuas", ...] }
├── reps_2023.json             → [{ "seat": "P008_N10", "name": "...", "party": "PAS" }]
```

**Impact:** Representative records become tiny. Lookups are cached/shared across all views.

---

### Strategy 4: Pagination via Static Chunks

Pre-split into fixed-size page files at build time.

```
public/data/2023/
├── meta.json                  → { "totalPages": 12, "pageSize": 50 }
├── page_1.json                → first 50 records
├── page_2.json                → next 50 records
└── ...
```

**Impact:** Supports infinite scroll / pagination without loading everything upfront.

---

### Strategy 5: HTTP Compression (Free Win — Already Active)

GitHub Pages serves gzip automatically. A 200KB JSON file is typically ~30-40KB over the wire. No code changes needed — just be aware that "file size on disk" ≠ "bytes transferred".

---

### Recommended Progression

| Stage | Trigger | Action |
|---|---|---|
| Now | 2 years, ~400 reps | Current setup is fine (gzip keeps it small) |
| Medium | 5+ years or 1000+ reps | Add **split by state** within each year |
| Later | Complex profiles with lots of fields | Add **index + detail** pattern |
| Much later | Full nationwide multi-decade dataset | Combine all strategies + search index |

---

## Part 2 — Client-Side Search / Database Options

### Option A: Fuse.js (Fuzzy Search at Runtime)

- **Size:** ~5KB gzipped
- **How:** Load full JSON, Fuse.js builds index in-memory at runtime
- **Best for:** <5,000 records, simple substring/fuzzy matching
- **Tradeoff:** Must load all data upfront; indexing happens on every page load

```js
import Fuse from 'fuse.js'
const fuse = new Fuse(allRecords, {
  keys: ['name', 'party', 'state', 'federalSeatName', 'pollingDistricts'],
  threshold: 0.3
})
const results = fuse.search('wan romani')
```

---

### Option B: MiniSearch (Pre-Built Search Index)

- **Size:** ~6KB gzipped
- **How:** Build search index at build time → ship as `search-index.json`
- **Best for:** Fast full-text search without runtime indexing cost
- **Tradeoff:** Need a build step to generate the index; slightly more complex pipeline

```
Build time:
  XLSX → JSON → generate-search-index.js → search-index.json

Runtime:
  fetch('search-index.json') → MiniSearch.loadJSON() → instant queries
```

```js
import MiniSearch from 'minisearch'
// At build time:
const ms = new MiniSearch({ fields: ['name', 'party', 'state', 'federalSeatName'] })
ms.addAll(allRecords)
writeFileSync('search-index.json', JSON.stringify(ms))

// At runtime:
const ms = MiniSearch.loadJSON(indexJson, { fields: [...] })
const results = ms.search('pokok sena')
```

---

### Option C: sql.js (SQLite in the Browser via WebAssembly)

- **Size:** ~400KB WASM runtime (cached after first load) + `.sqlite` file
- **How:** Ship a pre-built SQLite database; query with real SQL client-side
- **Best for:** Complex queries, JOINs, full-text search (FTS5), very large datasets
- **Tradeoff:** Larger initial download; more complex build pipeline

```js
import initSqlJs from 'sql.js'
const SQL = await initSqlJs({ locateFile: f => `/wasm/${f}` })
const buf = await fetch('/data/representatives.db').then(r => r.arrayBuffer())
const db = new SQL.Database(new Uint8Array(buf))

const results = db.exec(`
  SELECT * FROM representatives 
  WHERE name LIKE '%Wan%' AND state = 'Kedah'
`)
```

**Build pipeline change:** `XLSX → SQLite (.db file)` instead of `XLSX → JSON`

---

### Option D: IndexedDB + Dexie.js (Persistent Client Cache)

- **Size:** ~20KB library
- **How:** Fetch JSON once, store in browser's IndexedDB. Return visits query locally.
- **Best for:** Offline support, repeat visitors, reducing redundant fetches
- **Tradeoff:** First visit still requires full data download; adds cache management logic

```js
import Dexie from 'dexie'
const db = new Dexie('whoadunit')
db.version(1).stores({
  representatives: '++id, name, party, state, federalSeatCode, type, electedYear'
})

// First visit: populate from JSON
// Return visits: query directly
const results = await db.representatives
  .where('state').equals('Kedah')
  .and(r => r.party === 'PAS')
  .toArray()
```

---

### Option E: Hybrid (Recommended for This Project)

Combine a pre-built search index with tiered file loading:

```
public/data/
├── search-index.json          ← MiniSearch pre-built (~30KB gzipped)
├── index_2023.json            ← lightweight listing fields only
├── index_2022.json
├── seats/
│   ├── P001.json              ← full detail, loaded on demand
│   ├── P002.json
│   └── ...
└── manifest.json
```

**User flow:**
1. Page load → fetch `search-index.json` (small, pre-built)
2. User searches → MiniSearch returns matching seat codes instantly
3. Directory page → fetch `index_2023.json` (just display fields)
4. User clicks profile → fetch `seats/P008.json` (full detail on demand)

---

### Comparison Table

| Approach | Lib Size | Index Speed | Offline? | Complexity | Best For |
|---|---|---|---|---|---|
| Fuse.js | 5KB | Runtime | With SW | Low | Small datasets, quick wins |
| MiniSearch | 6KB | Pre-built | With SW | Medium | Fast search, growing data |
| sql.js | 400KB | Pre-built | With SW | High | Complex queries, huge data |
| Dexie/IndexedDB | 20KB | Runtime | ✅ Native | Medium | Offline-first, repeat users |
| **Hybrid** | 6KB + split | Pre-built | With SW | Medium | **This project's sweet spot** |

---

## Decision Record

**Current choice:** Keep current simple approach (per-year JSON, in-memory search).

**When to revisit:**
- When total JSON exceeds ~500KB raw (likely at 5+ election years)
- When search performance noticeably degrades (likely >3,000 records being scanned)
- When adding offline/PWA support

**Likely next step:** Add MiniSearch with a pre-built index (low effort, big search improvement), then split by state if file sizes grow.
