import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { useTheme } from '../../context/ThemeContext'
import type { Feature, GeoJsonObject } from 'geojson'
import type { PathOptions, Layer, Map as LeafletMap } from 'leaflet'

/* ── Helper: grabs the map instance and exposes it via ref ─── */
function MapController({ mapRef }: { mapRef: React.MutableRefObject<LeafletMap | null> }) {
  const map = useMap()
  useEffect(() => { mapRef.current = map }, [map, mapRef])
  return null
}

/* ── Map constants ──────────────────────────────────────────── */
const CENTER: [number, number] = [32.8318, -6.9194]
const BOUNDS: [[number, number], [number, number]] = [
  [32.8236, -6.9263],
  [32.8400, -6.9125],
]

type Basemap  = 'satellite' | 'osm'
type Overlay  = 'thermal' | 'gray' | 'none'
type GeoLayer = 'both' | 'cb' | 'is' | 'none'

/* ── Colour palette for GeoJSON layers ──────────────────────── */
const IS_COLOR = '#f97316'   // orange  — Inverter Stations
const CB_COLOR = '#22d3ee'   // cyan    — Combiner Boxes

function isStyle(): PathOptions {
  return { color: IS_COLOR, fillColor: IS_COLOR, fillOpacity: 0.35, weight: 2 }
}
function cbStyle(): PathOptions {
  return { color: CB_COLOR, fillColor: CB_COLOR, fillOpacity: 0.25, weight: 1 }
}

/* ── Popup builder ──────────────────────────────────────────── */
function buildPopup(feature: Feature, type: 'cb' | 'is'): string {
  const p = feature.properties ?? {}
  if (type === 'is') {
    return `
      <div style="font-family:Inter,sans-serif;font-size:13px;min-width:160px">
        <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#f97316">
          ⚡ Inverter Station ${p.IS}
        </div>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="color:#64748b;padding:2px 6px 2px 0">Combiner Boxes</td><td style="font-weight:600">${p.N_CB}</td></tr>
          <tr><td style="color:#64748b;padding:2px 6px 2px 0">PV Modules</td><td style="font-weight:600">${p.N_PV?.toLocaleString()}</td></tr>
          <tr><td style="color:#64748b;padding:2px 6px 2px 0">Strings</td><td style="font-weight:600">${p.N_STRING}</td></tr>
        </table>
      </div>`
  }
  return `
    <div style="font-family:Inter,sans-serif;font-size:13px;min-width:160px">
      <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#22d3ee">
        📦 Combiner Box ${p.CB} <span style="color:#94a3b8;font-weight:400">— IS ${p.IS}</span>
      </div>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="color:#64748b;padding:2px 6px 2px 0">Strings</td><td style="font-weight:600">${p.N_STRINGS}</td></tr>
        <tr><td style="color:#64748b;padding:2px 6px 2px 0">Modules</td><td style="font-weight:600">${p.N_MODULES?.toLocaleString()}</td></tr>
      </table>
    </div>`
}

