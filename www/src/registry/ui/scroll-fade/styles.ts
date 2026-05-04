import { createStyles } from "@/modules/core/styles";

import scrollFadeMeta from "./meta";

const { useStyles, styles } = createStyles(scrollFadeMeta, {
	base: {
		slots: {
			root: [
				"relative overflow-auto outline-none",
				"mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))]",
				"mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))]",
				"[--fade-size:1.5rem]",
			],
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type ScrollFadeStyles = typeof styles;

export { useStyles };
