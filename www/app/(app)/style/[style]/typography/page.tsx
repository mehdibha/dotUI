"use client";

import { FormControl } from "@dotui/ui/components/form";
import { Slider } from "@dotui/ui/components/slider";

import { FontSelector } from "@/modules/styles/components/fonts-selector";
import { useStyleForm } from "@/modules/styles/lib/form-context";

export default function TypographyPage() {
  const { form } = useStyleForm();

  return (
    <div className="min-h-[200svh]">
      <p className="mt-6 text-base font-semibold">Font family</p>
      <FormControl
        name="typography.fonts.heading"
        control={form.control}
        render={({ value, onChange }) => (
          <FontSelector
            label="Heading font"
            font={value}
            onFontChange={onChange}
            className="mt-2"
          />
        )}
      />

      <FormControl
        name="typography.fonts.body"
        control={form.control}
        render={({ value, onChange }) => (
          <FontSelector
            label="Body font"
            font={value}
            onFontChange={onChange}
            className="mt-2"
          />
        )}
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
