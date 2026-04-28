import { createStyles } from "@/modules/core/styles";

import modalMeta from "./meta";

const { useStyles, styles } = createStyles(modalMeta, {
	base: {
		slots: {
			overlay: "",
			backdrop: "",
			modal: "",
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
	styles: {
		default: {
			slots: {
				overlay: "group/modal absolute top-0 left-0 z-100 h-(--page-height) w-full",
				backdrop: [
					"size-full bg-bg/40 duration-200 group-exiting/modal:duration-150",
					"transition-opacity group-entering/modal:opacity-0 group-exiting/modal:opacity-0",
				],
				modal: [
					"fixed top-[calc(var(--visual-viewport-height)/2)] left-1/2 max-h-(--visual-viewport-height) w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-bg shadow-lg sm:max-w-lg",
					"transition-[opacity,scale] ease-[cubic-bezier(0.165,0.84,0.44,1)]",
					"entering:scale-95 entering:opacity-0 duration-200",
					"exiting:scale-95 exiting:opacity-0 exiting:duration-150",
				],
			},
		},
	},
});

export type ModalStyles = typeof styles;

export { useStyles };
