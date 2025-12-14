"use client";

import React from "react";
import { useStore } from "@tanstack/react-form";

import { usePreferences } from "@/modules/preferences/preferences-atom";
import { useStyleEditorForm } from "@/modules/style-editor/style-editor-provider";

type Mode = "light" | "dark";

export function useResolvedModeState(): {
	resolvedMode: Mode;
	supportsLightDark: boolean;
} {
	const form = useStyleEditorForm();
	const { activeMode } = usePreferences();

	const activeModes = useStore(form.store, (state) => state.values.theme.colors.activeModes);

	const supportsLightDark = React.useMemo(() => {
		return activeModes.includes("light") && activeModes.includes("dark");
	}, [activeModes]);

	const resolvedMode = React.useMemo<Mode>(() => {
		if (supportsLightDark) return activeMode;
		return activeModes[0] ?? "light";
	}, [supportsLightDark, activeMode, activeModes]);

	return { resolvedMode, supportsLightDark };
}
