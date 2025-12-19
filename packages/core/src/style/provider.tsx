"use client";

import React from "react";

import { createTheme, type Theme } from "@dotui/colors";
import type { StyleConfig } from "../schemas/style";
import { ThemeProvider } from "./theme-provider";
import { VariantsProvider } from "./variants-provider";

export interface StyleProviderProps {
	config: StyleConfig;
	children: React.ReactNode;
}

/**
 * Main style provider that wraps theme and variants providers.
 * Takes a StyleConfig and provides resolved values to all children.
 */
export function StyleProvider({ config, children }: StyleProviderProps) {
	// Generate theme from config
	const theme: Theme = createTheme(config.theme.colors);

	return (
		<ThemeProvider config={config.theme} theme={theme}>
			<VariantsProvider variants={config.variants}>{children}</VariantsProvider>
		</ThemeProvider>
	);
}

// Re-export sub-providers for granular usage
export { ThemeProvider, useTheme, useThemeConfig } from "./theme-provider";
export { VariantsProvider, useVariants, useVariant } from "./variants-provider";
