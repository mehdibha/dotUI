"use client";

import { Modal as AriaModal, ModalOverlay as AriaModalOverlay, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import type React from "react";

const drawerVariants = tv({
	slots: {
		underlay:
			"group/overlay fixed inset-0 z-50 before:fixed before:inset-0 before:bg-bg/40 before:opacity-100 entering:before:opacity-0 exiting:before:opacity-0 before:transition-opacity before:duration-500 before:ease-fluid-out before:content-['']",
		overlay:
			"fixed z-50 flex flex-col border bg-bg transition-[translate] duration-500 ease-fluid-out will-change-[translate]",
	},
	variants: {
		placement: {
			top: {
				overlay:
					"entering:-translate-y-full exiting:-translate-y-full top-0 max-h-[calc(var(--visual-viewport-height)*0.8)] min-h-20 w-screen translate-y-0 rounded-b-xl border-t-0",
			},
			bottom: {
				overlay:
					"-translate-y-full top-(--visual-viewport-height) max-h-[calc(var(--visual-viewport-height)*0.8)] min-h-20 w-screen entering:translate-y-0 exiting:translate-y-0 rounded-t-xl border-b-0",
			},
			left: {
				overlay:
					"entering:-translate-x-full exiting:-translate-x-full top-0 left-0 h-(--visual-viewport-height) min-w-20 max-w-[80vw] translate-x-0 rounded-r-xl border-l-0",
			},
			right: {
				overlay:
					"top-0 right-0 h-(--visual-viewport-height) min-w-20 max-w-[80vw] entering:translate-x-full exiting:translate-x-full translate-x-0 rounded-l-xl border-r-0",
			},
		},
	},
	defaultVariants: {
		placement: "bottom",
	},
});

const { overlay, underlay } = drawerVariants();

interface DrawerProps extends React.ComponentProps<typeof AriaModal> {
	placement?: "top" | "bottom" | "left" | "right";
}

function Drawer({ isDismissable = true, className, style, placement, ...props }: DrawerProps) {
	return (
		<AriaModalOverlay className={underlay()} isDismissable={isDismissable} data-slot="drawer" {...props}>
			<AriaModal
				className={composeRenderProps(className, (className) => overlay({ placement, className }))}
				style={composeRenderProps(style, (style) => ({
					"--drawer-margin": "calc(var(--spacing)*24)",
					...style,
				}))}
				{...props}
			/>
		</AriaModalOverlay>
	);
}

export type { DrawerProps };
export { Drawer };
