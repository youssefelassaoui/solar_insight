import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const ORANGE      = '#e8733a'
const ORANGE_SOFT = 'rgba(232,115,58,0.12)'
const ORANGE_MED  = 'rgba(232,115,58,0.2)'

interface NavItem {
  path: string
  labelFr: string
  labelEn: string
  icon: (active: boolean) => React.ReactNode
  badge?: number
}

const NAV: NavItem[] = [
  {
    path: '/portfolio',
    labelFr: 'Portefeuille',
    labelEn: 'Portfolio',
    icon: (a) => <PortfolioIcon active={a} />,
  },
  {
    path: '/setup',
    labelFr: 'Configuration',
    labelEn: 'Project Setup',
    icon: (a) => <SetupIcon active={a} />,
  },
  {
    path: '/analytics',
    labelFr: 'Tableau de Bord',
    labelEn: 'Analytics',
    icon: (a) => <AnalyticsIcon active={a} />,
  },
  {
    path: '/map',
    labelFr: 'Visionneuse',
    labelEn: 'Map Viewer',
    icon: (a) => <MapViewIcon active={a} />,
  },
  {
    path: '/analysis',
    labelFr: 'Analyse HITL',
    labelEn: 'HITL Analysis',
    icon: (a) => <HitlIcon active={a} />,
    badge: 12,
  },
  {
    path: '/maintenance',
    labelFr: 'Maintenance',
    labelEn: 'Maintenance',
    icon: (a) => <MaintenanceIcon active={a} />,
    badge: 3,
  },
  {
    path: '/reporting',
    labelFr: 'Rapports',
    labelEn: 'Reporting',
    icon: (a) => <ReportingIcon active={a} />,
  },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  const { theme, lang } = useTheme()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isDark  = theme === 'dark'
  const bg      = isDark ? '#0d1321' : '#ffffff'
  const border  = isDark ? '#1e2535' : '#e8eaf0'
  const text    = isDark ? '#cbd5e1' : '#374151'
  const muted   = isDark ? '#475569' : '#9ca3af'
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.035)'

  const W = collapsed ? 64 : 220

  return (
    <aside
      style={{
        width: `${W}px`,
        minWidth: `${W}px`,
        height: 'calc(100vh - 62px)',
        position: 'sticky',
        top: '62px',
        background: bg,
        borderRight: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.22s ease, min-width 0.22s ease',
        overflow: 'hidden',
        zIndex: 40,
        boxShadow: isDark
          ? '2px 0 12px rgba(0,0,0,0.25)'
          : '2px 0 8px rgba(0,0,0,0.05)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Section label */}
        {!collapsed && (
          <p style={{
            margin: '0 0 6px',
            padding: '0 16px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: muted,
          }}>
            {lang === 'FR' ? 'Navigation' : 'Navigation'}
          </p>
        )}

        {NAV.map((item) => {
          const active = pathname.startsWith(item.path)
          return (
            <div
              key={item.path}
              title={collapsed ? (lang === 'FR' ? item.labelFr : item.labelEn) : undefined}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '10px 0' : '10px 14px',
                margin: '2px 8px',
                borderRadius: '10px',
                cursor: 'pointer',
                background: active ? ORANGE_SOFT : 'transparent',
                border: `1px solid ${active ? ORANGE_MED : 'transparent'}`,
                color: active ? ORANGE : text,
                transition: 'all 0.15s',
                position: 'relative',
                justifyContent: collapsed ? 'center' : 'flex-start',
                userSelect: 'none',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLDivElement).style.background = hoverBg
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent'
              }}
            >
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {item.icon(active)}
              </span>

              {!collapsed && (
                <span style={{
                  fontSize: '13px',
                  fontWeight: active ? 600 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  flex: 1,
                }}>
                  {lang === 'FR' ? item.labelFr : item.labelEn}
                </span>
              )}

              {/* Badge */}
              {item.badge && (
                <span style={{
                  background: ORANGE,
                  color: 'white',
                  borderRadius: '50px',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: collapsed ? '2px 5px' : '2px 7px',
                  position: collapsed ? 'absolute' : 'relative',
                  top: collapsed ? '6px' : undefined,
                  right: collapsed ? '6px' : undefined,
                  lineHeight: '14px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          )
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: border, margin: '0 12px' }} />

      {/* Collapse toggle */}
      <div
        onClick={onToggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: collapsed ? '14px 0' : '14px 16px',
          cursor: 'pointer',
          color: muted,
          justifyContent: collapsed ? 'center' : 'flex-start',
          transition: 'color 0.15s',
          userSelect: 'none',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.color = ORANGE)}
        onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.color = muted)}
      >
        <CollapseIcon collapsed={collapsed} />
        {!collapsed && (
          <span style={{ fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {lang === 'FR' ? 'Réduire' : 'Collapse'}
          </span>
        )}
      </div>
    </aside>
  )
}

/* ── Icons ─────────────────────────────────────────────────────── */
const IC: React.CSSProperties = { display: 'block' }

function PortfolioIcon({ active }: { active: boolean }) {
  const c = active ? ORANGE : 'currentColor'
  return (
    <svg style={IC} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )
}

function SetupIcon({ active }: { active: boolean }) {
  const c = active ? ORANGE : 'currentColor'
  return (
    <svg style={IC} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      <line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
    </svg>
  )
}

function AnalyticsIcon({ active }: { active: boolean }) {
  const c = active ? ORANGE : 'currentColor'
  return (
    <svg style={IC} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  )
}

function MapViewIcon({ active }: { active: boolean }) {
  const c = active ? ORANGE : 'currentColor'
  return (
    <svg style={IC} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  )
}

function HitlIcon({ active }: { active: boolean }) {
  const c = active ? ORANGE : 'currentColor'
  return (
    <svg style={IC} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  )
}

function MaintenanceIcon({ active }: { active: boolean }) {
  const c = active ? ORANGE : 'currentColor'
  return (
    <svg style={IC} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  )
}

function ReportingIcon({ active }: { active: boolean }) {
  const c = active ? ORANGE : 'currentColor'
  return (
    <svg style={IC} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease' }}>
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}
