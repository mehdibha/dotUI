"use client";

import { ChevronsUpDownIcon, PlusCircleIcon, User2Icon } from "lucide-react";
import { Collection } from "react-aria-components";

import { Avatar } from "@dotui/registry/ui/avatar";
import { Button } from "@dotui/registry/ui/button";
import { Combobox } from "@dotui/registry/ui/combobox";
import { Label } from "@dotui/registry/ui/field";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader } from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import { Separator } from "@dotui/registry/ui/separator";

export function ComboboxDemo() {
	return (
		<div className="flex flex-wrap gap-4">
			<Combobox>
				<Label>Framework</Label>
				<Input placeholder="Select a framework" />
				<Popover>
					<ListBox>
						<ListBoxItem id="tanstack-start">Tanstack start</ListBoxItem>
						<ListBoxItem id="nextjs">Next.js</ListBoxItem>
						<ListBoxItem id="vuejs">Remix</ListBoxItem>
					</ListBox>
				</Popover>
			</Combobox>

			<Combobox defaultSelectedKey="mehdibha">
				<Label>Users</Label>
				<InputGroup className="[--radius-factor:999]">
					<InputAddon>
						<User2Icon />
					</InputAddon>
					<Input />
					<InputAddon>
						<Button variant="quiet">
							<ChevronsUpDownIcon />
						</Button>
					</InputAddon>
				</InputGroup>
				<Popover>
					<ListBox>
						<Collection items={users}>
							{(user) => (
								<ListBoxItem id={user.username} textValue={user.username}>
									<Avatar src={user.img} fallback={user.username.charAt(0)} className="size-6" />
									{user.username}
								</ListBoxItem>
							)}
						</Collection>
						<Separator className="my-1 ml-[-4px]! w-[calc(100%+8px)]" />
						<ListBoxItem onAction={() => {}}>
							<PlusCircleIcon className="size-4 text-fg-muted" /> Create user
						</ListBoxItem>
					</ListBox>
				</Popover>
			</Combobox>

			<Combobox defaultSelectedKey="America/New_York">
				<Label>Timezones</Label>
				<InputGroup>
					<Input />
					<InputAddon>
						<Button variant="quiet">
							<ChevronsUpDownIcon />
						</Button>
					</InputAddon>
				</InputGroup>
				<Popover className="relative h-80 [&_[data-slot=listbox-section]]:p-1">
					<ListBox className="p-0">
						<Collection items={timezones}>
							{(timezone) => (
								<ListBoxSection id={timezone.label}>
									<ListBoxSectionHeader>{timezone.label}</ListBoxSectionHeader>
									<Collection items={timezone.timezones}>
										{(timezone) => (
											<ListBoxItem id={timezone.value} textValue={timezone.label}>
												{timezone.label}
											</ListBoxItem>
										)}
									</Collection>
								</ListBoxSection>
							)}
						</Collection>
						<ListBoxSection className="sticky bottom-0 bg-popover">
							<Separator className="mb-1" />
							<ListBoxItem onAction={() => {}}>
								<PlusCircleIcon className="size-4 text-fg-muted" /> Create timezone
							</ListBoxItem>
						</ListBoxSection>
					</ListBox>
				</Popover>
			</Combobox>
		</div>
	);
}

const users = [
	{ username: "mehdibha", img: "https://github.com/mehdibha.png" },
	{ username: "devongovett", img: "https://github.com/devongovett.png" },
	{ username: "shadcn", img: "https://github.com/shadcn.png" },
];

const timezones = [
	{
		label: "Americas",
		timezones: [
			{ value: "America/New_York", label: "(GMT-5) New York" },
			{ value: "America/Los_Angeles", label: "(GMT-8) Los Angeles" },
			{ value: "America/Chicago", label: "(GMT-6) Chicago" },
			{ value: "America/Toronto", label: "(GMT-5) Toronto" },
			{ value: "America/Vancouver", label: "(GMT-8) Vancouver" },
			{ value: "America/Sao_Paulo", label: "(GMT-3) São Paulo" },
		],
	},
	{
		label: "Europe",
		timezones: [
			{ value: "Europe/London", label: "(GMT+0) London" },
			{ value: "Europe/Paris", label: "(GMT+1) Paris" },
			{ value: "Europe/Berlin", label: "(GMT+1) Berlin" },
			{ value: "Europe/Rome", label: "(GMT+1) Rome" },
			{ value: "Europe/Madrid", label: "(GMT+1) Madrid" },
			{ value: "Europe/Amsterdam", label: "(GMT+1) Amsterdam" },
		],
	},
	{
		label: "Asia/Pacific",
		timezones: [
			{ value: "Asia/Tokyo", label: "(GMT+9) Tokyo" },
			{ value: "Asia/Shanghai", label: "(GMT+8) Shanghai" },
			{ value: "Asia/Singapore", label: "(GMT+8) Singapore" },
			{ value: "Asia/Dubai", label: "(GMT+4) Dubai" },
			{ value: "Australia/Sydney", label: "(GMT+11) Sydney" },
			{ value: "Asia/Seoul", label: "(GMT+9) Seoul" },
		],
	},
];
