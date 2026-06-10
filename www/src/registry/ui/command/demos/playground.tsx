"use client";

import {
	Command,
	CommandContent,
	CommandInput,
	CommandItem,
	CommandSection,
	CommandSectionHeader,
} from "@/registry/ui/command";

export default function Demo({ placeholder = "Type a command..." } = {}) {
	return (
		<Command className="w-[300px]">
			<CommandInput data-control-target aria-label="Search commands" placeholder={placeholder} />
			<CommandContent>
				<CommandSection>
					<CommandSectionHeader>Actions</CommandSectionHeader>
					<CommandItem textValue="Create new file">Create new file</CommandItem>
					<CommandItem textValue="Create new folder">Create new folder</CommandItem>
					<CommandItem textValue="Open file">Open file</CommandItem>
				</CommandSection>
			</CommandContent>
		</Command>
	);
}
