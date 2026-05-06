import { useState, useEffect } from 'react'

/**
 * Loads representatives from per-year JSON files via the manifest.
 *
 * Manifest: public/data/representatives-manifest.json → [2023, 2022]
 * Year files: public/data/representatives_{year}.json → flat array of records
 *
 * Each record in a year file has: type ("MP"|"ADUN"), federalSeatCode,
 * federalSeatName, state, stateSeatCode, stateSeatName, pollingDistricts[],
 * name, party, gender, address, email[], phoneNumber[], facebook[], twitter[]
 *
 * This hook:
 *   1. Tags each record with electedYear (from the filename year)
 *   2. Groups records into hierarchical seat objects { federalSeatCode,
 *      federalSeatName, state, mp, aduns[] } — exposed as `seats`
 *   3. Flattens seats back to a single array — exposed as `data` (backward compat)
 */
export function useRepresentatives() {
  const [data, setData] = useState([])
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const BASE = import.meta.env.BASE_URL

        const years = await fetch(`${BASE}data/representatives-manifest.json`).then(r => {
          if (!r.ok) throw new Error('Failed to fetch representatives-manifest.json')
          return r.json()
        })

        const yearData = await Promise.all(
          years.map(async year => {
            const records = await fetch(`${BASE}data/representatives_${year}.json`).then(r => {
              if (!r.ok) throw new Error(`Failed to fetch representatives_${year}.json`)
              return r.json()
            })
            return records.map(r => ({ ...r, electedYear: year }))
          })
        )

        const allRecords = yearData.flat()

        // Group into hierarchical seat objects
        const seatsMap = {}
        for (const rec of allRecords) {
          const key = rec.federalSeatCode
          if (!seatsMap[key]) {
            seatsMap[key] = {
              federalSeatCode: key,
              federalSeatName: rec.federalSeatName,
              state: rec.state,
              mp: null,
              aduns: [],
            }
          }
          if (rec.type === 'MP') {
            seatsMap[key].mp = rec
          } else {
            seatsMap[key].aduns.push(rec)
          }
        }

        const seatList = Object.values(seatsMap).sort((a, b) =>
          a.federalSeatCode.localeCompare(b.federalSeatCode)
        )

        // Flat list preserves order: MP first, then ADUNs, per seat
        const flat = seatList.flatMap(s => [s.mp, ...s.aduns].filter(Boolean))

        setSeats(seatList)
        setData(flat)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { data, seats, loading, error }
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
  const partyReachability = Object.entries(partyMap).map(([party]) => {
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
    return { party, count: partyMap[party], avgCompleteness }
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
