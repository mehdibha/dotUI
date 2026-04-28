import { createStyles } from "@/modules/core/styles";

import colorSliderMeta from "./meta";

const { useStyles, styles } = createStyles(colorSliderMeta, {
	base: {
		slots: {
			root: "",
			output: "",
			track: "",
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
				root: "flex flex-col gap-2",
				output: "text-fg-muted text-sm",
				track:
					"relative rounded-md before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:bg-[repeating-conic-gradient(#e6e6e6_0%_25%,#fff_0%_50%)] before:bg-center before:bg-size-[16px_16px] before:content-[''] orientation-horizontal:**:data-[slot=color-thumb]:top-1/2 orientation-vertical:**:data-[slot=color-thumb]:left-1/2 disabled:[background:var(--color-disabled)]!",
			},
			variants: {
				orientation: {
					horizontal: {
						root: "w-48",
						track: "h-6 w-full",
					},
					vertical: {
						root: "h-48 items-center",
						track: "w-6 flex-1",
					},
				},
			},
			defaultVariants: {
				orientation: "horizontal",
			},
		},
	},
});

export type ColorSliderStyles = typeof styles;

export { useStyles };
