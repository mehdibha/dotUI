"use client";

import React from "react";
import type * as MenuPrimitives from "react-aria-components/Menu";

import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	const [selected, setSelected] = React.useState<MenuPrimitives.Selection>(new Set(["center"]));
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
