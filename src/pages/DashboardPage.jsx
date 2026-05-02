import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { usePageMeta } from '../hooks/usePageMeta'

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      <polyline points="8 17 12 21 16 17"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
    </svg>
  )
}

const FIELD_MAP = {
  federalseatcode: 'federalSeatCode',
  federalseatname: 'federalSeatName',
  stateseatcode:   'stateSeatCode',
  stateseatname:   'stateSeatName',
  type:            'type',
  name:            'name',
  party:           'party',
  state:           'state',
  gender:          'gender',
  electedyear:     'electedYear',
  email:           'email',
  phonenumber:     'phoneNumber',
  facebook:        'facebook',
  twitter:         'twitter',
}

const REQUIRED_FIELDS = ['federalSeatCode', 'name', 'party', 'state']
const ARRAY_FIELDS    = new Set(['email', 'phoneNumber'])

function normalizeKey(str) {
  return String(str).toLowerCase().replace(/[\s_-]/g, '')
}

function parseXlsx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data    = new Uint8Array(e.target.result)
        const wb      = XLSX.read(data, { type: 'array' })
        const ws      = wb.Sheets[wb.SheetNames[0]]
        const rawRows = XLSX.utils.sheet_to_json(ws, { defval: '' })

        if (rawRows.length === 0) {
          throw new Error('The spreadsheet appears to be empty.')
        }

        const headerKeys = Object.keys(rawRows[0])
        const normMap = {}
        for (const h of headerKeys) {
          normMap[normalizeKey(h)] = h
        }

        const missingFields = Object.entries(FIELD_MAP)
          .filter(([norm, camel]) => REQUIRED_FIELDS.includes(camel) && !normMap[norm])
          .map(([, camel]) => camel)

        if (missingFields.length > 0) {
          throw new Error(`Missing required columns: ${missingFields.join(', ')}`)
        }

        const records = rawRows.map((row) => {
          const obj = {}
          for (const [normKey, camelKey] of Object.entries(FIELD_MAP)) {
            const actualHeader = normMap[normKey]
            let val = actualHeader !== undefined ? row[actualHeader] : ''

            if (camelKey === 'electedYear') {
              const parsed = parseInt(String(val), 10)
              val = !isNaN(parsed) && parsed > 1900 && parsed < 9999 ? parsed : null
            } else if (ARRAY_FIELDS.has(camelKey)) {
              val = String(val).split(/[,;]/).map(s => s.trim()).filter(Boolean)
            } else {
              val = String(val)
            }

            obj[camelKey] = val
          }
          return obj
        })

        resolve(records)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read the file.'))
    reader.readAsArrayBuffer(file)
  })
}

