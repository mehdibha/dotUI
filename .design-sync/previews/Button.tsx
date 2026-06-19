import { ArrowRightIcon, PlusIcon } from 'lucide-react'
import { Button } from 'www'

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
}

const variants = ['primary', 'default', 'quiet', 'link', 'danger', 'warning'] as const

export const Variants = () => (
  <div style={row}>
    {variants.map((v) => (
      <Button key={v} variant={v}>
        {v}
      </Button>
    ))}
  </div>
)

export const Sizes = () => (
  <div style={row}>
    {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
      <Button key={s} variant="primary" size={s}>
        Button {s}
      </Button>
    ))}
  </div>
)

export const WithIcons = () => (
  <div style={row}>
    <Button variant="primary">
      Continue
      <ArrowRightIcon data-icon-end="" />
    </Button>
    <Button variant="default">
      <PlusIcon data-icon-start="" />
      Add item
    </Button>
  </div>
)

export const IconOnly = () => (
  <div style={row}>
    {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
      <Button key={s} variant="default" size={s} isIconOnly aria-label="Add">
        <PlusIcon />
      </Button>
    ))}
  </div>
)

export const Disabled = () => (
  <div style={row}>
    <Button variant="primary" isDisabled>
      Primary
    </Button>
    <Button variant="default" isDisabled>
      Default
    </Button>
  </div>
)
