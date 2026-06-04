"use client";

import { Button } from "@/registry/ui/button";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/registry/ui/dialog";
import { Overlay } from "@/registry/ui/overlay";

import type { OverlayProps } from "@/registry/ui/overlay";

export default function Demo({ type = "modal", mobileType = "drawer" }: OverlayProps = {}) {
	return (
		<Dialog>
			<Button>Open Overlay</Button>
			<Overlay data-control-target type={type} mobileType={mobileType}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Overlay Title</DialogTitle>
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
