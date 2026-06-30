/**
 * A geographic coordinate the picker reports and accepts.
 */
export interface LatLng {
  lat: number
  lng: number
}

/**
 * A map location picker built on Leaflet and OpenStreetMap. Click anywhere on
 * the map or drag the marker to pick a coordinate; the selection is reported as
 * `{ lat, lng }` and the readout footer shows the current value.
 */
export interface MapPickerProps extends Omit<
  React.ComponentProps<'div'>,
  'onChange' | 'defaultValue'
> {
  /**
   * The selected coordinate (controlled).
   */
  value?: LatLng

  /**
   * The initial coordinate (uncontrolled).
   * @default { lat: 48.8566, lng: 2.3522 }
   */
  defaultValue?: LatLng

  /**
   * Called with the new coordinate whenever the marker moves, whether from a
   * map click, a marker drag, or the locate button.
   */
  onChange?: (value: LatLng) => void

  /**
   * The initial zoom level of the map.
   * @default 13
   */
  zoom?: number

  /**
   * Whether to hide the coordinate readout footer.
   * @default false
   */
  hideFooter?: boolean

  /**
   * Whether to show a button that recenters the picker on the device's
   * location via the Geolocation API.
   * @default true
   */
  showLocateButton?: boolean
}
