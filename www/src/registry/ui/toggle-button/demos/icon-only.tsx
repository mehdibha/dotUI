import { PinIcon } from "@/registry/icons"
import { ToggleButton } from "@/registry/ui/toggle-button"

export default function Demo() {
  return (
    <ToggleButton isIconOnly aria-label="Pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  )
}
