import { Input } from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			<SearchField aria-label="sm">
				<Input placeholder="sm" size="sm" />
			</SearchField>
			<SearchField aria-label="md">
				<Input placeholder="md" size="md" />
			</SearchField>
			<SearchField aria-label="lg">
				<Input placeholder="lg" size="lg" />
			</SearchField>
		</div>
	);
}
