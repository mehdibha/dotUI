import { useEffect, useRef } from 'react'

import { cn } from '@/registry/lib/utils'
import { LinkButton } from '@/registry/ui/button'
import {
  compactMaxCodeLines,
  CompositionCode,
  CompositionTransitionStyles,
  maxCodeLines,
  PlayPauseButton,
  StepDots,
  StepTimer,
  useCompositionPlayer,
} from '@/modules/docs/composition-animation'

// The code pane's border-box height at a given line count: p-6 padding plus
// lines at text-[0.8125rem]/leading-normal. Its border-t takes its 1px out of
// the bottom padding, which is why the pane isn't a line taller than the gutter.
const codePaneHeight = (lines: number) =>
  `calc(3rem + ${lines} * 0.8125rem * 1.5)`

// The pane is pinned to the longest snippet in the loop, so only the code
// inside it ever moves — the card holds still from the first step to the last.
// Below lg the section stacks and plays the shorter compact loop; that one is a
// floor, not a fixed height, because the breakpoint flips in CSS while the loop
// swaps in an effect — a full-loop step caught at that width must overflow the
// pane rather than be clipped by it.
const codeHeight = codePaneHeight(maxCodeLines)
const compactCodeMinHeight = codePaneHeight(compactMaxCodeLines)

// The right panel at its tallest step: preview area (min-h-56) + code pane +
// the card's own y-borders. Reserving it on the panel's container keeps a
// taller preview from moving the page.
const panelMaxHeight = `calc(14rem + 2px + ${codeHeight})`

function LineNumbers({
  lines,
  className,
}: {
  lines: number
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'shrink-0 text-right text-fg-muted/50 tabular-nums select-none',
        className,
      )}
    >
      {Array.from({ length: lines }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  )
}

export function CompositionSection() {
  const player = useCompositionPlayer({ compactBelowLg: true })
  const {
    paginated,
    activePaginated,
    goToStep,
    setHoverPaused,
    mounted,
    containerRef,
    current,
    reducedMotion,
    codeStaggerMs,
  } = player

  // Keep the active step centered in the fixed-height rail as the loop runs.
  const railRef = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const rail = railRef.current
    const active = rail?.querySelectorAll('li')[activePaginated] as
      | HTMLElement
      | undefined
    if (!rail || !active) return
    rail.scrollTo({
      top: active.offsetTop - rail.clientHeight / 2 + active.offsetHeight / 2,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }, [activePaginated, reducedMotion])

  const pauseHandlers = {
    onMouseEnter: () => setHoverPaused(true),
    onMouseLeave: () => setHoverPaused(false),
    onFocus: () => setHoverPaused(true),
    onBlur: () => setHoverPaused(false),
  }

  return (
    // Width mirrors the cards strip: 1500px grid + 8rem rail gutters.
    <section className="mx-auto mt-24 w-full max-w-[calc(1500px+16rem)] px-4 sm:px-6 md:mt-32 lg:px-32">
      <CompositionTransitionStyles />
      <StepTimer player={player} />
      <div
        ref={containerRef}
        className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      >
        {/* Copy + step rail */}
        <div className="flex flex-col items-start gap-4">
          <h2 className="font-mono text-sm tracking-wide text-fg-muted">
            Composition
          </h2>
          <p className="text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
            Compose components.
            <br />
            <span className="text-fg-muted">Create your own patterns.</span>
          </p>
          <p className="text-base text-fg-muted lg:max-w-md">
            One compositional API across the library — the same parts combine
            into anything, from a simple field to a complex pattern.
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
                transform: `translateY(${activePaginated * 2}rem)`,
                transitionDuration: '450ms',
              }}
            />
            {paginated.map((p, pos) => (
              <li key={p.title}>
                <button
                  type="button"
                  aria-current={pos === activePaginated ? 'step' : undefined}
                  onClick={() => goToStep(p.index)}
                  className={cn(
                    'relative flex h-8 w-full cursor-pointer items-center gap-3 border-l pl-4 text-left text-sm transition-colors',
                    pos === activePaginated
                      ? 'text-fg'
                      : 'text-fg-muted hover:text-fg',
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-xs tabular-nums transition-colors',
                      pos === activePaginated
                        ? 'text-fg-muted'
                        : 'text-fg-muted/50',
                    )}
                  >
                    {String(pos + 1).padStart(2, '0')}
                  </span>
                  {p.title}
                </button>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2 pt-2">
            <LinkButton href="/docs/components" variant="primary">
              Explore components
            </LinkButton>
            <LinkButton href="/docs" variant="default">
              Read the docs
            </LinkButton>
          </div>
        </div>

        {/* Code with its rendered result below — one card, no window chrome.
            On lg the container reserves the tallest step's height so a taller
            preview can't move the page. */}
        {/* min-w-0: grid items floor at min-content, so the code would widen the
            column past the viewport instead of scrolling inside the card. */}
        <div
          className="min-w-0 lg:min-h-(--panel-max)"
          style={{ '--panel-max': panelMaxHeight } as React.CSSProperties}
          {...pauseHandlers}
        >
          {/* Stands in for the step rail, which is desktop-only. */}
          <div className="mb-3 flex items-center justify-between gap-2 lg:hidden">
            <span className="truncate font-mono text-xs text-fg-muted">
              {current.title}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <StepDots player={player} />
              <PlayPauseButton player={player} />
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
            <div className="relative flex min-h-56 items-center justify-center p-6">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,black,transparent)] bg-[size:14px_14px]"
              />
              <div className="relative flex w-full justify-center">
                {current.preview}
              </div>
              <PlayPauseButton
                player={player}
                className="absolute right-2 bottom-2 max-lg:hidden"
              />
            </div>
            <div
              className="min-h-(--code-min) overflow-hidden border-t lg:h-(--code-full)"
              style={
                {
                  '--code-full': codeHeight,
                  '--code-min': compactCodeMinHeight,
                } as React.CSSProperties
              }
            >
              <div className="flex gap-4 p-6 font-mono text-[0.8125rem] leading-normal">
                {/* The gutter numbers the whole pane, not the current snippet —
                    it's the ruled page the code is written on, so it holds still
                    while steps come and go. One per loop, picked by the same
                    breakpoint that sets the pane height. */}
                <LineNumbers
                  lines={compactMaxCodeLines}
                  className="lg:hidden"
                />
                <LineNumbers lines={maxCodeLines} className="max-lg:hidden" />
                <div className="no-scrollbar min-w-0 flex-1 scroll-fade-x overflow-x-auto">
                  {mounted ? (
                    <CompositionCode
                      code={current.code}
                      reducedMotion={reducedMotion}
                      stagger={codeStaggerMs}
                    />
                  ) : (
                    <pre className="whitespace-pre">{current.code}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
