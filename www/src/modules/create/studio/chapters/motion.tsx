'use client'

import {
  ChapterIntro,
  OptionGrid,
  Section,
  Segmented,
  SwitchField,
} from '../controls'
import {
  MOTION_EASING_VAR,
  MOTION_ENABLED_VAR,
  MOTION_SPEED_VAR,
} from '../data'
import { useToken } from '../hooks'

const EASINGS = [
  {
    value: 'standard',
    label: 'Standard',
    hint: 'Calm ease-out',
    curve: 'M0 32 C 12 4, 20 2, 32 2',
  },
  {
    value: 'linear',
    label: 'Linear',
    hint: 'Mechanical',
    curve: 'M0 32 L 32 2',
  },
  {
    value: 'spring',
    label: 'Spring',
    hint: 'Natural overshoot',
    curve: 'M0 32 C 10 -6, 16 6, 32 2',
  },
  {
    value: 'bouncy',
    label: 'Bouncy',
    hint: 'Playful',
    curve: 'M0 32 C 6 -8, 14 10, 32 2',
  },
]

export function MotionChapter() {
  const [speed, setSpeed] = useToken(MOTION_SPEED_VAR, 'standard')
  const [easing, setEasing] = useToken(MOTION_EASING_VAR, 'standard')
  const [enabled, setEnabled] = useToken(MOTION_ENABLED_VAR, 'true')
  const [reduced, setReduced] = useToken('--ds-respect-reduced-motion', 'true')

  return (
    <div className="flex flex-col gap-7">
      <ChapterIntro
        title="Motion"
        blurb="How the system moves — the difference between a tool that feels mechanical and one that feels alive."
      />

      <Section label="Tempo">
        <Segmented
          ariaLabel="Speed"
          value={speed}
          onChange={setSpeed}
          options={[
            { value: 'snappy', label: 'Snappy' },
            { value: 'standard', label: 'Standard' },
            { value: 'smooth', label: 'Smooth' },
          ]}
        />
      </Section>

      <Section label="Easing personality">
        <OptionGrid
          value={easing}
          columns={2}
          onChange={setEasing}
          options={EASINGS.map((e) => ({
            value: e.value,
            label: e.label,
            hint: e.hint,
            preview: (
              <svg
                viewBox="0 0 32 34"
                className="h-7 w-9 text-primary"
                fill="none"
              >
                <path
                  d={e.curve}
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
            ),
          }))}
        />
      </Section>

      <Section label="Accessibility">
        <SwitchField
          label="Animations"
          hint="Global on/off for every transition."
          value={enabled === 'true'}
          onChange={(v) => setEnabled(String(v))}
        />
        <SwitchField
          label="Respect reduced-motion"
          hint="Honor the visitor's OS preference."
          value={reduced === 'true'}
          onChange={(v) => setReduced(String(v))}
        />
      </Section>
    </div>
  )
}
