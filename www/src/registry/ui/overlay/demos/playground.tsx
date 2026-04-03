"use client";

import { Button } from "@/registry/ui/button";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogHeading,
} from "@/registry/ui/dialog";
import { Overlay } from "@/registry/ui/overlay";

interface OverlayPlaygroundProps {
	type?: "modal" | "popover" | "drawer";
	mobileType?: "modal" | "drawer";
}

export function OverlayPlayground({ type = "modal", mobileType = "drawer" }: OverlayPlaygroundProps) {
	return (
		<Dialog>
			<Button>Open Overlay</Button>
			<Overlay type={type} mobileType={mobileType}>
				<DialogContent>
					<DialogHeader>
						<DialogHeading>Overlay Title</DialogHeading>
						<DialogDescription>This overlay adapts based on screen size.</DialogDescription>
					</DialogHeader>
					<DialogBody>
						<p>Overlay content goes here.</p>
					</DialogBody>
					<DialogFooter>
						<Button slot="close">Close</Button>
					</DialogFooter>
				</DialogContent>
			</Overlay>
		</Dialog>
	);
}
