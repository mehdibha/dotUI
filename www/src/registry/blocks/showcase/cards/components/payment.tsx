"use client";

import { useState } from "react";

import { CreditCardIcon, LockIcon } from "lucide-react";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Description, FieldContent, FieldGroup, Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Radio, RadioControl, RadioGroup, RadioIndicator } from "@/registry/ui/radio-group";
import { TextField } from "@/registry/ui/text-field";

const plans = {
	monthly: { cta: "Pay $19" },
	yearly: { cta: "Pay $180" },
} as const;

export function Payment({ className, ...props }: React.ComponentProps<"div">) {
	const [plan, setPlan] = useState<keyof typeof plans>("yearly");

	return (
		<Card className={cn(className)} {...props}>
			<CardHeader>
				<CardTitle>Payment details</CardTitle>
				<CardDescription>Pick a plan and enter your card.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<RadioGroup aria-label="Billing plan" value={plan} onChange={(value) => setPlan(value as keyof typeof plans)}>
					<FieldGroup>
						<Radio value="monthly">
							<RadioControl>
								<RadioIndicator />
								<FieldContent>
									<Label>Monthly</Label>
									<Description>Billed every month</Description>
								</FieldContent>
								<span className="ml-auto text-sm font-medium">
									$19<span className="text-fg-muted">/mo</span>
								</span>
							</RadioControl>
						</Radio>
						<Radio value="yearly">
							<RadioControl>
								<RadioIndicator />
								<FieldContent>
									<Label>Yearly</Label>
									<Description>Save 20% · billed annually</Description>
								</FieldContent>
								<span className="ml-auto text-sm font-medium">
									$180<span className="text-fg-muted">/yr</span>
								</span>
							</RadioControl>
						</Radio>
					</FieldGroup>
				</RadioGroup>
				<TextField defaultValue="4242 4242 4242 4242">
					<Label>Card number</Label>
					<InputGroup>
						<InputGroupAddon>
							<CreditCardIcon />
						</InputGroupAddon>
						<Input inputMode="numeric" />
					</InputGroup>
				</TextField>
				<div className="grid grid-cols-2 gap-3">
					<TextField defaultValue="04/28">
						<Label>Expiry</Label>
						<Input placeholder="MM/YY" />
					</TextField>
					<TextField defaultValue="123">
						<Label>CVC</Label>
						<InputGroup>
							<Input inputMode="numeric" />
							<InputGroupAddon>
								<LockIcon />
							</InputGroupAddon>
						</InputGroup>
					</TextField>
				</div>
				<TextField defaultValue="Jane Cooper">
					<Label>Name on card</Label>
					<Input />
				</TextField>
				<TextField>
					<Label>Promo code</Label>
					<InputGroup>
						<Input placeholder="Enter code" />
						<InputGroupAddon>
							<Button variant="quiet">Apply</Button>
						</InputGroupAddon>
					</InputGroup>
				</TextField>
			</CardContent>
			<CardFooter>
				<Button variant="primary" className="w-full">
					<LockIcon />
					{plans[plan].cta}
				</Button>
			</CardFooter>
		</Card>
	);
}
