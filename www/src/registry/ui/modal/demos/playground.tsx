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
import { Modal, type ModalProps } from "@/registry/ui/modal";

export default function Demo({ isDismissable = true }: ModalProps = {}) {
	return (
		<Dialog>
			<Button>Open Modal</Button>
			<Modal data-control-target isDismissable={isDismissable}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modal Title</DialogTitle>
						<DialogDescription>This is a modal description.</DialogDescription>
					</DialogHeader>
					<DialogBody>
						<p>Modal content goes here.</p>
					</DialogBody>
					<DialogFooter>
						<Button slot="close">Cancel</Button>
						<Button slot="close" variant="primary">
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Modal>
		</Dialog>
	);
}
