import { createStyles } from "@/modules/core/styles";

import modalMeta from "./meta";

const { useStyles, styles } = createStyles(modalMeta, {
	base: {
		slots: {
			overlay: ["group/modal absolute top-0 left-0 isolate z-100 h-(--page-height) w-full"],
			backdrop: [
				"absolute inset-0 bg-black/(--modal-backdrop-opacity) backdrop-blur-(--modal-backdrop-blur) duration-200 group-exiting/modal:duration-150",
				"transition-opacity group-entering/modal:opacity-0 group-exiting/modal:opacity-0",
			],
			viewport:
				"@container-[size] sticky top-0 left-0 flex h-(--visual-viewport-height) w-full items-center justify-center",
			modal: [
				"relative flex max-h-[calc(var(--visual-viewport-height)-2rem)] w-full max-w-[calc(100vw-2rem)] flex-col rounded-(--modal-radius) border bg-(--modal-background) shadow-lg sm:max-h-[calc(var(--visual-viewport-height)*.9)]",
				"transition-[opacity,scale] ease-[cubic-bezier(0.165,0.84,0.44,1)]",
				"entering:scale-95 entering:opacity-0 duration-200",
				"exiting:scale-95 exiting:opacity-0 exiting:duration-150",
			],
		},
	},
	density: {
		compact: { slots: { modal: "sm:max-w-sm" } },
		default: { slots: { modal: "sm:max-w-sm" } },
		comfortable: { slots: { modal: "sm:max-w-md" } },
	},
	params: {
		style: {
			default: {},
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
