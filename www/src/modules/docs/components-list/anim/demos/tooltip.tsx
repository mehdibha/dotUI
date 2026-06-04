"use client";

import { useState } from "react";

import { SquarePenIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Kbd } from "@/registry/ui/kbd";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [open, setOpen] = useState(false);
	return (
		<AnimatedPreview
			contain
			reset={() => setOpen(false)}
			script={async (s) => {
				await s.wait(600);
				await s.moveTo("trigger");
				await s.wait(220);
				await s.do(() => setOpen(true));
				await s.wait(1800);
				await s.do(() => setOpen(false));
				await s.wait(500);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<span ref={ref("trigger")}>
					<Tooltip isOpen={open} onOpenChange={setOpen}>
						<Button aria-label="Edit" isIconOnly>
							<SquarePenIcon />
						</Button>
						<TooltipContent placement="bottom">
							Create new issue <Kbd>C</Kbd>
						</TooltipContent>
					</Tooltip>
				</span>
			)}
		</AnimatedPreview>
	);
}
