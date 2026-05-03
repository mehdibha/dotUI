"use client";

import * as React from "react";
import { useDialog, useModalOverlay, usePreventScroll } from "react-aria";
import type { OverlayTriggerState } from "react-stately";

import type { DrawerPhase } from "./use-drawer-state";

interface UseDrawerOverlayOptions {
	state: OverlayTriggerState;
	phase: DrawerPhase;
	isDismissable: boolean;
	isKeyboardDismissDisabled?: boolean;
	role?: "dialog" | "alertdialog";
	panelRef: React.RefObject<HTMLElement | null>;
}

interface UseDrawerOverlayReturn {
	modalProps: React.HTMLAttributes<HTMLElement>;
	underlayProps: React.HTMLAttributes<HTMLElement>;
	dialogProps: React.HTMLAttributes<HTMLElement>;
	titleProps: React.HTMLAttributes<HTMLElement>;
}

/**
 * Composes `useModalOverlay` + `useDialog` + `usePreventScroll`. Returns
 * spreadable prop bags for the panel and the underlay.
 *
 * Scroll lock is engaged for every non-`closed` phase so the page doesn't jump
 * while the exit animation runs.
 */
export function useDrawerOverlay({
	state,
	phase,
	isDismissable,
	isKeyboardDismissDisabled = false,
	role = "dialog",
	panelRef,
}: UseDrawerOverlayOptions): UseDrawerOverlayReturn {
	usePreventScroll({ isDisabled: phase === "closed" });

	const { modalProps, underlayProps } = useModalOverlay(
		{ isDismissable, isKeyboardDismissDisabled },
		state,
		panelRef,
	);

	const { dialogProps, titleProps } = useDialog({ role }, panelRef);

	return {
		modalProps: modalProps as React.HTMLAttributes<HTMLElement>,
		underlayProps: underlayProps as React.HTMLAttributes<HTMLElement>,
		dialogProps: dialogProps as React.HTMLAttributes<HTMLElement>,
		titleProps: titleProps as React.HTMLAttributes<HTMLElement>,
	};
}
