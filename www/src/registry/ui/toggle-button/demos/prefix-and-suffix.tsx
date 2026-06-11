import { PinIcon } from '@/registry/__generated__/icons'
import { ToggleButton } from '@/registry/ui/toggle-button'

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <ToggleButton>
        <PinIcon data-icon-start="" className="rotate-45" />
        Pin
      </ToggleButton>
      <ToggleButton>
        Pin
        <PinIcon data-icon-end="" className="rotate-45" />
      </ToggleButton>
    </div>
  )
}