/* ══════════════════════════════════════════════════════════════ */
export default function SolarMap() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [basemap,   setBasemap]   = useState<Basemap>('satellite')
  const [overlay,   setOverlay]   = useState<Overlay>('thermal')
  const [geoLayer,  setGeoLayer]  = useState<GeoLayer>('both')
  const [opacity,   setOpacity]   = useState(0.75)
  const [overlayKey, setOverlayKey] = useState(0)

  const [cbData, setCbData] = useState<GeoJsonObject | null>(null)
  const [isData, setIsData] = useState<GeoJsonObject | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)

  /* Load GeoJSON files once */
  useEffect(() => {
    fetch('/combiner_box_4326.geojson').then(r => r.json()).then(setCbData)
    fetch('/inverter_station_4326.geojson').then(r => r.json()).then(setIsData)
  }, [])

  const card   = isDark ? '#151b27' : '#ffffff'
  const border = isDark ? '#1e2535' : '#e2e8f0'
  const text   = isDark ? '#e2e8f0' : '#1a1f2e'
  const muted  = isDark ? '#64748b' : '#9ca3af'
  const pill   = isDark ? '#0f1117' : '#f1f3f8'
  const ORANGE = '#e8733a'

  const basemapUrl = basemap === 'osm'
    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

  const R2 = 'https://pub-023707c04fd34a2296503afc43af378a.r2.dev'
  const overlayUrl = overlay === 'thermal'
    ? `${R2}/tiles_thermal/{z}/{x}/{y}.png`
    : `${R2}/tiles/{z}/{x}/{y}.png`

  const showCB = geoLayer === 'both' || geoLayer === 'cb'
  const showIS = geoLayer === 'both' || geoLayer === 'is'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
        background: card, border: `1px solid ${border}`,
        borderRadius: '10px', padding: '10px 18px',
      }}>

        <ToolGroup label="Basemap" muted={muted}>
          <Pill options={[
            { value: 'satellite', label: '🛰 Satellite' },
            { value: 'osm',       label: '🗺 OSM' },
          ]} value={basemap} onChange={v => setBasemap(v as Basemap)} pill={pill} active={ORANGE} muted={muted} />
        </ToolGroup>

        <Sep border={border} />

        <ToolGroup label="Raster" muted={muted}>
          <Pill options={[
            { value: 'thermal', label: '🌡 Thermal' },
            { value: 'gray',    label: '◧ Gray' },
            { value: 'none',    label: '✕ Off' },
          ]} value={overlay} onChange={v => { setOverlay(v as Overlay); setOverlayKey(k => k + 1) }}
          pill={pill} active={ORANGE} muted={muted} />
        </ToolGroup>

        <Sep border={border} />

        <ToolGroup label="Vectors" muted={muted}>
          <Pill options={[
            { value: 'both', label: 'All' },
            { value: 'is',   label: '⚡ Stations' },
            { value: 'cb',   label: '📦 Boxes' },
            { value: 'none', label: '✕ Off' },
          ]} value={geoLayer} onChange={v => setGeoLayer(v as GeoLayer)} pill={pill} active={ORANGE} muted={muted} />
        </ToolGroup>

        <Sep border={border} />

        {/* Opacity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <span style={{ fontSize: '12px', color: muted }}>Opacity</span>
          <input type="range" min={0} max={1} step={0.05} value={opacity}
            onChange={e => setOpacity(parseFloat(e.target.value))}
            style={{ width: '86px', accentColor: ORANGE, cursor: 'pointer' }} />
          <span style={{ fontSize: '12px', color: text, width: '34px', textAlign: 'right' }}>
            {Math.round(opacity * 100)}%
          </span>
        </div>
      </div>

      {/* ── Map ──────────────────────────────────────────────── */}
      <div style={{
        height: '620px', borderRadius: '12px', overflow: 'hidden',
        border: `1px solid ${border}`,
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 2px 12px rgba(0,0,0,0.08)',
      }}>
        <MapContainer center={CENTER} zoom={17} style={{ height: '620px', width: '100%' }} maxZoom={22} scrollWheelZoom>
          <MapController mapRef={mapRef} />

          {/* Basemap */}
          <TileLayer key={basemap} url={basemapUrl} maxZoom={22}
            attribution={basemap === 'osm' ? '&copy; OpenStreetMap contributors' : 'Tiles &copy; Esri'} />

          {/* Raster overlay */}
          {overlay !== 'none' && (
            <TileLayer key={overlayKey + overlay} url={overlayUrl} opacity={opacity}
              minNativeZoom={14} maxNativeZoom={20} maxZoom={22} bounds={BOUNDS} zIndex={400} />
          )}

          {/* Combiner Boxes */}
          {showCB && cbData && (
            <GeoJSON
              key="cb"
              data={cbData}
              style={cbStyle}
              onEachFeature={(feature: Feature, layer: Layer) => {
                layer.bindPopup(buildPopup(feature, 'cb'), { maxWidth: 240 })
                ;(layer as any).on('mouseover', function(this: any) { this.setStyle({ fillOpacity: 0.55, weight: 2 }) })
                ;(layer as any).on('mouseout',  function(this: any) { this.setStyle(cbStyle()) })
                ;(layer as any).on('click', function(this: any) {
                  const map = mapRef.current
                  if (!map) return
                  const bounds = (this as any).getBounds()
                  map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 20, duration: 0.8 })
                })
              }}
            />
          )}

          {/* Inverter Stations */}
          {showIS && isData && (
            <GeoJSON
              key="is"
              data={isData}
              style={isStyle}
              onEachFeature={(feature: Feature, layer: Layer) => {
                layer.bindPopup(buildPopup(feature, 'is'), { maxWidth: 240 })
                ;(layer as any).on('mouseover', function(this: any) { this.setStyle({ fillOpacity: 0.6, weight: 3 }) })
                ;(layer as any).on('mouseout',  function(this: any) { this.setStyle(isStyle()) })
                ;(layer as any).on('click', function(this: any) {
                  const map = mapRef.current
                  if (!map) return
                  const bounds = (this as any).getBounds()
                  map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 19, duration: 0.8 })
                })
              }}
            />
          )}

        </MapContainer>
      </div>

      {/* ── Legend row ───────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'stretch', gap: '10px', flexWrap: 'wrap',
      }}>

        {/* Thermal ramp */}
        {overlay === 'thermal' && (
          <div style={{
            flex: 1, minWidth: '240px', background: card, border: `1px solid ${border}`,
            borderRadius: '10px', padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '11px', color: muted, whiteSpace: 'nowrap' }}>−1.6</span>
            <div style={{
              flex: 1, height: '10px', borderRadius: '5px',
              background: 'linear-gradient(to right,#00004f,#1e009f,#5000c8,#a00000,#e83000,#ff7800,#ffd000,#ffff00,#ffffff)',
            }} />
            <span style={{ fontSize: '11px', color: muted, whiteSpace: 'nowrap' }}>73.6</span>
            <span style={{ fontSize: '11px', color: muted, marginLeft: '4px' }}>reflectance units</span>
          </div>
        )}

        {/* Vector legend */}
        {geoLayer !== 'none' && (
          <div style={{
            background: card, border: `1px solid ${border}`,
            borderRadius: '10px', padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            {showIS && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 14, height: 14, background: IS_COLOR, borderRadius: 3, opacity: 0.8 }} />
                <span style={{ fontSize: '12px', color: text }}>Inverter Stations</span>
                {isData && <span style={{ fontSize: '11px', color: muted }}>({(isData as any).features?.length})</span>}
              </div>
            )}
            {showCB && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 14, height: 14, background: CB_COLOR, borderRadius: 3, opacity: 0.8 }} />
                <span style={{ fontSize: '12px', color: text }}>Combiner Boxes</span>
                {cbData && <span style={{ fontSize: '11px', color: muted }}>({(cbData as any).features?.length})</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Shared sub-components ───────────────────────────────────── */
function ToolGroup({ label, muted, children }: { label: string; muted: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      {children}
    </div>
  )
}

function Sep({ border }: { border: string }) {
  return <div style={{ width: 1, height: 22, background: border, flexShrink: 0 }} />
}

function Pill({ options, value, onChange, pill, active, muted }: {
  options: { value: string; label: string }[]
  value: string; onChange: (v: string) => void
  pill: string; active: string; muted: string
}) {
  return (
    <div style={{ display: 'flex', background: pill, borderRadius: '50px', padding: '3px', gap: '2px' }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: '4px 12px', borderRadius: '50px', border: 'none', cursor: 'pointer',
          fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s',
          background: value === o.value ? active : 'transparent',
          color:      value === o.value ? '#fff'  : muted,
        }}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
