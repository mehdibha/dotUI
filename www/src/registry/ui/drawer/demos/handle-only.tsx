"use client";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { Drawer, DrawerHandle } from "@/registry/ui/drawer";

/**
 * The handle is a visible affordance only. Swipe behavior is intentionally
 * owned by the drawer implementation rather than exposed as a public option.
 */
export default function Demo() {
	return (
		<Dialog>
			<Button>Open drawer with handle</Button>
			<Drawer>
				<DialogContent>
					<DrawerHandle />
					<DialogHeader>
						<DialogTitle>Drawer with a handle</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<p>The handle gives the drawer a clear drag affordance.</p>
						<p className="mt-2 text-sm text-fg-muted">Swipe or press Escape to dismiss.</p>
					</DialogBody>
				</DialogContent>
			</Drawer>
		</Dialog>
	);
}
