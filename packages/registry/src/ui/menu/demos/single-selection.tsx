"use client";

import React from "react";
import type { Selection } from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export default function Demo() {
	const [selected, setSelected] = React.useState<Selection>(new Set(["center"]));
	return (
		<Menu>
			<Button variant="default" size="sm">
				Align
			</Button>
			<Popover>
				<MenuContent selectionMode="single" selectedKeys={selected} onSelectionChange={setSelected}>
					<MenuItem id="start">Start</MenuItem>
					<MenuItem id="center">Center</MenuItem>
					<MenuItem id="end">End</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}
