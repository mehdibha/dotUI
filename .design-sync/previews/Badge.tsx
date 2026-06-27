import { Badge } from 'www'

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
}

const variants = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const

export const Variants = () => (
  <div style={row}>
    {variants.map((v) => (
      <Badge key={v} variant={v}>
        {v}
      </Badge>
    ))}
  </div>
)

export const Subtle = () => (
  <div style={row}>
    {variants.map((v) => (
      <Badge key={v} appearance="subtle" variant={v}>
        {v}
      </Badge>
    ))}
  </div>
)

export const Sizes = () => (
  <div style={row}>
    {(['sm', 'md', 'lg'] as const).map((s) => (
      <Badge key={s} variant="accent" size={s}>
        Badge {s}
      </Badge>
    ))}
  </div>
)
