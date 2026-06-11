'use client'

import React from 'react'
import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

import { Button } from '@/registry/ui/button'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider, ColorSliderControl } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { Popover } from '@/registry/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

export default function Demo() {
  const [space, setSpace] =
    React.useState<ColorAreaPrimitives.ColorSpace>('rgb')
  return (
    <ColorPicker defaultValue="#5100FF">
      <Button>
        <ColorSwatch />
      </Button>
      <Popover>
        <DialogContent>
          <Select
            aria-label="Color format"
            defaultValue={space}
            onChange={(key) => setSpace(key as ColorAreaPrimitives.ColorSpace)}
          >
            <SelectTrigger size="sm" />
            <SelectContent>
              <SelectItem id="rgb">RGB</SelectItem>
              <SelectItem id="hsl">HSL</SelectItem>
              <SelectItem id="hsb">HSB</SelectItem>
            </SelectContent>
          </Select>
          {ColorAreaPrimitives.getColorChannels(space).map((channel) => (
            <ColorSlider key={channel} colorSpace={space} channel={channel}>
              <Label>{channel}</Label>
              <ColorSliderControl />
            </ColorSlider>
          ))}
          <ColorSlider channel="alpha">
            <Label>Alpha</Label>
            <ColorSliderControl />
          </ColorSlider>
        </DialogContent>
      </Popover>
    </ColorPicker>
  )
}
