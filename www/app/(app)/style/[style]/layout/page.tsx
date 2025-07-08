"use client";

import { Slider } from "@dotui/ui/components/slider";

export default function StyleLayoutPage() {
  return (
    <div>
      <p className="text-base font-semibold">Border radius</p>
      <Slider
        label="Radius factor"
        defaultValue={1}
        minValue={0}
        maxValue={2}
        className="mt-2 w-full"
      />
      <p className="mt-6 text-base font-semibold">Spacing</p>
      <Slider
        label="Spacing"
        defaultValue={0.25}
        minValue={0.1}
        maxValue={0.35}
        step={0.05}
        getValueLabel={(value) => `${value}rem`}
        className="mt-2 w-full"
      />
    </div>
  );
}
