"use client";

import { Command, CommandContent, CommandInput, CommandItem } from "@/registry/ui/command";

export default function Demo() {
	return (
		<Command>
			<CommandInput aria-label="Search commands" placeholder="Search a command…" />
			<CommandContent className="min-h-48">
				<CommandItem id="new-file" textValue="Create new file">
					Create new file…
				</CommandItem>
				<CommandItem id="new-folder" textValue="Create new folder">
					Create new folder…
				</CommandItem>
				<CommandItem id="assign-to" textValue="Assign to">
					Assign to…
				</CommandItem>
				<CommandItem id="status" textValue="Change status">
					Change status…
				</CommandItem>
				<CommandItem id="priority" textValue="Change priority">
					Change priority…
				</CommandItem>
				<CommandItem id="add-label" textValue="Add label">
					Add label…
				</CommandItem>
				<CommandItem id="remove-label" textValue="Remove label">
					Remove label…
				</CommandItem>
			</CommandContent>
		</Command>
	);
}
