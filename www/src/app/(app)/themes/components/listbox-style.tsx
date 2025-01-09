"use client";

import { useThemes } from "@/hooks/use-themes";
import { Radio, RadioGroup } from "@/components/core/radio-group";
import { ThemeOverride } from "@/components/theme-override";
import ComboboxDemo from "@/demos/combobox/basic";
import ListBoxDemo from "@/demos/list-box/basic";
import SelectDemo from "@/demos/select/basic";

const variants = [
  {
    label: "list-box 1",
    value: "list-box-01",
    description: "Minimalistic design.",
  },
  {
    label: "list-box 2",
    value: "list-box-02",
    description: "Subtle hover outline.",
  },
  {
    label: "list-box 3",
    value: "list-box-03",
    description: "Brutalism design",
  },
  {
    label: "list-box 4",
    value: "list-box-04",
    description: "With ripple effect, uses framer-motion.",
  },
];

export function ListBoxStyle() {
  const { currentTheme, isCurrentThemeEditable, updateVariant } = useThemes();
  return (
    <div className="flex justify-between gap-6">
      <RadioGroup
        variant="card"
        orientation="vertical"
        value={currentTheme.variants["button"]}
        onChange={(value) => updateVariant("button", value)}
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
      <ThemeOverride className="flex w-full flex-col-reverse items-center justify-center gap-6 rounded-md border p-4">
        <ListBoxDemo />
        <ComboboxDemo />
        <SelectDemo />
      </ThemeOverride>
    </div>
  );
}
