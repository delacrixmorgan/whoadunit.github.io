# Data Scripts

Three scripts manage the representative data pipeline:

```
data/xlsx/representative_base.xlsx   ← single source of truth (2 sheets: MP + ADUN)
        ↑ written by mw-to-xlsx.cjs
        ↓ read by convert-xlsx-to-json.cjs
public/data/representatives.json     ← consumed by the web app
```

---

## Scripts

### 1. `create-base-xlsx.cjs` — generate the blank template

Creates (or regenerates) `data/xlsx/representative_base.xlsx` with two empty sheets.

```bash
node data/scripts/create-base-xlsx.cjs
```

Only needed once (or to reset the template).

---

### 2. `mw-to-xlsx.cjs` — import MediaWiki election results

Parses a `data/mw/results_YEAR.mw` file and writes a per-year XLSX:

```bash
node data/scripts/mw-to-xlsx.cjs 2022   # → data/xlsx/representative_2022.xlsx  (MP rows)
node data/scripts/mw-to-xlsx.cjs 2023   # → data/xlsx/representative_2023.xlsx  (ADUN rows)
```

The per-year files are intermediate artefacts. Manually review them, then copy the rows into the appropriate sheet of `representative_base.xlsx`.

---

### 3. `convert-xlsx-to-json.cjs` — convert to JSON

Reads `data/xlsx/representative_base.xlsx` and writes the final JSON:

```bash
node data/scripts/convert-xlsx-to-json.cjs
# or
npm run data:convert
```

Output: `public/data/representatives.json`

---

## `representative_base.xlsx` sheet layout

Both sheets share the same column headers:

| Column | Description |
|---|---|
| `electedYear` | Election year, e.g. `2022` or `2023` |
| `state` | Malaysian state name |
| `federalSeatCode` | Parliament constituency code (e.g. `P.001`) |
| `federalSeatName` | Parliament constituency name |
| `stateSeatCode` | State constituency code (e.g. `N.01`); blank for Federal Territory MPs |
| `stateSeatName` | State constituency name; blank for Federal Territory MPs |
| `pollingDistricts` | Semicolon-separated list of polling districts |
| `name` | Representative's full name |
| `party` | Political party abbreviation |
| `gender` | `male` / `female` (normalised to `M` / `F` on export) |
| `address` | Office or constituency address |
| `email` | Semicolon-separated email addresses |
| `phoneNumber` | Semicolon-separated phone numbers |
| `facebook` | Semicolon-separated Facebook handles or URLs |
| `twitter/𝕏` | Semicolon-separated Twitter/X handles |

**Sheet "MP"** — one row per federal (Parliament) seat winner.  
**Sheet "ADUN"** — one row per state assembly seat winner.

The `type` column is gone — it is implied by the sheet name.

---

## Output JSON structure

`representatives.json` is an array of federal-seat objects:

```json
[
  {
    "federalSeatCode": "P001",
    "federalSeatName": "Padang Besar",
    "state": "Perlis",
    "mp": { "electedYear": 2022, "name": "...", "party": "...", ... },
    "aduns": [
      { "electedYear": 2023, "stateSeatCode": "N01", "name": "...", ... }
    ]
  }
]
```

See [`data/md/DATA_SCHEMA.md`](../md/DATA_SCHEMA.md) for the full field reference.

---

## Field transformations (`convert-xlsx-to-json.cjs`)

| Transformation | Input | Output |
|---|---|---|
| `normalizeCode` — strips the dot | `P.001`, `N.01` | `P001`, `N01` |
| `normalizeGender` — maps to single letter | `male`, `Female` | `M`, `F` |
| `splitList` — splits semicolons into arrays | `Dist1;Dist2` | `["Dist1","Dist2"]` |

---

## Adding a new election year

1. Place the MediaWiki file at `data/mw/results_YEAR.mw`.
2. Run the importer: `node data/scripts/mw-to-xlsx.cjs YEAR`
3. Review `data/xlsx/representative_YEAR.xlsx`.
4. Copy the rows into the correct sheet of `data/xlsx/representative_base.xlsx`.
5. Run `npm run data:convert` to regenerate `public/data/representatives.json`.
6. Commit the updated `representative_base.xlsx` and `representatives.json`.
