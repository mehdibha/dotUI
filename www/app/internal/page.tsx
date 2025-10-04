// "use client";

// import { ChevronsUpDownIcon } from "@dotui/registry/icons";
import { Select, SelectItem } from "@dotui/registry/ui/select";

export default function InternalPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Select defaultValue="item-1">
        <SelectItem id="item-1">Item 1</SelectItem>
        <SelectItem id="item-2">Item 2</SelectItem>
        <SelectItem id="item-3">Item 3</SelectItem>
      </Select>
      {/* <Select.Root defaultValue="item-1">
        <Select.Button suffix={<ChevronsUpDownIcon />}>
          <Select.Value />
        </Select.Button>
        <Select.Overlay type="popover">
          <Select.ListBox>
            <Select.Item id="item-1">Item 1</Select.Item>
            <Select.Item id="item-2">Item 2</Select.Item>
            <Select.Item id="item-3">Item 3</Select.Item>
          </Select.ListBox>
        </Select.Overlay>
      </Select.Root> */}
    </div>
  );
}
