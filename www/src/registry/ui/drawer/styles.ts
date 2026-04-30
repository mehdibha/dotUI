import { createStyles } from "@/modules/core/styles";

import drawerMeta from "./meta";

const { useStyles, styles } = createStyles(drawerMeta, {
	base: {
		slots: {
			underlay: "group/overlay fixed inset-0 z-50 before:fixed before:inset-0 before:bg-bg/40 before:opacity-100 entering:before:opacity-0 exiting:before:opacity-0 before:transition-opacity before:duration-500 before:ease-fluid-out before:content-['']",
			overlay: "fixed z-50 flex flex-col border bg-bg transition-[translate] duration-500 ease-fluid-out will-change-[translate]",
		},
		variants: {
			placement: {
				top: {
					overlay: "top-0 max-h-[calc(var(--visual-viewport-height)*0.8)] min-h-20 w-screen entering:-translate-y-full exiting:-translate-y-full translate-y-0 rounded-b-xl border-t-0",
				},
				bottom: {
					overlay: "top-(--visual-viewport-height) max-h-[calc(var(--visual-viewport-height)*0.8)] min-h-20 w-screen -translate-y-full entering:translate-y-0 exiting:translate-y-0 rounded-t-xl border-b-0",
				},
				left: {
					overlay: "top-0 left-0 h-(--visual-viewport-height) min-w-20 max-w-[80vw] entering:-translate-x-full exiting:-translate-x-full translate-x-0 rounded-r-xl border-l-0",
				},
				right: {
					overlay: "top-0 right-0 h-(--visual-viewport-height) min-w-20 max-w-[80vw] entering:translate-x-full exiting:translate-x-full translate-x-0 rounded-l-xl border-r-0",
				},
			},
		},
		defaultVariants: {
			placement: "bottom",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
});

export type DrawerStyles = typeof styles;

export { useStyles };
