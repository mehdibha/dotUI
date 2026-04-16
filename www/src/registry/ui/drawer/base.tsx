"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ModalPrimitives from "react-aria-components/Modal";
import type React from "react";

import { useStyles } from "./styles";

// MARK: drawerStyles

interface DrawerProps extends React.ComponentProps<typeof ModalPrimitives.Modal> {
	placement?: "top" | "bottom" | "left" | "right";
}

function Drawer({ isDismissable = true, className, style, placement, ...props }: DrawerProps) {
	const { overlay, underlay } = useStyles()();
	return (
		<ModalPrimitives.ModalOverlay className={underlay()} isDismissable={isDismissable} data-slot="drawer" {...props}>
			<ModalPrimitives.Modal
				className={composeRenderProps(className, (className) => overlay({ placement, className }))}
				style={composeRenderProps(style, (style) => ({
					"--drawer-margin": "calc(var(--spacing)*24)",
					...style,
				}))}
				{...props}
			/>
		</ModalPrimitives.ModalOverlay>
	);
}

export type { DrawerProps };
export { Drawer };
