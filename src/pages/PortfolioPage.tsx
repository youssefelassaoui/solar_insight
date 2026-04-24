import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

const ORANGE = '#e8733a'
const SANS   = "'Inter', system-ui, sans-serif"

const PLANTS = [
  { id: 1, name: 'Centrale Centrale A',   location: 'Marrakech, MA',  power: '4.2 MWc',  health: 91, alerts: 2,  lastInspection: '2025-11-14', status: 'healthy'  },
  { id: 2, name: 'Parc Solaire Nord',      location: 'Oujda, MA',      power: '8.7 MWc',  health: 74, alerts: 7,  lastInspection: '2025-10-02', status: 'warning'  },
  { id: 3, name: 'Site Ouarzazate Est',    location: 'Ouarzazate, MA', power: '12.1 MWc', health: 58, alerts: 14, lastInspection: '2025-09-18', status: 'critical' },
  { id: 4, name: 'Ferme PV Agadir',        location: 'Agadir, MA',     power: '6.0 MWc',  health: 96, alerts: 0,  lastInspection: '2025-12-01', status: 'healthy'  },
  { id: 5, name: 'Installation Fès',       location: 'Fès, MA',        power: '2.8 MWc',  health: 83, alerts: 4,  lastInspection: '2025-11-27', status: 'warning'  },
]

const KPI = [
  { label: 'Total Capacity',     value: '33.8 MWc', sub: '+2.4 MWc this year', icon: <BoltIcon /> },
  { label: 'Fleet Health Score', value: '80.4 %',   sub: '↑ 3.1 pts vs last month', icon: <HeartIcon /> },
  { label: 'Active Alerts',      value: '27',        sub: '14 critical · 13 major', icon: <AlertIcon />, alert: true },
  { label: 'Sites Monitored',    value: '5',         sub: '4 countries', icon: <MapPinIcon /> },
]

