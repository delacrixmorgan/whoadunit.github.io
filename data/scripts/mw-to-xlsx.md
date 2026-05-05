# mw-to-xlsx.cjs

Converts a MediaWiki election-results wikitext file (`results_YEAR.mw`) into a `representative_YEAR.xlsx` spreadsheet, ready to be processed by `convert-xlsx-to-json.cjs`.

---

## Prerequisites

- **Node.js** (v18+)
- **`xlsx` package** — already listed as a project dependency; run `npm install` from the repo root if you haven't already.

---

## Input files

| File | Location | Description |
|---|---|---|
| `results_YEAR.mw` | `data/mw/` | MediaWiki wikitext of election results (winners per seat) |
| `electoral_district.mw` | `data/mw/` | MediaWiki wikitext mapping federal ↔ state seats and polling districts |

The `electoral_district.mw` is always required regardless of the year being generated.

---

## Usage

```bash
node data/scripts/mw-to-xlsx.cjs <YEAR>
```

### Examples

```bash
# Generate the 2022 federal election spreadsheet
node data/scripts/mw-to-xlsx.cjs 2022

# Generate the 2023 state election spreadsheet
node data/scripts/mw-to-xlsx.cjs 2023
```

---

## Output

| Detail | Value |
|---|---|
| Output directory | `data/xlsx/` |
| File naming | `representative_YEAR.xlsx` |

The generated `.xlsx` file can then be converted to JSON using:

```bash
npm run data:convert
```

---

## What the script does

### 1. Parse `electoral_district.mw`

Builds a lookup map of all federal constituencies (`P.001` – `P.222`) and their nested state seats (`N.01` etc.), including the **polling districts** list for each state seat.

### 2. Parse `results_YEAR.mw`

Extracts the **winning candidate** for each seat from the election-results wikitext:
- The state name comes from `== State ==` section headers.
- The seat code and name come from `rowspan` table cells.
- The winner name and party come from the `bgcolor` winner row.
- Party is parsed from coalition notation: `(PN–PAS)` → `PAS`, `(PH–PKR)` → `PKR`.
- Seats with no winner name are **skipped** (rule: no name → no row).

### 3. Determine seat type

| Code prefix | Type |
|---|---|
| `P` (e.g. `P001`) | `MP` (federal parliament seat) |
| `N` (e.g. `N01`) | `ADUN` (state assembly seat) |

### 4. Enrich with electoral district data

- For **MP** rows: `federalSeatCode` and `federalSeatName` come directly from the seat.
- For **ADUN** rows: the script looks up the parent federal seat from `electoral_district.mw` and fills `federalSeatCode`, `federalSeatName`, and `pollingDistricts`.

### 5. Guess gender

When no gender is available in the source data, the script applies a name-based heuristic:

- Checks for known female name tokens (e.g. `Siti`, `Nor`, `Nurul`, `Hafidzah`, `Rohani`, `Mardhiyyah`).
- Checks for `binti` / `bt.` particles.
- Checks for common `-ah` / `-iyyah` feminine name endings.
- Defaults to **Male** if no female indicator is found.

> ⚠️ The gender field is a best-effort guess. Always verify and correct in the generated spreadsheet before committing.

---

## Generated columns

The output spreadsheet contains the same columns as `representative_base.xlsx`:

| Column | Notes |
|---|---|
| `state` | Malaysian state name |
| `federalSeatCode` | e.g. `P.001` |
| `federalSeatName` | e.g. `Padang Besar` |
| `stateSeatCode` | e.g. `N.01`; blank for MP rows |
| `stateSeatName` | e.g. `Titi Tinggi`; blank for MP rows |
| `pollingDistricts` | Semicolon-separated; blank for MP rows |
| `type` | `MP` or `ADUN` |
| `name` | Winner's full name |
| `party` | Party abbreviation (e.g. `PAS`, `PKR`, `UMNO`) |
| `gender` | `Male` or `Female` (guessed) |
| `address` | Blank — fill in manually |
| `email` | Blank — fill in manually |
| `phoneNumber` | Blank — fill in manually |
| `facebook` | Blank — fill in manually |
| `twitter/𝕏` | Blank — fill in manually |

---

## Adding a new election year

1. Export the Wikipedia election-results page as wikitext and save it as:
   ```
   data/mw/results_YEAR.mw
   ```
2. Run the generator:
   ```bash
   node data/scripts/mw-to-xlsx.cjs YEAR
   ```
3. Open `data/xlsx/representative_YEAR.xlsx` and review/correct:
   - Gender guesses
   - Any names that parsed incorrectly
   - Fill in `address`, `email`, `phoneNumber`, `facebook`, `twitter/𝕏` as available
4. Convert to JSON:
   ```bash
   npm run data:convert
   ```
5. Update `public/data/representatives-manifest.json` to include the new year.
6. Commit both the XLSX and the generated JSON.