export default function DashboardPage() {
  usePageMeta({
    title: 'Data Import Dashboard',
    description: 'Upload an Excel spreadsheet to convert and download representatives JSON data.',
  })

  const [isDragOver, setIsDragOver] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [records, setRecords]       = useState(null)
  const [fileName, setFileName]     = useState('')
  const [error, setError]           = useState('')
  const fileInputRef                = useRef(null)

  const processFile = async (file) => {
    if (!file) return
    const isXlsx =
      file.name.endsWith('.xlsx') ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (!isXlsx) {
      setError('Only .xlsx files are accepted. Please drop a valid Excel file.')
      setRecords(null)
      return
    }
    setError('')
    setLoading(true)
    setFileName(file.name)
    try {
      const parsed = await parseXlsx(file)
      setRecords(parsed)
    } catch (err) {
      setError(err.message || 'Failed to parse the file.')
      setRecords(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragOver(false)
    await processFile(e.dataTransfer.files[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget ?? null)) {
      setIsDragOver(false)
    }
  }

  const handleFileInput = async (e) => {
    if (e.target.files[0]) await processFile(e.target.files[0])
  }

  const handleDownload = () => {
    if (!records?.length) return
    const year = records.find(r => r.electedYear)?.electedYear ?? 'unknown'
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `representatives_${year}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const electedYear = records?.find(r => r.electedYear)?.electedYear ?? '—'
  const preview     = records?.slice(0, 10) ?? []

  return (
    <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 72px' }}>

      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="section-label" style={{ marginBottom: '6px', display: 'block' }}>
          Admin Tools
        </span>
        <h1 style={{ margin: '0 0 8px' }}>Data Import Dashboard</h1>
        <p style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', maxWidth: 'none' }}>
          Upload an .xlsx spreadsheet to parse and export the representatives JSON dataset.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragOver ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
          borderRadius: '16px',
          padding: '56px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragOver
            ? 'var(--md-sys-color-primary-container)'
            : 'var(--md-sys-color-surface-container-low)',
          transition: 'background 0.15s, border-color 0.15s',
          userSelect: 'none',
        }}
      >
        <div style={{
          width: '52px', height: '52px', margin: '0 auto 18px',
          borderRadius: '14px',
          background: isDragOver
            ? 'var(--md-sys-color-primary)'
            : 'var(--md-sys-color-surface-container-high)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isDragOver
            ? 'var(--md-sys-color-on-primary)'
            : 'var(--md-sys-color-on-surface-variant)',
          transition: 'background 0.15s, color 0.15s',
        }}>
          <UploadIcon />
        </div>
        <p style={{
          margin: '0 0 6px',
          fontWeight: 600,
          color: isDragOver
            ? 'var(--md-sys-color-on-primary-container)'
            : 'var(--md-sys-color-on-surface)',
          fontSize: '0.95rem',
          maxWidth: 'none',
        }}>
          {isDragOver ? 'Release to upload' : 'Drag & drop your .xlsx file here'}
        </p>
        <p style={{
          margin: 0,
          fontSize: '0.82rem',
          color: 'var(--md-sys-color-on-surface-variant)',
          maxWidth: 'none',
        }}>
          or{' '}
          <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
            click to browse
          </span>
          {' '}— only .xlsx files accepted
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '14px 18px',
          background: 'var(--md-sys-color-error-container)',
          border: '1px solid var(--md-sys-color-error)',
          borderRadius: '12px',
          color: 'var(--md-sys-color-on-error-container)',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}>
          <span style={{ fontWeight: 700, flexShrink: 0 }}>Error:</span>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          marginTop: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          color: 'var(--md-sys-color-on-surface-variant)',
          fontSize: '0.88rem',
        }}>
          <div style={{
            width: '18px', height: '18px',
            border: '2px solid var(--md-sys-color-outline-variant)',
            borderTopColor: 'var(--md-sys-color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }} />
          Parsing spreadsheet…
        </div>
      )}

      {/* Results */}
      {records && (
        <div style={{ marginTop: '36px' }}>

          {/* KPI summary strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1px',
            background: 'var(--md-sys-color-outline-variant)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '14px',
            overflow: 'hidden',
            marginBottom: '28px',
          }}>
            {[
              { label: 'Records Parsed', value: records.length, accent: true },
              { label: 'Elected Year',   value: electedYear,    accent: false },
              { label: 'File',           value: fileName,        accent: false },
            ].map((item) => (
              <div key={item.label} style={{
                background: item.accent
                  ? 'var(--md-sys-color-primary-container)'
                  : 'var(--md-sys-color-surface-container-low)',
                padding: '18px 22px',
              }}>
                <div style={{
                  fontFamily: 'Libre Baskerville, Georgia, serif',
                  fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                  fontWeight: 700,
                  color: item.accent
                    ? 'var(--md-sys-color-on-primary-container)'
                    : 'var(--md-sys-color-on-surface)',
                  lineHeight: 1,
                  letterSpacing: '-0.015em',
                  marginBottom: '5px',
                  wordBreak: 'break-all',
                }}>
                  {item.value}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: item.accent
                    ? 'var(--md-sys-color-on-primary-container)'
                    : 'var(--md-sys-color-on-surface-variant)',
                  opacity: item.accent ? 0.8 : 1,
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Header row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <span className="section-label">Preview</span>
              <span style={{
                marginLeft: '8px',
                fontSize: '0.78rem',
                color: 'var(--md-sys-color-on-surface-variant)',
              }}>
                First {Math.min(10, records.length)} of {records.length} rows
              </span>
            </div>
            <button
              onClick={handleDownload}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <DownloadIcon />
              Download representatives_{electedYear}.json
            </button>
          </div>

          {/* Preview table */}
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table dashboard-preview-table">
                <thead>
                  <tr>
                    {['name','federalSeatCode','federalSeatName','stateSeatCode','type','party','state','electedYear','email','phoneNumber'].map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{row.name}</td>
                      <td>
                        <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 700, fontSize: '0.78rem' }}>
                          {row.federalSeatCode}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem' }}>{row.federalSeatName}</td>
                      <td style={{ fontSize: '0.78rem' }}>{row.stateSeatCode || '—'}</td>
                      <td>
                        <span className={`badge badge-${row.type?.toLowerCase()}`}>{row.type}</span>
                      </td>
                      <td style={{ fontSize: '0.75rem', fontWeight: 700 }}>{row.party}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--md-sys-color-on-surface-variant)' }}>{row.state}</td>
                      <td>
                        {row.electedYear && (
                          <span style={{
                            fontSize: '0.75rem', fontWeight: 700,
                            padding: '3px 8px', borderRadius: '6px',
                            background: 'var(--md-sys-color-secondary-container)',
                            color: 'var(--md-sys-color-on-secondary-container)',
                          }}>
                            {row.electedYear}
                          </span>
                        )}
                      </td>
                      <td style={{
                        fontSize: '0.72rem',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        maxWidth: '160px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {row.email.length ? row.email.join(', ') : '—'}
                      </td>
                      <td style={{
                        fontSize: '0.72rem',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        whiteSpace: 'nowrap',
                      }}>
                        {row.phoneNumber.length ? row.phoneNumber.join(', ') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .dashboard-preview-table th:nth-child(n+4),
          .dashboard-preview-table td:nth-child(n+4) { display: none; }
        }
      `}</style>
    </div>
  )
}
