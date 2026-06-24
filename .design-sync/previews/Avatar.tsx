import { CheckIcon, PlusIcon } from 'lucide-react'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from 'www'

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }

const sizes = ['sm', 'md', 'lg'] as const

export const Sizes = () => (
  <div style={row}>
    {sizes.map((size) => (
      <Avatar key={size} size={size}>
        <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
        <AvatarFallback>MB</AvatarFallback>
      </Avatar>
    ))}
    {sizes.map((size) => (
      <Avatar key={`fb-${size}`} size={size}>
        <AvatarFallback>MB</AvatarFallback>
      </Avatar>
    ))}
  </div>
)

export const WithBadge = () => (
  <div style={row}>
    <Avatar size="lg">
      <AvatarImage src="https://github.com/jorgezreik.png" alt="@jorgezreik" />
      <AvatarFallback>JZ</AvatarFallback>
      <AvatarBadge />
    </Avatar>
    <Avatar size="lg">
      <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
      <AvatarFallback>PP</AvatarFallback>
      <AvatarBadge>
        <CheckIcon />
      </AvatarBadge>
    </Avatar>
    <Avatar size="lg">
      <AvatarFallback>PP</AvatarFallback>
      <AvatarBadge>
        <PlusIcon />
      </AvatarBadge>
    </Avatar>
  </div>
)

export const Group = () => (
  <div style={{ ...row, gap: 24 }}>
    <AvatarGroup size="md">
      <Avatar>
        <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
        <AvatarFallback>MB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <AvatarFallback>ML</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
    <AvatarGroup size="lg">
      <Avatar>
        <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
        <AvatarFallback>MB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <AvatarFallback>ML</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>
        <PlusIcon />
      </AvatarGroupCount>
    </AvatarGroup>
  </div>
)
