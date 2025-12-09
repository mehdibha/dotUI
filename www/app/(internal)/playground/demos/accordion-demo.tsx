"use client";

import { Accordion } from "@dotui/registry/ui/accordion";
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@dotui/registry/ui/disclosure";

export function AccordionDemo() {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="space-y-4">
				<Accordion>
					<Disclosure>
						<DisclosureTrigger>Is it accessible?</DisclosureTrigger>
						<DisclosurePanel>Yes. It adheres to the WAI-ARIA design pattern.</DisclosurePanel>
					</Disclosure>
					<Disclosure>
						<DisclosureTrigger>Is it styled?</DisclosureTrigger>
						<DisclosurePanel>Yes. It comes with default styles that matches the other components.</DisclosurePanel>
					</Disclosure>
					<Disclosure>
						<DisclosureTrigger>Is it animated?</DisclosureTrigger>
						<DisclosurePanel>Yes. It's animated by default, but you can disable it if you want.</DisclosurePanel>
					</Disclosure>
				</Accordion>

				<Accordion>
					<Disclosure>
						<DisclosureTrigger>
							What are the key considerations when implementing a comprehensive enterprise-level authentication system?
						</DisclosureTrigger>
						<DisclosurePanel>
							Implementing a robust enterprise authentication system requires careful consideration of multiple factors.
							This includes secure password hashing and storage, multi-factor authentication (MFA) implementation,
							session management, OAuth2 and SSO integration, regular security audits, rate limiting to prevent brute
							force attacks, and maintaining detailed audit logs. Additionally, you'll need to consider scalability,
							performance impact, and compliance with relevant data protection regulations such as GDPR or HIPAA.
						</DisclosurePanel>
					</Disclosure>
					<Disclosure>
						<DisclosureTrigger>
							How does modern distributed system architecture handle eventual consistency and data synchronization
							across multiple regions?
						</DisclosureTrigger>
						<DisclosurePanel>
							Modern distributed systems employ various strategies to maintain data consistency across regions. This
							often involves using techniques like CRDT (Conflict-Free Replicated Data Types), vector clocks, and gossip
							protocols. Systems might implement event sourcing patterns, utilize message queues for asynchronous
							updates, and employ sophisticated conflict resolution strategies. Popular solutions like Amazon's DynamoDB
							and Google's Spanner demonstrate different approaches to solving these challenges, balancing between
							consistency, availability, and partition tolerance as described in the CAP theorem.
						</DisclosurePanel>
					</Disclosure>
				</Accordion>
			</div>
			<div className="space-y-4">
				<Disclosure>
					<DisclosureTrigger>Accordion Heading 3</DisclosureTrigger>
					<DisclosurePanel>Accordion Panel 3</DisclosurePanel>
				</Disclosure>
			</div>
		</div>
	);
}
