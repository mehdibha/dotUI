"use client";

import * as React from "react";

/* --------------------------------- Types --------------------------------- */

type StyleSelections = Record<string, string>;
type ParamSelections = Record<string, string>;

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
	children: React.ReactNode;
}

function DesignSystemProvider({
	styles,
	params = {},
	children,
}: DesignSystemProviderProps) {
	const value = React.useMemo(() => ({ styles, params }), [styles, params]);

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
