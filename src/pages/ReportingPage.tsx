import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const ORANGE = '#e8733a'
const SANS   = "'Inter', system-ui, sans-serif"

const REPORTS = [
  { id: 'RPT-001', name: 'Rapport d\'inspection — Centrale A',  date: '2025-12-01', pages: 42, status: 'ready',      type: 'PDF' },
  { id: 'RPT-002', name: 'Export défauts — Centrale A',         date: '2025-12-01', pages: null, status: 'ready',    type: 'CSV' },
  { id: 'RPT-003', name: 'Rapport exécutif — Parc Nord',        date: '2025-11-14', pages: 18, status: 'ready',      type: 'PDF' },
  { id: 'RPT-004', name: 'Rapport complet — Ouarzazate Est',    date: '2025-10-05', pages: 67, status: 'generating', type: 'PDF' },
]

const SECTIONS = [
  { id: 'cover',    labelFr: 'Page de couverture',      labelEn: 'Cover Page',           checked: true  },
  { id: 'summary',  labelFr: 'Résumé exécutif',         labelEn: 'Executive Summary',    checked: true  },
  { id: 'map',      labelFr: 'Cartes annotées',         labelEn: 'Annotated Maps',       checked: true  },
  { id: 'anomalies',labelFr: 'Liste des anomalies',     labelEn: 'Anomaly List',         checked: true  },
  { id: 'photos',   labelFr: 'Galerie des signatures',  labelEn: 'Signature Gallery',    checked: true  },
  { id: 'financial',labelFr: 'Impact financier',        labelEn: 'Financial Impact',     checked: true  },
  { id: 'reco',     labelFr: 'Recommandations',         labelEn: 'Recommendations',      checked: false },
  { id: 'annex',    labelFr: 'Annexes techniques',      labelEn: 'Technical Annexes',    checked: false },
]

export default function ReportingPage() {
  const { theme, lang } = useTheme()
  const isDark = theme === 'dark'
  const [sections, setSections] = useState(SECTIONS)
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)

  const bg      = isDark ? '#0f1117' : '#f4f6fb'
  const card    = isDark ? '#151b27' : '#ffffff'
  const border  = isDark ? '#1e2535' : '#e8eaf0'
  const text    = isDark ? '#e2e8f0' : '#1a1f2e'
  const muted   = isDark ? '#64748b' : '#6b7280'
  const subCard = isDark ? '#1a2133' : '#f8f9fc'

  function toggle(id: string) {
    setSections(s => s.map(sec => sec.id === id ? { ...sec, checked: !sec.checked } : sec))
  }

  function generate() {
    setGenerating(true); setDone(false)
    setTimeout(() => { setGenerating(false); setDone(true) }, 2200)
  }

  return (
    <div style={{ flex: 1, padding: '28px 32px', background: bg, minHeight: '100%', fontFamily: SANS }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: text }}>
          {lang === 'FR' ? 'Reporting & Exportation' : 'Reporting & Deliverables'}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: muted }}>
          {lang === 'FR' ? 'Génération de rapports professionnels et exports de données' : 'Professional report generation and data exports'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px' }}>

        {/* Generator */}
        <div>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: text }}>
              {lang === 'FR' ? 'Générateur de Rapport PDF' : 'PDF Report Generator'}
            </h3>

            {/* Project selector */}
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: muted, marginBottom: '6px' }}>
              {lang === 'FR' ? 'Projet' : 'Project'}
            </label>
            <select style={{ width: '100%', background: subCard, border: `1px solid ${border}`, borderRadius: '8px', padding: '9px 14px', fontSize: '13px', color: text, fontFamily: SANS, outline: 'none', marginBottom: '16px', cursor: 'pointer' }}>
              <option>Centrale Centrale A</option>
              <option>Parc Solaire Nord</option>
              <option>Site Ouarzazate Est</option>
            </select>

            {/* Section checklist */}
            <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {lang === 'FR' ? 'Sections à inclure' : 'Sections to include'}
            </p>
            {sections.map(s => (
              <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', cursor: 'pointer', borderBottom: `1px solid ${border}` }}>
                <input type="checkbox" checked={s.checked} onChange={() => toggle(s.id)} style={{ accentColor: ORANGE, width: '14px', height: '14px' }} />
                <span style={{ fontSize: '13px', color: s.checked ? text : muted }}>{lang === 'FR' ? s.labelFr : s.labelEn}</span>
              </label>
            ))}

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={generating}
              style={{
                width: '100%', marginTop: '18px',
                background: generating ? `${ORANGE}80` : ORANGE,
                color: 'white', border: 'none', borderRadius: '50px',
                padding: '12px', fontSize: '14px', fontWeight: 700,
                cursor: generating ? 'not-allowed' : 'pointer', fontFamily: SANS,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {generating ? <><Spinner />{lang === 'FR' ? 'Génération en cours…' : 'Generating…'}</> :
               done       ? `✓ ${lang === 'FR' ? 'Rapport généré — Télécharger' : 'Report ready — Download'}` :
                            `${lang === 'FR' ? 'Générer le rapport' : 'Generate Report'}`}
            </button>
          </div>

          {/* CSV export */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '18px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: text }}>
              {lang === 'FR' ? 'Exports de données' : 'Data Exports'}
            </h3>
            {[
              { label: lang === 'FR' ? 'Liste des anomalies (CSV)' : 'Anomaly list (CSV)', icon: '📊' },
              { label: lang === 'FR' ? 'Données thermiques (XLSX)' : 'Thermal data (XLSX)', icon: '🌡' },
              { label: lang === 'FR' ? 'Shapes GeoJSON' : 'GeoJSON shapes', icon: '🗺' },
            ].map(e => (
              <div key={e.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: `1px solid ${border}` }}>
                <span style={{ fontSize: '18px' }}>{e.icon}</span>
                <span style={{ flex: 1, fontSize: '13px', color: text }}>{e.label}</span>
                <button style={{ background: `${ORANGE}12`, border: `1px solid ${ORANGE}35`, color: ORANGE, borderRadius: '50px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: SANS }}>
                  {lang === 'FR' ? 'Télécharger' : 'Download'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Past reports */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '22px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: text }}>
            {lang === 'FR' ? 'Rapports générés' : 'Generated Reports'}
          </h3>
          {REPORTS.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: `1px solid ${border}` }}>
              <div style={{ width: '40px', height: '48px', background: r.type === 'PDF' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${r.type === 'PDF' ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: r.type === 'PDF' ? '#ef4444' : '#22c55e' }}>{r.type}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: muted }}>{r.date}{r.pages ? ` · ${r.pages} pages` : ''}</p>
              </div>
              {r.status === 'generating' ? (
                <span style={{ fontSize: '12px', color: ORANGE, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Spinner />{lang === 'FR' ? 'En cours' : 'Generating'}</span>
              ) : (
                <button style={{ background: `${ORANGE}12`, border: `1px solid ${ORANGE}35`, color: ORANGE, borderRadius: '50px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: SANS, whiteSpace: 'nowrap' }}>
                  {lang === 'FR' ? 'Télécharger' : 'Download'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </span>
  )
}
