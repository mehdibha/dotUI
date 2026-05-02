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
import { Drawer, DrawerHandle } from "@/registry/ui/drawer";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

/**
 * Drawer with form inputs. Pointerdown on inputs / textarea / select doesn't
 * start a drag (interactive-control skip in the gesture hook), so you can type
 * normally. Drag from outside the inputs (or from the handle) to dismiss.
 */
export default function Demo() {
	return (
		<Dialog>
			<Button>Open form drawer</Button>
			<Drawer>
				<DialogContent>
					<DrawerHandle />
					<DialogHeader>
						<DialogHeading>Edit profile</DialogHeading>
						<DialogDescription>Inputs don't trigger drag.</DialogDescription>
					</DialogHeader>
					<DialogBody className="flex flex-col gap-3">
						<TextField className="flex flex-col gap-1.5">
							<Label>Name</Label>
							<Input defaultValue="Jane Doe" />
						</TextField>
						<TextField className="flex flex-col gap-1.5">
							<Label>Email</Label>
							<Input type="email" defaultValue="jane@example.com" />
						</TextField>
					</DialogBody>
					<DialogFooter>
						<Button slot="close" variant="outline">
							Cancel
						</Button>
						<Button slot="close">Save</Button>
					</DialogFooter>
				</DialogContent>
			</Drawer>
		</Dialog>
	);
}
