import { Label } from "@dotui/registry/ui/field";
import { Tag, TagGroup, TagList } from "@dotui/registry/ui/tag-group";

export default function Demo() {
  return (
    <TagGroup>
      <Label></Label>
      <TagList>
        <Tag>Tag 1</Tag>
        <Tag>Tag 2</Tag>
        <Tag>Tag 3</Tag>
      </TagList>
    </TagGroup>
  );
}
