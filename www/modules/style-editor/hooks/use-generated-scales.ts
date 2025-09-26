"use client";

import React from "react";
import { useStore } from "@tanstack/react-form";
import { useDebounce } from "use-debounce";

import { createColorScalesV2 } from "@dotui/style-engine/core";
import type { ModeDefinition, ScaleId } from "@dotui/style-engine/types";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useResolvedModeState } from "./use-resolved-mode";

export function useGeneratedScales(scaleIds?: ScaleId[]) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();

  const [lightness, saturation, contrast, neutralScale, scales] = useStore(
    form.store,
    (state) => [
      state.values.theme.colors.modes[resolvedMode].lightness,
      state.values.theme.colors.modes[resolvedMode].saturation,
      state.values.theme.colors.modes[resolvedMode].contrast,
      state.values.theme.colors.modes[resolvedMode].scales.neutral,
      (scaleIds ?? [])
        .filter((scaleId) => scaleId !== "neutral")
        .map(
          (scaleId) =>
            state.values.theme.colors.modes[resolvedMode].scales[scaleId],
        ),
    ],
  );

  const generatedTheme = React.useMemo(() => {
    const theme = createColorScalesV2({
      lightness: dLightness,
      saturation,
      contrast,
      neutralScale,
      scales: [neutralScale, ...scales].map((s) => ({
        name: s.name,
        colorKeys: s.colorKeys,
        ratios: s.ratios,
        smooth: s.smooth,
        overrides: s.overrides,
      })),
    });
    return theme;
  }, [dLightness, saturation, contrast, neutralScale, scales]);

  return generatedTheme;
}
