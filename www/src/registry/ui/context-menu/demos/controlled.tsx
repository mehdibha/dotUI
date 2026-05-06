"use client";

import * as React from "react";

import { ContextMenu } from "@/registry/ui/context-menu";
import { MenuContent, MenuItem } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	const [isOpen, setOpen] = React.useState(false);

	return (
		<div className="flex flex-col-reverse items-center gap-4">
			<ContextMenu
				data-testid="context-menu-controlled"
				isOpen={isOpen}
				onOpenChange={setOpen}
				className="flex h-32 w-64 items-center justify-center rounded-md border border-dashed bg-bg-muted text-fg-muted text-sm"
			>
				Right click me
				<Popover>
					<MenuContent>
						<MenuItem>Account settings</MenuItem>
						<MenuItem>Create team</MenuItem>
						<MenuItem>Log out</MenuItem>
					</MenuContent>
				</Popover>
			</ContextMenu>
			<p data-testid="context-menu-controlled-state" className="text-fg-muted text-sm">
				state: {isOpen ? "open" : "closed"}
			</p>
		</div>
	);
}
