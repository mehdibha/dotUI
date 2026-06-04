"use client";

import { useState } from "react";

import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [open, setOpen] = useState(false);
	return (
		<AnimatedPreview
			contain
			reset={() => setOpen(false)}
			script={async (s) => {
				await s.wait(600);
				await s.click({ selector: "button" }, () => setOpen(true));
				await s.wait(700);
				await s.moveTo({ selector: '[role="menuitem"]:nth-child(2)' });
				await s.wait(500);
				await s.click({ selector: '[role="menuitem"]:nth-child(2)' }, () => setOpen(false));
				await s.wait(1000);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{() => (
				<Menu isOpen={open} onOpenChange={setOpen}>
					<Button variant="default" className="w-fit">
						Open menu
					</Button>
					<Popover>
						<MenuContent className="min-w-44">
							<MenuItem>
								<UserIcon />
								Profile
							</MenuItem>
							<MenuItem>
								<CreditCardIcon />
								Billing
							</MenuItem>
							<MenuItem>
								<SettingsIcon />
								Settings
							</MenuItem>
							<MenuItem variant="danger">
								<LogOutIcon />
								Log out
							</MenuItem>
						</MenuContent>
					</Popover>
				</Menu>
			)}
		</AnimatedPreview>
	);
}
