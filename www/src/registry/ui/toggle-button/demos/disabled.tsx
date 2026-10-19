import { PinIcon } from "@/registry/icons"
import { ToggleButton } from "@/registry/ui/toggle-button"

export default function Demo() {
  return (
    <ToggleButton isDisabled>
      <PinIcon data-icon="inline-start" className="rotate-45" />
      Pin
    </ToggleButton>
  )
}
