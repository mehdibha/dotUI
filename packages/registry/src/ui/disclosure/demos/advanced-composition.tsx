import { ChevronDownIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Disclosure, DisclosurePanel } from "@dotui/registry/ui/disclosure";
import { Heading } from "@dotui/registry/ui/heading";

export default function Demo() {
	return (
		<Disclosure>
			<Heading>
				<Button variant="quiet" slot="trigger">
					System requirements
					<ChevronDownIcon />
				</Button>
			</Heading>
			<DisclosurePanel className="px-3 pt-2">
				Details about system requirements go here. Describes the minimum and recommended hardware and software needed.
			</DisclosurePanel>
		</Disclosure>
	);
}
