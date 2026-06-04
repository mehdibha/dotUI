"use client";

import { useState } from "react";

import type { Key } from "react-aria-components/Menu";

import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [selected, setSelected] = useState<Key>("account");
	return (
		<AnimatedPreview
			reset={() => setSelected("account")}
			script={async (s) => {
				await s.wait(600);
				await s.click("password", () => setSelected("password"));
				await s.wait(1300);
				await s.click("team", () => setSelected("team"));
				await s.wait(1300);
				await s.click("account", () => setSelected("account"));
				await s.wait(900);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<Tabs selectedKey={selected} onSelectionChange={setSelected}>
					<TabList>
						<Tab id="account">
							<span ref={ref("account")}>Account</span>
						</Tab>
						<Tab id="password">
							<span ref={ref("password")}>Password</span>
						</Tab>
						<Tab id="team">
							<span ref={ref("team")}>Team</span>
						</Tab>
					</TabList>
					<TabPanel id="account" className="text-sm text-fg-muted">
						Manage your account.
					</TabPanel>
					<TabPanel id="password" className="text-sm text-fg-muted">
						Change your password.
					</TabPanel>
					<TabPanel id="team" className="text-sm text-fg-muted">
						Invite your team.
					</TabPanel>
				</Tabs>
			)}
		</AnimatedPreview>
	);
}
