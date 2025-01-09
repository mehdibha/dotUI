"use client";

import { useThemes } from "@/hooks/use-themes";
import { Radio, RadioGroup } from "@/components/core/radio-group";
import { ThemeOverride } from "@/components/theme-override";
import ButtonVariants from "@/demos/button/variants";
import ToggleButtonVariants from "@/demos/toggle-button/variants";

const variants = [
  {
    label: "Button 1",
    value: "button-01",
    description: "Minimalistic design.",
  },
  {
    label: "Button 2",
    value: "button-02",
    description: "Subtle hover outline.",
  },
  {
    label: "Button 3",
    value: "button-03",
    description: "Brutalism design",
  },
  {
    label: "Button 4",
    value: "button-04",
    description: "With ripple effect, uses framer-motion.",
  },
];

export function ButtonStyle() {
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
        <ButtonVariants />
        <ToggleButtonVariants />
      </ThemeOverride>
    </div>
  );
}
