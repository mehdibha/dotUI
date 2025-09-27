import { Button } from "@dotui/ui/components/button";
import { Combobox, ComboboxItem } from "@dotui/ui/components/combobox";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Select, SelectItem } from "@dotui/ui/components/select";

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
          <SelectItem id="option-1">Option 1</SelectItem>
          <SelectItem id="option-2">Option 2</SelectItem>
          <SelectItem id="option-3">Option 3</SelectItem>
        </Select>
        <Combobox aria-label="Country" form="none">
          <ComboboxItem>Canada</ComboboxItem>
          <ComboboxItem>France</ComboboxItem>
          <ComboboxItem>Germany</ComboboxItem>
          <ComboboxItem>Spain</ComboboxItem>
          <ComboboxItem>Tunisia</ComboboxItem>
          <ComboboxItem>United states</ComboboxItem>
          <ComboboxItem>United Kingdom</ComboboxItem>
        </Combobox>
      </div>
      <MenuRoot aria-label="Basic menu">
        <Button>Menu</Button>
        <Menu>
          <MenuItem>Account settings</MenuItem>
          <MenuItem>Create team</MenuItem>
          <MenuItem>Command menu</MenuItem>
          <MenuItem>Log out</MenuItem>
        </Menu>
      </MenuRoot>
    </Section>
  );
}
