import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const ORANGE = '#e8733a'
const SANS   = "'Inter', system-ui, sans-serif"

type Scenario = 'A' | 'B'

export default function ProjectSetupPage() {
  const { theme, lang } = useTheme()
  const isDark = theme === 'dark'
  const [scenario, setScenario] = useState<Scenario>('A')
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState<Record<string, string>>({})

  const bg      = isDark ? '#0f1117' : '#f4f6fb'
  const card    = isDark ? '#151b27' : '#ffffff'
  const border  = isDark ? '#1e2535' : '#e8eaf0'
  const text    = isDark ? '#e2e8f0' : '#1a1f2e'
  const muted   = isDark ? '#64748b' : '#6b7280'
  const subCard = isDark ? '#1a2133' : '#f8f9fc'

  function handleDrop(zone: string, e: React.DragEvent) {
    e.preventDefault(); setDragOver(null)
    const file = e.dataTransfer.files[0]
    if (file) setUploaded(u => ({ ...u, [zone]: file.name }))
  }

  function DropZone({ id, label, accept, icon }: { id: string; label: string; accept: string; icon: React.ReactNode }) {
    const active = dragOver === id
    return (
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(id) }}
        onDragLeave={() => setDragOver(null)}
        onDrop={e => handleDrop(id, e)}
        style={{
          border: `2px dashed ${active ? ORANGE : uploaded[id] ? '#22c55e' : border}`,
          borderRadius: '12px', padding: '24px 20px', textAlign: 'center',
          background: active ? `${ORANGE}08` : uploaded[id] ? 'rgba(34,197,94,0.06)' : subCard,
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        <div style={{ color: uploaded[id] ? '#22c55e' : ORANGE, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
        {uploaded[id] ? (
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#22c55e' }}>✓ {uploaded[id]}</p>
        ) : (
          <>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: text }}>{label}</p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: muted }}>{accept}</p>
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: muted }}>
              {lang === 'FR' ? 'Glissez-déposez ou cliquez pour parcourir' : 'Drag & drop or click to browse'}
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div style={{ flex: 1, padding: '28px 32px', background: bg, minHeight: '100%', fontFamily: SANS }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: text }}>
          {lang === 'FR' ? 'Importation & Configuration du Projet' : 'Project Setup & Import'}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: muted }}>
          {lang === 'FR' ? 'Configurez un nouveau projet et importez vos données d\'acquisition.' : 'Configure a new project and import your acquisition data.'}
        </p>
      </div>

      {/* Project name */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: text }}>
          {lang === 'FR' ? 'Informations du Projet' : 'Project Information'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { label: lang === 'FR' ? 'Nom du projet' : 'Project Name', placeholder: 'Centrale Agadir 2025' },
            { label: lang === 'FR' ? 'Nom du client' : 'Client Name', placeholder: 'Masen' },
            { label: lang === 'FR' ? 'Localisation' : 'Location', placeholder: 'Agadir, Maroc' },
            { label: lang === 'FR' ? 'Date d\'inspection' : 'Inspection Date', placeholder: '2025-12-01', type: 'date' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: muted, marginBottom: '6px' }}>{f.label}</label>
              <input type={f.type ?? 'text'} placeholder={f.placeholder} style={{
                width: '100%', boxSizing: 'border-box',
                background: subCard, border: `1px solid ${border}`, borderRadius: '8px',
                padding: '9px 14px', fontSize: '13px', color: text, fontFamily: SANS, outline: 'none',
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Scenario selector */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: text }}>
          {lang === 'FR' ? 'Scénario d\'acquisition' : 'Acquisition Scenario'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {([
            { id: 'A', title: lang === 'FR' ? 'Scénario A — Prestation Complète' : 'Scenario A — Full Service', desc: lang === 'FR' ? 'L\'acquisition est réalisée par nos équipes.' : 'Acquisition performed by our teams.' },
            { id: 'B', title: lang === 'FR' ? 'Scénario B — Client Autonome' : 'Scenario B — Self-Acquired Data', desc: lang === 'FR' ? 'Le client fournit ses propres images drone.' : 'Client provides their own drone images.' },
          ] as const).map(s => (
            <div
              key={s.id}
              onClick={() => setScenario(s.id)}
              style={{
                border: `2px solid ${scenario === s.id ? ORANGE : border}`,
                borderRadius: '12px', padding: '16px',
                background: scenario === s.id ? `${ORANGE}0a` : subCard,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: `2px solid ${scenario === s.id ? ORANGE : muted}`,
                  background: scenario === s.id ? ORANGE : 'transparent',
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {scenario === s.id && <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} />}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: scenario === s.id ? ORANGE : text }}>{s.title}</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: muted, paddingLeft: '28px' }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Scenario A */}
        {scenario === 'A' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <DropZone id="dxf" label={lang === 'FR' ? 'Plans AutoCAD' : 'AutoCAD Plans'} accept=".dxf, .dwg" icon={<BlueprintIcon />} />
            <DropZone id="pdf" label={lang === 'FR' ? 'Fiche technique PV' : 'PV Datasheet'} accept=".pdf" icon={<DocIcon />} />
          </div>
        )}

        {/* Scenario B */}
        {scenario === 'B' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <DropZone id="rgb"     label="Images RGB"        accept=".jpg, .tiff, .zip" icon={<ImageIcon />} />
            <DropZone id="thermal" label={lang === 'FR' ? 'Images Thermiques' : 'Thermal Images'} accept=".tiff, .zip" icon={<ThermalIcon />} />
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '10px' }}>
                <span style={{ fontSize: '18px' }}>🔒</span>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: text }}>
                    {lang === 'FR' ? 'Option Souveraineté des Données (Premium)' : 'Data Sovereignty Option (Premium)'}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: muted }}>
                    {lang === 'FR' ? 'Transfert direct et sécurisé vers notre workstation, sans cloud public.' : 'Direct secure transfer to our workstation, no public cloud.'}
                  </p>
                </div>
                <button style={{ marginLeft: 'auto', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1', borderRadius: '50px', padding: '6px 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: SANS }}>
                  {lang === 'FR' ? 'Contacter l\'équipe' : 'Contact Team'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button style={{ background: 'transparent', border: `1px solid ${border}`, color: muted, borderRadius: '50px', padding: '10px 24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: SANS }}>
          {lang === 'FR' ? 'Annuler' : 'Cancel'}
        </button>
        <button style={{ background: ORANGE, color: 'white', border: 'none', borderRadius: '50px', padding: '10px 28px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: SANS }}>
          {lang === 'FR' ? 'Créer le projet' : 'Create Project'}
        </button>
      </div>
    </div>
  )
}

function BlueprintIcon() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> }
function DocIcon() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> }
function ImageIcon() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> }
function ThermalIcon() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg> }
