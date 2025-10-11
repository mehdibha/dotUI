"use client";

import { Slider } from "@dotui/registry-v2/ui/slider";

export function SliderDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="space-y-4">
          <Slider size={size} label="Volume" defaultValue={30} showValueLabel />
          <Slider
            size={size}
            label="Brightness"
            defaultValue={50}
            variant="primary"
            showValueLabel
          />
        </div>
      ))}
      <Slider
        label="Price range"
        defaultValue={[25, 75]}
        showValueLabel
        getValueLabel={(values) => `$${values[0]} - $${values[1]}`}
      />
      <Slider
        label="Temperature"
        defaultValue={20}
        minValue={0}
        maxValue={100}
        step={5}
        showValueLabel
        getValueLabel={(values) => `${values[0]}°C`}
      />
      <Slider
        orientation="vertical"
        label="Vertical slider"
        defaultValue={60}
        showValueLabel
      />
      <Slider label="Disabled" defaultValue={50} isDisabled showValueLabel />
    </div>
  );
}
