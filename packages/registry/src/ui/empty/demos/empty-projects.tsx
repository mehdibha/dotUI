import { FolderCodeIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@dotui/registry/ui/empty";

export default function EmptyProjects() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<FolderCodeIcon />
				</EmptyMedia>
			</EmptyHeader>
			<EmptyTitle>No Projects Yet</EmptyTitle>
			<EmptyDescription>
				You haven't created any projects yet. Get started by creating your first project.
			</EmptyDescription>
			<EmptyContent>
				<Button>Create Project</Button>
			</EmptyContent>
		</Empty>
	);
}
