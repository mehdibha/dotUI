"use client";

import React, { createContext, useContext, useMemo } from "react";

import type { ThemeConfig } from "../schemas/theme";
import type { Theme } from "@dotui/colors";

interface ThemeContextValue {
	config: ThemeConfig;
	theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
	config: ThemeConfig;
	theme: Theme;
	children: React.ReactNode;
}

export function ThemeProvider({ config, theme, children }: ThemeProviderProps) {
	const value = useMemo(() => ({ config, theme }), [config, theme]);

	return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}

export function useThemeConfig(): ThemeConfig {
	return useTheme().config;
}
