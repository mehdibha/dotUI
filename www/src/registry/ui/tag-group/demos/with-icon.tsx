import { BookmarkIcon, FlameIcon, SparklesIcon, TagIcon } from "lucide-react";

import { Label } from "@/registry/ui/field";
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group";

export default function Demo() {
	return (
		<TagGroup>
			<Label>Topics</Label>
			<TagList>
				<Tag>
					<TagIcon /> General
				</Tag>
				<Tag>
					<FlameIcon /> Trending
				</Tag>
				<Tag>
					<SparklesIcon /> New
				</Tag>
				<Tag>
					<BookmarkIcon /> Saved
				</Tag>
			</TagList>
		</TagGroup>
	);
}
