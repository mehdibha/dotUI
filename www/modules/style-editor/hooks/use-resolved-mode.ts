"use client";

import React from "react";
import { useWatch } from "react-hook-form";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

type Mode = "light" | "dark";

export function useResolvedModeState(): {
  resolvedMode: Mode;
  supportsLightDark: boolean;
} {
  const form = useStyleEditorForm();
  const { activeMode } = usePreferences();

  const activeModes = useWatch({
    control: form.control,
    name: "theme.colors.activeModes",
  });

  const supportsLightDark = React.useMemo(() => {
    return activeModes.includes("light") && activeModes.includes("dark");
  }, [activeModes]);

  const resolvedMode = React.useMemo<Mode>(() => {
    if (supportsLightDark) return activeMode;
    return activeModes[0] ?? "light";
  }, [supportsLightDark, activeMode, activeModes]);

  return { resolvedMode, supportsLightDark };
}
