"use client";

import { Button } from "@/registry/ui/button";
import { FileTrigger, type FileTriggerProps } from "@/registry/ui/file-trigger";

export default function Demo({ allowsMultiple = false }: FileTriggerProps = {}) {
	return (
		<FileTrigger allowsMultiple={allowsMultiple}>
			<Button>Upload File</Button>
		</FileTrigger>
	);
}
