"use client";

import * as React from "react";

import { mergeProps } from "react-aria/mergeProps";

const LONG_PRESS_DELAY = 500;
const TOUCH_MOVE_THRESHOLD = 10;
const CONTEXT_MENU_OPEN_EVENT = "dotui-context-menu-open";

interface ContextMenuTriggerState {
	isOpen: boolean;
	open: (focusStrategy?: "first" | "last" | null) => void;
	close: () => void;
}

interface ContextMenuAnchor {
	x: number;
	y: number;
	size: number;
	key: number;
}

interface UseContextMenuTriggerProps {
	state: ContextMenuTriggerState;
	isDisabled?: boolean;
	onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
	triggerProps?: Omit<React.ComponentProps<"div">, "onContextMenu">;
}

interface ContextMenuOpenEventDetail {
	x: number;
	y: number;
	size?: number;
}

function isNode(value: EventTarget | null): value is Node {
	return value instanceof Node;
}

function containsPoint(element: HTMLElement, x: number, y: number) {
	const rect = element.getBoundingClientRect();
	return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function findContextMenuTriggerAtPoint(doc: Document, x: number, y: number) {
	const triggers = Array.from(doc.querySelectorAll<HTMLElement>("[data-context-menu]")).filter((trigger) =>
		containsPoint(trigger, x, y),
	);

	return triggers.sort((a, b) => {
		const aRect = a.getBoundingClientRect();
		const bRect = b.getBoundingClientRect();
		return aRect.width * aRect.height - bRect.width * bRect.height;
	})[0];
}

function useContextMenuTrigger({ state, isDisabled = false, onContextMenu, triggerProps }: UseContextMenuTriggerProps) {
	const triggerRef = React.useRef<HTMLDivElement>(null);
	const anchorRef = React.useRef<HTMLSpanElement>(null);
	const anchorPositionRef = React.useRef<ContextMenuAnchor>({ x: 0, y: 0, size: 0, key: 0 });
	const menuRef = React.useRef<HTMLDivElement>(null);
	const [, rerenderAfterAnchorMount] = React.useState(0);
	const touchPositionRef = React.useRef<{ x: number; y: number } | null>(null);
	const longPressTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	const allowMouseUpTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	const allowMouseUpRef = React.useRef(false);
	const [anchor, setAnchor] = React.useState<ContextMenuAnchor>({ x: 0, y: 0, size: 0, key: 0 });

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
			setAnchor((anchor) => {
				const nextAnchor = { x, y, size, key: anchor.key + 1 };
				anchorPositionRef.current = nextAnchor;
				return nextAnchor;
			});
			allowMouseUpRef.current = false;
			state.open("first");

			clearAllowMouseUpTimeout();
			allowMouseUpTimeoutRef.current = setTimeout(() => {
				allowMouseUpRef.current = true;
			}, LONG_PRESS_DELAY);
		},
		[clearAllowMouseUpTimeout, state],
	);

	const anchorRefCallback = React.useCallback((element: HTMLSpanElement | null) => {
		anchorRef.current = element;
		if (element) {
			element.getBoundingClientRect = () => {
				const { x, y, size } = anchorPositionRef.current;
				return DOMRect.fromRect({ x, y, width: size, height: size });
			};
			rerenderAfterAnchorMount((version) => version + 1);
		}
	}, []);

	React.useEffect(() => {
		const trigger = triggerRef.current;
		if (!trigger || isDisabled) {
			return;
		}

		function handleContextMenuOpen(event: Event) {
			const { x, y, size = 0 } = (event as CustomEvent<ContextMenuOpenEventDetail>).detail;
			openAtPoint(x, y, size);
		}

		trigger.addEventListener(CONTEXT_MENU_OPEN_EVENT, handleContextMenuOpen);

		return () => {
			trigger.removeEventListener(CONTEXT_MENU_OPEN_EVENT, handleContextMenuOpen);
		};
	}, [isDisabled, openAtPoint]);

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

			if (target instanceof Element && target.closest("[data-popover]")) {
				event.preventDefault();
				return;
			}

			if (state.isOpen) {
				const contextMenuTrigger = findContextMenuTriggerAtPoint(doc, event.clientX, event.clientY);

				if (contextMenuTrigger?.hasAttribute("data-disabled")) {
					state.close();
					return;
				}

				event.preventDefault();

				if (contextMenuTrigger === triggerRef.current) {
					openAtPoint(event.clientX, event.clientY);
					return;
				}

				if (contextMenuTrigger) {
					state.close();
					contextMenuTrigger.dispatchEvent(
						new CustomEvent<ContextMenuOpenEventDetail>(CONTEXT_MENU_OPEN_EVENT, {
							bubbles: false,
							detail: { x: event.clientX, y: event.clientY },
						}),
					);
				}
			}
		}

		doc.addEventListener("contextmenu", handleDocumentContextMenu, true);

		return () => {
			doc.removeEventListener("contextmenu", handleDocumentContextMenu, true);
		};
		// oxlint-disable-next-line react/exhaustive-deps -- state members are listed explicitly
	}, [isDisabled, openAtPoint, state.close, state.isOpen]);

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
		anchorRefCallback,
		menuRef,
		triggerProps: mergedTriggerProps,
		triggerRef,
	};
}

export { useContextMenuTrigger };
