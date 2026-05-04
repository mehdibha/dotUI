"use client";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/registry/ui/dialog";
import { Popover } from "@/registry/ui/popover";

interface PopoverPlaygroundProps {
	placement?: "bottom" | "top" | "left" | "right";
}

export function PopoverPlayground({ placement = "bottom" }: PopoverPlaygroundProps) {
	return (
		<Dialog>
			<Button>Open Popover</Button>
			<Popover placement={placement}>
				<DialogContent className="w-56">
					<DialogTitle>Popover Title</DialogTitle>
					<p className="text-fg-muted text-sm">This is a popover with some content. You can put any content here.</p>
				</DialogContent>
			</Popover>
		</Dialog>
	);
}
