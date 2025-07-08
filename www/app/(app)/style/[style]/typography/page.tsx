"use client";

import { Slider } from "@dotui/ui/components/slider";

import { FontSelector } from "@/modules/styles/components/fonts-selector";

export default function TypographyPage() {
  return (
    <div className="min-h-[200svh]">
      <p className="text-base font-semibold">Font family</p>
      <FontSelector
        label="Heading font"
        font="Inter"
        onFontChange={() => {}}
        className="mt-2"
      />
      <FontSelector
        label="Body font"
        font="Inter"
        onFontChange={() => {}}
        className="mt-2"
      />
      <p className="mt-6 text-base font-semibold">Letter spacing</p>
      <Slider
        label="Letter spacing"
        defaultValue={0}
        minValue={-0.1}
        maxValue={0.1}
        step={0.025}
        getValueLabel={(value) => `${value}em`}
        className="mt-2 w-full"
      />
    </div>
  );
}
