import {
  Button,
  ColorArea,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  DialogContent,
  Popover,
} from 'www'

const wrap: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}

export const Default = () => (
  <div style={wrap}>
    <ColorPicker defaultOpen defaultValue="hsb(220, 80%, 90%)">
      <Button isIconOnly aria-label="color">
        <ColorSwatch />
      </Button>
      <Popover>
        <DialogContent>
          <ColorArea
            colorSpace="hsb"
            xChannel="saturation"
            yChannel="brightness"
            style={{ width: '100%' }}
          />
          <ColorSlider colorSpace="hsb" channel="hue" />
        </DialogContent>
      </Popover>
    </ColorPicker>
  </div>
)
