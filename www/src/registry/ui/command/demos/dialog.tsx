"use client";

import { Button } from "@/registry/ui/button";
import { Command, CommandContent, CommandInput, CommandItem } from "@/registry/ui/command";
import { Dialog, DialogContent } from "@/registry/ui/dialog";
import { Overlay } from "@/registry/ui/overlay";

export default function Demo() {
	return (
		<Dialog>
			<Button>Open Dialog</Button>
			<Overlay type="popover">
				<DialogContent>
					<Command>
						<CommandInput />
						<CommandContent>
							<CommandItem textValue="Create new file">Create new file...</CommandItem>
							<CommandItem textValue="Create new folder">Create new folder...</CommandItem>
							<CommandItem textValue="Assign to">Assign to...</CommandItem>
							<CommandItem textValue="Assign to me">Assign to me</CommandItem>
							<CommandItem textValue="Change status">Change status...</CommandItem>
							<CommandItem textValue="Change priority">Change priority...</CommandItem>
							<CommandItem textValue="Add label">Add label...</CommandItem>
							<CommandItem textValue="Remove label">Remove label...</CommandItem>
						</CommandContent>
					</Command>
				</DialogContent>
			</Overlay>
		</Dialog>
	);
}
