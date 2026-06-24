// ColorThumb is the draggable handle rendered inside ColorArea and ColorSlider.
// It is only meaningful inside a parent control, so each cell composes it there.
import { ColorArea, ColorSlider, ColorSliderControl, ColorThumb } from 'www'

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 16,
}
const wrap: React.CSSProperties = { width: 220 }

export const InColorArea = () => (
  <ColorArea
    colorSpace="hsb"
    xChannel="saturation"
    yChannel="brightness"
    defaultValue="hsb(220, 70%, 80%)"
  >
    <ColorThumb />
  </ColorArea>
)

export const InColorSlider = () => (
  <div style={wrap}>
    <ColorSlider aria-label="Hue" channel="hue" defaultValue="hsl(280, 100%, 50%)">
      <ColorSliderControl>
        <ColorThumb />
      </ColorSliderControl>
    </ColorSlider>
  </div>
)

export const Both = () => (
  <div style={row}>
    <ColorArea defaultValue="hsb(140, 100%, 60%)">
      <ColorThumb />
    </ColorArea>
    <ColorSlider
      orientation="vertical"
      channel="hue"
      defaultValue="hsl(0, 100%, 50%)"
    >
      <ColorSliderControl>
        <ColorThumb />
      </ColorSliderControl>
    </ColorSlider>
  </div>
)
