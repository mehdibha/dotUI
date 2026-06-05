"use client";

import { useState } from "react";

import { CreditCardIcon, LockIcon } from "lucide-react";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";
import { TextField } from "@/registry/ui/text-field";

const providers = [
	{ id: "visa", label: "Visa", logo: <VisaMark /> },
	{ id: "mastercard", label: "Mastercard", logo: <MastercardMark /> },
	{ id: "amex", label: "American Express", logo: <AmexMark /> },
];

const inputClassName = "h-9 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted";

export function Payment({ className, ...props }: React.ComponentProps<"div">) {
	const [provider, setProvider] = useState("visa");

	return (
		<Card className={cn(className)} {...props}>
			<CardHeader>
				<CardTitle>Payment details</CardTitle>
				<CardDescription>Choose a method and enter your card.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<RadioGroup
					aria-label="Payment method"
					value={provider}
					onChange={setProvider}
					className="grid grid-cols-3 gap-2"
				>
					{providers.map((p) => (
						<Radio key={p.id} value={p.id} className="items-stretch">
							<RadioControl className="h-full flex-col justify-center gap-2 px-2 py-4">
								{p.logo}
								<Label className="sr-only">{p.label}</Label>
							</RadioControl>
						</Radio>
					))}
				</RadioGroup>

				<div role="group" aria-label="Card information" className="space-y-1.5">
					<Label>Card information</Label>
					{/* Joined field: card number on top, expiry / CVC below, sharing one
					    border with gap-0 dividers — the Stripe-style combined card input. */}
					<div className="divide-y divide-border-field overflow-hidden rounded-(--input-radius) border border-border-field bg-field transition-[box-shadow,border-color] focus-within:border-border-focus focus-within:ring-2 focus-within:ring-border-focus-muted">
						<div className="flex items-center gap-2 px-3">
							<CreditCardIcon className="size-4 shrink-0 text-fg-muted" />
							<input
								aria-label="Card number"
								inputMode="numeric"
								defaultValue="4242 4242 4242 4242"
								className={inputClassName}
							/>
						</div>
						<div className="grid grid-cols-2 divide-x divide-border-field">
							<input
								aria-label="Expiry"
								placeholder="MM / YY"
								defaultValue="04 / 28"
								className={cn(inputClassName, "px-3")}
							/>
							<div className="flex items-center gap-2 px-3">
								<input
									aria-label="CVC"
									inputMode="numeric"
									placeholder="CVC"
									defaultValue="123"
									className={inputClassName}
								/>
								<LockIcon className="size-4 shrink-0 text-fg-muted" />
							</div>
						</div>
					</div>
				</div>

				<TextField defaultValue="Jane Cooper">
					<Label>Name on card</Label>
					<Input />
				</TextField>
			</CardContent>
			<CardFooter>
				<Button variant="primary" className="w-full">
					<LockIcon />
					Pay $180
				</Button>
			</CardFooter>
		</Card>
	);
}

function VisaMark() {
	return <span className="text-base leading-none font-bold tracking-tight text-[#1a59ff] italic">VISA</span>;
}

function MastercardMark() {
	return (
		<svg viewBox="0 0 32 20" className="h-5 w-auto" aria-hidden="true">
			<circle cx="13" cy="10" r="7" fill="#eb001b" />
			<circle cx="19" cy="10" r="7" fill="#f79e1b" fillOpacity="0.9" />
		</svg>
	);
}

function AmexMark() {
	return (
		<span className="rounded-sm bg-[#1f72cd] px-1.5 py-1 text-[10px] leading-none font-bold tracking-wide text-white">
			AMEX
		</span>
	);
}
