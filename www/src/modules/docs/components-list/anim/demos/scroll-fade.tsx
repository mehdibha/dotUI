"use client";

import { useRef } from "react";

import { ScrollFade } from "@/registry/ui/scroll-fade";

import { AnimatedPreview } from "../animated-preview";

const items = ["Inbox", "Drafts", "Sent", "Archive", "Spam", "Trash", "Starred", "Snoozed", "Important", "All mail"];

export default function Demo() {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollTo = async (s: { wait: (ms: number) => Promise<void> }, target: number, steps = 24) => {
		const el = scrollRef.current;
		if (!el) return;
		const start = el.scrollTop;
		for (let i = 1; i <= steps; i++) {
			el.scrollTop = start + (target - start) * (i / steps);
			await s.wait(16);
		}
	};

	return (
		<AnimatedPreview
			reset={() => {
				if (scrollRef.current) scrollRef.current.scrollTop = 0;
			}}
			script={async (s) => {
				await s.moveOff();
				await s.wait(700);
				const el = scrollRef.current;
				const max = el ? el.scrollHeight - el.clientHeight : 0;
				await scrollTo(s, max);
				await s.wait(900);
				await scrollTo(s, 0);
				await s.wait(700);
			}}
		>
			{() => (
				<ScrollFade ref={scrollRef} className="h-32 w-44 rounded-lg border bg-bg p-2">
					<div className="space-y-1.5">
						{items.map((item) => (
							<div key={item} className="rounded-md bg-muted px-3 py-1.5 text-sm">
								{item}
							</div>
						))}
					</div>
				</ScrollFade>
			)}
		</AnimatedPreview>
	);
}
