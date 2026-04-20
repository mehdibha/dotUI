import { Label } from "@/registry/ui/field";
import { Input, InputGroup } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<>
			<TextField>
				<Label>Default (no InputGroup)</Label>
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
					<Input placeholder="disabled field" />
				</InputGroup>
			</TextField>
			<TextField isInvalid>
				<Label>Invalid</Label>
				<InputGroup>
					<Input placeholder="invalid field" />
				</InputGroup>
			</TextField>
			<TextField isInvalid defaultValue="invalid field">
				<Label>Invalid (with value)</Label>
				<InputGroup>
					<Input placeholder="invalid field" />
				</InputGroup>
			</TextField>
			<TextField isReadOnly defaultValue="read only field">
				<Label>Read Only</Label>
				<InputGroup>
					<Input />
				</InputGroup>
			</TextField>
		</>
	);
}
