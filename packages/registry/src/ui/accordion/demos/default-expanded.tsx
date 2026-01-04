import { Accordion } from "@dotui/registry/ui/accordion";
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@dotui/registry/ui/disclosure";

export default function Demo() {
	return (
		<Accordion defaultExpandedKeys={["getting-started"]} className="w-full max-w-2xl">
			<Disclosure id="getting-started">
				<DisclosureTrigger>How do I get started with DotUI?</DisclosureTrigger>
				<DisclosurePanel>
					Getting started is simple! Install the package using your preferred package manager, then import the
					components you need. All components are built on React Aria Components and follow accessibility best practices
					out of the box.
				</DisclosurePanel>
			</Disclosure>
			<Disclosure id="free-to-use">
				<DisclosureTrigger>Is DotUI free to use?</DisclosureTrigger>
				<DisclosurePanel>
					Yes, DotUI is completely free and open source. You can use it in any project, whether personal or commercial,
					without any restrictions or licensing fees.
				</DisclosurePanel>
			</Disclosure>
			<Disclosure id="customization">
				<DisclosureTrigger>Can I customize the components?</DisclosureTrigger>
				<DisclosurePanel>
					Absolutely! All components use Tailwind Variants for styling, making it easy to customize colors, sizes, and
					other visual properties. You can pass custom className props or extend the default variants to match your
					design system.
				</DisclosurePanel>
			</Disclosure>
		</Accordion>
	);
}
