import { SquarePenIcon, PlusSquareIcon, CopyIcon } from "@/__icons__";
import { ListBox, Item } from "@/registry/ui/default/core/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Framework" className="w-60">
      <Item
        label="New file"
        description="Create a new file"
        prefix={<PlusSquareIcon />}
      />
      <Item
        label="Copy link"
        description="Copy the file link"
        prefix={<CopyIcon />}
      />
      <Item
        label="Edit file"
        description="Allows you to edit the file"
        prefix={<SquarePenIcon />}
      />
    </ListBox>
  );
}
