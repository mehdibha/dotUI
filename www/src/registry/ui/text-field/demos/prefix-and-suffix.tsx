"use client";

import React from "react";

import { XCircleIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
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
					<InputGroupAddon>https://</InputGroupAddon>
					<Input />
				</InputGroup>
			</TextField>
			<TextField>
				<Label>Email</Label>
				<InputGroup>
					<Input />
					<InputGroupAddon>@example.com</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField aria-label="Textfield with clear input" value={inputValue} onChange={setInputValue}>
				<InputGroup>
					<Input ref={inputRef} />
					<InputGroupAddon>
						<Tooltip>
							<Button
								variant="quiet"
								isIconOnly
								onPress={() => {
									setInputValue("");
									inputRef.current?.focus();
								}}
							>
								<XCircleIcon />
							</Button>
							<TooltipContent placement="bottom">
								<p>Clear input</p>
							</TooltipContent>
						</Tooltip>
					</InputGroupAddon>
				</InputGroup>
			</TextField>
		</div>
	);
}
