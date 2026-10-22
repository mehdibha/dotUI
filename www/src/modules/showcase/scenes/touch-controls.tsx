import { useState } from "react"

import { BellIcon, Volume2Icon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { Label } from "@/registry/ui/field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"
import { Switch, SwitchControl } from "@/registry/ui/switch"

export function TouchControlsScene() {
  const [volume, setVolume] = useState(60)

  return (
    <div className="flex w-full max-w-72 flex-col gap-5">
      <Switch defaultSelected className="w-full justify-between gap-3">
        <Label className="flex items-center gap-2">
          <BellIcon className="size-4 text-fg-muted" aria-hidden />
          Push notifications
        </Label>
        <SwitchControl />
      </Switch>
      <Slider
        value={volume}
        onChange={(value) => setVolume(value as number)}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-2">
          <Label className="flex items-center gap-2">
            <Volume2Icon className="size-4 text-fg-muted" aria-hidden />
            Volume
          </Label>
          <SliderOutput className="text-sm text-fg-muted tabular-nums" />
        </div>
        <SliderControl />
      </Slider>
      <SegmentedControl
        aria-label="Appearance"
        defaultSelectedKeys={["auto"]}
        className="w-full *:flex-1"
      >
        <SegmentedControlItem id="light">Light</SegmentedControlItem>
        <SegmentedControlItem id="dark">Dark</SegmentedControlItem>
        <SegmentedControlItem id="auto">Auto</SegmentedControlItem>
      </SegmentedControl>
      <Button variant="primary" className="w-full">
        Save changes
      </Button>
    </div>
  )
}
