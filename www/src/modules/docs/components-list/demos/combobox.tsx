import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox, ComboboxContent, ComboboxItem } from "@/registry/ui/combobox";
import { Input, InputAddon, InputGroup } from "@/registry/ui/input";

export function ComboboxDemo() {
	return (
		<Combobox aria-label="Country" menuTrigger="focus">
			<InputGroup>
				<Input placeholder="Select country..." />
				<InputAddon>
					<Button variant="quiet" size="icon">
						<ChevronDownIcon />
					</Button>
				</InputAddon>
			</InputGroup>
			<ComboboxContent>
				<ComboboxItem>Canada</ComboboxItem>
				<ComboboxItem>France</ComboboxItem>
				<ComboboxItem>Germany</ComboboxItem>
				<ComboboxItem>Japan</ComboboxItem>
				<ComboboxItem>United Kingdom</ComboboxItem>
				<ComboboxItem>United States</ComboboxItem>
			</ComboboxContent>
		</Combobox>
	);
}
