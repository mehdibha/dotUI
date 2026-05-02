"use client";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogHeading } from "@/registry/ui/dialog";
import { Drawer, DrawerHandle } from "@/registry/ui/drawer";

/**
 * `swipeFromHandleOnly` — only the `<DrawerHandle>` (and `<DrawerSwipeArea>`)
 * starts a drag. Pointerdown on the body does nothing. Useful when the body has
 * complex content you don't want gesture-eligible.
 */
export default function Demo() {
	return (
		<Dialog>
			<Button>Open handle-only drawer</Button>
			<Drawer swipeFromHandleOnly>
				<DialogContent>
					<DrawerHandle />
					<DialogHeader>
						<DialogHeading>Drag the pill, not the body</DialogHeading>
					</DialogHeader>
					<DialogBody>
						<p>Try dragging this paragraph — nothing happens.</p>
						<p className="mt-2 text-fg-muted text-sm">Then drag the pill above to dismiss.</p>
					</DialogBody>
				</DialogContent>
			</Drawer>
		</Dialog>
	);
}
