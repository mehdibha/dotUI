"use client";

import { parseColor } from "react-aria-components";

import { ColorSlider } from "@dotui/registry-v2/ui/color-slider";

export function ColorSliderDemo() {
  return (
    <div className="flex flex-col gap-6">
      <ColorSlider
        channel="hue"
        defaultValue={parseColor("hsl(0, 100%, 50%)")}
        label="Hue"
        showValueLabel
      />

      <ColorSlider
        channel="saturation"
        defaultValue={parseColor("hsl(0, 100%, 50%)")}
        label="Saturation"
        showValueLabel
      />

      <ColorSlider
        channel="lightness"
        defaultValue={parseColor("hsl(0, 50%, 50%)")}
        label="Lightness"
        showValueLabel
      />

      <ColorSlider
        channel="alpha"
        defaultValue={parseColor("hsla(0, 100%, 50%, 0.5)")}
        label="Alpha"
        showValueLabel
      />

      <ColorSlider
        channel="red"
        defaultValue={parseColor("rgb(255, 0, 0)")}
        label="Red"
        showValueLabel
      />

      <ColorSlider
        orientation="vertical"
        channel="hue"
        defaultValue={parseColor("hsl(180, 100%, 50%)")}
        label="Vertical"
        showValueLabel
      />

      <ColorSlider
        channel="hue"
        defaultValue={parseColor("hsl(120, 100%, 50%)")}
        isDisabled
        label="Disabled"
        showValueLabel
      />
    </div>
  );
}
