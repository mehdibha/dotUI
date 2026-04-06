import { tv } from "tailwind-variants";

import { createStyles } from "@/modules/core/styles";

import avatarMeta from "./meta";

const baseStyles = tv({
	slots: {
		root: "",
		image: "",
		fallback: "",
		badge: "",
		group: "",
		groupCount: "",
	},
});

const defaultStyles = tv({
	extend: baseStyles,
	slots: {
		root: [
			"group/avatar relative inline-flex shrink-0 rounded-full bg-muted align-middle",
			"*:data-badge:absolute *:data-badge:not-with-[right]:not-with-[left]:right-0 *:data-badge:not-with-[bottom]:not-with-[top]:bottom-0",
		],
		image: "aspect-square size-full rounded-[inherit] object-cover",
		fallback:
			"flex size-full select-none items-center justify-center rounded-[inherit] bg-muted text-sm group-data-[size=sm]/avatar:text-xs",
		badge: [
			"absolute right-0 with-[left]:right-auto bottom-0 with-[top]:bottom-auto z-10 inline-flex select-none items-center justify-center rounded-full bg-primary text-fg-on-primary bg-blend-color ring-2 ring-bg",
			"not-with-[size]:group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
			"not-with-[size]:group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2",
			"not-with-[size]:group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
		],
		group: "group/avatar-group flex -space-x-2 *:data-avatar:ring-2 *:data-avatar:ring-bg",
		groupCount:
			"relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-fg-muted text-sm ring-2 ring-bg group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
	},
	variants: {
		size: {
			sm: { group: "*:data-avatar:size-6", root: "size-6" },
			md: { group: "*:data-avatar:size-8", root: "size-8" },
			lg: { group: "*:data-avatar:size-10", root: "size-10" },
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export type AvatarStyles = typeof defaultStyles;

export const { useStyles } = createStyles(avatarMeta, {
	default: defaultStyles,
});
