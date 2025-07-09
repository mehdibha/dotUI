"use client";

import { FormControl } from "@dotui/ui/components/form";
import { Slider } from "@dotui/ui/components/slider";

import { FontSelector } from "@/modules/styles/components/fonts-selector";
import { useStyleForm } from "@/modules/styles/lib/form-context";

export default function TypographyPage() {
  const { form, isSaving } = useStyleForm();

  return (
    <div className="min-h-[200svh]">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Typography</p>
        {isSaving && <span className="text-sm text-fg-muted">Saving...</span>}
      </div>

      <p className="mt-6 text-base font-semibold">Font family</p>
      <FormControl
        name="fonts.heading"
        control={form.control}
        render={(props) => (
          <FontSelector
            label="Heading font"
            font={props.value ?? "Inter"}
            onFontChange={props.onChange}
            className="mt-2"
          />
        )}
      />

      <FormControl
        name="fonts.body"
        control={form.control}
        render={(props) => (
          <FontSelector
            label="Body font"
            font={props.value ?? "Inter"}
            onFontChange={props.onChange}
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
