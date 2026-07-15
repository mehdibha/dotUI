/**
 * A QR code encodes a value, such as a URL, as a scannable matrix barcode.
 */
export interface QRCodeProps extends React.ComponentProps<'div'> {
  /**
   * The value to encode, such as a URL or plain text.
   */
  value: string

  /**
   * The error correction level. Higher levels tolerate more visual damage
   * (L 7%, M 15%, Q 25%, H 30%) at the cost of a denser code.
   * @default 'M' — 'H' when a logo is present
   */
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'

  /**
   * An optional logo displayed at the center of the code. Modules behind it
   * are excavated, and the default error correction level is raised to 'H'.
   */
  children?: React.ReactNode
}
