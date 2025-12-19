"use client";

import React, { createContext, useContext, useMemo } from "react";

import { createTheme, type Theme } from "@dotui/colors";
import type { StyleConfig, IconsConfig } from "../schemas/style";
import { ThemeProvider } from "./theme-provider";
import { VariantsProvider } from "./variants-provider";

interface StyleContextValue {
	icons: IconsConfig;
}

const StyleContext = createContext<StyleContextValue | null>(null);

export interface StyleProviderProps extends Omit<React.ComponentProps<"div">, "style"> {
	config: StyleConfig;
	mode?: "light" | "dark";
	unstyled?: boolean;
	children?: React.ReactNode;
}

/**
 * Main style provider that wraps theme and variants providers.
 * Takes a StyleConfig and provides resolved values to all children.
 */
export function StyleProvider({ config, mode: _mode, unstyled: _unstyled, children, ...props }: StyleProviderProps) {
	// TODO: implement mode, unstyled, and div props
	void _mode;
	void _unstyled;
	void props;
	// Generate theme from config
	const theme: Theme = createTheme(config.theme.colors);

	const styleValue = useMemo(() => ({ icons: config.icons }), [config.icons]);

	return (
		<StyleContext value={styleValue}>
			<ThemeProvider config={config.theme} theme={theme}>
				<VariantsProvider variants={config.variants}>{children}</VariantsProvider>
			</ThemeProvider>
		</StyleContext>
	);
}

/**
 * Hook to get the current style context (icons config)
 * Returns null if not within a StyleProvider
 */
export function useCurrentStyle(): StyleContextValue | null {
	return useContext(StyleContext);
}

// Re-export sub-providers for granular usage
export { ThemeProvider, useTheme, useThemeConfig } from "./theme-provider";
export { VariantsProvider, useVariants, useVariant } from "./variants-provider";
