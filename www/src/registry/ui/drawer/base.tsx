"use client";

import { Modal as AriaModal, ModalOverlay as AriaModalOverlay, composeRenderProps } from "react-aria-components";
import type React from "react";

import { useStyles } from "./styles";

// MARK: drawerStyles

interface DrawerProps extends React.ComponentProps<typeof AriaModal> {
	placement?: "top" | "bottom" | "left" | "right";
}

function Drawer({ isDismissable = true, className, style, placement, ...props }: DrawerProps) {
	const { overlay, underlay } = useStyles()();
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
