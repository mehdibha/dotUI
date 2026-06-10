import { ClipboardIcon, CopyIcon, ScissorsIcon, Trash2Icon } from "lucide-react";

import { Kbd } from "@/registry/ui/kbd";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Separator } from "@/registry/ui/separator";

export default function Demo() {
	return (
		<div className="rounded-md border bg-card shadow-sm">
			<ListBox aria-label="File" onAction={() => console.log("action")}>
				<ListBoxItem id="cut" textValue="Cut">
					<ScissorsIcon />
					Cut
					<Kbd>⌘X</Kbd>
				</ListBoxItem>
				<ListBoxItem id="copy" textValue="Copy">
					<CopyIcon />
					Copy
					<Kbd>⌘C</Kbd>
				</ListBoxItem>
				<ListBoxItem id="paste" textValue="Paste">
					<ClipboardIcon />
					Paste
					<Kbd>⌘V</Kbd>
				</ListBoxItem>
				<Separator />
				<ListBoxItem id="delete" variant="danger" textValue="Delete">
					<Trash2Icon />
					Delete
					<Kbd>⌫</Kbd>
				</ListBoxItem>
			</ListBox>
		</div>
	);
}
