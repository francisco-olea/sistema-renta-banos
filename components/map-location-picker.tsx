"use client"

import { useEffect, useState } from "react"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapLocationPickerProps {
  lat: number | null | undefined
  lng: number | null | undefined
  onChange: (lat: number, lng: number) => void
}

function setupLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  })
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng)
    },
  })

  return null
}

export function MapLocationPicker({ lat, lng, onChange }: MapLocationPickerProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setupLeafletIcons()
  }, [])

  const defaultCenter: [number, number] = [32.466, -114.783]
  const center: [number, number] = lat != null && lng != null ? [lat, lng] : defaultCenter
  const mapKey = `${center[0]}-${center[1]}`

  if (!isMounted) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
        Cargando mapa...
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <MapContainer key={mapKey} center={center} zoom={13} className="h-64 w-full z-0" style={{ zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        {lat != null && lng != null && <Marker position={[lat, lng]} />}
      </MapContainer>
    </div>
  )
}
