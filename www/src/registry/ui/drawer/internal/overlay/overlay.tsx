"use client";

import * as React from "react";
import { mergeProps, Overlay } from "react-aria";
import type { OverlayTriggerState } from "react-stately";

import type { DrawerPlacement } from "../types";
import { useDrawerOverlay } from "./use-drawer-overlay";
import type { DrawerPhase } from "./use-drawer-state";

interface DrawerOverlayProps {
	state: OverlayTriggerState;
	phase: DrawerPhase;
	isDismissable: boolean;
	isKeyboardDismissDisabled?: boolean;
	placement: DrawerPlacement;
	panelRef: React.RefObject<HTMLDivElement | null>;
	setPanelRef: (el: HTMLDivElement | null) => void;
	underlayRef: React.RefObject<HTMLDivElement | null>;
	className?: string;
	style?: React.CSSProperties;
	underlayProps?: React.HTMLAttributes<HTMLDivElement>;
	children?: React.ReactNode;
}

function phaseDataAttrs(phase: DrawerPhase): Record<string, string | undefined> {
	const attrs: Record<string, string | undefined> = {};
	if (phase === "starting") {
		attrs["data-open"] = "true";
		attrs["data-starting-style"] = "true";
	} else if (phase === "open") {
		attrs["data-open"] = "true";
	} else if (phase === "ending") {
		attrs["data-ending-style"] = "true";
	} else {
		attrs["data-closed"] = "true";
	}
	return attrs;
}

/**
 * Owned overlay shell. Replaces RAC's `<ModalOverlay>` + `<Modal>`.
 *
 * Renders a portal (`<Overlay>`) containing a focus-contained underlay and panel.
 * The phase machine in `useDrawerState` controls mount/unmount and emits
 * `data-open` / `data-starting-style` / `data-ending-style` / `data-closed`
 * for CSS to interpolate against.
 */
export function DrawerOverlay({
	state,
	phase,
	isDismissable,
	isKeyboardDismissDisabled,
	placement,
	panelRef,
	setPanelRef,
	underlayRef,
	className,
	style,
	underlayProps: underlayPropsProp,
	children,
}: DrawerOverlayProps) {
	const { modalProps, underlayProps, dialogProps } = useDrawerOverlay({
		state,
		phase,
		isDismissable,
		isKeyboardDismissDisabled,
		panelRef,
	});

	const dataAttrs = phaseDataAttrs(phase);
	const isExiting = phase === "ending";

	return (
		<Overlay isExiting={isExiting}>
			<div
				{...mergeProps(underlayProps, underlayPropsProp ?? {})}
				ref={underlayRef}
				data-slot="drawer"
				data-placement={placement}
				{...dataAttrs}
			>
				<div
					{...mergeProps(modalProps, dialogProps)}
					ref={setPanelRef}
					className={className}
					style={style}
					data-placement={placement}
					{...dataAttrs}
				>
					{children}
				</div>
			</div>
		</Overlay>
	);
}
