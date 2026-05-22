import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { SearchField } from "@/registry/ui/search-field";

export default function Demo() {
	return (
		<SearchField isRequired>
			<Label>Search</Label>
			<Input />
		</SearchField>
	);
}
