# Search Feature Design

This document defines the architecture and behaviour of the search feature for the Malaysian representatives web app. It covers two distinct search modes derived from the hierarchical data structure in `public/data/representatives.json`.

---

## Overview

The data is hierarchical: each **federal seat** contains one **MP** and zero-or-more **ADUNs**. Because of this, search results should always preserve that relationship — you never want to show an ADUN without knowing who their MP is, and vice versa.

Two search modes exist to serve different user intents:

| Mode | User intent | Result unit |
|---|---|---|
| **Group Search** | "Who represents my area?" | Federal seat card (MP + ADUNs together) |
| **Individual Search** | "Find representatives matching criteria" | Single person per row (MP or ADUN) |

---

## Mode 1 — Group Search (Constituency Lookup)

### Purpose

Help a user find their constituency by typing any piece of information they know: a place name, a seat code, a representative's name, a polling district, etc.

### Input

- A single **free-text query string** (no filters)

### Matching logic

Search is performed at the **federal seat level**. A seat is included in results if the query matches **any** of the following fields:

| Source | Fields searched |
|---|---|
| Federal seat | `federalSeatCode`, `federalSeatName`, `state` |
| MP | `name`, `party`, `stateSeatName`, `pollingDistricts[]` |
| Any ADUN | `name`, `party`, `stateSeatCode`, `stateSeatName`, `pollingDistricts[]` |

All comparisons are **case-insensitive substring matches**.

#### Pseudocode

```ts
function matchesSeat(seat: FederalSeat, query: string): boolean {
  const q = query.toLowerCase();

  // Federal seat fields
  if (seat.federalSeatCode.toLowerCase().includes(q)) return true;
  if (seat.federalSeatName.toLowerCase().includes(q)) return true;
  if (seat.state.toLowerCase().includes(q)) return true;

  // MP fields
  if (seat.mp && matchesPerson(seat.mp, q)) return true;

  // ADUN fields
  return seat.aduns.some(adun => matchesPerson(adun, q));
}

function matchesPerson(person: MP | ADUN, q: string): boolean {
  return (
    person.name.toLowerCase().includes(q) ||
    person.party.toLowerCase().includes(q) ||
    person.stateSeatName.toLowerCase().includes(q) ||
    person.stateSeatCode.toLowerCase().includes(q) ||
    person.pollingDistricts.some(d => d.toLowerCase().includes(q))
  );
}

const results: FederalSeat[] = allSeats.filter(seat => matchesSeat(seat, query));
```

### Result structure

The result is a **list of federal seat objects** — the same shape as the raw data. No flattening is needed; the full grouped structure is preserved.

```ts
type GroupSearchResult = FederalSeat[]; // each with .mp and .aduns intact
```

### Result card UI

Each result renders as a **federal seat card** with two tabs:

```
┌────────────────────────────────────────┐
│ P001  Padang Besar  ·  Perlis          │
│ ┌──────────┬────────────────┐          │
│ │   MP     │  ADUN (2)      │ ← tabs  │
│ └──────────┴────────────────┘          │
│                                        │
│  [active tab content here]             │
└────────────────────────────────────────┘
```

- **MP tab** — shows the single MP's details (name, party, contact info, etc.)
- **ADUN tab** — shows a list of all ADUNs under that federal seat
- The ADUN tab badge shows the count, e.g. `ADUN (3)`
- **Federal Territory seats** (KL, Putrajaya, Labuan) have no ADUNs — the ADUN tab is hidden or shows a "No state assembly" note

### Smart tab defaulting

When a result card is rendered, the default active tab is determined by where the match occurred:

| Match source | Default tab |
|---|---|
| `federalSeatCode`, `federalSeatName`, `state` | MP (first tab by default) |
| MP fields | MP tab |
| ADUN fields | ADUN tab |

If both MP and ADUN matched, default to MP tab.

### Track match origin (optional enhancement)

For smart defaulting and text highlighting, the search function can return richer metadata:

```ts
type GroupSearchResult = {
  seat: FederalSeat;
  matchedIn: 'seat' | 'mp' | 'adun';
  matchedAdunIndices: number[]; // indices into seat.aduns that matched
};
```

---

## Mode 2 — Individual Search (Representative Finder)

### Purpose

Allow a user to browse or filter representatives as individuals — useful for questions like "show me all female PKR MPs" or "list all ADUNs elected in 2023 from PAS".

### Input

