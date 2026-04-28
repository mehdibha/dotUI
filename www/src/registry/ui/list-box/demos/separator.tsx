import { FileIcon, PrinterIcon, SaveIcon, SettingsIcon } from "lucide-react";

import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Separator } from "@/registry/ui/separator";

export default function Demo() {
	return (
		<div className="w-60 rounded-md border bg-popover p-1 shadow-sm">
			<ListBox aria-label="File">
				<ListBoxItem id="new">
					<FileIcon />
					New file
				</ListBoxItem>
				<ListBoxItem id="open">
					<FileIcon />
					Open…
				</ListBoxItem>
				<Separator />
				<ListBoxItem id="save">
					<SaveIcon />
					Save
				</ListBoxItem>
				<ListBoxItem id="save-as">
					<SaveIcon />
					Save as…
				</ListBoxItem>
				<Separator />
				<ListBoxItem id="print">
					<PrinterIcon />
					Print…
				</ListBoxItem>
				<ListBoxItem id="prefs">
					<SettingsIcon />
					Preferences
				</ListBoxItem>
			</ListBox>
		</div>
	);
}
