"use client";

import { useState } from "react";

import { LockIcon } from "lucide-react";

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

const inputClassName = "h-9 min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted";

// Each segment of the joined card field: lifts above the dividers and shows its
// own focus ring on focus, instead of ringing the whole group.
const segmentClassName =
	"relative flex items-center px-3 focus-within:z-10 focus-within:rounded-(--input-radius) focus-within:border-transparent focus-within:bg-field focus-within:ring-2 focus-within:ring-border-focus";

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
							<CardBrands />
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

// Small card-brand chips shown at the end of the card-number field.
function BrandChip({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<span
			className={cn(
				"flex h-4 w-[26px] items-center justify-center rounded-[3px] bg-white ring-1 ring-black/5",
				className,
			)}
		>
			{children}
		</span>
	);
}

function CardBrands() {
	return (
		<span className="flex shrink-0 items-center gap-1" aria-hidden="true">
			<BrandChip>
				<span className="text-[8px] leading-none font-bold tracking-tight text-[#1434cb] italic">VISA</span>
			</BrandChip>
			<BrandChip>
				<svg viewBox="0 0 24 16" className="h-2.5 w-auto">
					<circle cx="10" cy="8" r="5" fill="#eb001b" />
					<circle cx="14" cy="8" r="5" fill="#f79e1b" fillOpacity="0.9" />
				</svg>
			</BrandChip>
			<BrandChip className="bg-[#1f72cd] ring-0">
				<span className="text-[6px] leading-none font-bold tracking-tight text-white">AMEX</span>
			</BrandChip>
			<BrandChip>
				<span className="text-[8px] leading-none font-bold">
					<span className="text-[#0e4c96]">J</span>
					<span className="text-[#d1131a]">C</span>
					<span className="text-[#007b40]">B</span>
				</span>
			</BrandChip>
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
