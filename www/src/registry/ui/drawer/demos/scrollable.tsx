"use client";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogHeading } from "@/registry/ui/dialog";
import { Drawer, DrawerHandle } from "@/registry/ui/drawer";

/**
 * Drawer with a tall scrollable body. Drag the handle to dismiss; scroll the
 * body normally. Once scrolled to the top, dragging down should take over and
 * dismiss the drawer (scroll-edge gate).
 */
export default function Demo() {
	return (
		<Dialog>
			<Button>Open scrollable drawer</Button>
			<Drawer>
				<DialogContent>
					<DrawerHandle />
					<DialogHeader>
						<DialogHeading>Scrollable content</DialogHeading>
					</DialogHeader>
					<DialogBody className="max-h-80 overflow-y-auto">
						{Array.from({ length: 30 }).map((_, i) => (
							<p
								// biome-ignore lint/suspicious/noArrayIndexKey: demo
								key={i}
								className="border-b py-3"
							>
								Item #{i + 1} — drag handle to dismiss, or scroll inside.
							</p>
						))}
					</DialogBody>
				</DialogContent>
			</Drawer>
		</Dialog>
	);
}
