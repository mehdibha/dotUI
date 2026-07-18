// Test-only ambient types: apca-w3 ships no declarations.
declare module 'apca-w3' {
  export function APCAcontrast(
    txtY: number,
    bgY: number,
    places?: number,
  ): number
  export function sRGBtoY(rgb: [number, number, number]): number
}
