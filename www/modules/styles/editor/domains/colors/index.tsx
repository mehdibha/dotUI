import type { EditorPlugin } from "../../registry/types";
import { ModeSection } from "./sections/ModeSection";
import { AdjustmentsSection } from "./sections/AdjustmentsSection";
import { ScalesSection } from "./sections/ScalesSection";
import { TokensSection } from "./sections/TokensSection";

export const colorsPlugin: EditorPlugin = {
	id: "colors",
	label: "Colors",
	route: (u, s) => `/styles/${u}/${s}`,
	icon: null,
	sections: [
		{ id: "mode", title: "Mode", Component: ModeSection },
		{ id: "adjustments", title: "Color adjustments", Component: AdjustmentsSection },
		{ id: "scales", title: "Scales", Component: ScalesSection },
		{ id: "tokens", title: "Tokens", Component: TokensSection },
	],
};

