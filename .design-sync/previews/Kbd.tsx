import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from 'lucide-react'
import { Kbd, KbdGroup } from 'www'

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
}

export const Basic = () => (
  <div style={row}>
    <Kbd>⌘</Kbd>
    <Kbd>K</Kbd>
    <Kbd>Esc</Kbd>
    <Kbd>Enter</Kbd>
  </div>
)

export const Shortcuts = () => (
  <div style={row}>
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  </div>
)

export const ArrowKeys = () => (
  <KbdGroup>
    <Kbd>
      <ArrowUpIcon />
    </Kbd>
    <Kbd>
      <ArrowDownIcon />
    </Kbd>
    <Kbd>
      <ArrowLeftIcon />
    </Kbd>
    <Kbd>
      <ArrowRightIcon />
    </Kbd>
  </KbdGroup>
)
