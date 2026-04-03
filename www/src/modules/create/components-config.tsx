import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Checkbox } from "@/registry/ui/checkbox";
import { Input } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Select, SelectValue } from "@/registry/ui/select";
import { Switch } from "@/registry/ui/switch";
import { TextField } from "@/registry/ui/text-field";

export function ComponentsConfig() {
	return (
		<div className="flex flex-col gap-5">
			{/* Button style */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Button style</span>
				<Select defaultSelectedKey="default">
					<Button size="sm" className="w-full">
						<SelectValue />
						<ChevronDownIcon />
					</Button>
					<Popover>
						<ListBox>
							<ListBoxItem id="default">Default</ListBoxItem>
							<ListBoxItem id="rounded">Rounded</ListBoxItem>
							<ListBoxItem id="sharp">Sharp</ListBoxItem>
							<ListBoxItem id="pill">Pill</ListBoxItem>
						</ListBox>
					</Popover>
				</Select>
			</div>

			{/* Input style */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Input style</span>
				<Select defaultSelectedKey="outline">
					<Button size="sm" className="w-full">
						<SelectValue />
						<ChevronDownIcon />
					</Button>
					<Popover>
						<ListBox>
							<ListBoxItem id="outline">Outline</ListBoxItem>
							<ListBoxItem id="filled">Filled</ListBoxItem>
							<ListBoxItem id="underline">Underline</ListBoxItem>
						</ListBox>
					</Popover>
				</Select>
			</div>

			{/* Toggle style */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Toggle style</span>
				<Select defaultSelectedKey="default">
					<Button size="sm" className="w-full">
						<SelectValue />
						<ChevronDownIcon />
					</Button>
					<Popover>
						<ListBox>
							<ListBoxItem id="default">Default</ListBoxItem>
							<ListBoxItem id="ios">iOS</ListBoxItem>
							<ListBoxItem id="material">Material</ListBoxItem>
						</ListBox>
					</Popover>
				</Select>
			</div>

			{/* Preview */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Preview</span>
				<div className="flex flex-col gap-3 rounded-lg border p-3">
					<TextField className="w-full">
						<Input placeholder="Input field" />
					</TextField>
					<div className="flex items-center gap-2">
						<Button slot={null} size="sm" variant="primary">
							Primary
						</Button>
						<Button slot={null} size="sm">
							Default
						</Button>
						<Button slot={null} size="sm" variant="quiet">
							Quiet
						</Button>
					</div>
					<div className="flex items-center gap-3">
						<Switch defaultSelected />
						<Checkbox defaultSelected />
					</div>
				</div>
			</div>
		</div>
	);
}
