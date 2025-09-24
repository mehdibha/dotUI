"use client";

import React from "react";
import { useWatch } from "react-hook-form";

import { createColorScales } from "@dotui/style-engine/core";
import type { ModeDefinition } from "@dotui/style-engine/types";

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

  const generatedTheme = React.useMemo(() => {
    const theme = createColorScales({
      lightness,
      saturation,
      contrast,
      scales,
    });
    return theme;
  }, [lightness, saturation, contrast, scales]);

  return generatedTheme;
}
