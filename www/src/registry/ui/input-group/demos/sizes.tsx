import { SearchIcon, StarIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
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
							<Input />
							<InputGroupAddon>
								<Button>Button</Button>
							</InputGroupAddon>
						</InputGroup>
					</TextField>
				))}
			</div>
			<div className="flex w-full flex-col gap-2">
				{sizes.map((size) => (
					<TextField key={size} aria-label={`Size ${size}`}>
						<InputGroup size={size} orientation="vertical">
							<InputGroupAddon>
								<Label>First Name</Label>
							</InputGroupAddon>
							<Input />
						</InputGroup>
					</TextField>
				))}
			</div>
			<div className="flex w-full flex-col gap-2">
				{sizes.map((size) => (
					<TextField key={size} aria-label={`Size ${size}`}>
						<InputGroup size={size} orientation="vertical">
							<Input />
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
