"use client";

import React from "react";

import { UploadIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { FileTrigger } from "@dotui/registry/ui/file-trigger";

export default function Demo() {
	const [files, setFiles] = React.useState<string[] | null>(null);
	return (
		<div className="flex flex-col items-center gap-4">
			<FileTrigger
				acceptDirectory
				onSelect={(e) => {
					if (e) {
						const files = Array.from(e);
						const filenames = files.map((file) => file.name);
						setFiles(filenames);
					}
				}}
			>
				<Button>
					<UploadIcon /> Upload a directory
				</Button>
			</FileTrigger>
			{files && (
				<ul>
					{files.map((file, index) => (
						<li key={index}>{file}</li>
					))}
				</ul>
			)}
		</div>
	);
}
