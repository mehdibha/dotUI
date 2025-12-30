import { Accordion } from "@dotui/registry/ui/accordion";
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@dotui/registry/ui/disclosure";

export function AccordionDemo() {
	return (
		<Accordion className="w-72" defaultExpandedKeys={["react"]}>
			<Disclosure id="react">
				<DisclosureTrigger>What is React?</DisclosureTrigger>
				<DisclosurePanel>React is a JavaScript library for building user interfaces.</DisclosurePanel>
			</Disclosure>
			<Disclosure id="nextjs">
				<DisclosureTrigger>What is Next.js?</DisclosureTrigger>
				<DisclosurePanel>Next.js is a React framework for production applications.</DisclosurePanel>
			</Disclosure>
		</Accordion>
	);
}
