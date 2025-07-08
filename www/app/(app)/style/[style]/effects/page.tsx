"use client";

import { ColorPicker } from "@dotui/ui/components/color-picker";
import { ColorSwatch } from "@dotui/ui/components/color-swatch";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { Slider } from "@dotui/ui/components/slider";

export default function StyleEffectsPage() {
  return (
    <div>
      <p className="text-base font-semibold">Patterns</p>
      <Select
        label="Background pattern"
        defaultSelectedKey="none"
        className="mt-2"
      >
        <SelectItem id="none">None</SelectItem>
        <SelectItem id="dots">Dots</SelectItem>
        <SelectItem id="lines">Lines</SelectItem>
        <SelectItem id="squares">Squares</SelectItem>
      </Select>
      {/* texture applied on the entire website */}
      <Select label="Texture" defaultSelectedKey="none" className="mt-2">
        <SelectItem id="none">None</SelectItem>
        <SelectItem id="none">None</SelectItem>
      </Select>
      <p className="mt-6 text-base font-semibold">Shadows</p>
      <ColorPicker className="mt-2 w-full">
        <ColorSwatch />
        Shadow color
      </ColorPicker>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <Slider
          label="Opacity"
          defaultValue={0.25}
          minValue={0}
          maxValue={1}
          step={0.05}
          getValueLabel={(value) => `${value}%`}
          className="col-span-2 w-full"
        />
        <Slider
          label="Blur radius"
          defaultValue={2}
          minValue={0}
          maxValue={50}
          step={1}
          getValueLabel={(value) => `${value}px`}
          className="col-span-1 w-full"
        />
        <Slider
          label="Spread"
          defaultValue={0}
          minValue={0}
          maxValue={100}
          step={1}
          getValueLabel={(value) => `${value}%`}
          className="col-span-1 w-full"
        />
        <Slider
          label="Offset X"
          defaultValue={0}
          minValue={-50}
          maxValue={50}
          step={1}
          getValueLabel={(value) => `${value}px`}
          className="col-span-1 w-full"
        />
        <Slider
          label="Offset Y"
          defaultValue={1}
          minValue={-50}
          maxValue={50}
          step={1}
          getValueLabel={(value) => `${value}px`}
          className="col-span-1 w-full"
        />
      </div>
      {/* <p className="mt-6 text-base font-semibold">Spacing</p>
      <Slider
        label="Spacing"
        defaultValue={0.25}
        minValue={0.1}
        maxValue={0.35}
        step={0.05}
        getValueLabel={(value) => `${value}rem`}
        className="mt-2 w-full"
      /> */}
    </div>
  );
}
