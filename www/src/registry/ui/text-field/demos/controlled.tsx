"use client";

import React from "react";

import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	const [inputValue, setInputValue] = React.useState("Hello world!");
	return (
		<>
			<TextField aria-label="Controlled text field" value={inputValue} onChange={setInputValue}>
				<Input />
			</TextField>
			<p className="text-fg-muted text-sm">mirrored text: {inputValue}</p>
		</>
	);
}
