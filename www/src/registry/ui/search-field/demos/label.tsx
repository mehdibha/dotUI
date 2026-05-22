import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { SearchField } from "@/registry/ui/search-field";

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
