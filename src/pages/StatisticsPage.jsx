import { useState, useMemo } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useRepresentatives, computeStats } from '../hooks/useRepresentatives'
import { t } from '../i18n'

const PARTY_COLORS = {
  PKR: '#c0392b', DAP: '#1a5276', Amanah: '#1e8449', UMNO: '#d4ac0d',
  BERSATU: '#1a5276', PAS: '#196f3d', MCA: '#c0392b', MIC: '#7d3c98',
  GPS: '#1a6b8a', GRS: '#117a65', default: '#5d6d7e',
}
function getPartyColor(p) { return PARTY_COLORS[p] || PARTY_COLORS.default }

const GENDER_COLORS = ['#5b8db8', '#b85b8d', '#8b8b8b']
const TYPE_COLORS = ['oklch(38% 0.12 155)', 'oklch(42% 0.09 200)']

const selectStyle = {
  background: 'var(--md-sys-color-surface-container)',
  border: '1px solid var(--md-sys-color-outline-variant)',
  borderRadius: '8px',
  color: 'var(--md-sys-color-on-surface)',
  padding: '8px 36px 8px 14px',
  fontSize: '0.88rem',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  minHeight: '38px',
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={{ fontSize: 'var(--text-lg)', margin: '0 0 4px' }}>{title}</h2>
      {subtitle && (
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--md-sys-color-on-surface-variant)', maxWidth: 'none' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

function KpiRow({ items }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '1px',
      background: 'var(--md-sys-color-outline-variant)',
      border: '1px solid var(--md-sys-color-outline-variant)',
      borderRadius: '14px',
      overflow: 'hidden',
      marginBottom: '40px',
    }}>
      {items.map((item, i) => (
        <div
          key={item.label}
          style={{
            background: i === 0 ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container-low)',
            padding: '20px 22px',
          }}
        >
          <div style={{
            fontFamily: 'Libre Baskerville, Georgia, serif',
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            fontWeight: 700,
            color: i === 0 ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
            lineHeight: 1,
            letterSpacing: '-0.015em',
            marginBottom: '6px',
          }}>
            {item.value}
          </div>
          <div style={{
            fontSize: '0.75rem', fontWeight: 600,
            color: i === 0 ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
            opacity: i === 0 ? 0.8 : 1,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function ContactBar({ label, pct, count, total }) {
  const color = pct >= 75
    ? 'var(--md-sys-color-tertiary)'
    : pct >= 50
    ? 'var(--md-sys-color-primary)'
    : 'var(--md-sys-color-outline)'

  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface)' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)' }}>{count} of {total}</span>
          <span style={{
            fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px',
            borderRadius: '999px',
            background: `${color.startsWith('var') ? 'oklch(from ' + color + ' l c h / 0.15)' : color + '22'}`,
            color,
          }}>
            {pct}%
          </span>
        </div>
      </div>
      <div style={{
        background: 'var(--md-sys-color-surface-container-high)',
        borderRadius: '999px', overflow: 'hidden', height: '8px',
      }}>
        <div style={{
          height: '100%', borderRadius: '999px',
          width: `${pct}%`,
          background: color,
          transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  )
}

const CustomPartyTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { party, count } = payload[0].payload
  return (
    <div style={{
      background: 'var(--md-sys-color-surface-container-highest)',
      border: '1px solid var(--md-sys-color-outline-variant)',
      borderRadius: '9px', padding: '10px 14px',
      fontSize: '0.82rem', color: 'var(--md-sys-color-on-surface)',
      boxShadow: '0 2px 8px oklch(18% 0.008 155 / 0.08)',
    }}>
      <div style={{ fontWeight: 700 }}>{party}</div>
      <div style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>{count} representatives</div>
    </div>
  )
}

const CustomStateTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { state, count } = payload[0].payload
  return (
    <div style={{
      background: 'var(--md-sys-color-surface-container-highest)',
      border: '1px solid var(--md-sys-color-outline-variant)',
      borderRadius: '9px', padding: '10px 14px',
      fontSize: '0.82rem', color: 'var(--md-sys-color-on-surface)',
      boxShadow: '0 2px 8px oklch(18% 0.008 155 / 0.08)',
    }}>
      <div style={{ fontWeight: 700 }}>{state}</div>
      <div style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>{count} representatives</div>
    </div>
  )
}

const CustomLegend = ({ payload }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '12px', flexWrap: 'wrap' }}>
    {payload.map((entry) => (
      <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
        <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: entry.color, display: 'inline-block' }} />
        {entry.value}
      </div>
    ))}
  </div>
)

