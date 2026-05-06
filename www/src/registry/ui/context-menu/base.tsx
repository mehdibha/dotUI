"use client";

import * as React from "react";
import { mergeProps } from "react-aria/mergeProps";
import { OverlayTriggerStateContext } from "react-aria-components/Dialog";
import { MenuContext, RootMenuTriggerStateContext } from "react-aria-components/Menu";
import { PopoverContext } from "react-aria-components/Popover";
import { Provider } from "react-aria-components/slots";
import { useMenuTriggerState } from "react-stately/useMenuTriggerState";

interface ContextMenuProps extends Omit<React.ComponentProps<"div">, "onContextMenu"> {
	children: React.ReactNode;
	isOpen?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
	isDisabled?: boolean;
	onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
	"aria-label"?: string;
}

function ContextMenu({
	children,
	defaultOpen,
	isOpen,
	isDisabled = false,
	onContextMenu,
	onOpenChange,
	"aria-label": ariaLabel = "Context menu",
	...triggerProps
}: ContextMenuProps) {
	const state = useMenuTriggerState({ defaultOpen, isOpen, onOpenChange });
	const triggerRef = React.useRef<HTMLDivElement>(null);
	const anchorRef = React.useRef<HTMLSpanElement>(null);
	const menuRef = React.useRef<HTMLDivElement>(null);
	const [anchor, setAnchor] = React.useState({ x: 0, y: 0 });

	React.useEffect(() => {
		if (isDisabled) {
			return;
		}

		const doc = triggerRef.current?.ownerDocument ?? document;

		function handleDocumentContextMenu(event: MouseEvent) {
			const target = event.target;

			if (!(target instanceof Node)) {
				return;
			}

			if (triggerRef.current?.contains(target)) {
				return;
			}

			if (state.isOpen) {
				event.preventDefault();
			}
		}

		doc.addEventListener("contextmenu", handleDocumentContextMenu, true);

		return () => {
			doc.removeEventListener("contextmenu", handleDocumentContextMenu, true);
		};
	}, [isDisabled, state.isOpen]);

	const contextMenuProps = mergeProps(triggerProps, {
		onContextMenu(event: React.MouseEvent<HTMLDivElement>) {
			onContextMenu?.(event);
			if (event.defaultPrevented) {
				return;
			}
			if (isDisabled) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			setAnchor({ x: event.clientX, y: event.clientY });
			state.open("first");
		},
	});

	return (
		<Provider
			values={[
				[
					MenuContext,
					{
						"aria-label": ariaLabel,
						autoFocus: state.focusStrategy || true,
						onClose: state.close,
						ref: menuRef,
					},
				],
				[OverlayTriggerStateContext, state],
				[RootMenuTriggerStateContext, state],
				[
					PopoverContext,
					{
						trigger: "ContextMenu",
						triggerRef: anchorRef,
						scrollRef: menuRef,
						placement: "bottom start",
					},
				],
			]}
		>
			<div data-context-menu="" {...contextMenuProps} ref={triggerRef}>
				{children}
			</div>
			<span
				ref={anchorRef}
				aria-hidden="true"
				style={{
					position: "fixed",
					left: anchor.x,
					top: anchor.y,
					width: 0,
					height: 0,
					pointerEvents: "none",
				}}
			/>
		</Provider>
	);
}

export type { ContextMenuProps };
export { ContextMenu };
