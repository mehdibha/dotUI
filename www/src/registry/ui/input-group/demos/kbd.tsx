"use client";

import { CheckIcon, InfoIcon, SearchIcon, SparklesIcon } from "@/registry/__generated__/icons";
import { Description, Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Kbd, KbdGroup } from "@/registry/ui/kbd";
import { Loader } from "@/registry/ui/loader";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<>
			<TextField aria-label="Search">
				<InputGroup>
					<Input />
					<InputGroupAddon>
						<Kbd>⌘K</Kbd>
					</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField aria-label="Search">
				<InputGroup>
					<InputGroupAddon>
						<Kbd>⌘K</Kbd>
					</InputGroupAddon>
					<Input />
				</InputGroup>
			</TextField>
			<TextField aria-label="Search for Apps">
				<InputGroup>
					<Input placeholder="Search for Apps..." />
					<InputGroupAddon className="gap-2">
						<span>Ask AI</span>
						<Kbd>Tab</Kbd>
					</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField aria-label="Type to search">
				<InputGroup>
					<InputGroupAddon>
						<SparklesIcon />
					</InputGroupAddon>
					<Input placeholder="Type to search..." />
					<InputGroupAddon>
						<KbdGroup>
							<Kbd>Ctrl</Kbd>
							<Kbd>C</Kbd>
						</KbdGroup>
					</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField defaultValue="shadcn">
				<Label>Username</Label>
				<InputGroup>
					<Input />
					<InputGroupAddon>
						<div className="flex size-4 items-center justify-center rounded-full bg-green-500 dark:bg-green-800">
							<CheckIcon className="size-3 text-white" />
						</div>
					</InputGroupAddon>
				</InputGroup>
				<Description className="text-green-700">This username is available.</Description>
			</TextField>
			<TextField aria-label="Search documentation">
				<InputGroup>
					<InputGroupAddon>
						<SearchIcon />
					</InputGroupAddon>
					<Input placeholder="Search documentation..." />
					<InputGroupAddon>
						<span>12 results</span>
					</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField aria-label="Search documentation" isDisabled>
				<InputGroup>
					<InputGroupAddon>
						<SearchIcon />
					</InputGroupAddon>
					<Input placeholder="Search documentation..." />
					<InputGroupAddon>
						<span>Disabled</span>
					</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField isDisabled defaultValue="shadcn">
				<Label>Loading</Label>
				<InputGroup>
					<Input />
					<InputGroupAddon>
						<Loader />
					</InputGroupAddon>
				</InputGroup>
				<Description>This is a description of the input group.</Description>
			</TextField>
			<div className="grid grid-cols-2 gap-4">
				<TextField>
					<Label>First Name</Label>
					<InputGroup>
						<Input placeholder="First Name" />
						<InputGroupAddon>
							<InfoIcon />
						</InputGroupAddon>
					</InputGroup>
				</TextField>
				<TextField>
					<Label>Last Name</Label>
					<InputGroup>
						<Input placeholder="Last Name" />
						<InputGroupAddon>
							<InfoIcon />
						</InputGroupAddon>
					</InputGroup>
				</TextField>
			</div>
		</>
	);
}
