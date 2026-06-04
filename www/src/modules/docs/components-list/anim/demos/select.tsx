"use client";

import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [open, setOpen] = useState(false);
	const [key, setKey] = useState<string | null>(null);
	return (
		<AnimatedPreview
			contain
			reset={() => {
				setOpen(false);
				setKey(null);
			}}
			script={async (s) => {
				await s.wait(600);
				await s.click("trigger", () => setOpen(true));
				await s.wait(700);
				await s.click({ selector: '[role="option"]:nth-child(2)' }, () => {
					setKey("replicate");
					setOpen(false);
				});
				await s.wait(1500);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<div ref={ref("trigger")} className="w-52">
					<Select
						aria-label="Provider"
						placeholder="Select a provider"
						selectedKey={key}
						onSelectionChange={(k) => setKey(k as string | null)}
					>
						<SelectTrigger />
						<SelectContent isOpen={open} onOpenChange={setOpen}>
							<SelectItem id="perplexity">Perplexity</SelectItem>
							<SelectItem id="replicate">Replicate</SelectItem>
							<SelectItem id="together">Together AI</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}
		</AnimatedPreview>
	);
}
