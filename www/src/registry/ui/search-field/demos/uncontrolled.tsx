import { Input } from "@/registry/ui/input";
import { SearchField } from "@/registry/ui/search-field";

export default function Demo() {
	return (
		<SearchField aria-label="Search" defaultValue="Marvel movies">
			<Input />
		</SearchField>
	);
}
