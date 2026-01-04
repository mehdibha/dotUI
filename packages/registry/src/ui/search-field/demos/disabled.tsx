import { Input } from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";

export default function Demo() {
	return (
		<SearchField aria-label="Search" defaultValue="Is dotUI the best ui library?" isDisabled>
			<Input />
		</SearchField>
	);
}
