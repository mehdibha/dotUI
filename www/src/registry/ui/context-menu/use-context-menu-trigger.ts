"use client";

import * as React from "react";
import { mergeProps } from "react-aria/mergeProps";

const LONG_PRESS_DELAY = 500;
const TOUCH_MOVE_THRESHOLD = 10;

interface ContextMenuTriggerState {
	isOpen: boolean;
	open: (focusStrategy?: "first" | "last" | null) => void;
	close: () => void;
}

interface ContextMenuAnchor {
	x: number;
	y: number;
	size: number;
}

interface UseContextMenuTriggerProps {
	state: ContextMenuTriggerState;
	isDisabled?: boolean;
	onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
	triggerProps?: Omit<React.ComponentProps<"div">, "onContextMenu">;
}

function isNode(value: EventTarget | null): value is Node {
	return value instanceof Node;
}

function useContextMenuTrigger({ state, isDisabled = false, onContextMenu, triggerProps }: UseContextMenuTriggerProps) {
	const triggerRef = React.useRef<HTMLDivElement>(null);
	const anchorRef = React.useRef<HTMLSpanElement>(null);
	const menuRef = React.useRef<HTMLDivElement>(null);
	const touchPositionRef = React.useRef<{ x: number; y: number } | null>(null);
	const longPressTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	const allowMouseUpTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	const allowMouseUpRef = React.useRef(false);
	const [anchor, setAnchor] = React.useState<ContextMenuAnchor>({ x: 0, y: 0, size: 0 });

	const clearLongPressTimeout = React.useCallback(() => {
		if (longPressTimeoutRef.current) {
			clearTimeout(longPressTimeoutRef.current);
			longPressTimeoutRef.current = null;
		}
	}, []);

	const clearAllowMouseUpTimeout = React.useCallback(() => {
		if (allowMouseUpTimeoutRef.current) {
			clearTimeout(allowMouseUpTimeoutRef.current);
			allowMouseUpTimeoutRef.current = null;
		}
	}, []);

	const openAtPoint = React.useCallback(
		(x: number, y: number, size = 0) => {
			setAnchor({ x, y, size });
			allowMouseUpRef.current = false;
			state.open("first");

			clearAllowMouseUpTimeout();
			allowMouseUpTimeoutRef.current = setTimeout(() => {
				allowMouseUpRef.current = true;
			}, LONG_PRESS_DELAY);
		},
		[clearAllowMouseUpTimeout, state],
	);

	React.useEffect(() => {
		if (isDisabled) {
			return;
		}

		const doc = triggerRef.current?.ownerDocument ?? document;

		function handleDocumentContextMenu(event: MouseEvent) {
			const target = event.target;

			if (!isNode(target)) {
				return;
			}

			if (triggerRef.current?.contains(target)) {
				return;
			}

			if (state.isOpen || menuRef.current?.contains(target)) {
				event.preventDefault();
			}
		}

		doc.addEventListener("contextmenu", handleDocumentContextMenu, true);

		return () => {
			doc.removeEventListener("contextmenu", handleDocumentContextMenu, true);
		};
	}, [isDisabled, state.isOpen]);

	React.useEffect(() => {
		return () => {
			clearLongPressTimeout();
			clearAllowMouseUpTimeout();
		};
	}, [clearAllowMouseUpTimeout, clearLongPressTimeout]);

	const mergedTriggerProps = mergeProps(triggerProps, {
		onContextMenu(event: React.MouseEvent<HTMLDivElement>) {
			onContextMenu?.(event);
			if (event.defaultPrevented || isDisabled) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			openAtPoint(event.clientX, event.clientY);

			const doc = event.currentTarget.ownerDocument;
			doc.addEventListener(
				"mouseup",
				(mouseEvent) => {
					if (!allowMouseUpRef.current) {
						mouseEvent.preventDefault();
						mouseEvent.stopPropagation();
						return;
					}

					clearAllowMouseUpTimeout();
					allowMouseUpRef.current = false;

					const target = mouseEvent.target;
					if (!isNode(target)) {
						return;
					}

					if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) {
						return;
					}

					state.close();
				},
				{ capture: true, once: true },
			);
		},
		onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
			if (isDisabled || event.touches.length !== 1) {
				return;
			}

			event.stopPropagation();
			const touch = event.touches.item(0);
			if (!touch) {
				return;
			}

			touchPositionRef.current = { x: touch.clientX, y: touch.clientY };
			clearLongPressTimeout();
			longPressTimeoutRef.current = setTimeout(() => {
				const touchPosition = touchPositionRef.current;
				if (touchPosition) {
					openAtPoint(touchPosition.x, touchPosition.y, 10);
				}
			}, LONG_PRESS_DELAY);
		},
		onTouchMove(event: React.TouchEvent<HTMLDivElement>) {
			if (!longPressTimeoutRef.current || !touchPositionRef.current || event.touches.length !== 1) {
				return;
			}

			const touch = event.touches.item(0);
			if (!touch) {
				return;
			}

			const deltaX = Math.abs(touch.clientX - touchPositionRef.current.x);
			const deltaY = Math.abs(touch.clientY - touchPositionRef.current.y);

			if (deltaX > TOUCH_MOVE_THRESHOLD || deltaY > TOUCH_MOVE_THRESHOLD) {
				clearLongPressTimeout();
			}
		},
		onTouchEnd() {
			clearLongPressTimeout();
			touchPositionRef.current = null;
		},
		onTouchCancel() {
			clearLongPressTimeout();
			touchPositionRef.current = null;
		},
		style: {
			...triggerProps?.style,
			WebkitTouchCallout: "none",
		},
	});

	return {
		anchor,
		anchorRef,
		menuRef,
		triggerProps: mergedTriggerProps,
		triggerRef,
	};
}

export { useContextMenuTrigger };
