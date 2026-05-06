import type * as React from "react";

/**
 * A context menu opens a menu at the pointer position when the trigger element receives a contextmenu event.
 */
export interface ContextMenuProps extends Omit<React.ComponentProps<"div">, "onContextMenu"> {
	/**
	 * The trigger content.
	 */
	children: React.ReactNode;

	/**
	 * The overlay to display. This is usually a Popover containing MenuContent.
	 */
	overlay: React.ReactNode;

	/**
	 * Whether the menu is open.
	 */
	isOpen?: boolean;

	/**
	 * Whether the menu is open by default.
	 */
	defaultOpen?: boolean;

	/**
	 * Handler that is called when the open state changes.
	 */
	onOpenChange?: (isOpen: boolean) => void;

	/**
	 * Whether the context menu is disabled.
	 */
	isDisabled?: boolean;

	/**
	 * Handler that is called when the trigger receives a contextmenu event.
	 */
	onContextMenu?: React.MouseEventHandler<HTMLDivElement>;

	/**
	 * An accessibility label for the menu.
	 */
	"aria-label"?: string;
}
