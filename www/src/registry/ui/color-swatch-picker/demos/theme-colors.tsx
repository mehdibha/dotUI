import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from '@/registry/ui/color-swatch-picker'
import { Description, Label } from '@/registry/ui/field'

const accents = [
  '#18181b',
  '#dc2626',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
  '#0d9488',
  '#2563eb',
  '#7c3aed',
  '#db2777',
]

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label id="accent-label">Accent</Label>
        <Description>Pick a preset color scheme.</Description>
      </div>
      <ColorSwatchPicker
        aria-labelledby="accent-label"
        defaultValue="#2563eb"
        className="grid grid-cols-5"
      >
        {accents.map((color) => (
          <ColorSwatchPickerItem key={color} color={color} />
        ))}
      </ColorSwatchPicker>
    </div>
  )
}
