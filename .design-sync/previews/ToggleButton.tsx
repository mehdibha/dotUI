import { BoldIcon, ItalicIcon, PinIcon, StarIcon } from 'lucide-react'
import { ToggleButton } from 'www'

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
}

export const States = () => (
  <div style={row}>
    <ToggleButton>
      <StarIcon data-icon-start="" />
      Off
    </ToggleButton>
    <ToggleButton defaultSelected>
      <StarIcon data-icon-start="" />
      On
    </ToggleButton>
  </div>
)

export const Variants = () => (
  <div style={row}>
    <ToggleButton variant="default" defaultSelected>
      Default
    </ToggleButton>
    <ToggleButton variant="primary" defaultSelected>
      Primary
    </ToggleButton>
    <ToggleButton variant="quiet" defaultSelected>
      Quiet
    </ToggleButton>
  </div>
)

export const Sizes = () => (
  <div style={row}>
    {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
      <ToggleButton key={size} size={size} defaultSelected>
        <BoldIcon data-icon-start="" />
        {size}
      </ToggleButton>
    ))}
  </div>
)

export const IconOnly = () => (
  <div style={row}>
    <ToggleButton isIconOnly aria-label="Pin">
      <PinIcon />
    </ToggleButton>
    <ToggleButton isIconOnly defaultSelected aria-label="Bold">
      <BoldIcon />
    </ToggleButton>
    <ToggleButton isIconOnly defaultSelected aria-label="Italic">
      <ItalicIcon />
    </ToggleButton>
  </div>
)

export const Disabled = () => (
  <div style={row}>
    <ToggleButton isDisabled>
      <PinIcon data-icon-start="" />
      Disabled
    </ToggleButton>
    <ToggleButton isDisabled defaultSelected>
      <PinIcon data-icon-start="" />
      Disabled
    </ToggleButton>
  </div>
)
