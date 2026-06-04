"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { UNSAFE_PortalProvider } from "react-aria/PortalProvider";

import { cn } from "@/registry/lib/utils";

/**
 * Sandbox for the INTERACTIVE overlay/picker previews on the components page.
 *
 * The real overlays (Modal/Popover/Tooltip/Menu/Select/Combobox/DatePicker)
 * normally portal to `document.body` and position against the viewport. Here we
 * scope them to the card so opening one never covers the rest of the page:
 *
 *  - `UNSAFE_PortalProvider getContainer={() => box}` makes every react-aria
 *    overlay beneath portal INTO this box instead of `document.body`. Positioning
 *    is then resolved relative to the box, so the overlay stays in the card.
 *  - The box is `relative isolate overflow-hidden`, so absolutely/`sticky`
 *    positioned overlay layers (modal backdrop/viewport) fill the card, and the
 *    runtime viewport vars are pinned to the box (modal sizes to the card, not
 *    the screen).
 *  - Children render client-only (after mount): Select/Combobox/Menu crash React
 *    during SSR (`selectionManager` null), and these previews don't need SSR.
 *
 * Triggers are real and focusable; opening is user-initiated, so focus moving
 * into the overlay is expected (not the load-time focus-steal the static iframe
 * approach had). Closing (Escape / click-away / close button) restores focus.
 */
const CONTAINED_VARS = {
	"--page-height": "100%",
	"--visual-viewport-height": "100%",
} as CSSProperties;

interface LivePreviewProps {
	children: React.ReactNode;
	className?: string;
}

export function LivePreview({ children, className }: LivePreviewProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div
			ref={ref}
			className={cn(
				"relative isolate flex size-full items-center justify-center overflow-hidden",
				// React Aria sizes the modal to the real window/page: it sets --page-height (document
				// scrollHeight) and --visual-viewport-height (window height) as inline styles on the
				// modal overlay, which would push the centered panel far below the card. Pin the
				// overlay (the element wrapping the viewport) and the viewport back to this box.
				"[&_:has(>[data-slot=modal-viewport])]:!h-full [&_[data-slot=modal-viewport]]:!h-full",
				className,
			)}
			style={CONTAINED_VARS}
		>
			{mounted && (
				<UNSAFE_PortalProvider getContainer={() => ref.current ?? document.body}>{children}</UNSAFE_PortalProvider>
			)}
		</div>
	);
}