function HealthGauge({ score }: { score: number }) {
  const r  = 22
  const cx = 28
  const cy = 28
  const full = 2 * Math.PI * r
  const dash = (score / 100) * full
  const color = score >= 85 ? '#22c55e' : score >= 65 ? '#f59e0b' : '#ef4444'
  return (
    <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="5" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${full}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px`, fontFamily: SANS, fontSize: '12px', fontWeight: 700, fill: color }}>
        {score}
      </text>
    </svg>
  )
}

export default function PortfolioPage() {
  const { theme, lang } = useTheme()
  const navigate        = useNavigate()
  const isDark          = theme === 'dark'
  const [search, setSearch] = useState('')

  const bg       = isDark ? '#0f1117' : '#f4f6fb'
  const card     = isDark ? '#151b27' : '#ffffff'
  const border   = isDark ? '#1e2535' : '#e8eaf0'
  const text      = isDark ? '#e2e8f0' : '#1a1f2e'
  const muted    = isDark ? '#64748b' : '#6b7280'
  const inputBg  = isDark ? '#1e2535' : '#f8f9fc'

  const filtered = PLANTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = (s: string) => s === 'healthy' ? '#22c55e' : s === 'warning' ? '#f59e0b' : '#ef4444'
  const statusLabel = (s: string) => s === 'healthy' ? (lang === 'FR' ? 'Sain' : 'Healthy') : s === 'warning' ? (lang === 'FR' ? 'Attention' : 'Warning') : (lang === 'FR' ? 'Critique' : 'Critical')

  return (
    <div style={{ flex: 1, padding: '28px 32px', background: bg, minHeight: '100%', fontFamily: SANS }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: text }}>
            {lang === 'FR' ? 'Gestion du Portefeuille' : 'Portfolio Management'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: muted }}>
            {lang === 'FR' ? 'Vue d\'ensemble de votre flotte solaire' : 'Overview of your solar fleet'}
          </p>
        </div>
        <button
          onClick={() => navigate('/setup')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: ORANGE, color: 'white', border: 'none',
            borderRadius: '50px', padding: '10px 20px',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          <PlusIcon /> {lang === 'FR' ? 'Nouveau projet' : 'New Project'}
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {KPI.map(k => (
          <div key={k.label} style={{
            background: card, border: `1px solid ${k.alert ? 'rgba(239,68,68,0.3)' : border}`,
            borderRadius: '14px', padding: '18px 20px',
            boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '11px', color: muted, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{k.label}</p>
                <p style={{ margin: '6px 0 4px', fontSize: '26px', fontWeight: 700, color: k.alert ? '#ef4444' : text, lineHeight: 1 }}>{k.value}</p>
                <p style={{ margin: 0, fontSize: '12px', color: muted }}>{k.sub}</p>
              </div>
              <span style={{ color: k.alert ? '#ef4444' : ORANGE, opacity: 0.8 }}>{k.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: inputBg, border: `1px solid ${border}`, borderRadius: '50px',
          padding: '8px 16px', flex: 1, maxWidth: '320px',
        }}>
          <SearchIcon color={muted} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'FR' ? 'Rechercher un site…' : 'Search sites…'}
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: text, fontFamily: SANS }}
          />
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: muted }}>{filtered.length} {lang === 'FR' ? 'sites' : 'sites'}</p>
      </div>

      {/* Plants grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
        {filtered.map(plant => (
          <div
            key={plant.id}
            style={{
              background: card, border: `1px solid ${border}`, borderRadius: '16px',
              padding: '20px', cursor: 'pointer',
              boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 20px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'none'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = isDark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: text }}>{plant.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <PinIcon /> {plant.location}
                </p>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                borderRadius: '50px', background: `${statusColor(plant.status)}18`, color: statusColor(plant.status),
                border: `1px solid ${statusColor(plant.status)}40`,
              }}>
                {statusLabel(plant.status)}
              </span>
            </div>

            {/* Health + stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <HealthGauge score={plant.health} />
              <div style={{ flex: 1 }}>
                <Row label={lang === 'FR' ? 'Puissance' : 'Capacity'} value={plant.power} color={text} muted={muted} />
                <Row label={lang === 'FR' ? 'Alertes' : 'Alerts'} value={String(plant.alerts)} color={plant.alerts > 5 ? '#ef4444' : plant.alerts > 0 ? '#f59e0b' : '#22c55e'} muted={muted} />
                <Row label={lang === 'FR' ? 'Dernière inspection' : 'Last inspection'} value={plant.lastInspection} color={text} muted={muted} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: `1px solid ${border}` }}>
              <ActionBtn label={lang === 'FR' ? 'Carte' : 'Map'} onClick={() => navigate('/map')} primary />
              <ActionBtn label={lang === 'FR' ? 'Rapport' : 'Report'} onClick={() => navigate('/reporting')} />
              {plant.alerts > 0 && <ActionBtn label={`${plant.alerts} ${lang === 'FR' ? 'alertes' : 'alerts'}`} onClick={() => navigate('/analysis')} danger />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Row({ label, value, color, muted }: { label: string; value: string; color: string; muted: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ fontSize: '11px', color: muted }}>{label}</span>
      <span style={{ fontSize: '12px', fontWeight: 600, color }}>{value}</span>
    </div>
  )
}

function ActionBtn({ label, onClick, primary, danger }: { label: string; onClick: () => void; primary?: boolean; danger?: boolean }) {
  const bg = danger ? 'rgba(239,68,68,0.1)' : primary ? `${ORANGE}18` : 'transparent'
  const color = danger ? '#ef4444' : primary ? ORANGE : '#6b7280'
  const border = danger ? '1px solid rgba(239,68,68,0.3)' : primary ? `1px solid ${ORANGE}40` : '1px solid #e8eaf0'
  return (
    <button onClick={onClick} style={{ background: bg, color, border, borderRadius: '50px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: SANS }}>
      {label}
    </button>
  )
}

function BoltIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> }
function HeartIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> }
function AlertIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
function MapPinIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> }
function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function SearchIcon({ color }: { color: string }) { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function PinIcon() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> }
