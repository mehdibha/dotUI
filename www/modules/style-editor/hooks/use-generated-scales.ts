"use client";

import React from "react";
import { useWatch } from "react-hook-form";

import { createColorScales } from "@dotui/style-engine/core";
import type { ModeDefinition } from "@dotui/style-engine/types";

import { useDebounce } from "@/hooks/use-debounce";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useResolvedModeState } from "./use-resolved-mode";

type Mode = "light" | "dark";
type ScaleId = "neutral" | "accent" | "success" | "warning" | "danger" | "info";
type ScalePath = `theme.colors.modes.${Mode}.scales.${ScaleId}`;

export function useGeneratedScales(scaleIds?: ScaleId[]) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();

  const lightness = useWatch({
    control: form.control,
    name: `theme.colors.modes.${resolvedMode}.lightness`,
  });

  const saturation = useWatch({
    control: form.control,
    name: `theme.colors.modes.${resolvedMode}.saturation`,
  });

  const contrast = useWatch({
    control: form.control,
    name: `theme.colors.modes.${resolvedMode}.contrast`,
  });

  // ensure neutral is always included; watch only requested ids
  const ids = React.useMemo(
    () => Array.from(new Set<ScaleId>(["neutral", ...(scaleIds ?? [])])),
    [scaleIds],
  );
  const names = React.useMemo(
    () =>
      ids.map(
        (id) => `theme.colors.modes.${resolvedMode}.scales.${id}`,
      ) as ScalePath[],
    [ids, resolvedMode],
  );

  const watched = useWatch({
    control: form.control,
    name: names,
  });

  const scales = React.useMemo(
    () =>
      Object.fromEntries(
        ids.map((id, i) => [id, (watched as any)?.[i]]),
      ) as ModeDefinition["scales"],
    [ids, watched],
  );

  const dLightness = useDebounce(lightness, 150);
  const dSaturation = useDebounce(saturation, 150);
  const dContrast = useDebounce(contrast, 150);

  // Build a stable signature for scales and debounce that signature (not the object)
  const scalesKey = React.useMemo(() => {
    const minimal = Object.fromEntries(
      ids.map((id) => {
        const s = (scales as any)?.[id];
        return [
          id,
          {
            name: s?.name,
            smooth: s?.smooth,
            colorKeys: (s?.colorKeys ?? []).map((ck: any) => ck.color),
            ratios: s?.ratios,
          },
        ];
      }),
    );
    return JSON.stringify(minimal);
  }, [ids, scales]);
  const dScalesKey = useDebounce(scalesKey, 1000);

  const generatedTheme = React.useMemo(() => {
    const theme = createColorScales({
      lightness: dLightness,
      saturation: dSaturation,
      contrast: dContrast,
      scales: scales,
    });
    return theme;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dLightness, dSaturation, dContrast, dScalesKey]);

  return generatedTheme;
}