export default function StatisticsPage() {
  usePageMeta({
    title: 'Statistics — Whoadunit',
    description: 'Data and trends on Malaysian parliamentary and state representation.',
  })
  const { data, loading } = useRepresentatives()
  const [selectedYear, setSelectedYear] = useState('All')

  // Available years derived from data
  const years = useMemo(() =>
    ['All', ...Array.from(new Set(data.map(r => r.electedYear).filter(Boolean))).sort((a, b) => b - a)],
    [data]
  )

  // Filter data by selected year
  const filteredData = useMemo(() =>
    selectedYear === 'All' ? data : data.filter(r => String(r.electedYear) === String(selectedYear)),
    [data, selectedYear]
  )

  const stats = useMemo(() => filteredData.length ? computeStats(filteredData) : null, [filteredData])

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: '260px', borderRadius: '16px', background: 'var(--md-sys-color-surface-container)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }`}</style>
      </div>
    )
  }

  if (!stats) return null

  const genderData = [
    { name: 'Male', value: stats.gender.male },
    { name: 'Female', value: stats.gender.female },
    ...(stats.gender.unknown > 0 ? [{ name: 'Unknown', value: stats.gender.unknown }] : []),
  ]

  const typeData = [
    { name: 'MP (Federal)', value: stats.mps },
    { name: 'ADUN (State)', value: stats.aduns },
  ]

  return (
    <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 72px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px' }}>{t('stats.title')}</h1>
          <p style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', maxWidth: 'none' }}>
            {t('stats.subtitle')}
          </p>
        </div>

        {/* Year filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)',
          }}>
            Election Year:
          </span>
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={selectStyle}>
            {years.map(y => (
              <option key={y} value={y}>{y === 'All' ? 'All Years' : String(y)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Year context banner (when a year is selected) */}
      {selectedYear !== 'All' && (
        <div style={{
          background: 'var(--md-sys-color-secondary-container)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.1rem' }}>🗳️</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--md-sys-color-on-secondary-container)' }}>
              Showing statistics for representatives elected in <strong>{selectedYear}</strong>
              {' — '}{filteredData.length} representative{filteredData.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={() => setSelectedYear('All')}
            style={{
              background: 'transparent',
              border: '1px solid var(--md-sys-color-outline-variant)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--md-sys-color-on-secondary-container)',
              whiteSpace: 'nowrap',
            }}
          >
            View All Years
          </button>
        </div>
      )}

      {/* KPI row */}
      <KpiRow items={[
        { label: 'Total Representatives', value: stats.total },
        { label: 'Members of Parliament', value: stats.mps },
        { label: 'State Assemblymen', value: stats.aduns },
        { label: 'Parties', value: stats.partyCount },
        { label: 'States & Territories', value: stats.stateCount },
        { label: 'Female Representatives', value: stats.gender.female },
      ]} />

      {/* No data state for filtered year */}
      {filteredData.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
          <div style={{ fontWeight: 600, marginBottom: '6px' }}>No data for {selectedYear}</div>
          <button onClick={() => setSelectedYear('All')} className="btn-tonal" style={{ marginTop: '12px' }}>View All Years</button>
        </div>
      )}

      {/* Charts grid */}
      {filteredData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="stats-grid">

          {/* Party breakdown — full width */}
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '16px', padding: '28px',
            gridColumn: '1 / -1',
          }}>
            <SectionTitle title={t('stats.section_party')} />
            <ResponsiveContainer width="100%" height={Math.max(200, stats.parties.length * 32)}>
              <BarChart
                data={stats.parties}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: 'var(--md-sys-color-on-surface-variant)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="party"
                  width={76}
                  tick={{ fontSize: 12, fill: 'var(--md-sys-color-on-surface)', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomPartyTooltip />} cursor={{ fill: 'var(--md-sys-color-surface-container-high)' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
                  {stats.parties.map((entry) => (
                    <Cell key={entry.party} fill={getPartyColor(entry.party)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gender */}
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '16px', padding: '28px',
          }}>
            <SectionTitle title={t('stats.section_gender')} />
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%" cy="50%"
                  innerRadius={56} outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={entry.name} fill={GENDER_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} (${Math.round((value / stats.total) * 100)}%)`, name]}
                  contentStyle={{
                    background: 'var(--md-sys-color-surface-container-highest)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    borderRadius: '8px', fontSize: '0.82rem',
                  }}
                />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {genderData.map((entry, i) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: GENDER_COLORS[i], flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--md-sys-color-on-surface)' }}>{entry.name}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{entry.value}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)', minWidth: '36px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round((entry.value / stats.total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Federal vs State */}
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '16px', padding: '28px',
          }}>
            <SectionTitle title={t('stats.section_type')} />
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%" cy="50%"
                  innerRadius={56} outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={entry.name} fill={TYPE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} (${Math.round((value / stats.total) * 100)}%)`, name]}
                  contentStyle={{
                    background: 'var(--md-sys-color-surface-container-highest)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    borderRadius: '8px', fontSize: '0.82rem',
                  }}
                />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {typeData.map((entry, i) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: TYPE_COLORS[i], flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--md-sys-color-on-surface)' }}>{entry.name}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{entry.value}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)', minWidth: '36px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round((entry.value / stats.total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact completeness — full width */}
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '16px', padding: '28px',
            gridColumn: '1 / -1',
          }}>
            <SectionTitle
              title={t('stats.section_contact')}
              subtitle={t('stats.contact_desc')}
            />
            <ContactBar label="Email Address" pct={stats.contact.email.pct} count={stats.contact.email.count} total={stats.total} />
            <ContactBar label="Phone Number" pct={stats.contact.phone.pct} count={stats.contact.phone.count} total={stats.total} />
            <ContactBar label="Facebook" pct={stats.contact.facebook.pct} count={stats.contact.facebook.count} total={stats.total} />
            <ContactBar label="Twitter / X" pct={stats.contact.twitter.pct} count={stats.contact.twitter.count} total={stats.total} />
          </div>

          {/* Party Reachability — full width */}
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '16px', padding: '28px',
            gridColumn: '1 / -1',
          }}>
            <SectionTitle
              title="Party Reachability Score"
              subtitle="Average contact completeness across all representatives per party — how easy is it to reach them?"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {stats.partyReachability.map((item, index) => {
                const pct = item.avgCompleteness
                const color = pct >= 75
                  ? 'var(--md-sys-color-tertiary)'
                  : pct >= 50
                  ? 'var(--md-sys-color-primary)'
                  : pct >= 25
                  ? 'var(--md-sys-color-secondary)'
                  : 'var(--md-sys-color-outline)'
                const partyColor = getPartyColor(item.party)
                return (
                  <div key={item.party} style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 76px 1fr 56px 52px',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom: index < stats.partyReachability.length - 1
                      ? '1px solid var(--md-sys-color-outline-variant)'
                      : 'none',
                  }}>
                    {/* Rank */}
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700,
                      color: index < 3 ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                      textAlign: 'center',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    {/* Party name */}
                    <span style={{
                      fontSize: '0.85rem', fontWeight: 700,
                      color: partyColor,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.party}
                    </span>
                    {/* Bar */}
                    <div style={{
                      background: 'var(--md-sys-color-surface-container-high)',
                      borderRadius: '999px', overflow: 'hidden', height: '7px',
                    }}>
                      <div style={{
                        height: '100%', borderRadius: '999px',
                        width: `${pct}%`,
                        background: color,
                        transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                      }} />
                    </div>
                    {/* Score badge */}
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 700,
                      padding: '2px 8px', borderRadius: '999px',
                      background: `oklch(from ${color} l c h / 0.15)`,
                      color,
                      textAlign: 'center',
                      fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap',
                    }}>
                      {pct}%
                    </span>
                    {/* Rep count */}
                    <span style={{
                      fontSize: '0.72rem', color: 'var(--md-sys-color-on-surface-variant)',
                      textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.count} rep{item.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* State breakdown — full width */}
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '16px', padding: '28px',
            gridColumn: '1 / -1',
          }}>
            <SectionTitle title={t('stats.section_state')} />
            <ResponsiveContainer width="100%" height={Math.max(280, stats.states.length * 28)}>
              <BarChart
                data={stats.states}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 20, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: 'var(--md-sys-color-on-surface-variant)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  width={130}
                  tick={{ fontSize: 11, fill: 'var(--md-sys-color-on-surface)', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomStateTooltip />} cursor={{ fill: 'var(--md-sys-color-surface-container-high)' }} />
                <Bar
                  dataKey="count"
                  fill="var(--md-sys-color-primary)"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div style={{ marginTop: '36px', textAlign: 'center' }}>
        <Link to="/directory" className="btn-primary" style={{ textDecoration: 'none' }}>
          Browse the Full Directory →
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .stats-grid > div[style*="gridColumn"] { grid-column: 1 !important; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
      `}</style>
    </div>
  )
}
