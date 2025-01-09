"use client";

import { useThemes } from "@/hooks/use-themes";
import { Radio, RadioGroup } from "@/components/core/radio-group";
import { ThemeOverride } from "@/components/theme-override";
import TabsDemo from "@/demos/tabs/basic";

const variants = [
  {
    label: "tabs 1",
    value: "tabs-01",
    description: "Minimalistic design.",
  },
  {
    label: "tabs 2",
    value: "tabs-02",
    description: "Subtle hover outline.",
  },
  {
    label: "tabs 3",
    value: "tabs-03",
    description: "Brutalism design",
  },
  {
    label: "tabs 4",
    value: "tabs-04",
    description: "With ripple effect, uses framer-motion.",
  },
];

export function TabsStyle() {
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
        <TabsDemo />
      </ThemeOverride>
    </div>
  );
}
