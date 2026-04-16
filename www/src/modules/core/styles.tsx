"use client";

import * as React from "react";

/* --------------------------------- Types --------------------------------- */

type StyleSelections = Record<string, string>;
type ParamSelections = Record<string, string>;
type Density = "compact" | "default" | "comfortable";

interface DesignSystemContextValue {
	styles: StyleSelections;
	params: ParamSelections;
}

/* -------------------------------- Context -------------------------------- */

const DesignSystemContext = React.createContext<DesignSystemContextValue>({
	styles: {},
	params: {},
});

/* -------------------------------- Provider ------------------------------- */

/** Resolve a param value to a CSS value. "--radius-md" → "var(--radius-md)", "0" → "0" */
function resolveCssValue(value: string): string {
	return value.startsWith("--") ? `var(${value})` : value;
}

interface DesignSystemProviderProps {
	styles: StyleSelections;
	params?: ParamSelections;
	density?: Density;
	children: React.ReactNode;
}

function DesignSystemProvider({
	styles,
	params = {},
	density,
	children,
}: DesignSystemProviderProps) {
	const value = React.useMemo(() => ({ styles, params }), [styles, params]);

	// Apply density class to the document body when inside an iframe
	React.useLayoutEffect(() => {
		if (!density) return;
		const body = document.body;
		body.classList.remove("density-compact", "density-default", "density-comfortable");
		body.classList.add(`density-${density}`);
	}, [density]);

	const cssVars = React.useMemo(() => {
		const vars: Record<string, string> = {};
		for (const [prop, val] of Object.entries(params)) {
			vars[prop] = resolveCssValue(val);
		}
		return vars;
	}, [params]);

	// Apply CSS custom properties to :root.
	// Using a wrapper <div> doesn't work for tokens that reference each other
	// via calc() + var() (e.g. --radius-sm = calc(.25rem * var(--radius-factor)))
	// because the inner var() is substituted at declaration time at :root and
	// the resolved value is inherited. Setting the overrides on :root forces
	// those dependent tokens to recompute with the new values.
	React.useLayoutEffect(() => {
		const root = document.documentElement;
		const applied = Object.keys(cssVars);
		for (const key of applied) {
			root.style.setProperty(key, cssVars[key]!);
		}
		return () => {
			for (const key of applied) {
				root.style.removeProperty(key);
			}
		};
	}, [cssVars]);

	return (
		<DesignSystemContext.Provider value={value}>
			{children}
		</DesignSystemContext.Provider>
	);
}

/* ------------------------------ createStyles ----------------------------- */

function createStyles<
	M extends { name: string; defaultStyle: string; styles: Record<string, unknown> },
	T extends Record<keyof M["styles"] & string, unknown>,
>(meta: M, stylesMap: T) {
	function useStyles(): T[keyof T] {
		const { styles } = React.useContext(DesignSystemContext);
		const selected = styles[meta.name];
		if (selected && selected in stylesMap) {
			return stylesMap[selected as keyof T];
		}
		return stylesMap[meta.defaultStyle as keyof T];
	}
	return { useStyles };
}

export { createStyles, DesignSystemContext, DesignSystemProvider };
