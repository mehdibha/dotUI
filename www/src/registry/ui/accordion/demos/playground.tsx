"use client";

import { Accordion } from "@/registry/ui/accordion";
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/registry/ui/disclosure";

interface AccordionPlaygroundProps {
	allowsMultipleExpanded?: boolean;
	isDisabled?: boolean;
}

const items = [
	{
		id: "getting-started",
		question: "How do I get started with DotUI?",
		answer:
			"Getting started is simple! Install the package using your preferred package manager, then import the components you need.",
	},
	{
		id: "free-to-use",
		question: "Is DotUI free to use?",
		answer:
			"Yes, DotUI is completely free and open source. You can use it in any project, whether personal or commercial.",
	},
	{
		id: "customization",
		question: "Can I customize the components?",
		answer:
			"Absolutely! All components use Tailwind Variants for styling, making it easy to customize colors, sizes, and other visual properties.",
	},
];

export function AccordionPlayground({
	allowsMultipleExpanded = false,
	isDisabled = false,
}: AccordionPlaygroundProps) {
	return (
		<Accordion
			allowsMultipleExpanded={allowsMultipleExpanded}
			isDisabled={isDisabled}
			className="max-w-2xl"
		>
			{items.map((item) => (
				<Disclosure id={item.id} key={item.id}>
					<DisclosureTrigger>{item.question}</DisclosureTrigger>
					<DisclosurePanel>{item.answer}</DisclosurePanel>
				</Disclosure>
			))}
		</Accordion>
	);
}
