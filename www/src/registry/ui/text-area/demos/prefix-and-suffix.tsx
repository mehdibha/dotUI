"use client";

import React from "react";

import { BoldIcon, ItalicIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { InputGroupAddon, InputGroup, TextArea } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";
import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

export default function Demo() {
	const [inputValue, setInputValue] = React.useState("");
	const insertEmoji = (emoji: string) => {
		setInputValue(`${inputValue}${emoji}`);
	};
	return (
		<TextField value={inputValue} onChange={setInputValue}>
			<Label>Comment</Label>
			<InputGroup>
				<InputGroupAddon>
					<Group>
						<Button
							variant="quiet"
							onPress={() => {
								insertEmoji("👍");
							}}
						>
							👍
						</Button>
						<Button
							variant="quiet"
							onPress={() => {
								insertEmoji("❤️");
							}}
						>
							❤️
						</Button>
					</Group>
				</InputGroupAddon>
				<TextArea placeholder="type something here" />
				<InputGroupAddon>
					<Group className="justify-between">
						<ToggleButtonGroup>
							<ToggleButton isIconOnly>
								<BoldIcon />
							</ToggleButton>
							<ToggleButton isIconOnly>
								<ItalicIcon />
							</ToggleButton>
						</ToggleButtonGroup>
						<Button variant="primary">Comment</Button>
					</Group>
				</InputGroupAddon>
			</InputGroup>
		</TextField>
	);
}
