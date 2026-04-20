import { InfoIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogHeading } from "@/registry/ui/dialog";
import { Popover } from "@/registry/ui/popover";

export function PopoverDemo() {
	return (
		<div className="flex h-40 items-end justify-center">
			<Dialog>
				<Button aria-label="Help" isIconOnly>
					<InfoIcon />
				</Button>
				<Popover>
					<DialogContent>
						<DialogHeader>
							<DialogHeading>Need help?</DialogHeading>
						</DialogHeader>
						<p>If you&apos;re having issues, contact our customer support team.</p>
					</DialogContent>
				</Popover>
			</Dialog>
		</div>
	);
}
