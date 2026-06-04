"use client";

import { useState } from "react";

import { CheckCircle2Icon } from "@/registry/__generated__/icons";
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert";

import { AnimatedPreview } from "../animated-preview";

// Display-only: no cursor. The alert subtly slides + fades in each loop.
export default function Demo() {
	const [shown, setShown] = useState(false);
	return (
		<AnimatedPreview
			reset={() => setShown(false)}
			script={async (s) => {
				await s.wait(250);
				await s.do(() => setShown(true));
				await s.wait(3200);
			}}
		>
			{() => (
				<div
					className="w-64 transition-all duration-500 ease-out"
					style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(8px)" }}
				>
					<Alert variant="success">
						<CheckCircle2Icon />
						<AlertTitle>Changes saved</AlertTitle>
						<AlertDescription>Your update is now live.</AlertDescription>
					</Alert>
				</div>
			)}
		</AnimatedPreview>
	);
}
