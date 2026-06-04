"use client";

import { FolderCodeIcon } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/registry/ui/empty";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	return (
		<AnimatedPreview
			script={async (s) => {
				await s.moveOff();
				await s.wait(2400);
			}}
		>
			{() => (
				<Empty className="p-2">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<FolderCodeIcon />
						</EmptyMedia>
						<EmptyTitle>No projects yet</EmptyTitle>
						<EmptyDescription>Create your first project to get started.</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
		</AnimatedPreview>
	);
}