- An optional **free-text query string** (same per-person match as above)
- One or more **filter values**:
  - `electedYear` — e.g. `2022`, `2023`
  - `party` — e.g. `PAS`, `DAP`, `PKR`
  - `gender` — `"M"`, `"F"`

### Data source

Operate on the **flattened list** (as produced by `useRepresentatives()`). Each item has a `type` field (`"MP"` or `"ADUN"`) and inherits `federalSeatCode`, `federalSeatName`, and `state` from the parent seat.

```ts
type FlatRepresentative = (MP | ADUN) & {
  type: 'MP' | 'ADUN';
  federalSeatCode: string;
  federalSeatName: string;
  state: string;
};
```

### Matching logic

Each person in the flat list is independently evaluated. A person is included if they satisfy **all active filters** AND (if a text query is provided) match the text search.

```ts
function matchesFilters(
  person: FlatRepresentative,
  filters: { electedYear?: number; party?: string; gender?: string }
): boolean {
  if (filters.electedYear != null && person.electedYear !== filters.electedYear) return false;
  if (filters.party && person.party !== filters.party) return false;
  if (filters.gender && person.gender !== filters.gender) return false;
  return true;
}

const results = flatList.filter(person =>
  matchesFilters(person, activeFilters) &&
  (!query || matchesPerson(person, query.toLowerCase()))
);
```

### Result structure

A **flat array of individual representative objects**, each tagged with their `type`:

```ts
type IndividualSearchResult = FlatRepresentative[];
```

### Result card UI

Each result is a compact **person row** showing their type, name, party, seat, and election year:

```
┌───────────────────────────────────────────┐
│ [MP]   Rusydan Rusmi                      │
│        PAS · P001 Padang Besar · Perlis   │
│        Elected 2022                       │
└───────────────────────────────────────────┘
┌───────────────────────────────────────────┐
│ [ADUN] Some Name                          │
│        PKR · N03 Derma · P002 Kangar      │
│        Elected 2023                       │
└───────────────────────────────────────────┘
```

- Tapping/clicking a row can navigate to the full federal seat page (using `federalSeatCode`)
- The `[MP]` / `[ADUN]` badge distinguishes the representative type

### Available filter values

Filter options are **derived dynamically** from the dataset so they stay in sync with the data:

```ts
// Unique election years across all representatives
const years = [...new Set(flatList.map(p => p.electedYear).filter(Boolean))].sort();

// Unique parties
const parties = [...new Set(flatList.map(p => p.party).filter(Boolean))].sort();

// Gender options (fixed)
const genders = [{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }];
```

---

## Mode Switching

The two modes serve different user intents and should be surfaced clearly in the UI.

### Recommended UX: Tab/Toggle at the top of the search page

```
┌──────────────────────────────────────────────┐
│  [ By Constituency ]  [ By Representative ]  │
└──────────────────────────────────────────────┘
```

- **By Constituency** → Group Search mode (no filter UI shown)
- **By Representative** → Individual Search mode (filter UI shown: year, party, gender)
- Both modes share the same text search input
- Switching modes resets results but preserves the current query

### Alternative: Auto-switch

If filters are activated, automatically switch to Individual mode. If all filters are cleared and no text is entered, revert to Group mode. This is more seamless but less explicit — use with caution.

---

## Edge Cases

| Case | Handling |
|---|---|
| Federal Territory (no ADUNs) | In Group Search: hide or disable ADUN tab. In Individual Search: MP record appears normally, no ADUN records exist for that seat. |
| `mp` is `null` | Skip MP matching; seat can still appear via ADUN match. In UI, show "MP data not yet available" on the MP tab. |
| Empty query + no filters | Show all results (or a prompt to start searching — avoid rendering all 222 seats at once). |
| `stateSeatCode` uniqueness | State seat codes are NOT globally unique (N01 restarts per state). Always use `federalSeatCode + stateSeatCode` as the composite key for ADUNs. |
| Multiple filter values (e.g. multi-select party) | Extend filters to support arrays: `party?: string[]`. A person matches if their party is in the array. |

---

## Summary

```
User types query / applies filters
          │
          ▼
   Which mode is active?
    ┌──────────────────────┐
    │                      │
 Group Search       Individual Search
    │                      │
 Filter seats         Filter persons
 by full seat         individually
 text match           (flat list)
    │                      │
 Return List<FederalSeat>  Return List<FlatRepresentative>
    │                      │
 Render as cards      Render as rows
 with MP/ADUN tabs    with type badge
```
