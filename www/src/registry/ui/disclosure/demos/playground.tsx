"use client";

import { Disclosure, DisclosurePanel, DisclosureTrigger, type DisclosureProps } from "@/registry/ui/disclosure";

export default function Demo({ isDisabled = false }: DisclosureProps = {}) {
	return (
		<Disclosure isDisabled={isDisabled}>
			<DisclosureTrigger>System requirements</DisclosureTrigger>
			<DisclosurePanel>
				Details about system requirements go here. Describes the minimum and recommended hardware and software needed.
			</DisclosurePanel>
		</Disclosure>
	);
}
