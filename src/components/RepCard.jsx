import { Link } from 'react-router-dom'
import { getContactCompleteness } from '../hooks/useRepresentatives'

const PARTY_COLORS = {
  PKR: '#c0392b',
  DAP: '#1a5276',
  Amanah: '#1e8449',
  UMNO: '#d4ac0d',
  BERSATU: '#1a5276',
  PAS: '#196f3d',
  MCA: '#c0392b',
  MIC: '#7d3c98',
  GPS: '#1a6b8a',
  GRS: '#117a65',
  default: '#5d6d7e',
}

function getPartyColor(party) {
  return PARTY_COLORS[party] || PARTY_COLORS.default
}

function getInitials(name) {
  return name
    .split(' ')
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function RepCard({ rep }) {
  const seatCode = rep.federalSeatCode || rep.stateSeatCode
  const seatName = rep.federalSeatName || rep.stateSeatName
  const completeness = getContactCompleteness(rep)
  const partyColor = getPartyColor(rep.party)

  return (
    <Link
      to={`/profile/${seatCode}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div className="card" style={{ padding: '16px 18px', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Avatar */}
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
            background: `${partyColor}18`,
            border: `1.5px solid ${partyColor}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: partyColor, fontFamily: 'Inter, sans-serif' }}>
              {getInitials(rep.name)}
            </span>
          </div>

          {/* Main info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: '600', fontSize: '0.88rem',
              color: 'var(--md-sys-color-on-surface)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              marginBottom: '2px',
            }}>
              {rep.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {seatCode && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  color: 'var(--md-sys-color-primary)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {seatCode}
                </span>
              )}
              <span style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {seatName}
              </span>
            </div>
          </div>

          {/* Right: badges + completeness */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <span className={`badge badge-${rep.type?.toLowerCase()}`}>{rep.type}</span>
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px',
                borderRadius: '999px',
                background: `${partyColor}18`,
                color: partyColor,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.02em',
              }}>
                {rep.party}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '36px', height: '4px', borderRadius: '999px',
                background: 'var(--md-sys-color-surface-container-high)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${completeness}%`,
                  borderRadius: '999px',
                  background: completeness >= 75
                    ? 'var(--md-sys-color-tertiary)'
                    : completeness >= 50
                    ? 'var(--md-sys-color-primary)'
                    : 'var(--md-sys-color-outline)',
                  transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                }} />
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--md-sys-color-on-surface-variant)', fontVariantNumeric: 'tabular-nums' }}>{completeness}%</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
