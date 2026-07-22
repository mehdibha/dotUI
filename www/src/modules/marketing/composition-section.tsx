import { useEffect, useRef, useState } from 'react'

import { cn } from '@/registry/lib/utils'
import { LinkButton } from '@/registry/ui/button'
import {
  chapters,
  compactMaxCodeLines,
  CompositionCode,
  CompositionTransitionStyles,
  maxCodeLines,
  PlayPauseButton,
  StepDots,
  StepTimer,
  useCompositionPlayer,
} from '@/modules/docs/composition-animation'

// The code pane's height at a given line count: p-6 padding plus lines at
// text-[0.8125rem]/leading-normal.
const codePaneHeight = (lines: number) =>
  `calc(3rem + ${lines} * 0.8125rem * 1.5)`

// Pinning the pane below lg (where the section stacks) keeps the page from
// moving between compact-loop steps.
const compactCodeMinHeight = codePaneHeight(compactMaxCodeLines)

// The right panel at its tallest step: preview area (min-h-56) + code pane +
// the card's own y-borders. Reserving it on the panel's container keeps the
// animating card from ever moving the page.
const panelMaxHeight = `calc(14rem + 2px + ${codePaneHeight(maxCodeLines)})`

export function CompositionSection() {
  // Plays the story once on its own; the moment the user picks a step the
  // clock yields to them, and the play button restarts the tour.
  const player = useCompositionPlayer({
    compactBelowLg: true,
    oneShot: true,
  })
  const {
    step,
    goToStep,
    mounted,
    containerRef,
    current,
    reducedMotion,
    codeStaggerMs,
  } = player

  // While walking toward a chapter, its rail entry stays lit (mirrors how mid
  // steps map to the next headline during the tour).
  const activeChapter = Math.max(
    0,
    chapters.findIndex((c) => c.index >= step),
  )

  // Keep the active chapter centered in the fixed-height rail.
  const railRef = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const rail = railRef.current
    const active = rail?.querySelectorAll('li')[activeChapter] as
      | HTMLElement
      | undefined
    if (!rail || !active) return
    rail.scrollTo({
      top: active.offsetTop - rail.clientHeight / 2 + active.offsetHeight / 2,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }, [activeChapter, reducedMotion])

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
      // Rect, not offsetHeight — the integer rounding inflates the per-line
      // metric (67.5 → 68 reads as 20px/line instead of 19.5).
      const height = el.getBoundingClientRect().height
      codeMetrics.current = { line: (height - pad) / lines, pad }
    }
    const { line, pad } = codeMetrics.current
    setCodeHeight(lines * line + pad)
  }, [mounted, current.code])

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
            className="relative mt-2 no-scrollbar h-88 self-stretch overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_3rem,black_calc(100%-3rem),transparent)] py-5 max-lg:hidden"
          >
            {/* One indicator for the whole rail — it travels to the active
                chapter instead of each entry lighting its own segment. */}
            <span
              aria-hidden
              className="absolute top-5 left-0 z-10 h-8 w-px bg-fg transition-transform ease-[cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none"
              style={{
                transform: `translateY(${activeChapter * 2}rem)`,
                transitionDuration: '450ms',
              }}
            />
            {chapters.map((c, pos) => (
              <li key={c.title}>
                <button
                  type="button"
                  aria-current={pos === activeChapter ? 'step' : undefined}
                  // Clicking the next chapter walks through the steps in
                  // between; farther and backward clicks jump direct.
                  onClick={() =>
                    goToStep(c.index, {
                      walkAll: pos === activeChapter + 1,
                    })
                  }
                  className={cn(
                    'relative flex h-8 w-full cursor-pointer items-center gap-3 border-l pl-4 text-left text-sm transition-colors',
                    pos === activeChapter
                      ? 'text-fg'
                      : 'text-fg-muted hover:text-fg',
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-xs tabular-nums transition-colors',
                      pos === activeChapter
                        ? 'text-fg-muted'
                        : 'text-fg-muted/50',
                    )}
                  >
                    {String(pos + 1).padStart(2, '0')}
                  </span>
                  {c.title}
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
            On lg the container reserves the tallest step's height so the
            animating card resizes inside it without moving the page. */}
        {/* min-w-0: grid items floor at min-content, so the code would widen the
            column past the viewport instead of scrolling inside the card. */}
        <div
          className="min-w-0 lg:min-h-(--panel-max)"
          style={{ '--panel-max': panelMaxHeight } as React.CSSProperties}
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
                showLabel
                className="absolute right-2 bottom-2 max-lg:hidden"
              />
            </div>
            <div
              className="overflow-hidden border-t [mask-image:linear-gradient(to_bottom,black_calc(100%-1.5rem),transparent)] transition-[height] ease-in-out motion-reduce:transition-none max-lg:min-h-(--code-min)"
              style={
                {
                  height: codeHeight ?? 'auto',
                  transitionDuration: '500ms',
                  '--code-min': compactCodeMinHeight,
                } as React.CSSProperties
              }
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
