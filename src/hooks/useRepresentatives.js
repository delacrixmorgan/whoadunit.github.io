import { useState, useEffect } from 'react'

/**
 * Loads representatives from public/data/representatives.json.
 *
 * The JSON is an array of federal-seat objects shaped as:
 * {
 *   federalSeatCode: "P001",
 *   federalSeatName: "Padang Besar",
 *   state: "Perlis",
 *   mp: {
 *     electedYear: 2022,
 *     stateSeatCode: "N01",  // state seat the MP's polling districts belong to
 *     stateSeatName: "Titi Tinggi",
 *     pollingDistricts: [...],
 *     name, party, gender, address, email, phoneNumber, facebook, twitter
 *   },
 *   aduns: [
 *     {
 *       electedYear: 2023,
 *       stateSeatCode: "N01",
 *       stateSeatName: "Titi Tinggi",
 *       pollingDistricts: [...],
 *       name, party, gender, address, email, phoneNumber, facebook, twitter
 *     },
 *     ...
 *   ]
 * }
 *
 * This hook flattens the structure into a single array of representative
 * records (one per person) for backwards compatibility with pages that
 * iterate over a flat list.  Each record gets a `type` field ("MP" or "ADUN")
 * and carries the parent `federalSeatCode` / `federalSeatName` / `state`.
 */
export function useRepresentatives() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/representatives.json`)
        if (!res.ok) throw new Error('Failed to fetch representatives.json')
        const seats = await res.json()

        const flat = []
        for (const seat of seats) {
          const { federalSeatCode, federalSeatName, state } = seat

          // MP record
          if (seat.mp) {
            flat.push({
              type: 'MP',
              federalSeatCode,
              federalSeatName,
              state,
              ...seat.mp,
            })
          }

          // ADUN records
          for (const adun of seat.aduns ?? []) {
            flat.push({
              type: 'ADUN',
              federalSeatCode,
              federalSeatName,
              state,
              ...adun,
            })
          }
        }

        setData(flat)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { data, loading, error }
}

export function getContactCompleteness(rep) {
  const fields = ['email', 'phoneNumber', 'facebook', 'twitter']
  const filled = fields.filter((f) =>
    Array.isArray(rep[f]) ? rep[f].length > 0 : rep[f] && rep[f].trim() !== ''
  ).length
  return Math.round((filled / fields.length) * 100)
}

export function computeStats(data) {
  const total = data.length
  const mps = data.filter((r) => r.type === 'MP').length
  const aduns = data.filter((r) => r.type === 'ADUN').length

  // Party breakdown
  const partyMap = {}
  data.forEach((r) => {
    partyMap[r.party] = (partyMap[r.party] || 0) + 1
  })
  const parties = Object.entries(partyMap)
    .map(([party, count]) => ({ party, count }))
    .sort((a, b) => b.count - a.count)

  // Gender
  const male = data.filter((r) => r.gender === 'M').length
  const female = data.filter((r) => r.gender === 'F').length
  const unknownGender = total - male - female

  // State breakdown
  const stateMap = {}
  data.forEach((r) => {
    stateMap[r.state] = (stateMap[r.state] || 0) + 1
  })
  const states = Object.entries(stateMap)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)

  // Contact completeness
  const hasContact = (r, f) =>
    Array.isArray(r[f]) ? r[f].length > 0 : r[f] && r[f].trim()
  const withEmail    = data.filter((r) => hasContact(r, 'email')).length
  const withPhone    = data.filter((r) => hasContact(r, 'phoneNumber')).length
  const withFacebook = data.filter((r) => hasContact(r, 'facebook')).length
  const withTwitter  = data.filter((r) => hasContact(r, 'twitter')).length

  // Party reachability: average contact completeness per party
  const partyReachability = Object.entries(partyMap).map(([party, count]) => {
    const reps = data.filter((r) => r.party === party)
    const avgCompleteness = Math.round(
      reps.reduce((sum, r) => {
        const fields = ['email', 'phoneNumber', 'facebook', 'twitter']
        const filled = fields.filter((f) =>
          Array.isArray(r[f]) ? r[f].length > 0 : r[f] && r[f].trim() !== ''
        ).length
        return sum + (filled / fields.length) * 100
      }, 0) / reps.length
    )
    return { party, count, avgCompleteness }
  }).sort((a, b) => b.avgCompleteness - a.avgCompleteness || b.count - a.count)

  return {
    total, mps, aduns,
    partyCount: parties.length,
    stateCount: states.length,
    parties, states,
    partyReachability,
    gender: { male, female, unknown: unknownGender },
    contact: {
      email:    { count: withEmail,    pct: Math.round((withEmail    / total) * 100) },
      phone:    { count: withPhone,    pct: Math.round((withPhone    / total) * 100) },
      facebook: { count: withFacebook, pct: Math.round((withFacebook / total) * 100) },
      twitter:  { count: withTwitter,  pct: Math.round((withTwitter  / total) * 100) },
    },
  }
}
