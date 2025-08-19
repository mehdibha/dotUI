import React from "react";

export interface EditorSection {
	id: string;
	title: string;
	Component: React.ComponentType;
}

export interface EditorPlugin {
	id: string;
	label: string;
	route: (username: string, styleName: string) => string;
	icon: React.ReactNode;
	sections: EditorSection[];
}

