"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";

import { Button } from "@/registry/ui/button";
import { DialogBody, DialogContent, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { Drawer, DrawerHandle } from "@/registry/ui/drawer";

import { AnimatedPreview } from "../animated-preview";

// Drop the off-screen over-drag bleed so the sheet sits flush in the small card.
const NO_BLEED = { "--drawer-bleed": "0px" } as CSSProperties;

/**
 * Drawer is Base UI (portals + `fixed`), so it can't use AnimatedPreview's `contain` mode
 * (which targets React Aria overlays). Instead this demo gives itself a `translateZ(0)`
 * containing block and points the drawer's `container` at it, exactly like the static
 * overlay preview — then drives the open state on a loop.
 */
export default function Demo() {
	const [open, setOpen] = useState(false);
	const boxRef = useRef<HTMLDivElement>(null);
	return (
		<AnimatedPreview
			reset={() => setOpen(false)}
			script={async (s) => {
				await s.wait(600);
				await s.click("trigger", () => setOpen(true));
				await s.wait(1700);
				await s.do(() => setOpen(false));
				await s.wait(900);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<div ref={boxRef} className="relative flex size-full [transform:translateZ(0)] items-center justify-center">
					<span ref={ref("trigger")} className="inline-flex">
						<Button onPress={() => setOpen(true)}>Open drawer</Button>
					</span>
					<Drawer isOpen={open} onOpenChange={setOpen} container={boxRef.current} style={NO_BLEED}>
						<DialogContent>
							<DrawerHandle />
							<DialogHeader>
								<DialogTitle>Drag me down</DialogTitle>
							</DialogHeader>
							<DialogBody>Or click outside to dismiss.</DialogBody>
						</DialogContent>
					</Drawer>
				</div>
			)}
		</AnimatedPreview>
	);
}
