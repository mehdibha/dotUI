import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <ColorPicker>
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
        </DialogContent>
      </Popover>
    </ColorPicker>
  )
}
