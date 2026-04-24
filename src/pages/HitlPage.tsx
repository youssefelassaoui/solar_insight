import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const ORANGE = '#e8733a'
const SANS   = "'Inter', system-ui, sans-serif"

const ANOMALIES = [
  { id: 'ANO-001', type: 'Hotspot',      sev: 'Critique', tmax: 89.4, tref: 42.1, dtn: 47.3, status: 'pending',  panel: 'INV-3 / CB-12 / M-04' },
  { id: 'ANO-002', type: 'Diode Bypass', sev: 'Majeur',   tmax: 74.2, tref: 41.8, dtn: 32.4, status: 'pending',  panel: 'INV-1 / CB-04 / M-18' },
  { id: 'ANO-003', type: 'PID',          sev: 'Majeur',   tmax: 68.7, tref: 41.5, dtn: 27.2, status: 'accepted', panel: 'INV-2 / CB-07 / M-09' },
  { id: 'ANO-004', type: 'Salissure',    sev: 'Mineur',   tmax: 52.3, tref: 41.9, dtn: 10.4, status: 'rejected', panel: 'INV-4 / CB-15 / M-22' },
  { id: 'ANO-005', type: 'Hotspot',      sev: 'Critique', tmax: 95.1, tref: 42.0, dtn: 53.1, status: 'pending',  panel: 'INV-3 / CB-11 / M-01' },
  { id: 'ANO-006', type: 'Fissure',      sev: 'Mineur',   tmax: 50.8, tref: 41.6, dtn:  9.2, status: 'pending',  panel: 'INV-5 / CB-02 / M-33' },
]

const DEFECT_TYPES = ['Hotspot', 'Diode Bypass', 'PID', 'Salissure', 'Fissure', 'Délamination', 'Court-circuit', 'Ombre portée']

const SEV_COLOR: Record<string, string> = { Critique: '#ef4444', Majeur: '#f59e0b', Mineur: '#22c55e' }
const STA_COLOR: Record<string, string> = { pending: '#6b7280', accepted: '#22c55e', rejected: '#ef4444' }
const STA_LABEL: Record<string, string> = { pending: 'En attente', accepted: 'Validé', rejected: 'Rejeté' }

