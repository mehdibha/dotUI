import { createStyles } from "@/modules/core/styles";

import scrollFadeMeta from "./meta";

const { useStyles, styles } = createStyles(scrollFadeMeta, {
	base: {
		base: [
			"relative overflow-auto outline-none",
			"data-[overflow-y-end]:mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] data-[overflow-y-start]:mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))]",
			"data-[overflow-x-end]:mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] data-[overflow-x-start]:mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))]",
			"[--fade-size:1.5rem]",
		],
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type ScrollFadeStyles = typeof styles;

export { useStyles };
