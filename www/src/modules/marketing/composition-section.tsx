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

export function CompositionSection() {
  const player = useCompositionPlayer()
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

        {/* Code with its rendered result below — one card, no window chrome */}
        {/* min-w-0: grid items floor at min-content, so the code would widen the
            column past the viewport instead of scrolling inside the card. */}
        <div className="min-w-0" {...pauseHandlers}>
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
              <div className="relative">{current.preview}</div>
              <PlayPauseButton
                player={player}
                className="absolute right-2 bottom-2 max-lg:hidden"
              />
            </div>
            <div
              className="overflow-hidden border-t [mask-image:linear-gradient(to_bottom,black_calc(100%-1.5rem),transparent)] transition-[height] ease-in-out [view-transition-name:cmp-code] motion-reduce:transition-none"
              style={{
                height: codeHeight ?? 'auto',
                transitionDuration: '500ms',
              }}
            >
              <div
                ref={codeInnerRef}
                className="no-scrollbar scroll-fade-x overflow-x-auto p-6 font-mono text-[0.8125rem] leading-normal"
              >
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
    </section>
  )
}
