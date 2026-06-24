import { ColorEditor } from 'www'

const wrap: React.CSSProperties = { width: 260 }

export const Default = () => (
  <div style={wrap}>
    <ColorEditor defaultValue="#6366f1" />
  </div>
)

export const WithAlpha = () => (
  <div style={wrap}>
    <ColorEditor defaultValue="#22c55e" showAlphaChannel colorFormat="rgb" />
  </div>
)
