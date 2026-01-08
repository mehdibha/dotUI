import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ScriptOnce } from "@tanstack/react-router";
import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import type { ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeProviderProps {
	children: ReactNode;
	/** Default theme mode. Defaults to "system" */
	defaultTheme?: ThemeMode;
	/** Key used to store theme in localStorage. Defaults to "theme" */
	storageKey?: string;
	/** Whether to set the color-scheme CSS property. Defaults to true */
	enableColorScheme?: boolean;
	/** Whether to disable CSS transitions when switching themes. Defaults to false */
	disableTransitionOnChange?: boolean;
	/** Force a specific theme (useful for per-page themes) */
	forcedTheme?: ThemeMode;
	/** Nonce for CSP headers */
	nonce?: string;
}

export interface UseThemeReturn {
	/** Current theme mode (light, dark, or system) */
	theme: ThemeMode;
	/** Resolved theme based on system preference if theme is "system" */
	resolvedTheme: ResolvedTheme;
	/** Current system preference */
	systemTheme: ResolvedTheme;
	/** Set the theme */
	setTheme: (theme: ThemeMode) => void;
	/** Forced theme if set */
	forcedTheme?: ThemeMode;
}

// ============================================================================
// Constants
// ============================================================================

const MEDIA = "(prefers-color-scheme: dark)";
const VALID_THEMES: ThemeMode[] = ["light", "dark", "system"];

// ============================================================================
// Isomorphic/Client-only helpers using TanStack Start utilities
// ============================================================================

const getSystemTheme = createIsomorphicFn()
	.server((): ResolvedTheme => "light")
	.client((): ResolvedTheme => {
		return window.matchMedia(MEDIA).matches ? "dark" : "light";
	});

const getStoredTheme = createIsomorphicFn()
	.server((defaultTheme: ThemeMode): ThemeMode => defaultTheme)
	.client((defaultTheme: ThemeMode): ThemeMode => {
		try {
			const stored = localStorage.getItem("theme");
			if (stored && VALID_THEMES.includes(stored as ThemeMode)) {
				return stored as ThemeMode;
			}
		} catch {
			// localStorage not available
		}
		return defaultTheme;
	});

const saveTheme = createClientOnlyFn((storageKey: string, theme: ThemeMode) => {
	try {
		localStorage.setItem(storageKey, theme);
	} catch {
		// localStorage not available
	}
});

const applyThemeToDOM = createClientOnlyFn(
	(theme: ThemeMode, enableColorScheme: boolean, nonce?: string, disableTransitions?: boolean) => {
		const resolved = theme === "system" ? getSystemTheme() : theme;
		const root = document.documentElement;

		// Optionally disable transitions during theme change
		let enableTransitions: (() => void) | null = null;
		if (disableTransitions) {
			const css = document.createElement("style");
			if (nonce) css.setAttribute("nonce", nonce);
			css.appendChild(
				document.createTextNode(
					"*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;transition:none!important}",
				),
			);
			document.head.appendChild(css);
			enableTransitions = () => {
				window.getComputedStyle(document.body);
				setTimeout(() => document.head.removeChild(css), 1);
			};
		}

		// Update classes
		root.classList.remove("light", "dark");
		root.classList.add(resolved);

		// Update color-scheme
		if (enableColorScheme) {
			root.style.colorScheme = resolved;
		}

		enableTransitions?.();
	},
);

const setupMediaListener = createClientOnlyFn((callback: (theme: ResolvedTheme) => void) => {
	const media = window.matchMedia(MEDIA);
	const handler = (e: MediaQueryListEvent | MediaQueryList) => {
		callback(e.matches ? "dark" : "light");
	};
	media.addListener(handler);
	handler(media);
	return () => media.removeListener(handler);
});

const setupStorageListener = createClientOnlyFn((storageKey: string, callback: (theme: ThemeMode | null) => void) => {
	const handler = (e: StorageEvent) => {
		if (e.key !== storageKey) return;
		if (e.newValue && VALID_THEMES.includes(e.newValue as ThemeMode)) {
			callback(e.newValue as ThemeMode);
		} else {
			callback(null);
		}
	};
	window.addEventListener("storage", handler);
	return () => window.removeEventListener("storage", handler);
});

// ============================================================================
// Theme detection script (runs before React hydration)
// ============================================================================

const createThemeScript = (storageKey: string, defaultTheme: ThemeMode, enableColorScheme: boolean) => {
	return `(function(){try{var t=localStorage.getItem("${storageKey}")||"${defaultTheme}";var v=["light","dark","system"].includes(t)?t:"${defaultTheme}";var r=v==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":v;document.documentElement.classList.add(r);${enableColorScheme ? "document.documentElement.style.colorScheme=r;" : ""}}catch(e){var r=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.classList.add(r);${enableColorScheme ? "document.documentElement.style.colorScheme=r;" : ""}}})();`;
};

// ============================================================================
// Context
// ============================================================================

const ThemeContext = createContext<UseThemeReturn | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "theme",
	enableColorScheme = true,
	disableTransitionOnChange = true,
	forcedTheme,
	nonce,
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<ThemeMode>(() => getStoredTheme(defaultTheme));
	const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

	const resolvedTheme = forcedTheme
		? forcedTheme === "system"
			? systemTheme
			: forcedTheme
		: theme === "system"
			? systemTheme
			: theme;

	// Set theme and persist
	const setTheme = useCallback(
		(newTheme: ThemeMode) => {
			if (forcedTheme) return; // Don't allow changing when forced
			setThemeState(newTheme);
			saveTheme(storageKey, newTheme);
			applyThemeToDOM(newTheme, enableColorScheme, nonce, disableTransitionOnChange);
		},
		[forcedTheme, storageKey, enableColorScheme, nonce, disableTransitionOnChange],
	);

	// Listen to system preference changes
	useEffect(() => {
		const cleanup = setupMediaListener((newSystemTheme) => {
			setSystemTheme(newSystemTheme);
			// Re-apply if current theme is system
			const currentTheme = forcedTheme ?? theme;
			if (currentTheme === "system") {
				applyThemeToDOM("system", enableColorScheme, nonce, disableTransitionOnChange);
			}
		});
		return cleanup ?? undefined;
	}, [theme, forcedTheme, enableColorScheme, nonce, disableTransitionOnChange]);

	// Cross-tab sync via storage event
	useEffect(() => {
		const cleanup = setupStorageListener(storageKey, (newTheme) => {
			if (forcedTheme) return;
			const themeToApply = newTheme ?? defaultTheme;
			setThemeState(themeToApply);
			applyThemeToDOM(themeToApply, enableColorScheme, nonce, disableTransitionOnChange);
		});
		return cleanup ?? undefined;
	}, [storageKey, defaultTheme, forcedTheme, enableColorScheme, nonce, disableTransitionOnChange]);

	const value = useMemo<UseThemeReturn>(
		() => ({
			theme: forcedTheme ?? theme,
			resolvedTheme,
			systemTheme,
			setTheme,
			forcedTheme,
		}),
		[theme, resolvedTheme, systemTheme, setTheme, forcedTheme],
	);

	return (
		<ThemeContext.Provider value={value}>
			<ScriptOnce>{createThemeScript(storageKey, defaultTheme, enableColorScheme)}</ScriptOnce>
			{children}
		</ThemeContext.Provider>
	);
}

// ============================================================================
// Hook
// ============================================================================

export function useTheme(): UseThemeReturn {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
