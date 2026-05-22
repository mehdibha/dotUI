import { CopyIcon, EyeOffIcon, InfoIcon, MicIcon, RadioIcon, SearchIcon, StarIcon } from "lucide-react";

import { Description, Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<>
			<TextField>
				<Label>label</Label>
				<InputGroup>
					<InputGroupAddon>
						<SearchIcon />
					</InputGroupAddon>
					<Input />
				</InputGroup>
			</TextField>
			<TextField>
				<Label>label</Label>
				<InputGroup>
					<Input />
					<InputGroupAddon>
						<EyeOffIcon />
					</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField>
				<Label>label</Label>
				<InputGroup>
					<InputGroupAddon>
						<MicIcon />
					</InputGroupAddon>
					<Input />
					<InputGroupAddon>
						<RadioIcon />
					</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField>
				<Label>label</Label>
				<InputGroup>
					<InputGroupAddon>
						<RadioIcon />
					</InputGroupAddon>
					<Input />
					<InputGroupAddon>
						<StarIcon />
						<CopyIcon />
					</InputGroupAddon>
				</InputGroup>
			</TextField>
			<TextField>
				<Label>label</Label>
				<InputGroup>
					<Input />
					<InputGroupAddon>
						<InfoIcon />
					</InputGroupAddon>
				</InputGroup>
				<Description>This is a description of the input group.</Description>
			</TextField>
			<TextField>
				<InputGroup>
					<InputGroupAddon>
						<Label>Label</Label>
					</InputGroupAddon>
					<Input />
				</InputGroup>
			</TextField>
			<TextField aria-label="Optional">
				<InputGroup>
					<Input />
					<InputGroupAddon>(optional)</InputGroupAddon>
				</InputGroup>
			</TextField>
		</>
	);
}
