import { Separator } from 'www'

export const Horizontal = () => (
  <div style={{ width: '100%', maxWidth: 320 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontWeight: 700 }}>dotUI</span>
      <span style={{ fontSize: 14, opacity: 0.7 }}>
        Tools for building accessible UI.
      </span>
    </div>
    <Separator style={{ marginTop: 16, marginBottom: 16 }} />
    <span style={{ fontSize: 14, opacity: 0.7 }}>
      Compose a design system and export the code you own.
    </span>
  </div>
)

export const Vertical = () => (
  <div
    style={{
      display: 'flex',
      height: 20,
      alignItems: 'center',
      gap: 16,
      fontSize: 14,
    }}
  >
    <span>Docs</span>
    <Separator orientation="vertical" />
    <span>Components</span>
    <Separator orientation="vertical" />
    <span>Hooks</span>
    <Separator orientation="vertical" />
    <span>Themes</span>
  </div>
)
