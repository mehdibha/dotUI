import { Button } from "@dotui/registry/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

export function ListBoxAndMenu() {
  return (
    <Section
      name="list-box-and-menu"
      title="ListBox and menu"
      variants={getComponentVariants("list-box")}
      previewClassName="gap-4"
    >
      <ListBox aria-label="Basic list box">
        <ListBoxItem>Next.js</ListBoxItem>
        <ListBoxItem>Remix</ListBoxItem>
        <ListBoxItem>Astro</ListBoxItem>
        <ListBoxItem>Gatsby</ListBoxItem>
      </ListBox>
      <div className="flex flex-col gap-2">
        <Select className="w-48" aria-label="Basic select" form="none">
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="option-1">Option 1</SelectItem>
            <SelectItem id="option-2">Option 2</SelectItem>
            <SelectItem id="option-3">Option 3</SelectItem>
          </SelectContent>
        </Select>
        <Combobox aria-label="Country" form="none">
          <ComboboxInput />
          <ComboboxContent>
            <ComboboxItem>Canada</ComboboxItem>
            <ComboboxItem>France</ComboboxItem>
            <ComboboxItem>Germany</ComboboxItem>
            <ComboboxItem>Spain</ComboboxItem>
            <ComboboxItem>Tunisia</ComboboxItem>
            <ComboboxItem>United states</ComboboxItem>
            <ComboboxItem>United Kingdom</ComboboxItem>
          </ComboboxContent>
        </Combobox>
      </div>
      <Menu aria-label="Basic menu">
        <Button>Menu</Button>
        <Popover>
          <MenuContent>
            <MenuItem>Account settings</MenuItem>
            <MenuItem>Create team</MenuItem>
            <MenuItem>Command menu</MenuItem>
            <MenuItem>Log out</MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
    </Section>
  );
}
