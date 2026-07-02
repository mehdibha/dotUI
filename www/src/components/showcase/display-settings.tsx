'use client'

import { useState } from 'react'
import { MoonStarIcon, SunIcon, Volume2Icon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { Description, FieldContent, Label } from '@/registry/ui/field'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'
import { Switch, SwitchControl } from '@/registry/ui/switch'

export function DisplaySettings({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [brightness, setBrightness] = useState(60)
  const [volume, setVolume] = useState(35)
  const [nightShift, setNightShift] = useState(true)

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Display</CardTitle>
        <CardDescription>Tune your viewing experience.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Slider
          value={brightness}
          onChange={(v) => setBrightness(v as number)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-2">
            <Label className="flex items-center gap-1.5">
              <SunIcon className="size-4 text-fg-muted" aria-hidden />
              Brightness
            </Label>
            <SliderOutput className="text-sm text-fg-muted tabular-nums" />
          </div>
          <SliderControl />
        </Slider>

        <Slider
          value={volume}
          onChange={(v) => setVolume(v as number)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-2">
            <Label className="flex items-center gap-1.5">
              <Volume2Icon className="size-4 text-fg-muted" aria-hidden />
              Volume
            </Label>
            <SliderOutput className="text-sm text-fg-muted tabular-nums" />
          </div>
          <SliderControl />
        </Slider>

        <Switch
          isSelected={nightShift}
          onChange={setNightShift}
          className="w-full justify-between gap-3"
        >
          <FieldContent className="flex-row items-center gap-2">
            <MoonStarIcon
              className="size-4 shrink-0 text-fg-muted"
              aria-hidden
            />
            <span className="flex flex-col">
              <Label>Night Shift</Label>
              <Description>Warmer colors after sunset.</Description>
            </span>
          </FieldContent>
          <SwitchControl />
        </Switch>
      </CardContent>
    </Card>
  )
}
