"use client";

import { useThemes } from "@/hooks/use-themes";
import { Radio, RadioGroup } from "@/components/core/radio-group";
import { ThemeOverride } from "@/components/theme-override";
import Inputs from "@/demos/text-field/prefix-and-suffix";

const variants = [
  {
    label: "Input 1",
    value: "input-01",
    description: "Minimalistic design.",
  },
  {
    label: "Input 2",
    value: "input-02",
    description: "Subtle hover outline.",
  },
  {
    label: "Input 3",
    value: "input-03",
    description: "Brutalism design",
  },
  {
    label: "Input 4",
    value: "input-04",
    description: "With ripple effect, uses framer-motion.",
  },
];

export function InputStyle() {
  const { currentTheme, isCurrentThemeEditable, updateVariant } = useThemes();
  return (
    <div className="flex justify-between gap-6">
      <RadioGroup
        variant="card"
        orientation="vertical"
        value={currentTheme.variants["input"]}
        onChange={(value) => updateVariant("input", value)}
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
        <Inputs />
      </ThemeOverride>
    </div>
  );
}
