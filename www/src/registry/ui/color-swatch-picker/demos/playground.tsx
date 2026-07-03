'use client'

import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from '@/registry/ui/color-swatch-picker'

export default function Demo({ isDisabled = false } = {}) {
  return (
    <ColorSwatchPicker aria-label="Color swatches" defaultValue="#ff0000">
      <ColorSwatchPickerItem
        data-control-target
        color="#ff0000"
        isDisabled={isDisabled}
      />
      <ColorSwatchPickerItem color="#00ff00" />
      <ColorSwatchPickerItem color="#0000ff" />
      <ColorSwatchPickerItem color="#ffff00" />
      <ColorSwatchPickerItem color="#ff00ff" />
      <ColorSwatchPickerItem color="#00ffff" />
    </ColorSwatchPicker>
  )
}
