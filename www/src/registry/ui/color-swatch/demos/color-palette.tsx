import { ColorSwatch } from '@/registry/ui/color-swatch'

const palette = [
  { name: 'Sky', color: '#0ea5e9' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Slate', color: '#64748b' },
]

export default function Demo() {
  return (
    <div className="grid w-full max-w-xs grid-cols-3 gap-3">
      {palette.map((swatch) => (
        <div key={swatch.name} className="flex flex-col items-center gap-1.5">
          <ColorSwatch color={swatch.color} className="size-10" />
          <span className="text-xs text-fg-muted">{swatch.name}</span>
        </div>
      ))}
    </div>
  )
}
