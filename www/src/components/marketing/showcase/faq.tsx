"use client";

import { cn } from "@/registry/lib/utils";
import { Accordion } from "@/registry/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/registry/ui/disclosure";

const faqs = [
	{
		id: "billing",
		question: "How does billing work?",
		answer:
			"Plans are billed monthly or annually and charged automatically to your card. Annual plans save you two months compared to paying monthly.",
	},
	{
		id: "cancel",
		question: "Can I cancel anytime?",
		answer:
			"Yes. You can cancel from your billing settings and keep access until the end of your current period. We don't charge any cancellation fees.",
	},
	{
		id: "seats",
		question: "How are team seats counted?",
		answer:
			"Each active member uses one seat. You can add or remove seats whenever you like, and we'll prorate the change on your next invoice.",
	},
	{
		id: "support",
		question: "What support is included?",
		answer:
			"Every plan includes email support with a one business-day response. Pro and Team plans add priority chat and a dedicated success contact.",
	},
];

export function Faq({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<Card className={cn(className)} {...props}>
			<CardHeader>
				<CardTitle>FAQ</CardTitle>
				<CardDescription>Answers to common questions.</CardDescription>
			</CardHeader>
			<CardContent>
				<Accordion defaultExpandedKeys={["billing"]} className="w-full min-w-0">
					{faqs.map((faq) => (
						<Disclosure key={faq.id} id={faq.id}>
							<DisclosureTrigger className="text-left text-sm">{faq.question}</DisclosureTrigger>
							<DisclosurePanel className="text-sm text-fg-muted">{faq.answer}</DisclosurePanel>
						</Disclosure>
					))}
				</Accordion>
			</CardContent>
			<CardFooter className="justify-between gap-2">
				<p className="min-w-0 text-sm text-fg-muted">Still need help?</p>
				<a href="#" className="shrink-0 text-sm text-fg-accent underline underline-offset-4">
					Contact support
				</a>
			</CardFooter>
		</Card>
	);
}
