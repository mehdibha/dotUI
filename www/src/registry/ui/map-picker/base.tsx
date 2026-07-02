'use client'

import 'leaflet/dist/leaflet.css'

import * as React from 'react'
import type {
  Icon,
  LeafletEvent,
  LeafletMouseEvent,
  Map as LeafletMap,
} from 'leaflet'
import type {
  MapContainer as MapContainerComponent,
  Marker as MarkerComponent,
  TileLayer as TileLayerComponent,
} from 'react-leaflet'

import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: helpers

/** A geographic coordinate the picker reports and accepts. */
interface LatLng {
  lat: number
  lng: number
}

const DEFAULT_CENTER: LatLng = { lat: 48.8566, lng: 2.3522 }

const round = (n: number): number => Math.round(n * 1e6) / 1e6

/**
 * Leaflet touches `window`/`document` at import time, so a static value import
 * crashes server-side rendering / prerendering. The engine is loaded lazily in
 * an effect (client-only) and held here; types above are import-only (erased).
 */
interface LeafletBundle {
  MapContainer: typeof MapContainerComponent
  TileLayer: typeof TileLayerComponent
  Marker: typeof MarkerComponent
  icon: Icon
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

  const [bundle, setBundle] = React.useState<LeafletBundle | null>(null)
  const [map, setMap] = React.useState<LeafletMap | null>(null)

  React.useEffect(() => {
    let active = true
    void Promise.all([import('react-leaflet'), import('leaflet')]).then(
      ([reactLeaflet, leafletModule]) => {
        const L = leafletModule.default
        // Leaflet ships its marker icon as a CSS background, which breaks under
        // asset-fingerprinting bundlers; point it at the CDN-hosted images.
        const icon = L.icon({
          iconUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
        if (active) {
          setBundle({
            MapContainer: reactLeaflet.MapContainer,
            TileLayer: reactLeaflet.TileLayer,
            Marker: reactLeaflet.Marker,
            icon,
          })
        }
      },
    )
    return () => {
      active = false
    }
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

  // Move the marker to wherever the user clicks (imperative — avoids the
  // useMapEvents hook so the engine can stay lazily loaded).
  React.useEffect(() => {
    if (!map) return
    const onClick = (event: LeafletEvent) => {
      const { latlng } = event as LeafletMouseEvent
      setValue({ lat: latlng.lat, lng: latlng.lng })
    }
    map.on('click', onClick)
    return () => {
      map.off('click', onClick)
    }
  }, [map, setValue])

  // Pan when a controlled value changes from outside.
  React.useEffect(() => {
    if (map && isControlled) map.panTo(value)
  }, [map, isControlled, value])

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
        {bundle && (
          <bundle.MapContainer
            center={value}
            zoom={zoom}
            scrollWheelZoom
            ref={setMap}
            className="size-full"
          >
            <bundle.TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <bundle.Marker
              position={value}
              icon={bundle.icon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const { lat, lng } = event.target.getLatLng()
                  setValue({ lat, lng })
                },
              }}
            />
          </bundle.MapContainer>
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
