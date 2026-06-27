import { Volume1Icon, Volume2Icon } from 'lucide-react'
import {
  Description,
  Label,
  Slider,
  SliderControl,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from 'www'

const head: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
}

export const Single = () => (
  <Slider defaultValue={60} style={{ width: 300 }}>
    <div style={head}>
      <Label>Opacity</Label>
      <SliderOutput />
    </div>
    <SliderControl />
  </Slider>
)

export const Range = () => (
  <Slider defaultValue={[200, 350]} minValue={100} maxValue={500} style={{ width: 300 }}>
    <div style={head}>
      <Label>Price range</Label>
      <SliderOutput />
    </div>
    <SliderControl />
  </Slider>
)

export const WithIcons = () => (
  <Slider defaultValue={45} style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={head}>
      <Label>Volume</Label>
      <SliderOutput />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Volume1Icon />
      <SliderControl>
        <SliderTrack>
          <SliderFill />
        </SliderTrack>
        <SliderThumb />
      </SliderControl>
      <Volume2Icon />
    </div>
    <Description>Adjust the playback volume.</Description>
  </Slider>
)

export const Disabled = () => (
  <Slider defaultValue={40} isDisabled style={{ width: 300 }}>
    <div style={head}>
      <Label>Brightness</Label>
      <SliderOutput />
    </div>
    <SliderControl />
  </Slider>
)
