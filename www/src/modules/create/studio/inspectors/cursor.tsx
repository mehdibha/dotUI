'use client'

import { ChevronDownIcon, MousePointer2Icon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'

import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../../cursor'
import { Field, Section } from '../primitives'
import { useToken } from '../tokens'

const CURSORS = [
  'default',
  'pointer',
  'not-allowed',
  'wait',
  'progress',
  'text',
  'grab',
  'crosshair',
]

function CursorSelect({
  value,
  onChange,
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  ariaLabel: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Select
        className="flex-1"
        selectedKey={value}
        onSelectionChange={(k) => onChange(k as string)}
        aria-label={ariaLabel}
      >
        <Button size="sm" className="w-full justify-between">
          <SelectValue className="truncate capitalize" />
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover>
          <ListBox>
            {CURSORS.map((c) => (
              <ListBoxItem key={c} id={c} className="capitalize">
                {c}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-md border text-fg-muted"
        style={{ cursor: value }}
      >
        <MousePointer2Icon className="size-4" />
      </div>
    </div>
  )
}

export function CursorInspector() {
  const [interactive, setInteractive] = useToken(
    CURSOR_INTERACTIVE_VAR,
    DEFAULT_CURSOR_INTERACTIVE,
  )
  const [disabled, setDisabled] = useToken(
    CURSOR_DISABLED_VAR,
    DEFAULT_CURSOR_DISABLED,
  )

  return (
    <div className="flex flex-col gap-7">
      <Section title="Pointer feedback">
        <Field
          label="Interactive"
          live
          hint="Cursor over buttons, links and other actionable elements."
        >
          <CursorSelect
            ariaLabel="Interactive cursor"
            value={interactive}
            onChange={setInteractive}
          />
        </Field>
        <Field label="Disabled" live hint="Cursor over disabled controls.">
          <CursorSelect
            ariaLabel="Disabled cursor"
            value={disabled}
            onChange={setDisabled}
          />
        </Field>
      </Section>
    </div>
  )
}
