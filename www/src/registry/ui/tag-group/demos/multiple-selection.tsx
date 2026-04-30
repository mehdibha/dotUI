import { Label } from "@/registry/ui/field";
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group";

export default function Demo() {
	return (
		<TagGroup selectionMode="multiple" defaultSelectedKeys={["news", "gaming"]}>
			<Label>Categories</Label>
			<TagList>
				<Tag id="news">News</Tag>
				<Tag id="travel">Travel</Tag>
				<Tag id="gaming">Gaming</Tag>
				<Tag id="shopping">Shopping</Tag>
			</TagList>
		</TagGroup>
	);
}
