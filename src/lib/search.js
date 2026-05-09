/**
 * Search primitives for Whoadunit, per data/md/Search Feature Design.md.
 *
 * - Group Search:      seats matched by any field on the seat, its MP, or any ADUN.
 * - Individual Search: seats whose MP or ADUNs satisfy filters AND optional text query;
 *                      result still grouped by seat (each card shows only matching people).
 *
 * Composite key for an ADUN is `federalSeatCode + stateSeatCode` because state seat
 * codes (N01, N02 …) restart per state.
 */

const lower = (v) => (v == null ? '' : String(v).toLowerCase())

export function matchesPerson(person, q) {
  if (!person) return false
  if (!q) return true
  return (
    lower(person.name).includes(q) ||
    lower(person.party).includes(q) ||
    lower(person.stateSeatName).includes(q) ||
    lower(person.stateSeatCode).includes(q) ||
    (person.pollingDistricts || []).some((d) => lower(d).includes(q))
  )
}

/**
 * @returns {{matched: boolean, matchedIn: 'seat'|'mp'|'adun'|null, matchedAdunIndices: number[]}}
 */
export function matchesSeat(seat, query) {
  const q = lower(query).trim()
  if (!q) return { matched: true, matchedIn: null, matchedAdunIndices: [] }

  const seatHit =
    lower(seat.federalSeatCode).includes(q) ||
    lower(seat.federalSeatName).includes(q) ||
    lower(seat.state).includes(q)

  const mpHit = seat.mp ? matchesPerson(seat.mp, q) : false

  const matchedAdunIndices = []
  ;(seat.aduns || []).forEach((a, i) => {
    if (matchesPerson(a, q)) matchedAdunIndices.push(i)
  })

  const matched = seatHit || mpHit || matchedAdunIndices.length > 0
  let matchedIn = null
  if (matched) {
    if (seatHit) matchedIn = 'seat'
    else if (mpHit) matchedIn = 'mp'
    else matchedIn = 'adun'
  }

  return { matched, matchedIn, matchedAdunIndices }
}

export function groupSearch(seats, query) {
  return seats
    .map((seat) => ({ seat, ...matchesSeat(seat, query) }))
    .filter((r) => r.matched)
}

function personMatchesFilters(person, filters) {
  if (!person) return false
  if (filters.electedYear != null && person.electedYear !== filters.electedYear) return false
  if (filters.party && person.party !== filters.party) return false
  if (filters.gender && person.gender !== filters.gender) return false
  return true
}

/**
 * Individual Search: keep only seats containing at least one person who matches
 * BOTH the filters and the text query. Result entries carry which side(s)
 * matched so the seat card can hide the irrelevant tab and prefill the count.
 */
export function individualSearch(seats, query, filters = {}) {
  const q = lower(query).trim()
  const typeFilter = filters.type // 'MP' | 'ADUN' | undefined

  const passes = (person) =>
    person &&
    personMatchesFilters(person, filters) &&
    matchesPerson(person, q)

  return seats
    .map((seat) => {
      const mpMatch = (!typeFilter || typeFilter === 'MP') && passes(seat.mp)

      const adunMatchIdx = []
      if (!typeFilter || typeFilter === 'ADUN') {
        ;(seat.aduns || []).forEach((a, i) => {
          if (passes(a)) adunMatchIdx.push(i)
        })
      }

      const matched = !!mpMatch || adunMatchIdx.length > 0
      const matchedIn = mpMatch && adunMatchIdx.length === 0
        ? 'mp'
        : !mpMatch && adunMatchIdx.length > 0
          ? 'adun'
          : mpMatch
            ? 'mp'
            : null

      return {
        seat,
        matched,
        matchedIn,
        mpMatched: !!mpMatch,
        matchedAdunIndices: adunMatchIdx,
      }
    })
    .filter((r) => r.matched)
}

/* ── Filter option derivation (dynamic from data) ────────────── */
export function deriveFilterOptions(flatList) {
  const years = [...new Set(flatList.map((p) => p.electedYear).filter(Boolean))].sort()
  const parties = [...new Set(flatList.map((p) => p.party).filter(Boolean))].sort()
  return {
    years,
    parties,
    genders: [
      { value: 'M', label: 'Male' },
      { value: 'F', label: 'Female' },
    ],
  }
}
