"use client";

import React from "react";

import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem, MenuSection, MenuSectionHeader } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	const [selected, setSelected] = React.useState<Set<React.Key>>(new Set(["status"]));
	return (
		<Menu>
			<Button variant="default" className="w-fit">
				Checkboxes
			</Button>
			<Popover>
				<MenuContent
					selectionMode="multiple"
					selectedKeys={selected}
					onSelectionChange={(keys) => setSelected(keys as Set<React.Key>)}
					disabledKeys={["activity"]}
					className="min-w-40"
				>
					<MenuSection>
						<MenuSectionHeader>Appearance</MenuSectionHeader>
						<MenuItem id="status">Status Bar</MenuItem>
						<MenuItem id="activity">Activity Bar</MenuItem>
						<MenuItem id="panel">Panel</MenuItem>
					</MenuSection>
				</MenuContent>
			</Popover>
		</Menu>
	);
}
