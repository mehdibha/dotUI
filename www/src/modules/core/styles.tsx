"use client";

import * as React from "react";

type StyleSelections = Record<string, string>;

const StyleContext = React.createContext<StyleSelections>({});

interface StyleProviderProps {
	styles: StyleSelections;
	children: React.ReactNode;
}

function StyleProvider({ styles, children }: StyleProviderProps) {
	return <StyleContext.Provider value={styles}>{children}</StyleContext.Provider>;
}

function createStyles<
	M extends { name: string; defaultStyle: string; styles: Record<string, unknown> },
	T extends Record<keyof M["styles"] & string, unknown>,
>(meta: M, stylesMap: T) {
	function useStyles(): T[keyof T] {
		const selections = React.useContext(StyleContext);
		const selected = selections[meta.name];
		if (selected && selected in stylesMap) {
			return stylesMap[selected as keyof T];
		}
		return stylesMap[meta.defaultStyle as keyof T];
	}
	return { useStyles };
}

export { StyleContext, StyleProvider, createStyles };
