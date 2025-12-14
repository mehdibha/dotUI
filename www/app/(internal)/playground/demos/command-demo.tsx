"use client";

import {
	CalendarIcon,
	CogIcon,
	CopyIcon,
	FileTextIcon,
	HomeIcon,
	LogOutIcon,
	MailIcon,
	MoonIcon,
	SunIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import {
	Command,
	CommandContent,
	CommandInput,
	CommandItem,
	CommandSection,
	CommandSectionHeader,
} from "@dotui/registry/ui/command";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";
import { Label } from "@dotui/registry/ui/field";
import { Kbd } from "@dotui/registry/ui/kbd";
import { Modal } from "@dotui/registry/ui/modal";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Popover } from "@dotui/registry/ui/popover";
import { Select, SelectTrigger } from "@dotui/registry/ui/select";

export function CommandDemo() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 p-8 text-fg-muted">
			<CommandExample className="w-[480px]" />

			<div className="flex items-center gap-2">
				<Dialog>
					<Button>Popover</Button>
					<Popover placement="bottom left">
						<DialogContent className="p-0!">
							<CommandExample />
						</DialogContent>
					</Popover>
				</Dialog>

				<Dialog>
					<Button>Modal</Button>
					<Modal>
						<CommandExample />
					</Modal>
				</Dialog>

				<Dialog>
					<Button>Drawer</Button>
					<Drawer>
						<CommandExample />
					</Drawer>
				</Dialog>

				<Dialog>
					<Button>Responsive</Button>
					<Overlay>
						<CommandExample />
					</Overlay>
				</Dialog>
			</div>

			<Select defaultValue={"tn"}>
				<Label>Select country</Label>
				<SelectTrigger />
				<Popover>
					<Command>
						<CommandInput placeholder="Search country..." />
						<CommandContent className="max-h-72 overflow-y-auto">
							<CommandItem id="tn">Tunisia</CommandItem>
							<CommandItem id="us">United States</CommandItem>
							<CommandItem id="uk">United Kingdom</CommandItem>
							<CommandItem id="ca">Canada</CommandItem>
							<CommandItem id="de">Germany</CommandItem>
							<CommandItem id="fr">France</CommandItem>
							<CommandItem id="it">Italy</CommandItem>
							<CommandItem id="jp">Japan</CommandItem>
							<CommandItem id="kr">Korea</CommandItem>
							<CommandItem id="mx">Mexico</CommandItem>
							<CommandItem id="nz">New Zealand</CommandItem>
							<CommandItem id="ru">Russia</CommandItem>
							<CommandItem id="sa">Saudi Arabia</CommandItem>
							<CommandItem id="sg">Singapore</CommandItem>
							<CommandItem id="za">South Africa</CommandItem>
							<CommandItem id="tw">Taiwan</CommandItem>
							<CommandItem id="th">Thailand</CommandItem>
							<CommandItem id="tr">Turkey</CommandItem>
							<CommandItem id="ua">Ukraine</CommandItem>
							<CommandItem id="vn">Vietnam</CommandItem>
						</CommandContent>
					</Command>
				</Popover>
			</Select>
		</div>
	);
}

const CommandExample = ({ className }: { className?: string }) => {
	return (
		<Command className={className}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandContent>
				<CommandSection>
					<CommandSectionHeader>Navigation</CommandSectionHeader>
					<CommandItem>
						<HomeIcon />
						Home
					</CommandItem>
					<CommandItem>
						<CalendarIcon />
						Calendar
					</CommandItem>
					<CommandItem>
						<MailIcon />
						Messages
					</CommandItem>
				</CommandSection>

				<CommandSection>
					<CommandSectionHeader>Actions</CommandSectionHeader>
					<CommandItem>
						<FileTextIcon /> New Document
						<Kbd>⌘ N</Kbd>
					</CommandItem>
					<CommandItem>
						<CopyIcon /> Copy Link
						<Kbd>⌘ ⇧ C</Kbd>
					</CommandItem>
					<CommandItem>
						<UsersIcon /> Invite Team Members
					</CommandItem>
				</CommandSection>

				<CommandSection>
					<CommandSectionHeader>Settings</CommandSectionHeader>
					<CommandItem>
						<UserIcon /> Profile Settings
					</CommandItem>
					<CommandItem>
						<CogIcon /> Preferences
						<Kbd>⌘ ,</Kbd>
					</CommandItem>
					<CommandItem>
						<SunIcon /> Toggle Light Mode
					</CommandItem>
					<CommandItem>
						<MoonIcon /> Toggle Dark Mode
					</CommandItem>
				</CommandSection>

				<CommandSection>
					<CommandSectionHeader>Account</CommandSectionHeader>
					<CommandItem>
						<LogOutIcon /> Log Out
					</CommandItem>
				</CommandSection>
			</CommandContent>
		</Command>
	);
};

const _countries = [
	{ id: "tn", name: "Tunisia" },
	{ id: "us", name: "United States" },
	{ id: "uk", name: "United Kingdom" },
	{ id: "ca", name: "Canada" },
	{ id: "de", name: "Germany" },
	{ id: "fr", name: "France" },
	{ id: "it", name: "Italy" },
	{ id: "jp", name: "Japan" },
	{ id: "kr", name: "Korea" },
	{ id: "mx", name: "Mexico" },
	{ id: "nz", name: "New Zealand" },
	{ id: "ru", name: "Russia" },
	{ id: "sa", name: "Saudi Arabia" },
	{ id: "sg", name: "Singapore" },
	{ id: "za", name: "South Africa" },
	{ id: "tw", name: "Taiwan" },
	{ id: "th", name: "Thailand" },
	{ id: "tr", name: "Turkey" },
	{ id: "ua", name: "Ukraine" },
	{ id: "vn", name: "Vietnam" },
];
