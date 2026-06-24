import { ColorSlider, ColorSliderControl, ColorSliderOutput, Label } from 'www'

const wrap: React.CSSProperties = { width: 260 }
const head: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}
const row: React.CSSProperties = { display: 'flex', gap: 16 }

export const Default = () => (
  <div style={wrap}>
    <ColorSlider aria-label="Hue" channel="hue" defaultValue="hsl(200, 100%, 50%)">
      <ColorSliderControl />
    </ColorSlider>
  </div>
)

export const WithLabel = () => (
  <div style={wrap}>
    <ColorSlider channel="alpha" defaultValue="#6366f1">
      <div style={head}>
        <Label>Opacity</Label>
        <ColorSliderOutput />
      </div>
      <ColorSliderControl />
    </ColorSlider>
  </div>
)

export const Vertical = () => (
  <div style={row}>
    <ColorSlider orientation="vertical" channel="hue" defaultValue="hsl(0, 100%, 50%)">
      <ColorSliderControl />
    </ColorSlider>
    <ColorSlider orientation="vertical" channel="saturation" defaultValue="hsl(280, 100%, 50%)">
      <ColorSliderControl />
    </ColorSlider>
  </div>
)
