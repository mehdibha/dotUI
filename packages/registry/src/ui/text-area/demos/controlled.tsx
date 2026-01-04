"use client";

import React from "react";

import { Label } from "@dotui/registry/ui/field";
import { TextArea } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
	const [inputValue, setInputValue] = React.useState("Roses are red, violets are blue.");
	return (
		<div className="flex flex-col items-center gap-4">
			<TextField
				value={inputValue}
				onChange={(text) => {
					setInputValue(text);
				}}
			>
				<Label>Essay</Label>
				<TextArea />
			</TextField>
			<p className="text-fg-muted text-sm">mirrored text: {inputValue}</p>
		</div>
	);
}
