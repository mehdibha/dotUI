import type { RegistryItem } from "@/registry/types";

const avatarMeta = {
	name: "avatar",
	type: "registry:ui",
	group: "data-display",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/avatar/base.tsx",
			target: "ui/avatar.tsx",
		},
	],
} satisfies RegistryItem;

export default avatarMeta;

export type AvatarStyle = keyof typeof avatarMeta.styles;

export const avatarStyleNames = Object.keys(avatarMeta.styles) as AvatarStyle[];

export const defaultAvatarStyle = avatarMeta.defaultStyle;
