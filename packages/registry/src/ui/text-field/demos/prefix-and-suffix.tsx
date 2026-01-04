"use client";

import React from "react";
import { Input } from "react-aria-components";

import { XCircleIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import { InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export default function Demo() {
	const [inputValue, setInputValue] = React.useState("Hello world!");
	const inputRef = React.useRef<HTMLInputElement>(null);
	return (
		<div className="space-y-2">
			<TextField>
				<Label>Website</Label>
				<InputGroup>
					<InputAddon>https://</InputAddon>
					<Input />
				</InputGroup>
			</TextField>
			<TextField>
				<Label>Email</Label>
				<InputGroup>
					<Input />
					<InputAddon>@dotui.org</InputAddon>
				</InputGroup>
			</TextField>
			<TextField aria-label="Textfield with clear input" ref={inputRef} value={inputValue} onChange={setInputValue}>
				<InputGroup>
					<Input />
					<InputAddon>
						<Tooltip>
							<Button variant="quiet">
								<XCircleIcon />
							</Button>
							<TooltipContent placement="bottom">
								<p>Clear input</p>
							</TooltipContent>
						</Tooltip>
					</InputAddon>
					<Input />
				</InputGroup>
			</TextField>
		</div>
	);
}
