import { createStyles } from "@/modules/core/styles";

import modalMeta from "./meta";

const { useStyles, styles } = createStyles(modalMeta, {
	base: {
		slots: {
			overlay: "group/modal absolute top-0 left-0 isolate z-100 h-(--page-height) w-full",
			backdrop: [
				"size-full bg-black/(--modal-backdrop-opacity) backdrop-blur-(--modal-backdrop-blur) duration-200 group-exiting/modal:duration-150",
				"transition-opacity group-entering/modal:opacity-0 group-exiting/modal:opacity-0",
			],
			viewport: "@container-[size] sticky top-0 h-(--visual-viewport-height) w-full",
			modal: [
				"pointer-events-auto fixed top-[calc(var(--visual-viewport-height)/2)] left-1/2 max-h-[calc(var(--visual-viewport-height)*.9)] w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-(--modal-radius) border bg-(--modal-background) shadow-lg sm:max-w-lg",
				"transition-[opacity,scale,top] ease-[cubic-bezier(0.165,0.84,0.44,1)]",
				"entering:scale-95 entering:opacity-0 duration-200",
				"exiting:scale-95 exiting:opacity-0 exiting:duration-150",
			],
		},
	},
	density: {
		compact: {},
		default: {},
		comfortable: {},
	},
	params: {
		style: {
			default: {
				slots: {
					overlay: "",
					backdrop: "",
					viewport: "",
					modal: "",
				},
			},
			"muted-footer": {
				slots: {
					overlay: "",
					backdrop: "",
					viewport: "",
					modal:
						"**:data-[slot=dialog-footer]:-mx-6 **:data-[slot=dialog-footer]:-mb-6 **:data-[slot=dialog-footer]:rounded-b-(--modal-radius) **:data-[slot=dialog-footer]:border-t **:data-[slot=dialog-footer]:bg-muted **:data-[slot=dialog-footer]:px-6 **:data-[slot=dialog-footer]:py-4",
				},
			},
		},
	},
});

export type ModalStyles = typeof styles;

export { useStyles };
