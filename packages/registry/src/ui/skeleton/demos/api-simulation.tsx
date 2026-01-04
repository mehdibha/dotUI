"use client";

import React from "react";

import { Button } from "@dotui/registry/ui/button";

export default function Demo() {
	const [status, setStatus] = React.useState<"idle" | "pending" | "error" | "success">("idle");
	const apiCall = () => {
		setStatus("pending");
		setTimeout(() => {
			setStatus("success");
		}, 4000);
	};
	return (
		<div className="flex flex-col items-center gap-4">
			<Button isPending={status === "pending"} onPress={apiCall}>
				Simulate API Call
			</Button>
			{/* <Skeleton show={status === "pending"}>
        <p>Some text loaded from API.</p>
      </Skeleton> */}
		</div>
	);
}
