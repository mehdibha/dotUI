import { PinIcon } from '@/registry/__generated__/icons'
import { ToggleButton } from '@/registry/ui/toggle-button'

const sizes = ['xs', 'sm', 'md', 'lg'] as const

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <ToggleButton key={size} size={size} isIconOnly aria-label="Toggle pin">
          <PinIcon className="rotate-45" />
        </ToggleButton>
      ))}
    </div>
  )
}
