"use client";

import { useState } from "react";
import {
	ArrowUpIcon,
	CheckIcon,
	CodeIcon,
	CopyIcon,
	EyeOffIcon,
	InfoIcon,
	MicIcon,
	RadioIcon,
	RefreshCwIcon,
	SearchIcon,
	SparklesIcon,
	StarIcon,
	TrashIcon,
} from "lucide-react";

import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { Button } from "@/registry/ui/button";
import { Description, FieldGroup, Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon, TextArea } from "@/registry/ui/input";
import { Kbd, KbdGroup } from "@/registry/ui/kbd";
import { TextField } from "@/registry/ui/text-field";

export default function InputGroupExamples() {
	return (
		<Examples className="**:data-input-group:w-full **:data-input:w-full **:data-textfield:w-full lg:grid-cols-2">
			{/* Basic */}
			<BasicVariants />

			{/* Icons */}
			<IconPrefix />
			<IconSuffix />
			<IconBothSides />

			{/* Vertical (block-start / block-end) */}
			<BlockStartLabel />
			<BlockEndCharCount />

			{/* Multiple children in a single addon */}
			<SuffixIconPlusButton />
			<OptionalSuffixText />

			{/* Buttons */}
			<ButtonSuffixVariants />
			<IconButtonSuffix />

			{/* Kbd */}
			<KbdSuffix />
			<SearchWithKbd />
			<SparklesWithKbdGroup />

			{/* Username check */}
			<UsernameAvailable />

			{/* Search docs */}
			<SearchDocs />

			{/* Grid layout */}
			<GridTwoFields />

			{/* Textarea block addons */}
			<TextAreaBlockEnd />
			<TextAreaBlockStartHeader />
			<TextAreaCommentButtons />
		</Examples>
	);
}

// -------------------------- Basic --------------------------

function BasicVariants() {
	return (
		<Example title="Basic">
			<FieldGroup>
				<TextField>
					<Label>Default (no Input Group)</Label>
					<Input placeholder="Placeholder" />
				</TextField>
				<TextField>
					<Label>Input Group</Label>
					<InputGroup>
						<Input placeholder="Placeholder" />
					</InputGroup>
				</TextField>
				<TextField isDisabled>
					<Label>Disabled</Label>
					<InputGroup>
						<Input placeholder="This field is disabled" />
					</InputGroup>
				</TextField>
				<TextField isInvalid>
					<Label>Invalid</Label>
					<InputGroup>
						<Input placeholder="This field is invalid" />
					</InputGroup>
				</TextField>
			</FieldGroup>
		</Example>
	);
}

// -------------------------- Icons --------------------------

function IconPrefix() {
	return (
		<Example title="Icon prefix">
			<InputGroup>
				<InputGroupAddon>
					<SearchIcon className="text-fg-muted" />
				</InputGroupAddon>
				<Input placeholder="Search..." />
			</InputGroup>
		</Example>
	);
}

