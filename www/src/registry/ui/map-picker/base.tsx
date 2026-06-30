'use client'

import 'leaflet/dist/leaflet.css'

import * as React from 'react'
import L from 'leaflet'
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'

import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: mapPickerStyles

// MARK: helpers

/** A geographic coordinate the picker reports and accepts. */
interface LatLng {
  lat: number
  lng: number
}

const DEFAULT_CENTER: LatLng = { lat: 48.8566, lng: 2.3522 }

/**
 * Leaflet ships its default marker icon as CSS `background-image`, which breaks
 * under bundlers that fingerprint asset URLs. Point the default icon at the
 * CDN-hosted images so the marker renders without a local asset pipeline.
 */
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const round = (n: number): number => Math.round(n * 1e6) / 1e6

// MARK: ClickHandler

/** Moves the marker to wherever the user clicks the map. */
function ClickHandler({ onPick }: { onPick: (value: LatLng) => void }) {
  useMapEvents({
    click: (event) => {
      onPick({ lat: event.latlng.lat, lng: event.latlng.lng })
    },
  })
  return null
}

// MARK: Recenter

/** Pans the map when the controlled value changes from outside. */
function Recenter({ value }: { value: LatLng }) {
  const map = useMap()
  React.useEffect(() => {
    map.panTo(value)
  }, [map, value])
  return null
}

// MARK: MapPicker

interface MapPickerProps extends Omit<
  React.ComponentProps<'div'>,
  'onChange' | 'defaultValue'
> {
  /** The selected coordinate (controlled). */
  value?: LatLng
  /** The initial coordinate (uncontrolled). */
  defaultValue?: LatLng
  /** Called with the new coordinate whenever the marker moves. */
  onChange?: (value: LatLng) => void
  /** The initial zoom level of the map. */
  zoom?: number
  /** Hide the coordinate readout footer. */
  hideFooter?: boolean
  /** Show a button that recenters the picker on the device's location. */
  showLocateButton?: boolean
}

function MapPicker({
  value: valueProp,
  defaultValue,
  onChange,
  zoom = 13,
  hideFooter = false,
  showLocateButton = true,
  className,
  children,
  ...props
}: MapPickerProps) {
  const { root, surface, footer, coords } = useStyles()()

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const [uncontrolled, setUncontrolled] = React.useState<LatLng>(
    defaultValue ?? DEFAULT_CENTER,
  )
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolled

  const setValue = React.useCallback(
    (next: LatLng) => {
      if (!isControlled) setUncontrolled(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  const handleLocate = React.useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((position) => {
      setValue({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }, [setValue])

  return (
    <div data-map-picker="" className={root({ className })} {...props}>
      <div data-map-picker-surface="" className={surface()}>
        {mounted && (
          <MapContainer
            center={value}
            zoom={zoom}
            scrollWheelZoom
            className="size-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={value}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const { lat, lng } = event.target.getLatLng()
                  setValue({ lat, lng })
                },
              }}
            />
            <ClickHandler onPick={setValue} />
            {isControlled && <Recenter value={value} />}
          </MapContainer>
        )}
      </div>

      {!hideFooter && (
        <div data-map-picker-footer="" className={footer()}>
          <span className={coords()}>
            {round(value.lat)}, {round(value.lng)}
          </span>
          <div className="flex items-center gap-2">
            {showLocateButton && (
              <Button size="sm" variant="quiet" onPress={handleLocate}>
                Use my location
              </Button>
            )}
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

// MARK: separator

export type { LatLng, MapPickerProps }
export { MapPicker }
