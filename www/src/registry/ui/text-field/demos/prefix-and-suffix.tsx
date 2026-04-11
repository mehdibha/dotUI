"use client";

import React from "react";
import { Input } from "react-aria-components";

import { XCircleIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { InputAddon, InputGroup } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

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
							<Button variant="quiet" size="icon">
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