function IconSuffix() {
	const [value, setValue] = useState("hunter2");
	return (
		<Example title="Icon suffix">
			<InputGroup>
				<Input type="password" value={value} onChange={(e) => setValue(e.target.value)} />
				<InputGroupAddon>
					<EyeOffIcon />
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

function IconBothSides() {
	return (
		<Example title="Icons on both sides">
			<InputGroup>
				<InputGroupAddon>
					<MicIcon className="text-fg-muted" />
				</InputGroupAddon>
				<Input placeholder="Recording..." />
				<InputGroupAddon>
					<RadioIcon className="animate-pulse text-red-500" />
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

// -------------------------- Vertical (block) addons --------------------------

function BlockStartLabel() {
	return (
		<Example title="Block-start label">
			<InputGroup orientation="vertical">
				<InputGroupAddon>
					<span>First Name</span>
					<InfoIcon className="ml-auto text-fg-muted" />
				</InputGroupAddon>
				<Input placeholder="Enter first name" />
			</InputGroup>
		</Example>
	);
}

function BlockEndCharCount() {
	return (
		<Example title="Block-end hint">
			<InputGroup orientation="vertical">
				<Input placeholder="Write your bio..." />
				<InputGroupAddon>
					<span className="text-fg-muted text-xs">20/240 characters</span>
					<InfoIcon className="ml-auto text-fg-muted" />
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

// -------------------------- Multi-child addons --------------------------

function SuffixIconPlusButton() {
	const [value, setValue] = useState("https://example.com/share");
	return (
		<Example title="Icon + icon button (suffix)">
			<InputGroup>
				<Input value={value} onChange={(e) => setValue(e.target.value)} />
				<InputGroupAddon>
					<StarIcon className="text-fg-muted" />
					<Button size="sm" variant="quiet" aria-label="Copy link">
						<CopyIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

function OptionalSuffixText() {
	return (
		<Example title="Optional suffix text">
			<InputGroup>
				<Input aria-label="Middle name" placeholder="Middle name" />
				<InputGroupAddon>
					<span className="text-fg-muted text-xs">(optional)</span>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

// -------------------------- Buttons --------------------------

function ButtonSuffixVariants() {
	return (
		<Example title="Button suffix variants">
			<FieldGroup>
				<InputGroup>
					<Input placeholder="Primary action" />
					<InputGroupAddon>
						<Button size="sm" variant="primary">
							Subscribe
						</Button>
					</InputGroupAddon>
				</InputGroup>
				<InputGroup>
					<Input placeholder="Outline action" />
					<InputGroupAddon>
						<Button size="sm" variant="outline">
							Outline
						</Button>
					</InputGroupAddon>
				</InputGroup>
				<InputGroup>
					<Input placeholder="Secondary action" />
					<InputGroupAddon>
						<Button size="sm" variant="quiet">
							Cancel
						</Button>
					</InputGroupAddon>
				</InputGroup>
			</FieldGroup>
		</Example>
	);
}

function IconButtonSuffix() {
	const [apiKey, setApiKey] = useState("sk_live_51H...");
	const [project, setProject] = useState("project-legacy");
	return (
		<Example title="Icon button suffix">
			<FieldGroup>
				<InputGroup>
					<Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} aria-label="API key" />
					<InputGroupAddon>
						<Button size="sm" variant="quiet" aria-label="Copy">
							<CopyIcon />
						</Button>
					</InputGroupAddon>
				</InputGroup>
				<InputGroup>
					<Input value={project} onChange={(e) => setProject(e.target.value)} aria-label="Project name" />
					<InputGroupAddon>
						<Button size="sm" variant="quiet" aria-label="Delete">
							<TrashIcon />
						</Button>
					</InputGroupAddon>
				</InputGroup>
			</FieldGroup>
		</Example>
	);
}

// -------------------------- Kbd --------------------------

function KbdSuffix() {
	return (
		<Example title="Keyboard shortcut suffix">
			<InputGroup>
				<Input placeholder="Quick search..." />
				<InputGroupAddon>
					<Kbd>⌘K</Kbd>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

function SearchWithKbd() {
	return (
		<Example title="Search with kbd + action">
			<InputGroup>
				<Input placeholder="Search for apps..." />
				<InputGroupAddon>
					<span className="text-fg-muted text-xs">Ask AI</span>
					<Kbd>Tab</Kbd>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

function SparklesWithKbdGroup() {
	return (
		<Example title="Prefix icon + kbd group">
			<InputGroup>
				<InputGroupAddon>
					<SparklesIcon />
				</InputGroupAddon>
				<Input placeholder="Type to search..." />
				<InputGroupAddon>
					<KbdGroup>
						<Kbd>Ctrl</Kbd>
						<Kbd>C</Kbd>
					</KbdGroup>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

// -------------------------- Username availability --------------------------

function UsernameAvailable() {
	const [value, setValue] = useState("shadcn");
	return (
		<Example title="Username available">
			<TextField value={value} onChange={setValue}>
				<Label>Username</Label>
				<InputGroup>
					<Input />
					<InputGroupAddon>
						<div className="flex size-4 items-center justify-center rounded-full bg-green-500 dark:bg-green-800">
							<CheckIcon className="size-3 text-white" />
						</div>
					</InputGroupAddon>
				</InputGroup>
				<Description className="text-green-700 dark:text-green-500">This username is available.</Description>
			</TextField>
		</Example>
	);
}

// -------------------------- Search docs --------------------------

function SearchDocs() {
	return (
		<Example title="Search with result count">
			<InputGroup>
				<InputGroupAddon>
					<SearchIcon />
				</InputGroupAddon>
				<Input placeholder="Search documentation..." />
				<InputGroupAddon>
					<span className="text-fg-muted text-xs">12 results</span>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

// -------------------------- Grid layout --------------------------

function GridTwoFields() {
	return (
		<Example title="Two-column layout">
			<FieldGroup className="grid grid-cols-2 gap-4">
				<TextField>
					<Label>First Name</Label>
					<InputGroup>
						<Input placeholder="First name" />
						<InputGroupAddon>
							<InfoIcon className="text-fg-muted" />
						</InputGroupAddon>
					</InputGroup>
				</TextField>
				<TextField>
					<Label>Last Name</Label>
					<InputGroup>
						<Input placeholder="Last name" />
						<InputGroupAddon>
							<InfoIcon className="text-fg-muted" />
						</InputGroupAddon>
					</InputGroup>
				</TextField>
			</FieldGroup>
		</Example>
	);
}

// -------------------------- Textarea examples --------------------------

function TextAreaBlockEnd() {
	return (
		<Example title="Textarea with char count + send">
			<InputGroup orientation="vertical">
				<TextArea placeholder="Write your thoughts..." />
				<InputGroupAddon>
					<span className="text-fg-muted text-xs">0/280 characters</span>
					<Button size="sm" variant="primary" className="ml-auto rounded-full" aria-label="Send">
						<ArrowUpIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

function TextAreaBlockStartHeader() {
	return (
		<Example title="Textarea with code-editor header">
			<InputGroup orientation="vertical">
				<InputGroupAddon className="border-b">
					<span className="flex items-center gap-1.5 font-medium font-mono">
						<CodeIcon className="size-4" />
						script.js
					</span>
					<Button size="sm" variant="quiet" className="ml-auto" aria-label="Refresh">
						<RefreshCwIcon />
					</Button>
					<Button size="sm" variant="quiet" aria-label="Copy">
						<CopyIcon />
					</Button>
				</InputGroupAddon>
				<TextArea className="min-h-[200px] font-mono text-sm" placeholder="console.log('Hello, world!');" />
				<InputGroupAddon className="border-t">
					<span className="text-fg-muted text-xs">Line 1, Column 1</span>
					<span className="ml-auto text-fg-muted text-xs">JavaScript</span>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}

function TextAreaCommentButtons() {
	return (
		<Example title="Textarea with action buttons">
			<InputGroup orientation="vertical">
				<TextArea placeholder="Share your thoughts..." className="min-h-[120px]" />
				<InputGroupAddon>
					<Button size="sm" variant="quiet" className="ml-auto">
						Cancel
					</Button>
					<Button size="sm" variant="primary">
						Post Comment
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</Example>
	);
}
