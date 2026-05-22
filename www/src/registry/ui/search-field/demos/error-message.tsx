import { FieldError, Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { SearchField } from "@/registry/ui/search-field";

export default function Demo() {
	return (
		<SearchField isInvalid>
			<Label>Search</Label>
			<Input />
			<FieldError>Please fill out this field.</FieldError>
		</SearchField>
	);
}
