"use client";

import { useState } from "react";

import { InfoIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { Popover } from "@/registry/ui/popover";

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
				await s.wait(1900);
				await s.click("trigger", () => setOpen(false));
				await s.wait(700);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<span ref={ref("trigger")} className="inline-flex">
					<Dialog isOpen={open} onOpenChange={setOpen}>
						<Button aria-label="Help" isIconOnly>
							<InfoIcon />
						</Button>
						<Popover className="w-56">
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Need help?</DialogTitle>
								</DialogHeader>
								<p>Contact our support team if you run into any issues.</p>
							</DialogContent>
						</Popover>
					</Dialog>
				</span>
			)}
		</AnimatedPreview>
	);
}
