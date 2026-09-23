import { Combobox, ComboboxTrigger } from "@/registry/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Popover } from "@/registry/ui/popover"

export default function Demo() {
  return (
    <Combobox className="w-52" aria-label="Animal">
      <InputGroup>
        <Input />
        <InputGroupAddon>
          <ComboboxTrigger />
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <ListBox isLoading>
          <ListBoxItem>Red Panda</ListBoxItem>
          <ListBoxItem>Cat</ListBoxItem>
          <ListBoxItem>Dog</ListBoxItem>
          <ListBoxItem>Aardvark</ListBoxItem>
          <ListBoxItem>Kangaroo</ListBoxItem>
          <ListBoxItem>Snake</ListBoxItem>
        </ListBox>
      </Popover>
    </Combobox>
  )
}
