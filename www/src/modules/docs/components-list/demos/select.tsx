import { ChevronDownIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"

import { OverlayPreview } from "../overlay"

export function SelectDemo() {
  return (
    <OverlayPreview
      variant="menu"
      surfaceClassName="w-full max-w-[11.5rem] p-0"
      trigger={
        <Button className="w-full max-w-[11.5rem] justify-between font-normal">
          Perplexity
          <ChevronDownIcon className="ml-auto text-fg-muted" />
        </Button>
      }
    >
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
    </OverlayPreview>
  )
}
