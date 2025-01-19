"use client";

import React from "react";
import { type PressEvent } from "react-aria-components";
import { useThemes } from "@/hooks/use-themes";
import { ThemeOverride } from "@/components/docs/theme-override";
import { Button } from "@/components/dynamic-core/button";
import { TextField } from "@/components/dynamic-core/text-field";
import { Radio, RadioGroup } from "@/registry/core/radio-group_basic";

const variants = [
  {
    label: "Focus 01",
    value: "focus-01",
  },
  {
    label: "Focus 02",
    value: "focus-02",
  },
  {
    label: "Focus 03",
    value: "focus-03",
  },
  {
    label: "Focus 04",
    value: "focus-04",
  },
];

export function FocusStyle() {
  const { currentTheme, isCurrentThemeEditable, updateVariant } = useThemes();

  return (
    <div className="flex justify-between gap-6">
      <RadioGroup
        variant="card"
        orientation="vertical"
        value={currentTheme.variants["loader"]}
        onChange={(value) => updateVariant("loader", value)}
        isDisabled={!isCurrentThemeEditable}
        className="min-w-60"
      >
        {variants.map((variant) => (
          <Radio
            key={variant.value}
            value={variant.value}
            aria-label={variant.label}
          >
            <div className="flex items-center gap-8">
              <span className="w-24">{variant.label}</span>
            </div>
          </Radio>
        ))}
      </RadioGroup>
      <ThemeOverride className="flex w-full flex-col items-center justify-center gap-4 rounded-md border p-4">
        <TextField placeholder="Email" />
        <Button>Button</Button>
      </ThemeOverride>
    </div>
  );
}
