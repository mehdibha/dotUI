"use client";

import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";

export function DrawerDemo() {
	return (
		<Dialog>
			<Button>Open Drawer</Button>
			<Drawer placement="bottom">
				<DialogContent>drawer content</DialogContent>
			</Drawer>
		</Dialog>
	);
}
