'use client'

import { useRef, useState } from 'react'

import type { RosterEntry, SystemWithColors } from '@/data/schema'
import { Button } from '@/ui/button'

import {
  Block,
  CodeBlock,
  Mono,
  Note,
  Playground,
  ScaleTrack,
  Section,
  SpecList,
  Choice,
  Toggle,
} from '../primitives'

const durationTokens = [
  { token: 'duration-100', value: 130, scale: 'micro' } as const,
  { token: 'duration-200', value: 160, scale: 'micro' } as const,
  { token: 'duration-300', value: 190, scale: 'micro' } as const,
  { token: 'duration-400', value: 220, scale: 'micro' } as const,
  { token: 'duration-500', value: 250, scale: 'macro' } as const,
  { token: 'duration-600', value: 300, scale: 'macro' } as const,
  { token: 'duration-700', value: 350, scale: 'macro' } as const,
  { token: 'duration-800', value: 400, scale: 'macro' } as const,
  { token: 'duration-900', value: 450, scale: 'macro' } as const,
  { token: 'duration-1000', value: 500, scale: 'macro' } as const,
]

const easings = [
  {
    id: 'ease-out',
    label: 'ease-out',
    bezier: 'cubic-bezier(0, 0, 0.40, 1)',
    points: [0, 0, 0.4, 1],
    usage: 'Fading or animating into view. The most common curve in Spectrum.',
  },
  {
    id: 'ease-in',
    label: 'ease-in',
    bezier: 'cubic-bezier(0.50, 0, 1, 1)',
    points: [0.5, 0, 1, 1],
    usage: 'Exiting the screen, or fading out.',
  },
  {
    id: 'ease-in-out',
    label: 'ease-in-out',
    bezier: 'cubic-bezier(0.45, 0, 0.40, 1)',
    points: [0.45, 0, 0.4, 1],
    usage: 'Movement from place to place — bigger, larger-scale movements.',
  },
] as const

type EasingId = (typeof easings)[number]['id']
type DurationToken = (typeof durationTokens)[number]['token']

const durationOptions = durationTokens.map((d) => ({
  value: d.token,
  label: `${d.value}`,
}))

const easingOptions = easings.map((e) => ({
  value: e.id,
  label: e.label,
}))

function bezierPath(points: readonly [number, number, number, number]) {
  const [x1, y1, x2, y2] = points
  // unit square mapped to a 200x200 plot, y flipped (svg y grows down)
  const toX = (x: number) => x * 200
  const toY = (y: number) => 200 - y * 200
  return `M ${toX(0)} ${toY(0)} C ${toX(x1)} ${toY(y1)}, ${toX(x2)} ${toY(y2)}, ${toX(1)} ${toY(1)}`
}

function EasingPlot({
  points,
  active,
}: {
  points: readonly [number, number, number, number]
  active: boolean
}) {
  const [x1, y1, x2, y2] = points
  return (
    <svg viewBox="0 0 200 200" className="size-full">
      <line
        x1={0}
        y1={200}
        x2={200}
        y2={200}
        className="stroke-border"
        strokeWidth={1}
      />
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={200}
        className="stroke-border"
        strokeWidth={1}
      />
      <line
        x1={0}
        y1={200}
        x2={200}
        y2={0}
        className="stroke-border"
        strokeWidth={1}
        strokeDasharray="3 4"
      />
      <line
        x1={0}
        y1={200 - y1 * 200}
        x2={x1 * 200}
        y2={200 - y1 * 200}
        className="stroke-fg-muted/40"
        strokeWidth={1}
      />
      <circle
        cx={x1 * 200}
        cy={200 - y1 * 200}
        r={3.5}
        className="fill-fg-muted/60"
      />
      <circle
        cx={x2 * 200}
        cy={200 - y2 * 200}
        r={3.5}
        className="fill-fg-muted/60"
      />
      <line
        x1={0}
        y1={200}
        x2={x1 * 200}
        y2={200 - y1 * 200}
        className="stroke-fg-muted/40"
        strokeWidth={1}
      />
      <line
        x1={200}
        y1={0}
        x2={x2 * 200}
        y2={200 - y2 * 200}
        className="stroke-fg-muted/40"
        strokeWidth={1}
      />
      <path
        d={bezierPath(points)}
        fill="none"
        className={active ? 'stroke-fg-accent' : 'stroke-fg-muted'}
        strokeWidth={2.5}
      />
    </svg>
  )
}

