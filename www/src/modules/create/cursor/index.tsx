import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'

export const CURSOR_INTERACTIVE_VAR = '--cursor-interactive'
export const CURSOR_DISABLED_VAR = '--cursor-disabled'
export const DEFAULT_CURSOR_INTERACTIVE = 'default'
export const DEFAULT_CURSOR_DISABLED = 'not-allowed'

const cursorOptions = [
  { value: 'default', label: 'Default' },
  { value: 'pointer', label: 'Pointer' },
  { value: 'not-allowed', label: 'Not allowed' },
  { value: 'wait', label: 'Wait' },
  { value: 'help', label: 'Help' },
  { value: 'crosshair', label: 'Crosshair' },
  { value: 'text', label: 'Text' },
  { value: 'move', label: 'Move' },
  { value: 'grab', label: 'Grab' },
  { value: 'progress', label: 'Progress' },
]

interface CursorConfigProps {
  interactive: string
  disabled: string
  onChange: (paramName: string, value: string) => void
}

export function CursorConfig({
  interactive,
  disabled,
  onChange,
}: CursorConfigProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg-muted">Interactive</span>
        <CursorSelect
          value={interactive}
          onChange={(v) => onChange(CURSOR_INTERACTIVE_VAR, v)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg-muted">Disabled</span>
        <CursorSelect
          value={disabled}
          onChange={(v) => onChange(CURSOR_DISABLED_VAR, v)}
        />
      </div>
    </div>
  )
}

function CursorSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select
      selectedKey={value}
      onSelectionChange={(key) => onChange(key as string)}
    >
      <Button size="sm" className="w-full">
        <SelectValue />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {cursorOptions.map((opt) => (
            <ListBoxItem key={opt.value} id={opt.value}>
              {opt.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}
