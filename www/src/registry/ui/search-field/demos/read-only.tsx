import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { SearchField } from "@/registry/ui/search-field";

export default function Demo() {
	return (
		<SearchField isReadOnly defaultValue="Marvel movies">
			<Label>Search</Label>
			<Input />
		</SearchField>
	);
}
