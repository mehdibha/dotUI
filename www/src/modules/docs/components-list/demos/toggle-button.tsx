import { BookmarkIcon, PinIcon } from "@/registry/__generated__/icons"
import { ToggleButton } from "@/registry/ui/toggle-button"

export function ToggleButtonDemo() {
  return (
    <div className="flex items-center gap-3">
      <ToggleButton defaultSelected isIconOnly aria-label="Pin">
        <PinIcon />
      </ToggleButton>
      <ToggleButton isIconOnly aria-label="Bookmark">
        <BookmarkIcon />
      </ToggleButton>
    </div>
  )
}
