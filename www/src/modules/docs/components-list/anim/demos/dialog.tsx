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
import { Overlay } from "@/registry/ui/overlay";

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
				await s.wait(1100);
				await s.click({ selector: '[data-slot="dialog-footer"] button' }, () => setOpen(false));
				await s.wait(900);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<Dialog isOpen={open} onOpenChange={setOpen}>
					<span ref={ref("trigger")}>
						<Button variant="danger" size="sm">
							Delete
						</Button>
					</span>
					<Overlay>
						<DialogContent role="alertdialog" className="max-w-72">
							<DialogHeader>
								<DialogTitle>Delete project</DialogTitle>
								<DialogDescription>This action cannot be undone.</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button slot="close" variant="default" size="sm">
									Cancel
								</Button>
								<Button slot="close" variant="danger" size="sm">
									Delete
								</Button>
							</DialogFooter>
						</DialogContent>
					</Overlay>
				</Dialog>
			)}
		</AnimatedPreview>
	);
}
