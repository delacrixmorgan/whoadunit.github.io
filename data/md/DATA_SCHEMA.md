# Data schema — representative record

Each entry in `public/data/representatives_YEAR.json` represents one elected representative.

## Fields

| Field | Type | Description | Example |
|---|---|---|---|
| `federalSeatCode` | String | Parliament constituency code | `"P001"` |
| `federalSeatName` | String | Parliament constituency name | `"Padang Besar"` |
| `stateSeatCode` | String | State constituency code; blank for federal-only records | `"N01"` |
| `stateSeatName` | String | State constituency name; blank for federal-only records | `"Sungai Baru"` |
| `type` | String | `"MP"` for federal parliament seats, `"ADUN"` for state assembly seats | `"MP"` |
| `name` | String | Representative's full name | `"Rusydan Rusmi"` |
| `party` | String | Political party abbreviation | `"PAS"` |
| `state` | String | Malaysian state | `"Perlis"` |
| `gender` | String | `"M"` or `"F"`; blank if unknown | `"M"` |
| `electedYear` | Int | Year of the general election | `2022` |
| `address` | String | Office or constituency address; blank if unknown | `"No. 1, Jalan Utama..."` |
| `email` | List\<String\> | Contact email addresses | `["rep@parlimen.gov.my"]` |
| `phoneNumber` | List\<String\> | Contact phone numbers | `["+60 4-976 1234"]` |
| `facebook` | List\<String\> | Facebook handles or profile URLs | `["rusydanrusmi"]` |
| `twitter` | List\<String\> | Twitter/X handles | `["@rusydan"]` |

## Conventions

- **Unknown / unpopulated fields**: use an empty string `""` for String fields and an empty array `[]` for List fields.
- **`type` values**: only `"MP"` and `"ADUN"` are valid.
- **`electedYear`**: integer, not a string.
- **Contact arrays**: a representative may have multiple phone numbers, emails, or social accounts — store each as a separate element in the array.

## Sample record

```json
{
  "federalSeatCode": "P001",
  "federalSeatName": "Padang Besar",
  "stateSeatCode": "",
  "stateSeatName": "",
  "type": "MP",
  "name": "Rusydan Rusmi",
  "party": "PAS",
  "state": "Perlis",
  "gender": "M",
  "electedYear": 2022,
  "address": "",
  "email": [],
  "phoneNumber": [],
  "facebook": [],
  "twitter": []
}
```

## Data files

| File | Description |
|---|---|
| `public/data/representatives_YEAR.json` | Representative records for a given election year |
| `public/data/representatives-manifest.json` | List of available election years |
