"use client";

import { useState } from "react";

import { Accordion } from "@/registry/ui/accordion";
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/registry/ui/disclosure";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
	return (
		<AnimatedPreview
			reset={() => setExpandedKeys(new Set())}
			script={async (s) => {
				await s.wait(500);
				await s.click("shipping", () => setExpandedKeys(new Set(["shipping"])));
				await s.wait(1500);
				await s.click("returns", () => setExpandedKeys(new Set(["returns"])));
				await s.wait(1500);
				await s.click("returns", () => setExpandedKeys(new Set()));
				await s.wait(600);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{(ref) => (
				<div className="w-64">
					<Accordion expandedKeys={expandedKeys} onExpandedChange={(keys) => setExpandedKeys(keys as Set<string>)}>
						<Disclosure id="shipping">
							<span ref={ref("shipping")} className="block">
								<DisclosureTrigger>Shipping</DisclosureTrigger>
							</span>
							<DisclosurePanel>Free worldwide shipping on all orders.</DisclosurePanel>
						</Disclosure>
						<Disclosure id="returns">
							<span ref={ref("returns")} className="block">
								<DisclosureTrigger>Returns</DisclosureTrigger>
							</span>
							<DisclosurePanel>30-day hassle-free returns, no questions asked.</DisclosurePanel>
						</Disclosure>
					</Accordion>
				</div>
			)}
		</AnimatedPreview>
	);
}
