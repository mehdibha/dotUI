"use client";

import React from "react";

import { BoldIcon, ItalicIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import { Group } from "@dotui/registry/ui/group";
import { InputAddon, InputGroup, TextArea } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@dotui/registry/ui/toggle-button-group";

export default function Demo() {
	const [inputValue, setInputValue] = React.useState("");
	const insertEmoji = (emoji: string) => {
		setInputValue(`${inputValue}${emoji}`);
	};
	return (
		<TextField value={inputValue} onChange={setInputValue}>
			<Label>Comment</Label>
			<InputGroup>
				<InputAddon>
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
				</InputAddon>
				<TextArea placeholder="type something here" />
				<InputAddon>
					<Group className="justify-between">
						<ToggleButtonGroup>
							<ToggleButton>
								<BoldIcon />
							</ToggleButton>
							<ToggleButton>
								<ItalicIcon />
							</ToggleButton>
						</ToggleButtonGroup>
						<Button variant="primary">Comment</Button>
					</Group>
				</InputAddon>
			</InputGroup>
		</TextField>
	);
}
