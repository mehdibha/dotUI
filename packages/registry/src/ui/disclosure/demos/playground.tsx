"use client";

import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@dotui/registry/ui/disclosure";

interface DisclosurePlaygroundProps {
	isDisabled?: boolean;
	defaultExpanded?: boolean;
}

export function DisclosurePlayground({ isDisabled = false, defaultExpanded = false }: DisclosurePlaygroundProps) {
	return (
		<Disclosure isDisabled={isDisabled} defaultExpanded={defaultExpanded}>
			<DisclosureTrigger>System requirements</DisclosureTrigger>
			<DisclosurePanel>
				Details about system requirements go here. Describes the minimum and recommended hardware and software needed.
			</DisclosurePanel>
		</Disclosure>
	);
}
