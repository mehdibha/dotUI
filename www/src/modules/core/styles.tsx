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

function createStyles<S>(componentName: string, stylesMap: Record<string, S>) {
	function useStyles(): S {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const selections = React.useContext(StyleContext);
		const selected = selections[componentName];
		return (selected && stylesMap[selected]) ?? stylesMap.default;
	}
	return { useStyles };
}

export { StyleContext, StyleProvider, createStyles };
