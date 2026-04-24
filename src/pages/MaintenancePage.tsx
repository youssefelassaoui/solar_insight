import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const ORANGE = '#e8733a'
const SANS   = "'Inter', system-ui, sans-serif"

const TICKETS = [
  { id: 'TKT-001', anomaly: 'ANO-001', type: 'Hotspot',      sev: 'Critique', site: 'Centrale A',   assignee: 'A. Benali',  status: 'todo',       created: '2025-12-01' },
  { id: 'TKT-002', anomaly: 'ANO-005', type: 'Hotspot',      sev: 'Critique', site: 'Centrale A',   assignee: 'M. Ouali',   status: 'todo',       created: '2025-12-01' },
  { id: 'TKT-003', anomaly: 'ANO-002', type: 'Diode Bypass', sev: 'Majeur',   site: 'Centrale A',   assignee: 'A. Benali',  status: 'in_progress',created: '2025-11-28' },
  { id: 'TKT-004', anomaly: 'ANO-003', type: 'PID',          sev: 'Majeur',   site: 'Parc Nord',    assignee: 'K. Fassi',   status: 'in_progress',created: '2025-11-25' },
  { id: 'TKT-005', anomaly: 'ANO-006', type: 'Fissure',      sev: 'Mineur',   site: 'Ferme Agadir', assignee: 'M. Ouali',   status: 'resolved',   created: '2025-11-20' },
]

const COLS: { id: string; labelFr: string; labelEn: string; color: string }[] = [
  { id: 'todo',        labelFr: 'À faire',     labelEn: 'To Do',      color: '#6b7280' },
  { id: 'in_progress', labelFr: 'En cours',    labelEn: 'In Progress', color: '#f59e0b' },
  { id: 'resolved',    labelFr: 'Résolu',      labelEn: 'Resolved',   color: '#22c55e' },
]

const SEV_COLOR: Record<string, string> = { Critique: '#ef4444', Majeur: '#f59e0b', Mineur: '#22c55e' }

export default function MaintenancePage() {
  const { theme, lang } = useTheme()
  const isDark = theme === 'dark'
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(TICKETS.map(t => [t.id, t.status]))
  )

  const bg    = isDark ? '#0f1117' : '#f4f6fb'
  const card  = isDark ? '#151b27' : '#ffffff'
  const border = isDark ? '#1e2535' : '#e8eaf0'
  const text  = isDark ? '#e2e8f0' : '#1a1f2e'
  const muted = isDark ? '#64748b' : '#6b7280'
  const colBg = isDark ? '#111827' : '#f1f3f8'

  function move(id: string, newStatus: string) {
    setStatuses(s => ({ ...s, [id]: newStatus }))
  }

  return (
    <div style={{ flex: 1, padding: '28px 32px', background: bg, minHeight: '100%', fontFamily: SANS }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: text }}>
            {lang === 'FR' ? 'Maintenance & Gestion des Tâches' : 'Maintenance & Task Management'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: muted }}>
            {lang === 'FR' ? 'Tableau de bord CMMS — Suivi des tickets de réparation' : 'CMMS Dashboard — Repair ticket tracking'}
          </p>
        </div>
        <button style={{ background: ORANGE, color: 'white', border: 'none', borderRadius: '50px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: SANS }}>
          <ExportIcon /> {lang === 'FR' ? 'Export CMMS' : 'Export CMMS'}
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {COLS.map(c => {
          const count = Object.values(statuses).filter(s => s === c.id).length
          return (
            <div key={c.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: '12px', padding: '14px 20px', minWidth: '130px' }}>
              <p style={{ margin: 0, fontSize: '11px', color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{lang === 'FR' ? c.labelFr : c.labelEn}</p>
              <p style={{ margin: '6px 0 0', fontSize: '28px', fontWeight: 800, color: c.color }}>{count}</p>
            </div>
          )
        })}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '12px', padding: '14px 20px', minWidth: '130px' }}>
          <p style={{ margin: 0, fontSize: '11px', color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{lang === 'FR' ? 'Total' : 'Total'}</p>
          <p style={{ margin: '6px 0 0', fontSize: '28px', fontWeight: 800, color: text }}>{TICKETS.length}</p>
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {COLS.map(col => {
          const items = TICKETS.filter(t => statuses[t.id] === col.id)
          return (
            <div key={col.id}>
              {/* Column header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: text }}>{lang === 'FR' ? col.labelFr : col.labelEn}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: col.color, background: `${col.color}18`, padding: '2px 8px', borderRadius: '50px', marginLeft: 'auto' }}>{items.length}</span>
              </div>

              {/* Cards */}
              <div style={{ background: colBg, borderRadius: '12px', padding: '10px', minHeight: '80px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map(t => (
                  <div key={t.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: ORANGE }}>{t.id}</span>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: SEV_COLOR[t.sev], background: `${SEV_COLOR[t.sev]}15`, padding: '2px 7px', borderRadius: '50px' }}>{t.sev}</span>
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: text }}>{t.type}</p>
                    <p style={{ margin: '0 0 8px', fontSize: '11px', color: muted }}>{t.site} · {t.anomaly}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: muted }}>👤 {t.assignee}</span>
                      <span style={{ fontSize: '11px', color: muted }}>{t.created}</span>
                    </div>
                    {/* Move buttons */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px', paddingTop: '8px', borderTop: `1px solid ${border}` }}>
                      {COLS.filter(c => c.id !== col.id).map(c => (
                        <button key={c.id} onClick={() => move(t.id, c.id)} style={{
                          flex: 1, background: `${c.color}12`, border: `1px solid ${c.color}30`,
                          color: c.color, borderRadius: '6px', padding: '4px 6px', fontSize: '10px',
                          fontWeight: 600, cursor: 'pointer', fontFamily: SANS,
                        }}>
                          → {lang === 'FR' ? c.labelFr : c.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <p style={{ margin: 0, padding: '12px', textAlign: 'center', fontSize: '12px', color: muted }}>
                    {lang === 'FR' ? 'Aucun ticket' : 'No tickets'}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ExportIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }
