"use client";

import React from "react";
import { type PressEvent } from "react-aria-components";
import { useThemes } from "@/hooks/use-themes";
import { ThemeOverride } from "@/components/docs/theme-override";
import { Button } from "@/components/dynamic-core/button";
import { Loader as DotSpinner } from "@/registry/core/loader-dot-spinner";
import { Loader as LineSpinner } from "@/registry/core/loader-line-spinner";
import { Loader as Ring } from "@/registry/core/loader-ring";
import { Loader as Tailspin } from "@/registry/core/loader-tailspin";
import { Loader as Wave } from "@/registry/core/loader-wave";
import { Radio, RadioGroup } from "@/registry/core/radio-group_basic";

const variants = [
  {
    label: "Dot spinner",
    value: "loader-dot-spinner",
    preview: <DotSpinner size={30} />,
  },
  {
    label: "Line spinner",
    value: "loader-line-spinner",
    preview: <LineSpinner size={30} />,
  },
  { label: "Ring", value: "loader-ring", preview: <Ring size={30} /> },
  {
    label: "Tailspin",
    value: "loader-tailspin",
    preview: <Tailspin size={30} />,
  },
  { label: "Wave", value: "loader-wave", preview: <Wave size={30} /> },
];

export function LoaderStyle() {
  const { currentTheme, isCurrentThemeEditable, updateVariant } = useThemes();
  const [isPending, setPending] = React.useState(false);

  const handlePress = (e: PressEvent) => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 5000);
  };

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
              {variant.preview}
            </div>
          </Radio>
        ))}
      </RadioGroup>
      <ThemeOverride className="flex w-full items-center justify-center gap-4 rounded-md border p-4">
        <Button isPending={isPending} onPress={handlePress}>
          Click me!
        </Button>
        <Button isPending className="w-24" />
      </ThemeOverride>
    </div>
  );
}
