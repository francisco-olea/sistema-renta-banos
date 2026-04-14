"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { RegistroRuta, EstatusRuta } from "@/lib/data"

// Fix Leaflet default marker icons broken by webpack/Next.js
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  })
}

// Approximate coordinates for the demo locations in San Luis Rio Colorado, Sonora
const LOCATION_COORDS: Array<{ key: string; coords: [number, number] }> = [
  { key: "Obra Av. Obregon 1201", coords: [32.4672, -114.7928] },
  { key: "Calle Segunda 908", coords: [32.4608, -114.7752] },
  { key: "Palacio Municipal", coords: [32.4685, -114.7698] },
  { key: "Malecon Turistico", coords: [31.6793, -114.4904] },
  { key: "Eje Federalismo 2100", coords: [32.4795, -114.7885] },
  { key: "Blvd. Luis Donaldo Colosio 455", coords: [32.4558, -114.7815] },
  { key: "Carretera San Luis RC - Mexicali Km 7", coords: [32.5228, -114.8235] },
]

function getCoords(ubicacion: string): [number, number] | null {
  for (const { key, coords } of LOCATION_COORDS) {
    if (ubicacion.includes(key) || key.includes(ubicacion)) return coords
  }
  return null
}

const RUTA_COLORS: Record<number, string> = {
  1: "#3b82f6",
  2: "#22c55e",
  3: "#f97316",
  4: "#a855f7",
}

const ESTATUS_COLORS: Record<EstatusRuta, string> = {
  completado: "#16a34a",
  en_proceso: "#d97706",
  pendiente: "#64748b",
}

function createMarkerIcon(ruta: number) {
  const color = RUTA_COLORS[ruta] ?? "#64748b"
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="42" viewBox="0 0 28 42">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 28 14 28S28 24.5 28 14C28 6.268 21.732 0 14 0z" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="14" cy="14" r="6" fill="white"/>
    <text x="14" y="18" text-anchor="middle" font-size="9" font-weight="bold" fill="${color}">${ruta}</text>
  </svg>`
  return L.divIcon({
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -44],
    className: "",
  })
}

// Child component that updates map bounds when markers change
function MapBoundsUpdater({
  positions,
}: {
  positions: [number, number][]
}) {
  const map = useMap()
  useEffect(() => {
    if (positions.length === 0) return
    if (positions.length === 1) {
      map.setView(positions[0], 15, { animate: true })
    } else {
      const bounds = L.latLngBounds(positions.map((p) => L.latLng(p[0], p[1])))
      map.fitBounds(bounds, { padding: [60, 60], animate: true })
    }
  }, [map, positions])
  return null
}

interface RutaMapProps {
  records: RegistroRuta[]
}

export default function RutaMap({ records }: RutaMapProps) {
  useEffect(() => {
    fixLeafletIcons()
  }, [])

  const markers = records
    .map((r) => {
      const coords =
        r.map_lat != null && r.map_lng != null
          ? ([r.map_lat, r.map_lng] as [number, number])
          : getCoords(r.ubicacion)
      return { record: r, coords }
    })
    .filter(
      (m): m is { record: RegistroRuta; coords: [number, number] } =>
        m.coords !== null,
    )

  const positions = markers.map((m) => m.coords)

  const defaultCenter: [number, number] = [32.465, -114.780]

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      className="h-[420px] w-full rounded-xl z-0"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBoundsUpdater positions={positions} />
      {markers.map(({ record, coords }) => (
        <Marker key={record.id} position={coords} icon={createMarkerIcon(record.ruta)}>
          <Popup>
            <div style={{ minWidth: 180 }}>
              <p style={{ fontWeight: 700, marginBottom: 2, fontSize: 13 }}>
                {record.cliente}
              </p>
              <p style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>
                {record.ubicacion}
              </p>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span
                  style={{
                    background: RUTA_COLORS[record.ruta] ?? "#64748b",
                    color: "white",
                    borderRadius: 4,
                    padding: "1px 7px",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  Ruta {record.ruta}
                </span>
                <span
                  style={{
                    background: ESTATUS_COLORS[record.estatus] + "22",
                    color: ESTATUS_COLORS[record.estatus],
                    borderRadius: 4,
                    padding: "1px 7px",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {record.estatus.replace("_", " ")}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      {markers.length === 0 && (
        <></>
      )}
    </MapContainer>
  )
}
