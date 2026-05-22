import { CopyIcon, RotateCcwIcon, SearchIcon, StarIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Input, InputGroup, InputGroupAddon, TextArea } from "@/registry/ui/input";
import { Kbd } from "@/registry/ui/kbd";
import { TextField } from "@/registry/ui/text-field";

const sizes = ["sm", "md", "lg"] as const;

export default function Demo() {
	return (
		<>
			<div className="flex w-full flex-col gap-2">
				{sizes.map((size) => (
					<TextField key={size} aria-label={`Size ${size}`}>
						<InputGroup size={size}>
							<InputGroupAddon>
								<SearchIcon />
							</InputGroupAddon>
							<Input />
						</InputGroup>
					</TextField>
				))}
			</div>
			<div className="flex w-full flex-col gap-2">
				{sizes.map((size) => (
					<TextField key={size} aria-label={`Size ${size}`}>
						<InputGroup size={size}>
							<Input />
							<InputGroupAddon>
								<StarIcon />
							</InputGroupAddon>
						</InputGroup>
					</TextField>
				))}
			</div>
			<div className="flex w-full flex-col gap-2">
				{sizes.map((size) => (
					<TextField key={size} aria-label={`Size ${size}`}>
						<InputGroup size={size}>
							<InputGroupAddon>
								<Button>Button</Button>
							</InputGroupAddon>
							<Input />
						</InputGroup>
					</TextField>
				))}
			</div>
			<div className="flex w-full flex-col gap-2">
				{sizes.map((size) => (
					<TextField key={size} aria-label={`Size ${size}`}>
						<InputGroup size={size}>
							<InputGroupAddon>
								<Kbd>⌘K</Kbd>
							</InputGroupAddon>
							<Input />
						</InputGroup>
					</TextField>
				))}
			</div>
			<div className="flex w-full flex-col gap-2">
				{sizes.map((size) => (
					<TextField key={size} aria-label={`Size ${size}`}>
						<InputGroup size={size}>
							<Input />
							<InputGroupAddon>
								<Kbd>⌘K</Kbd>
							</InputGroupAddon>
						</InputGroup>
					</TextField>
				))}
			</div>
			<div className="flex w-full flex-col gap-2">
				{sizes.map((size) => (
					<TextField key={size} aria-label={`Size ${size}`}>
						<InputGroup size={size}>
							<InputGroupAddon>
								<Button size="xs" isIconOnly aria-label="Undo" className="ml-auto">
									<RotateCcwIcon />
								</Button>
								<Button size="xs" isIconOnly aria-label="Copy">
									<CopyIcon />
								</Button>
							</InputGroupAddon>
							<TextArea />
						</InputGroup>
					</TextField>
				))}
			</div>
			<div className="flex w-full flex-col gap-2">
				{sizes.map((size) => (
					<TextField key={size} aria-label={`Size ${size}`}>
						<InputGroup size={size}>
							<TextArea />
							<InputGroupAddon>
								<span>20/240 characters</span>
							</InputGroupAddon>
						</InputGroup>
					</TextField>
				))}
			</div>
		</>
	);
}
