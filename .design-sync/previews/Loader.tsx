import { Button, Loader } from 'www'

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 24,
}

const inline: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
}

const card: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  width: 220,
  height: 120,
  borderRadius: 8,
  border: '1px solid var(--border, rgba(0,0,0,0.1))',
}

export const Basic = () => (
  <div style={row}>
    <Loader />
  </div>
)

export const InContext = () => (
  <div style={row}>
    <span style={inline}>
      <Loader />
      Loading...
    </span>
    <Button isDisabled>
      <Loader />
      Please wait
    </Button>
  </div>
)

export const LoadingState = () => (
  <div style={card}>
    <Loader />
    <span style={{ fontSize: 13, color: 'var(--fg-muted, #888)' }}>
      Fetching data
    </span>
  </div>
)
