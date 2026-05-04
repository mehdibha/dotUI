"use client";

import React from "react";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { Drawer, DrawerHandle } from "@/registry/ui/drawer";

/**
 * Controlled drawer via `isOpen` / `onOpenChange`. Useful when an outside event
 * (effect, message, parent state) needs to open or close the drawer.
 */
export default function Demo() {
	const [open, setOpen] = React.useState(false);
	return (
		<div className="flex items-center gap-3">
			<Button onPress={() => setOpen(true)}>Open</Button>
			<Button variant="outline" onPress={() => setOpen(false)}>
				Close
			</Button>
			<span className="text-fg-muted text-sm">Drawer is {open ? "open" : "closed"}</span>
			<Dialog isOpen={open} onOpenChange={setOpen}>
				<Drawer>
					<DialogContent>
						<DrawerHandle />
						<DialogHeader>
							<DialogTitle>Controlled</DialogTitle>
						</DialogHeader>
						<DialogBody>
							Drag to dismiss, click outside, or press Escape — `onOpenChange(false)` fires in all cases.
						</DialogBody>
					</DialogContent>
				</Drawer>
			</Dialog>
		</div>
	);
}
