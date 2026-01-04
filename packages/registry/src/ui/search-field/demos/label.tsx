import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";

export default function Demo() {
	return (
		<div className="space-y-4">
			<SearchField>
				<Label>Search</Label>
				<Input placeholder="Visible label" />
			</SearchField>

			<SearchField aria-label="Search">
				<Input placeholder="Hidden label" />
			</SearchField>
		</div>
	);
}
