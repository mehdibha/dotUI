'use client'

import { ColorSwatch, type ColorSwatchProps } from '@/registry/ui/color-swatch'

export default function Demo({ color = '#ff0000' }: ColorSwatchProps = {}) {
  return <ColorSwatch color={color}></ColorSwatch>
}