export default function HitlPage() {
  const { theme, lang } = useTheme()
  const isDark = theme === 'dark'
  const [selected, setSelected] = useState(ANOMALIES[0])
  const [emissivity, setEmissivity] = useState(0.95)
  const [irradiance, setIrradiance] = useState(900)
  const [defectType, setDefectType] = useState(selected.type)
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(ANOMALIES.map(a => [a.id, a.status]))
  )

  const bg      = isDark ? '#0f1117' : '#f4f6fb'
  const card    = isDark ? '#151b27' : '#ffffff'
  const border  = isDark ? '#1e2535' : '#e8eaf0'
  const text    = isDark ? '#e2e8f0' : '#1a1f2e'
  const muted   = isDark ? '#64748b' : '#6b7280'
  const subCard = isDark ? '#1a2133' : '#f8f9fc'

  const dtn = (selected.tmax - selected.tref) * (emissivity / 0.95) * (irradiance / 900)

  function accept() { setStatuses(s => ({ ...s, [selected.id]: 'accepted' })) }
  function reject() { setStatuses(s => ({ ...s, [selected.id]: 'rejected' })) }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: bg, minHeight: '100%', fontFamily: SANS }}>

      {/* Header */}
      <div style={{ padding: '22px 28px 0', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: text }}>
          {lang === 'FR' ? 'Analyse & Validation (HITL)' : 'Analysis & Validation (HITL)'}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: muted }}>
          {lang === 'FR' ? 'Validation Human-in-the-Loop des pré-détections IA' : 'Human-in-the-Loop validation of AI pre-detections'}
        </p>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: '0', minHeight: 0 }}>

        {/* Left: anomaly list */}
        <div style={{ borderRight: `1px solid ${border}`, padding: '0 16px 16px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 12px', borderBottom: `1px solid ${border}`, marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: muted, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {ANOMALIES.length} {lang === 'FR' ? 'anomalies' : 'anomalies'}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: ORANGE, background: `${ORANGE}18`, padding: '2px 8px', borderRadius: '50px' }}>
              {Object.values(statuses).filter(s => s === 'pending').length} {lang === 'FR' ? 'en attente' : 'pending'}
            </span>
          </div>
          {ANOMALIES.map(a => {
            const st = statuses[a.id]
            const active = selected.id === a.id
            return (
              <div
                key={a.id}
                onClick={() => { setSelected(a); setDefectType(a.type) }}
                style={{
                  padding: '12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '6px',
                  background: active ? `${ORANGE}10` : 'transparent',
                  border: `1px solid ${active ? `${ORANGE}40` : 'transparent'}`,
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: active ? ORANGE : text }}>{a.id}</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: STA_COLOR[st], background: `${STA_COLOR[st]}15`, padding: '2px 7px', borderRadius: '50px' }}>{STA_LABEL[st]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: text }}>{a.type}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: SEV_COLOR[a.sev] }}>{a.sev}</span>
                </div>
                <span style={{ fontSize: '11px', color: muted }}>{a.panel}</span>
              </div>
            )
          })}
        </div>

        {/* Right: detail panel */}
        <div style={{ overflowY: 'auto', padding: '16px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

            {/* Image crops */}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '14px', padding: '18px' }}>
              <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: text }}>
                {lang === 'FR' ? 'Signatures visuelles' : 'Visual Signatures'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['RGB', lang === 'FR' ? 'Thermique' : 'Thermal'].map(lbl => (
                  <div key={lbl} style={{ background: subCard, borderRadius: '8px', height: '110px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', border: `1px solid ${border}` }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: lbl === 'RGB' ? 'linear-gradient(135deg,#84cc16,#065f46)' : 'linear-gradient(135deg,#fbbf24,#ef4444)', opacity: 0.7 }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: muted }}>{lbl} crop</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Physical analysis */}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '14px', padding: '18px' }}>
              <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: text }}>
                {lang === 'FR' ? 'Analyse Physique' : 'Physical Analysis'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '14px' }}>
                {[
                  { label: 'T max', value: `${selected.tmax}°C`, color: '#ef4444' },
                  { label: 'T ref', value: `${selected.tref}°C`, color: '#3b82f6' },
                  { label: 'ΔTn', value: `${dtn.toFixed(1)}°C`, color: ORANGE },
                ].map(v => (
                  <div key={v.label} style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: muted }}>{v.label}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800, color: v.color }}>{v.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '12px', color: muted }}>
                  {lang === 'FR' ? 'Émissivité' : 'Emissivity'}: <strong style={{ color: text }}>{emissivity.toFixed(2)}</strong>
                  <input type="range" min="0.8" max="1" step="0.01" value={emissivity} onChange={e => setEmissivity(+e.target.value)}
                    style={{ display: 'block', width: '100%', accentColor: ORANGE, marginTop: '4px' }} />
                </label>
                <label style={{ fontSize: '12px', color: muted }}>
                  {lang === 'FR' ? 'Irradiance (W/m²)' : 'Irradiance (W/m²)'}: <strong style={{ color: text }}>{irradiance}</strong>
                  <input type="range" min="400" max="1200" step="10" value={irradiance} onChange={e => setIrradiance(+e.target.value)}
                    style={{ display: 'block', width: '100%', accentColor: ORANGE, marginTop: '4px' }} />
                </label>
              </div>
            </div>
          </div>

          {/* Validation */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '14px', padding: '18px' }}>
            <p style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: text }}>
              {lang === 'FR' ? 'Validation & Classification' : 'Validation & Classification'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: muted, marginBottom: '6px' }}>
                  {lang === 'FR' ? 'Type de défaut' : 'Defect Type'}
                </label>
                <select
                  value={defectType}
                  onChange={e => setDefectType(e.target.value)}
                  style={{ width: '100%', background: subCard, border: `1px solid ${border}`, borderRadius: '8px', padding: '9px 14px', fontSize: '13px', color: text, fontFamily: SANS, outline: 'none', cursor: 'pointer' }}
                >
                  {DEFECT_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={reject} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '50px', padding: '9px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: SANS }}>
                  ✕ {lang === 'FR' ? 'Rejeter' : 'Reject'}
                </button>
                <button onClick={accept} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: '50px', padding: '9px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: SANS }}>
                  ✓ {lang === 'FR' ? 'Valider' : 'Accept'}
                </button>
              </div>
            </div>
            {statuses[selected.id] !== 'pending' && (
              <div style={{ marginTop: '12px', padding: '10px 14px', background: `${STA_COLOR[statuses[selected.id]]}10`, border: `1px solid ${STA_COLOR[statuses[selected.id]]}30`, borderRadius: '8px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: STA_COLOR[statuses[selected.id]] }}>
                  {statuses[selected.id] === 'accepted' ? `✓ ${lang === 'FR' ? 'Anomalie validée — ticket créé automatiquement' : 'Anomaly validated — ticket created automatically'}` : `✕ ${lang === 'FR' ? 'Anomalie rejetée' : 'Anomaly rejected'}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
