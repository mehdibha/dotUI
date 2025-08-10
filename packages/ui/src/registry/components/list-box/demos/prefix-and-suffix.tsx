import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { CopyIcon, PlusSquareIcon, SquarePenIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <ListBox aria-label="Framework" className="w-60">
      <ListBoxItem
        label="New file"
        description="Create a new file"
        prefix={<PlusSquareIcon />}
      />
      <ListBoxItem
        label="Copy link"
        description="Copy the file link"
        prefix={<CopyIcon />}
      />
      <ListBoxItem
        label="Edit file"
        description="Allows you to edit the file"
        prefix={<SquarePenIcon />}
      />
    </ListBox>
  );
}
