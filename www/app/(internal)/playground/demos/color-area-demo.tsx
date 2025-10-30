"use client";

import { parseColor } from "react-aria-components";

import { ColorArea } from "@dotui/registry/ui/color-area";

export function ColorAreaDemo() {
  return (
    <div className="grid grid-cols-3 gap-6 py-10">
      <ColorArea
        defaultValue={parseColor("hsl(0, 100%, 50%)")}
        xChannel="saturation"
        yChannel="lightness"
      />

      <ColorArea
        defaultValue={parseColor("hsb(0, 100%, 100%)")}
        xChannel="saturation"
        yChannel="brightness"
        colorSpace="hsb"
      />

      <ColorArea
        defaultValue={parseColor("rgb(255, 0, 0)")}
        xChannel="green"
        yChannel="blue"
      />

      <ColorArea
        defaultValue={parseColor("hsl(180, 100%, 50%)")}
        xChannel="hue"
        yChannel="saturation"
      />

      <ColorArea
        defaultValue={parseColor("hsl(120, 100%, 50%)")}
        xChannel="saturation"
        yChannel="lightness"
        isDisabled
      />
    </div>
  );
}
