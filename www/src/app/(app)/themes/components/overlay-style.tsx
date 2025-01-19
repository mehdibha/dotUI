"use client";

import { useThemes } from "@/hooks/use-themes";
import { Radio, RadioGroup } from "@/components/core/radio-group";
import { ThemeOverride } from "@/components/docs/theme-override";
import DialogDemo from "@/demos/dialog/basic";

const variants = [
  {
    label: "overlay 1",
    value: "overlay-01",
    description: "Minimalistic design.",
  },
  {
    label: "overlay 2",
    value: "overlay-02",
    description: "Subtle hover outline.",
  },
  {
    label: "overlay 3",
    value: "overlay-03",
    description: "Brutalism design",
  },
  {
    label: "overlay 4",
    value: "overlay-04",
    description: "With ripple effect, uses framer-motion.",
  },
];

export function OverlayStyle() {
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
        <DialogDemo />
      </ThemeOverride>
    </div>
  );
}
