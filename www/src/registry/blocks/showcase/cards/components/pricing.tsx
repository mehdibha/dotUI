"use client";

import { useState } from "react";

import { CheckIcon } from "lucide-react";

import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

const features = ["Unlimited projects", "Advanced analytics", "Priority support", "Custom domains"];

export function Pricing(props: React.ComponentProps<"div">) {
	const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
	const isYearly = billing === "yearly";
	const price = isYearly ? 15 : 19;

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Pro</CardTitle>
				<CardDescription>Everything you need to scale your team.</CardDescription>
				<CardAction>
					<Badge variant="accent" appearance="subtle">
						Popular
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent className="space-y-4">
				<ToggleButtonGroup
					aria-label="Billing period"
					selectionMode="single"
					disallowEmptySelection
					size="sm"
					selectedKeys={[billing]}
					onSelectionChange={(keys) => {
						const next = [...keys][0];
						if (next) setBilling(next as "monthly" | "yearly");
					}}
					className="w-full"
				>
					<ToggleButton id="monthly" className="flex-1">
						Monthly
					</ToggleButton>
					<ToggleButton id="yearly" className="flex-1">
						Yearly
					</ToggleButton>
				</ToggleButtonGroup>
				<div>
					<div className="flex items-baseline gap-1">
						<span className="text-3xl font-semibold tracking-tight">${price}</span>
						<span className="text-fg-muted">/mo</span>
					</div>
					<p className="mt-1 text-xs text-fg-muted">
						{isYearly ? "Billed annually · save 20%" : "Billed monthly, cancel anytime"}
					</p>
				</div>
				<ul className="space-y-2">
					{features.map((feature) => (
						<li key={feature} className="flex items-center gap-2">
							<span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-accent-muted text-fg-accent">
								<CheckIcon className="size-3" />
							</span>
							<span>{feature}</span>
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter>
				<Button variant="primary" className="w-full">
					Upgrade to Pro
				</Button>
			</CardFooter>
		</Card>
	);
}
