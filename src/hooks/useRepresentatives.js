import { useState, useEffect } from 'react'

/**
 * Loads all representatives by:
 *  1. Fetching representatives-manifest.json  →  [2023, 2022, 2021, ...]
 *  2. Fetching each representatives_YYYY.json in parallel (newest-first order)
 *  3. Merging into a single list, deduplicating by seat:
 *       - MPs  keyed by federalSeatCode
 *       - ADUNs keyed by stateSeatCode
 *     Newer years take precedence; older entries for the same seat are skipped.
 */
export function useRepresentatives() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch manifest → sorted descending by the script, but sort again for safety
        const manifestRes = await fetch('./data/representatives-manifest.json')
        if (!manifestRes.ok) throw new Error('Failed to fetch manifest')
        const years = await manifestRes.json()
        const sortedYears = [...years].sort((a, b) => b - a)

        // 2. Fetch all year files in parallel
        const yearArrays = await Promise.all(
          sortedYears.map(async (year) => {
            const res = await fetch(`./data/representatives_${year}.json`)
            if (!res.ok) throw new Error(`Failed to fetch representatives_${year}.json`)
            return res.json()
          })
        )

        // 3. Merge: newest-first, deduplicate by seat key
        const seen = new Set()
        const merged = []

        for (const reps of yearArrays) {
          for (const rep of reps) {
            // Build a unique key per seat
            const key =
              rep.type === 'MP'
                ? `MP:${rep.federalSeatCode}`
                : `ADUN:${rep.stateSeatCode}`

            if (!seen.has(key)) {
              seen.add(key)
              merged.push(rep)
            }
          }
        }

        setData(merged)
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
  const filled = fields.filter((f) => rep[f] && rep[f].trim() !== '').length
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
  const withEmail = data.filter((r) => r.email && r.email.trim()).length
  const withPhone = data.filter((r) => r.phoneNumber && r.phoneNumber.trim()).length
  const withFacebook = data.filter((r) => r.facebook && r.facebook.trim()).length
  const withTwitter = data.filter((r) => r.twitter && r.twitter.trim()).length

  // Party reachability: average contact completeness per party
  const partyReachability = Object.entries(partyMap).map(([party, count]) => {
    const reps = data.filter(r => r.party === party)
    const avgCompleteness = Math.round(
      reps.reduce((sum, r) => {
        const fields = ['email', 'phoneNumber', 'facebook', 'twitter']
        const filled = fields.filter(f => r[f] && r[f].trim() !== '').length
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
      email: { count: withEmail, pct: Math.round((withEmail / total) * 100) },
      phone: { count: withPhone, pct: Math.round((withPhone / total) * 100) },
      facebook: { count: withFacebook, pct: Math.round((withFacebook / total) * 100) },
      twitter: { count: withTwitter, pct: Math.round((withTwitter / total) * 100) },
    },
  }
}
