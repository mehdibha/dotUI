import { createStyles } from "@/modules/core/styles";

import toastMeta from "./meta";

const { useStyles, styles } = createStyles(toastMeta, {
	base: {
		slots: {
			region: "",
			toast: "",
			content: "",
			title: "",
			description: "",
			actions: "",
			close: "",
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
				region: [
					"focus-reset focus-visible:focus-ring",
					"fixed right-4 bottom-4 z-50 flex max-h-[calc(100vh-2rem)] flex-col gap-2 overflow-hidden outline-none",
				],
				toast: "relative w-[min(380px,90vw)] rounded-lg border bg-bg p-4 shadow-lg",
				content: "flex flex-col gap-1",
				title: "text-base",
				description: "text-fg-muted text-sm",
				actions: "",
				close: "absolute top-3.5 right-3 size-7",
			},
			variants: {
				variant: {
					neutral: { toast: "border-border bg-card" },
					success: {
						toast: "border-border-success bg-success",
						title: "text-fg-success",
					},
					warning: {
						toast: "border-border-warning bg-warning",
					},
					danger: {
						toast: "border-border-danger bg-danger",
					},
					error: {
						toast: "border-border-danger bg-danger",
					},
					info: {
						toast: "border-border-info bg-info",
					},
				},
			},
			defaultVariants: {
				variant: "neutral",
			},
		},
	},
});

export type ToastStyles = typeof styles;
export { useStyles };
