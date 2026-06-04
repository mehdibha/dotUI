"use client";

import { useEffect, useState } from "react";

import { CalculatorIcon, CalendarIcon, SettingsIcon, SmileIcon } from "lucide-react";

import { Card } from "@/registry/ui/card";
import {
	Command,
	CommandContent,
	CommandInput,
	CommandItem,
	CommandSection,
	CommandSectionHeader,
} from "@/registry/ui/command";
import { Kbd } from "@/registry/ui/kbd";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	// The command palette is an Autocomplete + ListBox; that collection throws during
	// SSR (`selectionManager` null), which would blank the page. Render it only after
	// mount and show a lightweight placeholder until then. The script always runs
	// client-side (after the card is on-screen), so the cursor target exists by then.
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<AnimatedPreview
			script={async (s) => {
				await s.wait(700);
				await s.hover("input", { dwell: 1100 });
				await s.wait(500);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<Card className="w-[260px] p-0">
					{mounted ? (
						<Command aria-label="Command menu">
							<span ref={ref("input")} className="block">
								<CommandInput placeholder="Type a command..." />
							</span>
							<CommandContent aria-label="Commands">
								<CommandSection>
									<CommandSectionHeader>Suggestions</CommandSectionHeader>
									<CommandItem textValue="Calendar">
										<CalendarIcon />
										<span>Calendar</span>
									</CommandItem>
									<CommandItem textValue="Search Emoji">
										<SmileIcon />
										<span>Search Emoji</span>
									</CommandItem>
									<CommandItem textValue="Calculator">
										<CalculatorIcon />
										<span>Calculator</span>
										<Kbd>⌘K</Kbd>
									</CommandItem>
									<CommandItem textValue="Settings">
										<SettingsIcon />
										<span>Settings</span>
									</CommandItem>
								</CommandSection>
							</CommandContent>
						</Command>
					) : (
						<div className="flex flex-col gap-2 p-1.5" aria-hidden="true">
							<div className="h-8 rounded-sm border bg-muted" />
							<div className="space-y-1.5 px-1">
								<div className="h-3 w-20 rounded bg-muted" />
								<div className="h-3 w-28 rounded bg-muted" />
								<div className="h-3 w-24 rounded bg-muted" />
							</div>
						</div>
					)}
				</Card>
			)}
		</AnimatedPreview>
	);
}
