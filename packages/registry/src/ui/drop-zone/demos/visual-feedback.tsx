"use client";

import React from "react";

import { DropZone } from "@dotui/registry/ui/drop-zone";

export default function Demo() {
	const [dropped, setDropped] = React.useState(false);
	return (
		<DropZone
			getDropOperation={(types) => (types.has("image/png") ? "copy" : "cancel")}
			onDrop={() => setDropped(true)}
		>
			{dropped ? "Successful drop!" : "Drop files here"}
		</DropZone>
	);
}
