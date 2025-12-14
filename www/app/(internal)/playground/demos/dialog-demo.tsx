"use client";

import { Button } from "@dotui/registry/ui/button";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { Overlay } from "@dotui/registry/ui/overlay";
import { TextField } from "@dotui/registry/ui/text-field";

export function DialogDemo() {
	return (
		<div className="flex flex-col flex-wrap items-center gap-4">
			<Dialog>
				<Button>Open dialog</Button>
				<Overlay>
					<DialogContent>
						<DialogHeader>
							<DialogHeading>Edit profile</DialogHeading>
							<DialogDescription>Set the dimensions for the layer.</DialogDescription>
						</DialogHeader>
						<DialogBody className="space-y-4">
							<TextField>
								<Label>Name</Label>
								<Input defaultValue="mehdi" />
							</TextField>
							<TextField>
								<Label>Username</Label>
								<Input defaultValue="mehdibha" />
							</TextField>
						</DialogBody>
						<DialogFooter>
							<Button slot="close">Cancel</Button>
							<Button variant="primary">Apply</Button>
						</DialogFooter>
					</DialogContent>
				</Overlay>
			</Dialog>
		</div>
	);
}
