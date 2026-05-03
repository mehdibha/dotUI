import { createStyles } from "@/modules/core/styles";

import drawerMeta from "./meta";

const { useStyles, styles } = createStyles(drawerMeta, {
	base: {
		slots: {
			underlay:
				"group/overlay fixed inset-0 z-50 before:fixed before:inset-0 before:bg-black/70 before:opacity-100 data-[starting-style]:before:opacity-0 data-[ending-style]:before:opacity-0 before:transition-opacity before:duration-500 before:ease-fluid-out before:content-['']",
			overlay:
				// Base UI nested-drawer pattern (verbatim variable names + height-collapse):
				//   --drawer-height            own measured height
				//   --drawer-frontmost-height  topmost drawer's measured height
				//   --nested-drawers           integer count of drawers above this one
				//   --bleed                    overhang past viewport bottom (3rem)
				// When NOT nested: drawer at its natural height, transform = 0.
				// When nested: parent's height collapses to (frontmost-height + bleed)
				// with overflow-hidden so a tall parent shrinks to align with the topmost.
				// Translate clamps to min(0,...) so parents never move DOWN — they only lift
				// up to peek 24px above the topmost when needed.
				// `[interpolate-size:allow-keywords]` lets the `height` transition between
				// `auto` (natural) and `calc(var(--drawer-frontmost-height,0px))` (collapsed)
				// — without it, browsers snap discretely on close.
				"fixed bottom-0 z-50 flex flex-col border bg-bg shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.35)] [--bleed:3rem] [interpolate-size:allow-keywords] [transition-property:translate,height,--nested-drawers,--drawer-frontmost-height] [transition-duration:calc(500ms*var(--drawer-swipe-strength,1)),500ms,500ms,500ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1),cubic-bezier(0.32,0.72,0,1),cubic-bezier(0.32,0.72,0,1),cubic-bezier(0.32,0.72,0,1)] will-change-[translate,transform,height] [transform:translate3d(0,min(0px,calc(var(--drawer-height,0px)-var(--drawer-frontmost-height,0px)-var(--nested-drawers,0)*24px)),0)] data-[nested-drawer-open=true]:overflow-hidden data-[nested-drawer-open=true]:[height:calc(var(--drawer-frontmost-height,0px))] data-[swiping=true]:select-none data-[swiping=true]:transition-none data-[nested-drawer-swiping=true]:transition-none",
			handle:
				"mx-auto my-2 shrink-0 cursor-grab touch-none select-none rounded-full bg-fg/20 active:cursor-grabbing data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-12 data-[orientation=horizontal]:w-12 data-[orientation=vertical]:w-1.5",
			indent:
				// scale + translate driven by --drawer-progress (0 at rest, 1 fully open).
				// `relative z-1 bg-bg` keeps it stacked above the fixed IndentBackground
				// and ensures the scaled-away edges reveal the dark layer beneath.
				// Transition is on while idle/opening; suppressed during active swipe so the
				// page tracks the finger 1:1.
				"relative z-1 min-h-screen bg-bg [border-radius:calc(var(--drawer-progress,0)*16px)] [transform-origin:50%_0] [transform:translate3d(0,calc(var(--drawer-progress,0)*8px),0)_scale(calc(1-0.04*var(--drawer-progress,0)))] [transition:transform_500ms_cubic-bezier(0.32,0.72,0,1),border-radius_500ms_cubic-bezier(0.32,0.72,0,1)] data-[swiping=true]:transition-none",
			indentBackground:
				// opacity driven by --drawer-progress directly; transition only when not swiping.
				// z-index 0 + DOM-first render keeps it behind the indented content.
				"pointer-events-none fixed inset-0 z-0 bg-black [opacity:var(--drawer-progress,0)] [transition:opacity_500ms_cubic-bezier(0.32,0.72,0,1)] data-[swiping=true]:transition-none",
		},
		variants: {
			placement: {
				top: {
					overlay:
						"top-0 max-h-[calc(var(--visual-viewport-height)*0.8)] min-h-20 w-screen data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full translate-y-0 rounded-b-xl border-t-0",
				},
				bottom: {
					overlay:
						"bottom-0 max-h-[calc(var(--visual-viewport-height)*0.8)] min-h-20 w-screen data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full translate-y-0 rounded-t-xl border-b-0",
				},
				left: {
					overlay:
						"top-0 left-0 h-(--visual-viewport-height) min-w-20 max-w-[80vw] data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full translate-x-0 rounded-r-xl border-l-0",
				},
				right: {
					overlay:
						"top-0 right-0 h-(--visual-viewport-height) min-w-20 max-w-[80vw] data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full translate-x-0 rounded-l-xl border-r-0",
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
