import type { RegistryItem } from "@/registry/types";

const badgeMeta = {
	name: "badge",
	type: "registry:ui",
	group: "tags",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	tokens: {
		"--badge-radius": {
			type: "radius",
			default: "--radius-md",
		},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/badge/base.tsx",
			target: "ui/badge.tsx",
		},
	],
} satisfies RegistryItem;

export default badgeMeta;

export type BadgeStyle = keyof typeof badgeMeta.styles;

export const badgeStyleNames = Object.keys(badgeMeta.styles) as BadgeStyle[];

export const defaultBadgeStyle = badgeMeta.defaultStyle;
