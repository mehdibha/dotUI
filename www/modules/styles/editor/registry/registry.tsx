import React from "react";
import {
	PaletteIcon,
	LayoutTemplateIcon,
	TypeIcon,
	BoxIcon,
	SparklesIcon,
	ShapesIcon,
} from "lucide-react";

import type { EditorPlugin } from "./types";

// Temporary: wrap existing monolithic editors as single sections.
import { ColorsEditor } from "@/modules/styles/components/style-editor/colors-editor";
import { LayoutEditor } from "@/modules/styles/components/style-editor/layout-editor";
import { TypographyEditor } from "@/modules/styles/components/style-editor/style-typography-editor";
import { ComponentsEditor } from "@/modules/styles/components/style-editor/components-editor";
import { EffectsEditor } from "@/modules/styles/components/style-editor/effects-editor";
import { IconsEditor } from "@/modules/styles/components/style-editor/icons-editor";

function wrapAsSingleSection(
	id: string,
	title: string,
	Comp: React.ComponentType,
): EditorPlugin["sections"] {
	return [
		{
			id,
			title,
			Component: Comp,
		},
	];
}

export const editorPlugins: EditorPlugin[] = [
	{
		id: "colors",
		label: "Colors",
		route: (u, s) => `/styles/${u}/${s}`,
		icon: <PaletteIcon />,
		sections: wrapAsSingleSection("colors-root", "Colors", ColorsEditor),
	},
	{
		id: "layout",
		label: "Layout",
		route: (u, s) => `/styles/${u}/${s}/layout`,
		icon: <LayoutTemplateIcon />,
		sections: wrapAsSingleSection("layout-root", "Layout", LayoutEditor),
	},
	{
		id: "typography",
		label: "Typography",
		route: (u, s) => `/styles/${u}/${s}/typography`,
		icon: <TypeIcon />,
		sections: wrapAsSingleSection(
			"typography-root",
			"Typography",
			TypographyEditor,
		),
	},
	{
		id: "components",
		label: "Components",
		route: (u, s) => `/styles/${u}/${s}/components`,
		icon: <BoxIcon />,
		sections: wrapAsSingleSection(
			"components-root",
			"Components",
			ComponentsEditor,
		),
	},
	{
		id: "effects",
		label: "Effects",
		route: (u, s) => `/styles/${u}/${s}/effects`,
		icon: <SparklesIcon />,
		sections: wrapAsSingleSection("effects-root", "Effects", EffectsEditor),
	},
	{
		id: "icons",
		label: "Icons",
		route: (u, s) => `/styles/${u}/${s}/icons`,
		icon: <ShapesIcon />,
		sections: wrapAsSingleSection("icons-root", "Icons", IconsEditor),
	},
];

