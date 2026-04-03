"use client";

import { Button } from "@/registry/ui/button";
import { FileTrigger } from "@/registry/ui/file-trigger";

interface FileTriggerPlaygroundProps {
	allowsMultiple?: boolean;
}

export function FileTriggerPlayground({ allowsMultiple = false }: FileTriggerPlaygroundProps) {
	return (
		<FileTrigger allowsMultiple={allowsMultiple}>
			<Button>Upload File</Button>
		</FileTrigger>
	);
}
