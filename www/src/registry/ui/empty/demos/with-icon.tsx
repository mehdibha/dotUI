import { FolderIcon, PlusIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/registry/ui/empty";

export default function Demo() {
	return (
		<Empty className="border">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<FolderIcon />
				</EmptyMedia>
				<EmptyTitle>Nothing to see here</EmptyTitle>
				<EmptyDescription>
					No posts have been created yet. Get started by <a href="#">creating your first post</a>.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button variant="default">
					<PlusIcon />
					New Post
				</Button>
			</EmptyContent>
		</Empty>
	);
}
