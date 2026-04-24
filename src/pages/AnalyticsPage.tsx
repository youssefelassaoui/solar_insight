import { useTheme } from '../context/ThemeContext'

const ORANGE = '#e8733a'
const SANS   = "'Inter', system-ui, sans-serif"

const DEFECTS = [
  { type: 'Hotspot',      count: 34, pct: 38, color: '#ef4444' },
  { type: 'Diode Bypass', count: 22, pct: 24, color: '#f97316' },
  { type: 'PID',          count: 16, pct: 18, color: '#f59e0b' },
  { type: 'Salissure',    count: 11, pct: 12, color: '#3b82f6' },
  { type: 'Fissure',      count:  7, pct:  8, color: '#8b5cf6' },
]

const SEV = [
  { label: 'Critique', count: 14, color: '#ef4444', pct: 49 },
  { label: 'Majeur',   count: 31, color: '#f59e0b', pct: 34 },
  { label: 'Mineur',   count: 45, color: '#22c55e', pct: 16 },
]

const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const BAR_DATA = [18, 24, 31, 22, 19, 14]
const MAX_BAR = Math.max(...BAR_DATA)

export default function AnalyticsPage() {
  const { theme, lang } = useTheme()
  const isDark = theme === 'dark'

  const bg    = isDark ? '#0f1117' : '#f4f6fb'
  const card  = isDark ? '#151b27' : '#ffffff'
  const border = isDark ? '#1e2535' : '#e8eaf0'
  const text  = isDark ? '#e2e8f0' : '#1a1f2e'
  const muted = isDark ? '#64748b' : '#6b7280'
  const track = isDark ? '#1e2535' : '#f1f3f8'

  return (
    <div style={{ flex: 1, padding: '28px 32px', background: bg, minHeight: '100%', fontFamily: SANS }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: text }}>
          {lang === 'FR' ? 'Tableau de Bord Analytique' : 'Analytical Dashboard'}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: muted }}>
          {lang === 'FR' ? 'Centrale Centrale A — Synthèse statistique' : 'Centrale Centrale A — Statistical summary'}
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: lang === 'FR' ? 'Anomalies détectées' : 'Detected Anomalies', value: '90',     color: '#ef4444' },
          { label: lang === 'FR' ? 'Modules inspectés'   : 'Inspected Modules',  value: '2 840', color: text },
          { label: lang === 'FR' ? 'Taux de défauts'     : 'Defect Rate',        value: '3.17 %', color: '#f59e0b' },
          { label: lang === 'FR' ? 'Perte de puissance'  : 'Power Loss',         value: '62 kWc', color: '#ef4444' },
          { label: lang === 'FR' ? 'Impact financier'    : 'Financial Impact',   value: '€ 7 440', color: '#ef4444' },
        ].map(k => (
          <div key={k.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: '14px', padding: '18px 20px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: muted, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{k.label}</p>
            <p style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: '20px' }}>

        {/* Defect types */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '22px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '14px', fontWeight: 700, color: text }}>
            {lang === 'FR' ? 'Répartition par type' : 'Defect Type Breakdown'}
          </h3>
          {DEFECTS.map(d => (
            <div key={d.type} style={{ marginBottom: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: text }}>{d.type}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: d.color }}>{d.count} ({d.pct}%)</span>
              </div>
              <div style={{ height: '6px', background: track, borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: '99px', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Severity */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '22px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '14px', fontWeight: 700, color: text }}>
            {lang === 'FR' ? 'Sévérité' : 'Severity Levels'}
          </h3>
          {/* Donut-like circles */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
            {SEV.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: `${s.color}18`, border: `3px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: s.color }}>{s.count}</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: s.color }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', height: '12px', borderRadius: '99px', overflow: 'hidden' }}>
            {SEV.map(s => (
              <div key={s.label} style={{ flex: s.count, background: s.color, transition: 'flex 0.6s ease' }} title={`${s.label}: ${s.count}`} />
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(239,68,68,0.07)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>
              {lang === 'FR' ? '⚠ 14 anomalies critiques à traiter en priorité' : '⚠ 14 critical anomalies require immediate action'}
            </p>
          </div>
        </div>

        {/* Bar chart — monthly anomalies */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '22px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '14px', fontWeight: 700, color: text }}>
            {lang === 'FR' ? 'Anomalies détectées / mois' : 'Anomalies Detected / Month'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', paddingBottom: '4px' }}>
            {BAR_DATA.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '10px', color: muted, fontWeight: 600 }}>{v}</span>
                <div style={{ width: '100%', height: `${(v / MAX_BAR) * 88}px`, background: i === BAR_DATA.length - 1 ? ORANGE : `${ORANGE}55`, borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: `1px solid ${border}` }}>
            {MONTHS.map(m => <span key={m} style={{ fontSize: '11px', color: muted, flex: 1, textAlign: 'center' }}>{m}</span>)}
          </div>

          {/* Financial calculator */}
          <div style={{ marginTop: '18px', padding: '14px 16px', background: 'rgba(232,115,58,0.07)', borderRadius: '10px', border: `1px solid ${ORANGE}25` }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: text }}>
              {lang === 'FR' ? 'Calculateur d\'impact financier' : 'Financial Impact Calculator'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: muted }}>{lang === 'FR' ? 'Perte annuelle estimée' : 'Est. annual loss'}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: ORANGE }}>€ 89 280</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '12px', color: muted }}>{lang === 'FR' ? 'ROI réparation' : 'Repair ROI'}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#22c55e' }}>3.2×</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
