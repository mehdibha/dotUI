"use client";

import { usePreferences } from "@/modules/preferences/preferences-atom";

type Mode = "light" | "dark";

// Simplified hook - just returns the active mode from preferences
export function useResolvedModeState(): {
	resolvedMode: Mode;
	supportsLightDark: boolean;
} {
	const { activeMode } = usePreferences();

	return {
		resolvedMode: activeMode,
		supportsLightDark: true, // Static for UI shell
	};
}
