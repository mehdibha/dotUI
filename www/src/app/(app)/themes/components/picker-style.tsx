"use client";

import { useThemes } from "@/hooks/use-themes";
import { Radio, RadioGroup } from "@/components/core/radio-group";
import ColorPickerDemo from "@/components/demos/color-picker/default";
import ComboboxDemo from "@/components/demos/combobox/basic";
import DatePickerDemo from "@/components/demos/date-picker/default";
import SelectDemo from "@/components/demos/select/basic";
import { ThemeOverride } from "@/components/docs/theme-override";

const variants = [
  {
    label: "Picker 1",
    value: "picker-01",
    description: "Minimalistic design.",
  },
  {
    label: "Picker 2",
    value: "picker-02",
    description: "Subtle hover outline.",
  },
  {
    label: "Picker 3",
    value: "picker-03",
    description: "Brutalism design",
  },
];

export function PickerStyle() {
  const { currentTheme, isCurrentThemeEditable, updateVariant } = useThemes();
  return (
    <div className="flex justify-between gap-6">
      <RadioGroup
        variant="card"
        orientation="vertical"
        value={currentTheme.variants["picker"]}
        onChange={(value) => updateVariant("picker", value)}
        isDisabled={!isCurrentThemeEditable}
        className="min-w-60"
      >
        {variants.map((variant) => (
          <Radio
            key={variant.value}
            value={variant.value}
            aria-label={variant.label}
            className="gap-8"
          >
            <div>
              {variant.label}
              {variant.description && (
                <div className="text-fg-muted group-disabled/radio-group:text-fg-disabled text-sm">
                  {variant.description}
                </div>
              )}
            </div>
          </Radio>
        ))}
      </RadioGroup>
      <ThemeOverride className="flex w-full flex-col items-center justify-center rounded-md border p-4">
        <div className="flex flex-wrap items-center justify-center gap-4 p-2">
          <SelectDemo />
          <DatePickerDemo />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 p-2">
          <ComboboxDemo />
          <ColorPickerDemo />
        </div>
      </ThemeOverride>
    </div>
  );
}
