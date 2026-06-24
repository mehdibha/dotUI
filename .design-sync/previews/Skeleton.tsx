import { Skeleton } from 'www'

const card: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 320,
  padding: 16,
  border: '1px solid var(--color-border, #e5e7eb)',
  borderRadius: 12,
}

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}

const lines: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  flex: 1,
}

export const Profile = () => (
  <Skeleton isLoading style={card}>
    <div style={row}>
      <div data-skeleton style={{ width: 48, height: 48, borderRadius: 9999 }} />
      <div style={lines}>
        <div data-skeleton style={{ width: '60%', height: 14, borderRadius: 6 }} />
        <div data-skeleton style={{ width: '40%', height: 12, borderRadius: 6 }} />
      </div>
    </div>
    <div data-skeleton style={{ width: '100%', height: 12, borderRadius: 6 }} />
    <div data-skeleton style={{ width: '90%', height: 12, borderRadius: 6 }} />
    <div data-skeleton style={{ width: '75%', height: 12, borderRadius: 6 }} />
  </Skeleton>
)

export const MediaCard = () => (
  <Skeleton isLoading style={{ ...card, padding: 0, overflow: 'hidden' }}>
    <div data-skeleton style={{ width: '100%', height: 140 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      <div data-skeleton style={{ width: '70%', height: 16, borderRadius: 6 }} />
      <div data-skeleton style={{ width: '100%', height: 12, borderRadius: 6 }} />
      <div data-skeleton style={{ width: '85%', height: 12, borderRadius: 6 }} />
    </div>
  </Skeleton>
)

export const Loaded = () => (
  <Skeleton isLoading={false} style={card}>
    <div style={row}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 9999,
          background: 'var(--color-bg-muted, #f1f5f9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
        }}
      >
        DU
      </div>
      <div style={lines}>
        <strong>Design system report</strong>
        <small>Updated a few seconds ago</small>
      </div>
    </div>
    <p>Component usage is growing across product surfaces this quarter.</p>
  </Skeleton>
)
