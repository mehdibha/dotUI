'use client'

import { useEffect, useState } from 'react'

import { Switch } from '@/registry/ui/switch'

import {
  Field,
  InlineRow,
  OptionGrid,
  Section,
  ValueSlider,
} from '../primitives'
import {
  MOTION_DURATION_VAR,
  MOTION_EASING_VAR,
  MOTION_ENABLED_VAR,
  useNumberToken,
  useToken,
} from '../tokens'

const EASINGS: ReadonlyArray<{ value: string; label: string; css: string }> = [
  { value: 'standard', label: 'Standard', css: 'cubic-bezier(0.32,0.72,0,1)' },
  { value: 'snappy', label: 'Snappy', css: 'cubic-bezier(0.5,0,0,1)' },
  { value: 'gentle', label: 'Gentle', css: 'cubic-bezier(0.4,0,0.2,1)' },
  { value: 'spring', label: 'Spring', css: 'cubic-bezier(0.34,1.56,0.64,1)' },
]

export function MotionInspector() {
  const [duration, setDuration] = useNumberToken(MOTION_DURATION_VAR, 200)
  const [easing, setEasing] = useToken(MOTION_EASING_VAR, 'standard')
  const [enabled, setEnabled] = useToken(MOTION_ENABLED_VAR, 'true')
  const easingCss =
    EASINGS.find((e) => e.value === easing)?.css ??
    'cubic-bezier(0.32,0.72,0,1)'

  // Ping-pong a dot so the chosen duration + curve are felt, not just read.
  const [toggled, setToggled] = useState(false)
  useEffect(() => {
    const id = window.setInterval(() => setToggled((t) => !t), 1100)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-7">
      {/* Live specimen — a travelling dot driven by the current settings. */}
      <div className="rounded-lg border bg-card p-3">
        <div className="relative h-8 rounded-md bg-neutral">
          <div
            className="absolute top-1 size-6 rounded-md bg-primary"
            style={{
              left: toggled && enabled === 'true' ? 'calc(100% - 28px)' : '4px',
              transition:
                enabled === 'true' ? `left ${duration}ms ${easingCss}` : 'none',
            }}
          />
        </div>
      </div>

      <Section title="Timing">
        <Field
          label="Duration"
          value={`${duration}ms`}
          hint="Baseline transition speed."
        >
          <ValueSlider
            ariaLabel="Duration"
            value={duration}
            min={0}
            max={500}
            step={10}
            onChange={setDuration}
          />
        </Field>
        <Field label="Easing curve">
          <OptionGrid value={easing} onChange={setEasing} options={EASINGS} />
        </Field>
      </Section>

      <Section title="Preferences">
        <InlineRow label="Animations" hint="Global on/off for transitions">
          <Switch
            isSelected={enabled === 'true'}
            onChange={(s) => setEnabled(String(s))}
            aria-label="Animations"
          />
        </InlineRow>
      </Section>
    </div>
  )
}
