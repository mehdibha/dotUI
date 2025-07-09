"use client";

import { FormControl } from "@dotui/ui/components/form";
import { Slider } from "@dotui/ui/components/slider";

import { useStyleForm } from "@/modules/styles/lib/form-context";

export default function StyleLayoutPage() {
  const { form } = useStyleForm();

  return (
    <div>
      <p className="text-base font-semibold">Border radius</p>
      <FormControl
        name="layout.radius"
        control={form.control}
        render={(props) => (
          <Slider
            label="Radius factor"
            minValue={0}
            maxValue={2}
            className="mt-2 w-full"
            {...props}
          />
        )}
      />

      <p className="mt-6 text-base font-semibold">Spacing</p>
      <FormControl
        name="layout.spacing"
        control={form.control}
        render={(props) => (
          <Slider
            label="Spacing"
            minValue={0.1}
            maxValue={0.35}
            step={0.05}
            getValueLabel={(value) => `${value}rem`}
            className="mt-2 w-full"
            {...props}
          />
        )}
      />
    </div>
  );
}
