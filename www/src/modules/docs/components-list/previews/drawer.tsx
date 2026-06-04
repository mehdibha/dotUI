"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { Drawer, DrawerHandle } from "@/registry/ui/drawer";

// Drop the off-screen over-drag bleed so the sheet sits flush in the small card.
const NO_BLEED = { "--drawer-bleed": "0px" } as CSSProperties;

/**
 * Interactive Drawer preview — click "Open drawer" to slide it up inside the card.
 *
 * The Drawer (Base UI) portals to `document.body` and positions with `fixed`, so
 * containing it needs two things the shared LivePreview can't provide:
 *  - `container` portals the drawer DOM into this box (added to the Drawer component).
 *  - `translateZ(0)` makes this box a containing block, so the drawer's `fixed`
 *    backdrop/viewport resolve against the card instead of the viewport.
 */
export function DrawerPreview() {
	const ref = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div
			ref={ref}
			className="relative isolate flex size-full [transform:translateZ(0)] items-center justify-center overflow-hidden"
		>
			{mounted && (
				<Dialog>
					<Button>Open drawer</Button>
					<Drawer container={ref.current} style={NO_BLEED}>
						<DialogContent>
							<DrawerHandle />
							<DialogHeader>
								<DialogTitle>Drag me down</DialogTitle>
							</DialogHeader>
							<DialogBody>Or click outside to dismiss.</DialogBody>
						</DialogContent>
					</Drawer>
				</Dialog>
			)}
		</div>
	);
}
