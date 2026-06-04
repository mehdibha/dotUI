"use client";

import type { CSSProperties } from "react";

import { cn } from "@/registry/lib/utils";

/**
 * Focus-safety + layout boundary for the static "open overlay" previews shown on
 * the components page.
 *
 * The real Modal/Popover/Drawer/Tooltip components portal to `document.body`, trap
 * focus (FocusScope `contain` + `autoFocus`) and lock scroll when open — so they
 * cannot be rendered inline, and rendering them open inside an <iframe> steals focus
 * (the inner autofocus pulls browser focus onto the <iframe>). The previews therefore
 * rebuild each overlay's *open visual* from the real style slots WITHOUT those
 * wrappers, and render it inside this boundary:
 *
 *  - `inert` (native, React 19) removes the whole subtree from the tab order, pointer
 *    events and the accessibility tree, so nothing inside can ever take focus. This is
 *    what guarantees that focusing/​tabbing other elements on the page keeps working.
 *  - `overflow-hidden` clips any bleed; `relative isolate` contains the absolutely
 *    positioned slot layers (backdrop/viewport/panel) to this box instead of the page.
 *  - The slots reference CSS vars that React Aria / Base UI set at runtime from the
 *    real viewport; those are unset in a static preview, so we pin them to the card box.
 *    (Scalar param vars like --modal-radius/--modal-background have global :root
 *    defaults from the registry CSS and need no handling here.)
 */
const CONTAINED_VARS = {
	"--page-height": "100%",
	"--visual-viewport-height": "100%",
} as CSSProperties;

interface InertPreviewProps {
	children: React.ReactNode;
	className?: string;
	style?: CSSProperties;
}

export function InertPreview({ children, className, style }: InertPreviewProps) {
	return (
		<div
			inert
			className={cn("relative isolate size-full overflow-hidden", className)}
			style={{ ...CONTAINED_VARS, ...style }}
		>
			{children}
		</div>
	);
}
