"use client";

import { ArrowRightIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Field, Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input, InputGroup } from "@/registry/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

const currencyItems = [
	{ id: "$", label: "$" },
	{ id: "€", label: "€" },
	{ id: "£", label: "£" },
];

export default function Demo() {
	return (
		<Field>
			<Label>Amount</Label>
			<Group>
				<Select defaultSelectedKey="$">
					<SelectTrigger />
					<SelectContent items={currencyItems}>{(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}</SelectContent>
				</Select>
				<InputGroup>
					<Input placeholder="Enter amount to send" />
				</InputGroup>
				<Button isIconOnly>
					<ArrowRightIcon />
				</Button>
			</Group>
		</Field>
	);
}
