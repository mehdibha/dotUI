import { LayoutGridIcon, ListIcon, RowsIcon } from "lucide-react";

import { ListBox, ListBoxItem } from "@/registry/ui/list-box";

export default function Demo() {
	return (
		<div className="rounded-md border bg-card shadow-sm">
			<ListBox aria-label="View" orientation="horizontal" selectionMode="single" defaultSelectedKeys={["grid"]}>
				<ListBoxItem id="list">
					<ListIcon />
					List
				</ListBoxItem>
				<ListBoxItem id="rows">
					<RowsIcon />
					Rows
				</ListBoxItem>
				<ListBoxItem id="grid">
					<LayoutGridIcon />
					Grid
				</ListBoxItem>
			</ListBox>
		</div>
	);
}
