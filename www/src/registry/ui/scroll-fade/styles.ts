import { createStyles } from "@/modules/core/styles";

import scrollFadeMeta from "./meta";

const fadeGradientX =
	"linear-gradient(to_right,transparent_0,black_min(var(--scroll-fade-size),var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(var(--scroll-fade-size),var(--scroll-area-overflow-x-end,0px))),transparent_100%)";
const fadeGradientY =
	"linear-gradient(to_bottom,transparent_0,black_min(var(--scroll-fade-size),var(--scroll-area-overflow-y-start,0px)),black_calc(100%_-_min(var(--scroll-fade-size),var(--scroll-area-overflow-y-end,0px))),transparent_100%)";

const { useStyles, styles } = createStyles(scrollFadeMeta, {
	base: {
		slots: {
			root: [
				"relative overflow-auto outline-none [--scroll-fade-size:--spacing(10)]",
				`[mask-image:${fadeGradientX},${fadeGradientY}] [-webkit-mask-image:${fadeGradientX},${fadeGradientY}]`,
				"[-webkit-mask-repeat:no-repeat] [mask-repeat:no-repeat]",
				"[-webkit-mask-composite:source-in] [mask-composite:intersect]",
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
