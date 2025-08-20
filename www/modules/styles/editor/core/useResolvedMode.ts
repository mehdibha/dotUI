"use client";

import React from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import type { StyleFormData } from "./schema";

export function useResolvedMode(form: UseFormReturn<StyleFormData>) {
	const { activeMode } = usePreferences();
	const watchedActiveModes = useWatch({
		name: "theme.colors.activeModes",
		control: form.control,
	});

	const resolvedMode: "light" | "dark" = React.useMemo(() => {
		if (
			watchedActiveModes.includes("light") &&
			watchedActiveModes.includes("dark")
		)
			return activeMode;
		return watchedActiveModes[0]!;
	}, [watchedActiveModes, activeMode]);

	return resolvedMode;
}

