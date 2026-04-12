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

	const hasParams = Object.keys(cssVars).length > 0;

	return (
		<DesignSystemContext.Provider value={value}>
			{hasParams ? (
				<div style={cssVars} className="contents">
					{children}
				</div>
			) : (
				children
			)}
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
