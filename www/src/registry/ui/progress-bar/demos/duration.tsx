"use client";

import * as React from "react";

import { RotateCwIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar";

export default function Demo() {
	const [key, setKey] = React.useState(0);
	const restart = () => setKey((prev) => prev + 1);
	return (
		<div className="flex w-full flex-col items-center gap-6">
			<Button onPress={restart}>
				<RotateCwIcon />
				Restart animation
			</Button>
			<ProgressBar aria-label="Loading" isIndeterminate>
				<ProgressBarControl key={key} style={{ "--progress-duration": "30s" } as React.CSSProperties} />
			</ProgressBar>
		</div>
	);
}
