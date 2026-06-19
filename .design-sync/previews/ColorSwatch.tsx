import { ColorSwatch } from 'www'

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
}

export const Default = () => (
  <div style={row}>
    <ColorSwatch color="#f00" />
  </div>
)

export const Palette = () => (
  <div style={row}>
    {['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9', '#a855f7'].map((c) => (
      <ColorSwatch key={c} color={c} />
    ))}
  </div>
)

export const Alpha = () => (
  <div style={row}>
    {['#6366f1ff', '#6366f1aa', '#6366f166', '#6366f122'].map((c) => (
      <ColorSwatch key={c} color={c} />
    ))}
  </div>
)
