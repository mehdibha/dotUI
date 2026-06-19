import { ScrollFade } from 'www'

const card: React.CSSProperties = {
  width: '100%',
  maxWidth: 360,
}

const updates = [
  'Invite reviewers once the spec is stable.',
  'Confirm keyboard access for every overflow region.',
  'Measure content changes after async data lands.',
  'Keep the browser scrollbar visible for familiarity.',
  'Prefer masks over static overlays when color varies.',
  'Use edge-aware variables so the fade hides at limits.',
  'Resize observers keep the affordance in sync.',
  'Mutation observers catch late-rendered rows.',
  'RTL scrolling needs normalized start and end.',
  'Programmatic scroll should update the fade too.',
]

const row: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: 14,
  borderRadius: 6,
  background: 'var(--bg-muted, rgba(0,0,0,0.05))',
}

const chip: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: 14,
  whiteSpace: 'nowrap',
  borderRadius: 6,
  background: 'var(--bg-muted, rgba(0,0,0,0.05))',
}

const filters = [
  'Overview',
  'Accessibility',
  'Styling',
  'Composition',
  'Animation',
  'Validation',
  'Internationalization',
  'Performance',
  'Testing',
]

export const Vertical = () => (
  <div style={card}>
    <ScrollFade style={{ height: 160, overflow: 'auto', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {updates.map((u) => (
          <div key={u} style={row}>
            {u}
          </div>
        ))}
      </div>
    </ScrollFade>
  </div>
)

export const Horizontal = () => (
  <div style={card}>
    <ScrollFade style={{ overflowX: 'auto', width: '100%' }}>
      <div style={{ display: 'flex', gap: 8, width: 'max-content', padding: 2 }}>
        {filters.map((f) => (
          <span key={f} style={chip}>
            {f}
          </span>
        ))}
      </div>
    </ScrollFade>
  </div>
)
