import { ColorArea } from 'www'

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 16,
}

export const Default = () => (
  <ColorArea defaultValue="hsb(220, 100%, 50%)" />
)

export const Channels = () => (
  <div style={row}>
    <ColorArea
      colorSpace="hsb"
      xChannel="saturation"
      yChannel="brightness"
      defaultValue="hsb(280, 100%, 100%)"
    />
    <ColorArea
      xChannel="red"
      yChannel="blue"
      defaultValue="rgb(100, 149, 237)"
    />
  </div>
)

export const Disabled = () => (
  <ColorArea defaultValue="hsb(220, 100%, 50%)" isDisabled />
)
