"use client";

import { DropZone, DropZoneLabel } from "@/registry/ui/drop-zone";

export default function Demo({ label = "Drop files here", isDisabled = false } = {}) {
	return <DropZone isDisabled={isDisabled}>{label && <DropZoneLabel>{label}</DropZoneLabel>}</DropZone>;
}
