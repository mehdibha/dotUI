import { useEffect, useRef, useState } from 'react'

import { cn } from '@/registry/lib/utils'
import { LinkButton } from '@/registry/ui/button'
import {
  CompositionCode,
  CompositionTransitionStyles,
  PlayPauseButton,
  StepDots,
  StepTimer,
  useCompositionPlayer,
} from '@/modules/docs/composition-animation'
import { useTweak } from '@/dev/tweaker'

export function CompositionSection() {
  // Tweaker scaffolding — bake the picked values and remove before merging.
  const durationScale = useTweak('Step duration ×', {
    type: 'number',
    min: 0.5,
    max: 2.5,
    step: 0.1,
    default: 1,
    group: 'Composition',
  })
  const codeMoveMs = useTweak('Code move (ms)', {
    type: 'number',
    min: 200,
    max: 1500,
    step: 50,
    default: 700,
    group: 'Composition',
  })
  const codeStaggerMs = useTweak('Code stagger (ms)', {
    type: 'number',
    min: 0,
    max: 20,
    step: 1,
    default: 2,
    group: 'Composition',
  })
  const heightMs = useTweak('Height tween (ms)', {
    type: 'number',
    min: 150,
    max: 1200,
    step: 50,
    default: 500,
    group: 'Composition',
  })
  const morphMs = useTweak('Preview morph (ms)', {
    type: 'number',
    min: 150,
    max: 1000,
    step: 25,
    default: 450,
    group: 'Composition',
  })
  const railMs = useTweak('Rail slide (ms)', {
    type: 'number',
    min: 150,
    max: 1000,
    step: 25,
    default: 450,
    group: 'Composition',
  })
  const hoverPause = useTweak('Pause on hover', {
    type: 'boolean',
    default: true,
    group: 'Composition',
  })

  const player = useCompositionPlayer({ durationScale })
  const {
    steps,
    step,
    goToStep,
    setHoverPaused,
    mounted,
    containerRef,
    current,
    reducedMotion,
  } = player

  // Keep the active step centered in the fixed-height rail as the loop runs.
  const railRef = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const rail = railRef.current
    const active = rail?.children[step] as HTMLElement | undefined
    if (!rail || !active) return
    rail.scrollTo({
      top: active.offsetTop - rail.clientHeight / 2 + active.offsetHeight / 2,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }, [step, reducedMotion])

  // The code pane hugs its content. The target height is computed from the
  // step's line count (calibrated once against the first rendered snippet) so
  // the tween starts in the same commit as the token animation — observing the
  // DOM instead would only fire after departing tokens are removed, i.e. late.
  // Until calibration the height stays auto (auto→px doesn't tween).
  const codeInnerRef = useRef<HTMLDivElement>(null)
  const codeMetrics = useRef<{ line: number; pad: number } | null>(null)
  const [codeHeight, setCodeHeight] = useState<number | null>(null)
  useEffect(() => {
    const el = codeInnerRef.current
    if (!el || !mounted) return
    const lines = current.code.split('\n').length
    if (!codeMetrics.current) {
      const style = getComputedStyle(el)
      const pad = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      codeMetrics.current = { line: (el.offsetHeight - pad) / lines, pad }
    }
    const { line, pad } = codeMetrics.current
    setCodeHeight(lines * line + pad)
  }, [mounted, current.code])

  const pauseHandlers = {
    onMouseEnter: () => hoverPause && setHoverPaused(true),
    onMouseLeave: () => setHoverPaused(false),
    onFocus: () => hoverPause && setHoverPaused(true),
    onBlur: () => setHoverPaused(false),
  }

  return (
    <section className="container mt-24 md:mt-32">
      <CompositionTransitionStyles morphMs={morphMs} />
      <StepTimer player={player} />
      <div
        ref={containerRef}
        className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      >
        {/* Copy + step rail */}
        <div className="flex flex-col items-start gap-4 max-lg:items-center max-lg:text-center">
          <h2 className="font-mono text-sm tracking-wide text-fg-muted">
            Composition
          </h2>
          <p className="text-4xl font-semibold tracking-tighter text-balance sm:text-5xl">
            Ten primitives.
            <br />
            <span className="text-fg-muted">Every component.</span>
          </p>
          <p className="max-w-md text-base text-balance text-fg-muted">
            Learn a primitive once — the same parts recompose into the whole
            library.
          </p>
          <ol
            ref={railRef}
            className="relative mt-2 no-scrollbar h-56 self-stretch overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_3rem,black_calc(100%-3rem),transparent)] py-5 max-lg:hidden"
            {...pauseHandlers}
          >
            {/* One indicator for the whole rail — it travels to the active
                step instead of each step lighting its own segment. */}
            <span
              aria-hidden
              className="absolute top-5 left-0 z-10 h-8 w-px bg-fg transition-transform ease-[cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none"
              style={{
                transform: `translateY(${step * 2}rem)`,
                transitionDuration: `${railMs}ms`,
              }}
            />
            {steps.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  aria-current={i === step ? 'step' : undefined}
                  onClick={() => goToStep(i)}
                  className={cn(
                    'relative flex h-8 w-full cursor-pointer items-center gap-3 border-l pl-4 text-left text-sm transition-colors',
                    i === step ? 'text-fg' : 'text-fg-muted hover:text-fg',
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-xs tabular-nums transition-colors',
                      i === step ? 'text-fg-muted' : 'text-fg-muted/50',
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.title}
                </button>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2 pt-2 max-lg:justify-center">
            <LinkButton href="/docs/components" variant="primary">
              Explore components
            </LinkButton>
            <LinkButton href="/docs" variant="default">
              Read the docs
            </LinkButton>
          </div>
        </div>

        {/* Code with its rendered result below — one card, no window chrome */}
        <div {...pauseHandlers}>
          {/* Reserved for the card at its tallest — preview (14rem + border) plus
              the 18-line snippet (18 × 19.5px + p-6) — so the height animation
              never shifts the layout around it. */}
          <div className="h-[39.25rem] [contain:layout]">
            <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
              <div className="relative flex min-h-56 items-center justify-center p-6">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,black,transparent)] bg-[size:14px_14px]"
                />
                <div className="relative">{current.preview}</div>
                <PlayPauseButton
                  player={player}
                  className="absolute right-2 bottom-2"
                />
              </div>
              <div
                className="overflow-hidden border-t [mask-image:linear-gradient(to_bottom,black_calc(100%-1.5rem),transparent)] transition-[height] ease-in-out [view-transition-name:cmp-code] motion-reduce:transition-none"
                style={{
                  height: codeHeight ?? 'auto',
                  transitionDuration: `${heightMs}ms`,
                }}
              >
                <div
                  ref={codeInnerRef}
                  className="no-scrollbar overflow-x-auto p-6 font-mono text-[0.8125rem] leading-normal"
                >
                  {mounted ? (
                    <CompositionCode
                      code={current.code}
                      reducedMotion={reducedMotion}
                      duration={codeMoveMs}
                      stagger={codeStaggerMs}
                    />
                  ) : (
                    <pre className="whitespace-pre">{current.code}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between lg:hidden">
            <span className="font-mono text-xs text-fg-muted">
              {current.title}
            </span>
            <StepDots player={player} />
          </div>
        </div>
      </div>
    </section>
  )
}
