import { InfoIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { Popover } from "@/registry/ui/popover";

export function PopoverDemo() {
	return (
		<Dialog>
			<Button aria-label="Help" isIconOnly>
				<InfoIcon />
			</Button>
			<Popover>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Need help?</DialogTitle>
					</DialogHeader>
					<p>If you&apos;re having issues, contact our customer support team.</p>
				</DialogContent>
			</Popover>
		</Dialog>
	);
}
