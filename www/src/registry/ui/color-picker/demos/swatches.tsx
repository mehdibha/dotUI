import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from '@/registry/ui/color-swatch-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <ColorPicker defaultValue="#5100FF">
      <Button aria-label="Pick a color" isIconOnly>
        <ColorSwatch />
      </Button>
      <Popover>
        <DialogContent>
          <ColorArea
            aria-label="Color"
            colorSpace="hsb"
            xChannel="saturation"
            yChannel="brightness"
            className="w-full"
          />
          <ColorSlider colorSpace="hsb" channel="hue" />
          <ColorSwatchPicker
            aria-label="Color swatches"
            className="mt-2 justify-between"
          >
            <ColorSwatchPickerItem color="#A00" />
            <ColorSwatchPickerItem color="#f80" />
            <ColorSwatchPickerItem color="#080" />
            <ColorSwatchPickerItem color="#08f" />
            <ColorSwatchPickerItem color="#008" />
            <ColorSwatchPickerItem color="#fff" />
          </ColorSwatchPicker>
        </DialogContent>
      </Popover>
    </ColorPicker>
  )
}
