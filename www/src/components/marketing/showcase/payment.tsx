"use client";

import { useState } from "react";

import { BitcoinIcon, CreditCardIcon, LockIcon } from "lucide-react";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";
import { TextField } from "@/registry/ui/text-field";

const methods = [
	{ id: "card", label: "Card", icon: CreditCardIcon },
	{ id: "crypto", label: "Crypto", icon: BitcoinIcon },
];

const inputClassName = "h-9 min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted";

// Each segment of the joined card field: lifts above the dividers and shows its
// own focus ring on focus, instead of ringing the whole group.
const segmentClassName =
	"relative flex items-center px-3 focus-within:z-10 focus-within:rounded-(--input-radius) focus-within:border-transparent focus-within:bg-field focus-within:ring-2 focus-within:ring-border-focus";

export function Payment({ className, ...props }: React.ComponentProps<"div">) {
	const [method, setMethod] = useState("card");

	return (
		<Card className={cn(className)} {...props}>
			<CardHeader>
				<CardTitle>Payment details</CardTitle>
				<CardDescription>Choose a method and enter your card.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<RadioGroup aria-label="Payment method" value={method} onChange={setMethod} className="grid grid-cols-2 gap-2">
					{methods.map((m) => (
						<Radio key={m.id} value={m.id} className="items-stretch">
							<RadioControl className="h-full items-center justify-center gap-2 px-3 py-3.5">
								<m.icon className="size-5 shrink-0" />
								<Label className="text-base">{m.label}</Label>
							</RadioControl>
						</Radio>
					))}
				</RadioGroup>

				<div role="group" aria-label="Card information" className="space-y-1.5">
					<Label>Card information</Label>
					{/* Joined field: card number on top, expiry / CVC below, sharing one
					    border with gap-0 dividers — the Stripe-style combined card input.
					    Each segment rings on its own focus (z-10 lifts it above the dividers)
					    rather than ringing the whole group. */}
					<div className="relative rounded-(--input-radius) border border-border-field bg-field text-fg">
						<label className={cn(segmentClassName, "gap-2 rounded-t-(--input-radius)")}>
							<input
								aria-label="Card number"
								inputMode="numeric"
								placeholder="1234 1234 1234 1234"
								defaultValue="4242 4242 4242 4242"
								className={inputClassName}
							/>
							<VisaAddon />
						</label>
						<div className="grid grid-cols-2">
							<label className={cn(segmentClassName, "rounded-bl-(--input-radius) border-t border-border-field")}>
								<input
									aria-label="Expiry"
									inputMode="numeric"
									placeholder="MM / YY"
									defaultValue="04 / 28"
									className={inputClassName}
								/>
							</label>
							<label
								className={cn(
									segmentClassName,
									"gap-2 rounded-br-(--input-radius) border-t border-l border-border-field",
								)}
							>
								<input
									aria-label="CVC"
									inputMode="numeric"
									placeholder="CVC"
									defaultValue="123"
									className={inputClassName}
								/>
								<CvcIcon />
							</label>
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

// Visa logo shown as a trailing addon in the card-number field.
function VisaAddon() {
	return (
		<span aria-hidden="true" className="flex h-4 shrink-0 items-center rounded-[3px] bg-white px-1 ring-1 ring-black/5">
			<span className="text-[8px] leading-none font-bold tracking-tight text-[#1434cb] italic">VISA</span>
		</span>
	);
}

// CVC hint: a card showing where the 3-digit code lives.
function CvcIcon() {
	return (
		<svg viewBox="0 0 24 18" aria-hidden="true" className="h-4.5 w-6 shrink-0 text-fg-muted">
			<rect x="1" y="1" width="22" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
			<rect x="1" y="4.5" width="22" height="3" fill="currentColor" fillOpacity="0.35" />
			<text x="20.5" y="14.5" textAnchor="end" fontSize="6.5" fontWeight="700" fill="currentColor">
				123
			</text>
		</svg>
	);
}
