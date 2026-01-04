"use client";

import * as React from "react";

import { RotateCwIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { ProgressBar, ProgressBarControl } from "@dotui/registry/ui/progress-bar";

export default function Demo() {
	const [key, setKey] = React.useState(0);
	const restart = () => setKey((prev) => prev + 1);
	return (
		<div className="flex w-full flex-col items-center gap-6">
			<Button onPress={restart}>
				<RotateCwIcon />
				Restart animation
			</Button>
			<ProgressBar aria-label="Loading">
				<ProgressBarControl key={key} duration="30s" />
			</ProgressBar>
		</div>
	);
}
