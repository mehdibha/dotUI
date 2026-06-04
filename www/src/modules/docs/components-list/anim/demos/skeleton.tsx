"use client";

import { useState } from "react";

import { Avatar, AvatarFallback } from "@/registry/ui/avatar";
import { Skeleton } from "@/registry/ui/skeleton";

import { AnimatedPreview } from "../animated-preview";

// Display-only: no cursor. Loops loading placeholders, then reveals the real content.
export default function Demo() {
	const [isLoading, setLoading] = useState(true);
	return (
		<AnimatedPreview
			reset={() => setLoading(true)}
			script={async (s) => {
				await s.wait(1400);
				await s.do(() => setLoading(false));
				await s.wait(1800);
			}}
		>
			{() => (
				<Skeleton isLoading={isLoading}>
					<div className="flex items-center gap-4">
						<Avatar size="lg">
							<AvatarFallback>DU</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<div data-card-title="" className="h-4 w-32 text-sm font-medium">
								Mehdi Ben Hadj Ali
							</div>
							<div data-card-description="" className="h-4 w-24 text-sm text-fg-muted">
								Product designer
							</div>
						</div>
					</div>
				</Skeleton>
			)}
		</AnimatedPreview>
	);
}
