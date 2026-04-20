"use client";

import React from "react";

import { MenuIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { FieldGroup, Label } from "@/registry/ui/field";
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu";
import { Overlay } from "@/registry/ui/overlay";
import { Radio, RadioGroup } from "@/registry/ui/radio-group";
import type { OverlayProps } from "@/registry/ui/overlay";

export default function Demo() {
	const [type, setType] = React.useState("popover");
	const [mobileType, setMobileType] = React.useState("drawer");
	return (
		<div className="flex items-center gap-14">
			<Menu>
				<Button variant="default" isIconOnly>
					<MenuIcon />
				</Button>
				<Overlay type={type as OverlayProps["type"]} mobileType={mobileType as OverlayProps["type"]}>
					<MenuContent>
						<MenuItem>Account settings</MenuItem>
						<MenuItem>Create team</MenuItem>
						<MenuItem>Command menu</MenuItem>
						<MenuItem>Log out</MenuItem>
					</MenuContent>
				</Overlay>
			</Menu>
			<div className="flex items-center gap-6">
				<RadioGroup value={type} onChange={setType}>
					<Label>Type</Label>
					<FieldGroup>
						<Radio value="popover">Popover</Radio>
						<Radio value="modal">Modal</Radio>
						<Radio value="drawer">Drawer</Radio>
					</FieldGroup>
				</RadioGroup>
				<RadioGroup value={mobileType} onChange={setMobileType}>
					<Label>MobileType</Label>
					<FieldGroup>
						<Radio value="popover">Popover</Radio>
						<Radio value="modal">Modal</Radio>
						<Radio value="drawer">Drawer</Radio>
					</FieldGroup>
				</RadioGroup>
			</div>
		</div>
	);
}
