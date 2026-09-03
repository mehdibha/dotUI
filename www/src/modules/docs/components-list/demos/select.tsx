import { ChevronDownIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"

import { Surface } from "../overlay"

export function SelectDemo() {
  return (
    <div className="flex w-44 flex-col gap-2">
      <Button className="w-full justify-between font-normal">
        Perplexity
        <ChevronDownIcon className="ml-auto text-fg-muted" />
      </Button>
      <Surface variant="menu" className="w-full p-0">
        <ListBox
          aria-label="Provider"
          selectionMode="single"
          defaultSelectedKeys={["perplexity"]}
          className="border-0 bg-transparent shadow-none"
        >
          <ListBoxItem id="perplexity">Perplexity</ListBoxItem>
          <ListBoxItem id="replicate">Replicate</ListBoxItem>
          <ListBoxItem id="together">Together AI</ListBoxItem>
        </ListBox>
      </Surface>
    </div>
  )
}
