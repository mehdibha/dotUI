"use client";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/registry/ui/dialog";
import { Popover, type PopoverProps } from "@/registry/ui/popover";

export default function Demo({ placement = "bottom" }: PopoverProps = {}) {
	return (
		<Dialog>
			<Button>Open Popover</Button>
			<Popover data-control-target placement={placement}>
				<DialogContent className="w-56">
					<DialogTitle>Popover Title</DialogTitle>
					<p className="text-sm text-fg-muted">This is a popover with some content. You can put any content here.</p>
				</DialogContent>
			</Popover>
		</Dialog>
	);
}
