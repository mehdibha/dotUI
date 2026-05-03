"use client";

import { MinusIcon, PlusIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Field, FieldGroup, Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";

export default function Demo() {
	return (
		<FieldGroup className="grid grid-cols-3 gap-4">
			<Field className="col-span-2">
				<Label htmlFor="width">Width</Label>
				<Group>
					<InputGroup>
						<InputGroupAddon>W</InputGroupAddon>
						<Input id="width" />
						<InputGroupAddon>px</InputGroupAddon>
					</InputGroup>
					<Button isIconOnly>
						<MinusIcon />
					</Button>
					<Button isIconOnly>
						<PlusIcon />
					</Button>
				</Group>
			</Field>
		</FieldGroup>
	);
}
