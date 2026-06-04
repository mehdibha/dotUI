"use client";

import { useState } from "react";

import { Button } from "@/registry/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/registry/ui/dialog";
import { Modal } from "@/registry/ui/modal";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [open, setOpen] = useState(false);
	return (
		<AnimatedPreview
			contain
			reset={() => setOpen(false)}
			script={async (s) => {
				await s.wait(600);
				await s.click("trigger", () => setOpen(true));
				await s.wait(1200);
				await s.click({ selector: '[data-slot="dialog-footer"] button:last-child' }, () => setOpen(false));
				await s.wait(800);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<Dialog isOpen={open} onOpenChange={setOpen}>
					<span ref={ref("trigger")}>
						<Button size="sm">Delete project</Button>
					</span>
					<Modal isDismissable={false}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Delete project?</DialogTitle>
								<DialogDescription>This action cannot be undone.</DialogDescription>
							</DialogHeader>
							<DialogFooter className="flex-row! justify-end">
								<Button slot="close" size="sm">
									Cancel
								</Button>
								<Button slot="close" size="sm" variant="danger">
									Delete
								</Button>
							</DialogFooter>
						</DialogContent>
					</Modal>
				</Dialog>
			)}
		</AnimatedPreview>
	);
}
