"use client";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Modal } from "@/registry/ui/modal";
import { TextField } from "@/registry/ui/text-field";

import { LivePreview } from "./live-preview";

/** Interactive Modal preview — click "Open modal" to open it inside the card. */
export function ModalPreview() {
	return (
		<LivePreview>
			<Dialog>
				<Button>Open modal</Button>
				<Modal>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit username</DialogTitle>
						</DialogHeader>
						<DialogBody>
							<TextField defaultValue="@mehdibha" className="w-full">
								<Label>Username</Label>
								<Input />
							</TextField>
						</DialogBody>
						<DialogFooter className="flex-row! justify-end">
							<Button slot="close" size="sm">
								Cancel
							</Button>
							<Button slot="close" size="sm" variant="primary">
								Apply
							</Button>
						</DialogFooter>
					</DialogContent>
				</Modal>
			</Dialog>
		</LivePreview>
	);
}
