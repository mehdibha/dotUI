"use client";

import { useState } from "react";

import { UploadIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { FileTrigger } from "@/registry/ui/file-trigger";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [pressed, setPressed] = useState(false);
	const [file, setFile] = useState<string | null>(null);
	return (
		<AnimatedPreview
			reset={() => {
				setPressed(false);
				setFile(null);
			}}
			script={async (s) => {
				await s.wait(500);
				await s.click("trigger", () => {
					setPressed(true);
					setTimeout(() => setPressed(false), 160);
					setFile("report.pdf");
				});
				await s.wait(1700);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<div className="flex flex-col items-center gap-3">
					<span
						ref={ref("trigger")}
						className="inline-block transition-transform"
						style={{ scale: pressed ? 0.94 : 1 }}
					>
						<FileTrigger
							onSelect={(e) => {
								if (e) {
									const name = Array.from(e)[0]?.name;
									if (name) setFile(name);
								}
							}}
						>
							<Button>
								<UploadIcon /> Upload
							</Button>
						</FileTrigger>
					</span>
					{file && (
						<p className="text-sm text-fg-muted">
							Selected <span className="font-medium text-fg">{file}</span>
						</p>
					)}
				</div>
			)}
		</AnimatedPreview>
	);
}
