"use client";

import { ArrowUpIcon, CodeIcon, CopyIcon, InfoIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Description, Label } from "@/registry/ui/field";
import { InputGroup, InputGroupAddon, TextArea } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<>
			<TextField>
				<Label>Default Textarea (no InputGroup)</Label>
				<TextArea placeholder="Enter your text here..." />
			</TextField>
			<TextField>
				<Label>Input Group</Label>
				<InputGroup>
					<TextArea placeholder="Enter your text here..." />
				</InputGroup>
				<Description>This is a description of the input group.</Description>
			</TextField>
			<TextField isInvalid>
				<Label>Invalid</Label>
				<InputGroup>
					<TextArea placeholder="Enter your text here..." />
				</InputGroup>
				<Description>This is a description of the input group.</Description>
			</TextField>
			<TextField isDisabled>
				<Label>Disabled</Label>
				<InputGroup>
					<TextArea placeholder="Enter your text here..." />
				</InputGroup>
				<Description>This is a description of the input group.</Description>
			</TextField>
			<TextField>
				<Label>Addon (block-start)</Label>
				<InputGroup orientation="vertical">
					<InputGroupAddon>
						<span>Ask, Search or Chat...</span>
						<InfoIcon  className="ml-auto"/>
					</InputGroupAddon>
					<TextArea />
				</InputGroup>
				<Description>This is a description of the input group.</Description>
			</TextField>
			<TextField>
				<Label>Addon (block-end)</Label>
				<InputGroup orientation="vertical">
					<TextArea placeholder="Enter your text here..." />
					<InputGroupAddon>
						<span>0/280 characters</span>
						<Button variant="primary" isIconOnly size="sm" className="ml-auto rounded-full">
							<ArrowUpIcon />
							<span className="sr-only">Send</span>
						</Button>
					</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField>
				<Label>Addon (Buttons)</Label>
				<InputGroup orientation="vertical">
					<TextArea placeholder="Share your thoughts..." className="min-h-[120px]" />
					<InputGroupAddon>
						<Button variant="quiet" size="sm" className="ml-auto">
							Cancel
						</Button>
						<Button variant="primary" size="sm">
							Post Comment
						</Button>
					</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField>
				<Label>Code Editor</Label>
				<InputGroup orientation="vertical">
					<InputGroupAddon className="border-b">
						<span className="inline-flex items-center gap-2 font-medium font-mono">
							<CodeIcon />
							script.js
						</span>
						<Button variant="quiet" isIconOnly size="sm" className="ml-auto">
							<CopyIcon />
						</Button>
					</InputGroupAddon>
					<TextArea placeholder="console.log('Hello, world!');" className="min-h-[240px] py-3" />
					<InputGroupAddon className="border-t">
						<span>Line 1, Column 1</span>
						<span className="ml-auto">JavaScript</span>
					</InputGroupAddon>
				</InputGroup>
			</TextField>
		</>
	);
}
