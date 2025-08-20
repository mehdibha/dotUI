"use client";

import React from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import type { ContrastColor } from "@adobe/leonardo-contrast-colors";

import { createColorScales } from "@dotui/style-engine/core";

import type { StyleFormData } from "./schema";

export function useGeneratedTheme(
	form: UseFormReturn<StyleFormData>,
	resolvedMode: "light" | "dark",
) {
	const currentModeDefinition = useWatch({
		name: `theme.colors.modes.${resolvedMode}`,
		control: form.control,
	});

	const generatedTheme: ContrastColor[] = React.useMemo(() => {
		const theme = createColorScales(currentModeDefinition);
		return theme;
	}, [currentModeDefinition]);

	return generatedTheme;
}

