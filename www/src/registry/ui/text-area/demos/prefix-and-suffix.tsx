"use client";

import React from "react";

import { BoldIcon, ItalicIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { InputAddon, InputGroup, TextArea } from "@/registry/ui/input";
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
							<ToggleButton size="icon">
								<BoldIcon />
							</ToggleButton>
							<ToggleButton size="icon">
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
