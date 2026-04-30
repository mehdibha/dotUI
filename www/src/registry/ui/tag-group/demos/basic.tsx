import { Label } from "@/registry/ui/field";
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group";

export default function Demo() {
	return (
		<TagGroup>
			<Label>Categories</Label>
			<TagList>
				<Tag>News</Tag>
				<Tag>Travel</Tag>
				<Tag>Gaming</Tag>
				<Tag>Shopping</Tag>
			</TagList>
		</TagGroup>
	);
}
