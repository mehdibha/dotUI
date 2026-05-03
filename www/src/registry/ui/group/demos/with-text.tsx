"use client";

import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input, InputGroup } from "@/registry/ui/input";
import { Text } from "@/registry/ui/text";

export default function Demo() {
	return (
		<div className="flex flex-col gap-4">
			<Group>
				<Text>Text</Text>
				<Button>Another Button</Button>
			</Group>
			<Group>
				<Label htmlFor="input-text">GPU Size</Label>
				<InputGroup>
					<Input id="input-text" placeholder="Type something here..." />
				</InputGroup>
			</Group>
		</div>
	);
}
