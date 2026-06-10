"use client";

import { Group } from "@/registry/ui/group";
import { Input, InputGroup } from "@/registry/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

const durationItems = [
	{ id: "hours", label: "Hours" },
	{ id: "days", label: "Days" },
	{ id: "weeks", label: "Weeks" },
];

export default function Demo() {
	return (
		<Group>
			<Select defaultSelectedKey="hours" aria-label="Duration unit">
				<SelectTrigger />
				<SelectContent items={durationItems}>
					{(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
				</SelectContent>
			</Select>
			<InputGroup>
				<Input />
			</InputGroup>
		</Group>
	);
}
