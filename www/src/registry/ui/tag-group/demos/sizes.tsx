import { Label } from "@/registry/ui/field";
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group";

const tags = ["News", "Travel", "Gaming", "Shopping"];

export default function Demo() {
	return (
		<>
			<TagGroup size="sm">
				<Label>Small</Label>
				<TagList>
					{tags.map((tag) => (
						<Tag key={tag}>{tag}</Tag>
					))}
				</TagList>
			</TagGroup>
			<TagGroup size="md">
				<Label>Medium</Label>
				<TagList>
					{tags.map((tag) => (
						<Tag key={tag}>{tag}</Tag>
					))}
				</TagList>
			</TagGroup>
			<TagGroup size="lg">
				<Label>Large</Label>
				<TagList>
					{tags.map((tag) => (
						<Tag key={tag}>{tag}</Tag>
					))}
				</TagList>
			</TagGroup>
		</>
	);
}
