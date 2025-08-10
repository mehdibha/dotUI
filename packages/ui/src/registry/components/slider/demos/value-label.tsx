"use client";

import { Slider } from "@dotui/ui/components/slider";

export default function Demo() {
  return (
    <div className="space-y-6">
      <Slider
        defaultValue={50}
        label="Donuts to buy"
        showValueLabel
        className="w-60!"
      />
      <Slider
        defaultValue={50}
        label="Donuts to buy"
        showValueLabel
        getValueLabel={(donuts) => `${donuts[0]} of 100 Donuts`}
        className="w-60!"
      />
    </div>
  );
}
