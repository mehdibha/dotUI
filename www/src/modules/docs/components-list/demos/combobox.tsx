import { ChevronDownIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Field, Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"

import { DemoState } from "../demo-state"
import { OverlayPreview } from "../overlay"

// An open combobox: the field is focused, the trigger button held pressed and
// the first suggestion highlighted.
export function ComboboxDemo() {
  return (
    <DemoState
      states={{
        "[data-input-control]": ["data-focused"],
        "[data-button]": ["data-pressed"],
        "[data-listbox-item]:first-of-type": [
          "data-hovered",
          "data-focused",
          "data-focus-visible",
        ],
      }}
    >
      <OverlayPreview
        variant="menu"
        surfaceClassName="w-full max-w-[11.5rem] p-0"
        trigger={
          <Field className="w-full max-w-[11.5rem]">
            <Label>Country</Label>
            <InputGroup>
              <Input placeholder="Search countries..." />
              <InputGroupAddon>
                <Button variant="quiet" isIconOnly>
                  <ChevronDownIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        }
      >
        <ListBox
          aria-label="Country"
          className="border-0 bg-transparent shadow-none"
        >
          <ListBoxItem id="us">United States</ListBoxItem>
          <ListBoxItem id="uk">United Kingdom</ListBoxItem>
          <ListBoxItem id="france">France</ListBoxItem>
          <ListBoxItem id="germany">Germany</ListBoxItem>
        </ListBox>
      </OverlayPreview>
    </DemoState>
  )
}
