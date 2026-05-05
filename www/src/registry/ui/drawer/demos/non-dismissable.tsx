"use client";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { Drawer, DrawerHandle } from "@/registry/ui/drawer";

/**
 * `swipeToDismiss={false}` disables gesture dismissal, `isDismissable={false}`
 * disables outside dismissal, and `isKeyboardDismissDisabled` suppresses Escape.
 */
export default function Demo() {
	return (
		<Dialog>
			<Button>Open non-dismissable</Button>
			<Drawer swipeToDismiss={false} isDismissable={false} isKeyboardDismissDisabled>
				<DialogContent>
					<DrawerHandle />
					<DialogHeader>
						<DialogTitle>Confirm action</DialogTitle>
					</DialogHeader>
					<DialogBody>Try dragging or clicking outside — nothing dismisses. Use the button below.</DialogBody>
					<DialogFooter>
						<Button slot="close">Acknowledge</Button>
					</DialogFooter>
				</DialogContent>
			</Drawer>
		</Dialog>
	);
}
