'use client'

import { MousePointer2Icon } from 'lucide-react'

import { useDesignSystem } from '../../preset'
import {
  ChapterIntro,
  Field,
  Section,
  SelectField,
  SliderField,
} from '../controls'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
  FOCUS_RING_VAR,
} from '../data'
import { useToken } from '../hooks'
import { useReveals } from '../store'

const CURSORS = [
  { value: 'default', label: 'Default' },
  { value: 'pointer', label: 'Pointer' },
  { value: 'not-allowed', label: 'Not allowed' },
  { value: 'wait', label: 'Wait' },
  { value: 'progress', label: 'Progress' },
  { value: 'help', label: 'Help' },
  { value: 'text', label: 'Text' },
  { value: 'grab', label: 'Grab' },
]

export function InteractionChapter() {
  const { designSystem, setToken } = useDesignSystem()
  const interactive =
    designSystem.tokens[CURSOR_INTERACTIVE_VAR] ?? DEFAULT_CURSOR_INTERACTIVE
  const disabled =
    designSystem.tokens[CURSOR_DISABLED_VAR] ?? DEFAULT_CURSOR_DISABLED
  const [focusRing, setFocusRing] = useToken(FOCUS_RING_VAR, '2')
  const micro = useReveals('micro')

  return (
    <div className="flex flex-col gap-7">
      <ChapterIntro
        title="Interaction"
        blurb="The small physical details — what the pointer does, how focus reads."
      />

      <Section label="Cursors">
        <Field label="On interactive elements" live>
          <div className="flex items-center gap-2">
            <SelectField
              value={interactive}
              onChange={(v) => setToken(CURSOR_INTERACTIVE_VAR, v)}
              options={CURSORS}
            />
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-md border text-fg-muted"
              style={{ cursor: interactive }}
            >
              <MousePointer2Icon className="size-4" />
            </div>
          </div>
        </Field>
        <Field label="On disabled elements" live>
          <div className="flex items-center gap-2">
            <SelectField
              value={disabled}
              onChange={(v) => setToken(CURSOR_DISABLED_VAR, v)}
              options={CURSORS}
            />
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-md border text-fg-muted"
              style={{ cursor: disabled }}
            >
              <MousePointer2Icon className="size-4" />
            </div>
          </div>
        </Field>
      </Section>

      {micro && (
        <Section label="Focus">
          <SliderField
            label="Focus ring width"
            value={Number.parseFloat(focusRing) || 2}
            min={0}
            max={4}
            step={1}
            format={(v) => `${v}px`}
            onChange={(v) => setFocusRing(String(v))}
            hint="Keyboard focus outline thickness."
          />
        </Section>
      )}
    </div>
  )
}
