# Data Schema

`public/data/representatives.json` is the single source of truth consumed by the web app.

It is an **array of federal-seat objects**, each containing the winning MP and all ADUNs that fall under that federal constituency.

---

## Top-level seat object

| Field | Type | Description |
|---|---|---|
| `federalSeatCode` | `string` | Parliament constituency code, e.g. `P001` |
| `federalSeatName` | `string` | Parliament constituency name, e.g. `Padang Besar` |
| `state` | `string` | Malaysian state / federal territory name |
| `mp` | `object \| null` | The winning MP record (see below), or `null` if not yet filled |
| `aduns` | `array` | Zero or more ADUN records for state seats that fall under this federal seat |

---

## MP record (`mp` field)

An MP represents the entire federal constituency but the source data (GE15 2022) stores **one representative state seat** — the state seat whose polling districts the EC associates with that MP row.  The full list of state seats under that federal constituency is found by looking at all matching `aduns` entries.

| Field | Type | Description |
|---|---|---|
| `electedYear` | `number \| null` | Election year, e.g. `2022` |
| `stateSeatCode` | `string` | One representative state seat code (may be blank for Federal Territories) |
| `stateSeatName` | `string` | One representative state seat name (may be blank for Federal Territories) |
| `pollingDistricts` | `string[]` | Polling districts for the representative state seat |
| `name` | `string` | Representative's full name |
| `party` | `string` | Political party abbreviation, e.g. `PAS`, `PKR`, `DAP` |
| `gender` | `"M" \| "F" \| ""` | `M` = male, `F` = female |
| `address` | `string` | Office / constituency address |
| `email` | `string[]` | Email addresses |
| `phoneNumber` | `string[]` | Phone numbers |
| `facebook` | `string[]` | Facebook handles or URLs |
| `twitter` | `string[]` | Twitter / 𝕏 handles |

---

## ADUN record (items in `aduns` array)

ADUNs are elected in separate state elections (e.g. 2023). Each ADUN record maps to exactly **one** state constituency (`stateSeatCode`) that sits within the parent federal seat.

A typical federal seat contains **2–5 ADUNs**. Federal Territory seats have **zero** ADUNs.

| Field | Type | Description |
|---|---|---|
| `electedYear` | `number \| null` | Election year, e.g. `2023` |
| `stateSeatCode` | `string` | State constituency code, e.g. `N01` |
| `stateSeatName` | `string` | State constituency name |
| `pollingDistricts` | `string[]` | Polling districts for this state seat only |
| `name` | `string` | Representative's full name |
| `party` | `string` | Political party abbreviation |
| `gender` | `"M" \| "F" \| ""` | `M` = male, `F` = female |
| `address` | `string` | Office / constituency address |
| `email` | `string[]` | Email addresses |
| `phoneNumber` | `string[]` | Phone numbers |
| `facebook` | `string[]` | Facebook handles or URLs |
| `twitter` | `string[]` | Twitter / 𝕏 handles |

---

## Important: `stateSeatCode` is **not globally unique**

State seat codes (N01, N02 …) restart from N01 for every state.  
**Kelantan N01 ≠ Kedah N01.**

The globally unique key for an ADUN is the combination of **`federalSeatCode` + `stateSeatCode`** (or equivalently `state` + `stateSeatCode`).

---

## Federal Territories

Kuala Lumpur, Putrajaya, and Labuan have MPs but **no state assembly** — `aduns` will be `[]` and the MP's `stateSeatCode` / `stateSeatName` will be empty strings.

---

## Sample record

```json
{
  "federalSeatCode": "P001",
  "federalSeatName": "Padang Besar",
  "state": "Perlis",
  "mp": {
    "electedYear": 2022,
    "stateSeatCode": "N01",
    "stateSeatName": "Titi Tinggi",
    "pollingDistricts": [
      "Jalan Padang Besar", "Titi Tinggi", "FELDA Mata Ayer",
      "Kampong Kastam", "Padang Besar", "FELDA Rimba Mas", "Lubok Sireh"
    ],
    "name": "Rusydan Rusmi",
    "party": "PAS",
    "gender": "M",
    "address": "",
    "email": [],
    "phoneNumber": [],
    "facebook": [],
    "twitter": []
  },
  "aduns": [
    {
      "electedYear": 2023,
      "stateSeatCode": "N01",
      "stateSeatName": "Titi Tinggi",
      "pollingDistricts": ["Jalan Padang Besar", "Titi Tinggi", "FELDA Mata Ayer"],
      "name": "ADUN Name Here",
      "party": "PAS",
      "gender": "M",
      "address": "",
      "email": [],
      "phoneNumber": [],
      "facebook": [],
      "twitter": []
    },
    {
      "electedYear": 2023,
      "stateSeatCode": "N02",
      "stateSeatName": "Santan",
      "pollingDistricts": ["..."],
      "name": "Another ADUN",
      "party": "PAS",
      "gender": "M",
      "address": "",
      "email": [],
      "phoneNumber": [],
      "facebook": [],
      "twitter": []
    }
  ]
}
```

---

## Flat view (used by `useRepresentatives`)

`useRepresentatives()` flattens the grouped structure into a single array. Each item gets a `type` field and inherits `federalSeatCode`, `federalSeatName`, and `state` from the parent:

| `type` | Source | Unique key |
|---|---|---|
| `"MP"` | `seat.mp` | `federalSeatCode` |
| `"ADUN"` | `seat.aduns[i]` | `federalSeatCode` + `stateSeatCode` |

---

## Why this structure?

- **One MP per federal seat.** Malaysia's 222 Parliament seats each have exactly one elected MP (GE15 2022).
- **Multiple ADUNs per federal seat.** Each federal constituency contains several state constituencies, each with its own ADUN (state elections 2023). A typical seat covers 2–5 state seats.
- **Federal Territories** (Kuala Lumpur, Putrajaya, Labuan) have MPs but no ADUNs — `aduns` will be `[]`.
- **State seat codes restart per state** — they are only unique within a state, not globally.
- **Grouping by `federalSeatCode`** makes it trivial to display "MP + their local ADUNs" on a single profile page without any joins.
- **Separate election years** — MPs elected GE15 (Nov 2022), ADUNs elected in state elections (Mar/Aug 2023). Both years coexist in a single document per seat.
