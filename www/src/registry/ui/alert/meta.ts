import type { RegistryItem } from "@/registry/types";

const alertMeta = {
	name: "alert",
	type: "registry:ui",
	group: "feedback",
	defaultStyle: "default",
	files: [
		{
			type: "registry:ui",
			path: "ui/alert/base.tsx",
			target: "ui/alert.tsx",
		},
	],
	styles: {
		default: {
			description: "Minimal with a subtle border and muted background.",
		},
	},
	params: {
		"--alert-radius": {
			type: "radius",
			default: "--radius-lg",
		},
	},
} satisfies RegistryItem;

export default alertMeta;

export type AlertStyle = keyof typeof alertMeta.styles;

export const alertStyleNames = Object.keys(alertMeta.styles) as AlertStyle[];

export const defaultAlertStyle = alertMeta.defaultStyle;