export function MotionSection(_props: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const [easingId, setEasingId] = useState<EasingId>('ease-out')
  const [durationToken, setDurationToken] =
    useState<DurationToken>('duration-400')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [playKey, setPlayKey] = useState(0)
  const [running, setRunning] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const easing = easings.find((e) => e.id === easingId) ?? easings[0]
  const duration =
    durationTokens.find((d) => d.token === durationToken) ?? durationTokens[3]!

  const transitionCss = `transform ${duration.value}ms ${easing.bezier}, opacity ${duration.value}ms ${easing.bezier}`

  function play() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setRunning(false)
    // force a reflow so the transition re-triggers even with identical values
    requestAnimationFrame(() => {
      setPlayKey((k) => k + 1)
      setRunning(true)
      timeoutRef.current = setTimeout(
        () => setRunning(false),
        reducedMotion ? 0 : duration.value + 40,
      )
    })
  }

  return (
    <Section
      title="Motion & Animation"
      kicker="Foundations"
      intro="Spectrum 2 publishes a small set of durations and three cubic-bezier easing curves on its documentation site — but ships none of it as tokens. There is no duration or easing entry in @adobe/spectrum-tokens; motion is guidance, not a system."
    >
      <Block
        title="Easing curves"
        description="Pick a curve and a duration, then play the motion against a demo box. The dot on the plot traces the same curve driving the animation."
        aside={
          <Toggle isSelected={reducedMotion} onChange={setReducedMotion}>
            Respect reduced motion
          </Toggle>
        }
      >
        <Playground
          center={false}
          surface="grid"
          label="Easing + duration"
          controls={
            <>
              <Choice
                label="Easing"
                options={easingOptions}
                value={easingId}
                onChange={setEasingId}
              />
              <Choice
                label="Duration"
                options={durationOptions}
                value={durationToken}
                onChange={setDurationToken}
              />
              <Button size="sm" variant="primary" onPress={play}>
                Play
              </Button>
            </>
          }
          footer={
            reducedMotion ? (
              <span>
                Reduced motion is on: the box jumps to its end state instantly.
                Spectrum does not document a system-wide reduced-motion policy —
                this toggle is an implementation choice, not a Spectrum token.
              </span>
            ) : (
              <span>
                Curve: <Mono>{easing.bezier}</Mono> · Duration:{' '}
                <Mono>{`${duration.value}ms`}</Mono> (
                <Mono>{duration.token}</Mono>)
              </span>
            )
          }
        >
          <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-center">
            <div className="mx-auto aspect-square w-full max-w-[220px] shrink-0">
              <EasingPlot points={easing.points} active={running} />
              <p className="mt-2 text-center font-mono text-xs text-fg-muted">
                {easing.bezier}
              </p>
            </div>
            <div className="flex min-h-24 flex-1 items-center overflow-hidden rounded-lg border bg-bg px-4">
              <div
                key={playKey}
                className="size-12 shrink-0 rounded-md bg-accent"
                style={{
                  transitionProperty: reducedMotion
                    ? 'none'
                    : 'transform, opacity',
                  transitionDuration: reducedMotion
                    ? '0ms'
                    : `${duration.value}ms`,
                  transitionTimingFunction: easing.bezier,
                  transform: running ? 'translateX(220px)' : 'translateX(0px)',
                  opacity: running ? 1 : 0.35,
                }}
              />
            </div>
          </div>
        </Playground>

        <CodeBlock code={`transition: ${transitionCss};`} className="mt-4" />

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {easings.map((e) => (
            <div key={e.id} className="rounded-xl border p-4">
              <p className="text-sm font-medium text-fg">{e.label}</p>
              <p className="mt-1 font-mono text-xs text-fg-muted">{e.bezier}</p>
              <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                {e.usage}
              </p>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Duration scale"
        description="Ten durations split by scale rather than by named interaction: Micro (100–400) for small changes — color fades, hovers, accordions, tooltips; Macro (500–1000) for large ones — panels, drawers, cross-screen transitions."
      >
        <ScaleTrack
          unit="ms"
          items={durationTokens.map((d) => ({
            token: d.token,
            value: d.value,
            note: d.scale === 'micro' ? 'Micro' : 'Macro',
          }))}
          renderBar={(item, maxValue) => (
            <span
              className={
                item.note === 'Micro'
                  ? 'h-4 rounded-[3px] bg-accent/70'
                  : 'h-4 rounded-[3px] bg-fg-muted/40'
              }
              style={{
                width: `${Math.max((item.value / maxValue) * 100, 0.5)}%`,
              }}
            />
          )}
        />
      </Block>

      <Block
        title="What isn't documented"
        description="Spectrum's motion page stops short of a full system. Three things are notably absent."
      >
        <SpecList
          rows={[
            {
              label: 'Shipped tokens',
              value: 'None',
              note: '@adobe/spectrum-tokens has no duration or easing token type. Every value above is transcribed from doc prose, not read from a token file.',
            },
            {
              label: 'Choreography',
              value: 'Not published',
              note: 'No documented stagger, sequencing, or "expressive vs moderate" motion styles — unlike, say, Material.',
            },
            {
              label: 'Reduced motion',
              value: 'Not a system policy',
              note: 'No documented prefers-reduced-motion contract. Individual component implementations may add ad-hoc @media handling, but there is no site-wide guarantee.',
            },
          ]}
        />
      </Block>

      <Note>
        Source: spectrum.adobe.com/page/motion (documentation only — no shipped
        motion tokens exist in @adobe/spectrum-tokens).
      </Note>
    </Section>
  )
}
