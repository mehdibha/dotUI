import { createContext, useContext, useEffect, useState } from "react";
import { ScriptOnce } from "@tanstack/react-router";
import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ReactNode } from "react";

const themeModeSchema = z.enum(["light", "dark", "system"]);
const resolvedThemeSchema = z.enum(["light", "dark"]);
const THEME_KEY = "theme";

type ThemeMode = z.infer<typeof themeModeSchema>;
type ResolvedTheme = z.infer<typeof resolvedThemeSchema>;

const getStoredThemeMode = createIsomorphicFn()
	.server((): ThemeMode => "system")
	.client((): ThemeMode => {
		try {
			const stored = localStorage.getItem(THEME_KEY);
			return themeModeSchema.parse(stored);
		} catch {
			return "system";
		}
	});

const setStoredThemeMode = createClientOnlyFn((theme: ThemeMode) => {
	try {
		const parsed = themeModeSchema.parse(theme);
		localStorage.setItem(THEME_KEY, parsed);
	} catch {}
});

const getSystemTheme = createIsomorphicFn()
	.server((): ResolvedTheme => "light")
	.client((): ResolvedTheme => {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	});

const updateThemeClass = createClientOnlyFn((themeMode: ThemeMode) => {
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	const resolved = themeMode === "system" ? getSystemTheme() : themeMode;
	root.classList.add(resolved);
});

const setupSystemThemeListener = createClientOnlyFn((callback: () => void) => {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	mediaQuery.addEventListener("change", callback);
	return () => mediaQuery.removeEventListener("change", callback);
});

const getNextTheme = createClientOnlyFn((current: ThemeMode) => {
	const systemTheme = getSystemTheme();
	const themes: ThemeMode[] = systemTheme === "dark" ? ["system", "light", "dark"] : ["system", "dark", "light"];
	return themes[(themes.indexOf(current) + 1) % themes.length] as ThemeMode;
});

const themeDetectorScript = `(function(){try{var t=localStorage.getItem("theme")||"system";var v=["light","dark","system"].includes(t)?t:"system";if(v==="system"){var s=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.classList.add(s)}else{document.documentElement.classList.add(v)}}catch(e){var s=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.classList.add(s)}})();`;

type ThemeContextValue = {
	themeMode: ThemeMode;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: ThemeMode) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode);

	useEffect(() => {
		if (themeMode !== "system") return;
		return setupSystemThemeListener(() => updateThemeClass("system"));
	}, [themeMode]);

	const resolvedTheme = themeMode === "system" ? getSystemTheme() : themeMode;

	const setTheme = (newTheme: ThemeMode) => {
		setThemeMode(newTheme);
		setStoredThemeMode(newTheme);
		updateThemeClass(newTheme);
	};

	const toggleTheme = () => {
		const next = getNextTheme(themeMode);
		if (next) setTheme(next);
	};

	return (
		<ThemeContext.Provider value={{ themeMode, resolvedTheme, setTheme, toggleTheme }}>
<ScriptOnce children={themeDetectorScript} />
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
