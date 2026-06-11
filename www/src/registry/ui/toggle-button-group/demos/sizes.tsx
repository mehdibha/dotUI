import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from '@/registry/__generated__/icons'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

const sizes = ['xs', 'sm', 'md', 'lg'] as const

export default function Demo() {
  return (
    <>
      {sizes.map((size) => (
        <ToggleButtonGroup
          key={size}
          size={size}
          aria-label={`${size} text formatting`}
        >
          <ToggleButton id={`${size}-bold`} isIconOnly aria-label="Bold">
            <BoldIcon />
          </ToggleButton>
          <ToggleButton id={`${size}-italic`} isIconOnly aria-label="Italic">
            <ItalicIcon />
          </ToggleButton>
          <ToggleButton
            id={`${size}-underline`}
            isIconOnly
            aria-label="Underline"
          >
            <UnderlineIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      ))}
    </>
  )
}
