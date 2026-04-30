import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group";

export default function Demo() {
	return (
		<TagGroup aria-label="Sizes">
			<TagList>
				<Tag size="sm">Small</Tag>
				<Tag size="md">Medium</Tag>
				<Tag size="lg">Large</Tag>
			</TagList>
		</TagGroup>
	);
}
