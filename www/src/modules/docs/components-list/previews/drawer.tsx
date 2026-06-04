"use client";

import { useStyles as useDrawerStyles } from "@/registry/ui/drawer/styles";

import { InertPreview } from "./inert-preview";

/** Static "open" Drawer preview — bottom sheet + backdrop, no portal/swipe. */
export function DrawerPreview() {
	const { overlay, backdrop, viewport, popup, handle } = useDrawerStyles()();
	return (
		<InertPreview>
			{/* overlay/viewport are `fixed inset-0` in the real component — pin them to the card instead. */}
			<div className={overlay({ className: "absolute" })}>
				<div className={backdrop({ className: "opacity-100" })} />
				<div className={viewport({ placement: "bottom", className: "absolute" })}>
					{/* Neutralize the bottom-sheet bleed (negative margin + safe-area padding) and swipe transform. */}
					<div className={popup({ placement: "bottom", className: "!m-0 max-h-[80%] min-h-0 !translate-y-0 !pb-4" })}>
						<div data-orientation="horizontal" data-placement="bottom" className={handle()} />
						<div className="px-4 pt-1 pb-2 text-sm">drawer content</div>
					</div>
				</div>
			</div>
		</InertPreview>
	);
}
