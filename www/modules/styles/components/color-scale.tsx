"use client";

import React from "react";
import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { Button as AriaButton } from "react-aria-components";
import type {
  ContrastColor,
  ContrastColorBackground,
  CssColor,
} from "@adobe/leonardo-contrast-colors";

import { Skeleton } from "@dotui/ui/components/skeleton";
import { Tooltip } from "@dotui/ui/components/tooltip";

import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";
import { usePreferences } from "../atoms/preferences-atom";

interface ColorScaleProps {
  name: "neutral" | "accent" | "success" | "danger" | "warning" | "info";
  label: string;
}

export function ColorScale({ name, label }: ColorScaleProps) {
  const { form, isSuccess } = useStyleForm();

  const { currentMode } = usePreferences();

  const currentModeIndex = form
    .watch("theme.colors.modes")
    .findIndex((mode) => mode.mode === currentMode);
  const lightness = form.watch(
    `theme.colors.modes.${currentModeIndex}.lightness`,
  );
  const saturation = form.watch(
    `theme.colors.modes.${currentModeIndex}.saturation`,
  );
  const contrast =
    form.watch(`theme.colors.modes.${currentModeIndex}.contrast`) / 100;

  const neutralScale = form.watch(
    `theme.colors.modes.${currentModeIndex}.scales.neutral`,
  );
  const neutralColorKeys = neutralScale.colorKeys;
  const neutralRatios = neutralScale.ratios;

  const currentScale = form.watch(
    `theme.colors.modes.${currentModeIndex}.scales.${name}`,
  );
  const currentColorKeys = currentScale.colorKeys;
  const currentRatios = currentScale.ratios;

  const neutralColors = neutralColorKeys.map(
    (color) => color.color,
  ) as CssColor[];
  const currentColors = currentColorKeys.map(
    (color) => color.color,
  ) as CssColor[];

  const generatedTheme = React.useMemo(() => {
    const neutralColor = new LeonardoBgColor({
      name: "neutral",
      colorKeys: neutralColors,
      ratios: neutralRatios,
    });

    const currentColor = new LeonardoColor({
      name,
      colorKeys: currentColors,
      ratios: currentRatios,
    });

    const [_, contrastColor] = new LeonardoTheme({
      colors: [currentColor],
      backgroundColor: neutralColor,
      lightness,
      saturation,
      contrast,
      output: "HEX",
    }).contrastColors as [ContrastColorBackground, ContrastColor];

    return contrastColor.values;
  }, [
    name,
    neutralColors,
    neutralRatios,
    currentColors,
    currentRatios,
    lightness,
    saturation,
    contrast,
  ]);

  return (
    <div className="flex items-center gap-2">
      <p className="w-16 text-sm text-fg-muted">{label}</p>
      <div className="flex flex-1 items-center gap-1">
        {generatedTheme.map((color, index) => (
          <Tooltip key={index} content={color.name} delay={0}>
            <Skeleton show={!isSuccess} className="flex-1">
              <AriaButton
                className="h-8 flex-1 rounded-sm border"
                style={{ backgroundColor: color.value }}
              />
            </Skeleton>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
