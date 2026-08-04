import { useEffect, useRef, useState } from "react"

import { cn } from "@/registry/lib/utils"
import {
  CompositionCode,
  CompositionTransitionStyles,
  lineNumberWidth,
  PlayPauseButton,
  StepDots,
  StepTimer,
  useCompositionPlayer,
} from "@/modules/docs/composition-animation"

// The right panel at its tallest step: the play/pause row (h-7 + mb-3) + the
// preview area (min-h-56) + the code pane at its ceiling (max-h-86) + the card's
// own y-borders. Reserving it on the panel's container keeps the animating card
// from ever moving the page.
const panelMaxHeight = "calc(2.5rem + 14rem + 21.5rem + 2px)"

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
    const active = rail?.querySelectorAll("li")[activePaginated] as
      | HTMLElement
      | undefined
    if (!rail || !active) return
    rail.scrollTo({
      top: active.offsetTop - rail.clientHeight / 2 + active.offsetHeight / 2,
      behavior: reducedMotion ? "auto" : "smooth",
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
    const lines = current.code.split("\n").length
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

  const pauseHandlers = {
    onMouseEnter: () => setHoverPaused(true),
    onMouseLeave: () => setHoverPaused(false),
    onFocus: () => setHoverPaused(true),
    onBlur: () => setHoverPaused(false),
  }

  return (
    <section>
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
            className="relative mt-2 no-scrollbar h-80 max-w-54 self-stretch overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_3rem,black_calc(100%-3rem),transparent)] py-5 max-lg:hidden"
            {...pauseHandlers}
          >
            {/* One indicator for the whole rail — it travels to the active
                step instead of each step lighting its own segment. */}
            <span
              aria-hidden
              className="absolute top-5 left-0 z-10 h-8 w-px bg-fg transition-transform ease-[cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none"
              style={{
                transform: `translateY(${activePaginated * 2}rem)`,
                transitionDuration: "450ms",
              }}
            />
            {paginated.map((p, pos) => (
              <li key={p.title}>
                <button
                  type="button"
                  aria-current={pos === activePaginated ? "step" : undefined}
                  onClick={() => goToStep(p.index)}
                  className={cn(
                    "relative flex h-8 w-full cursor-pointer items-center gap-3 border-l pl-4 text-left text-sm transition-colors",
                    pos === activePaginated
                      ? "text-fg"
                      : "text-fg-muted hover:text-fg",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-xs tabular-nums transition-colors",
                      pos === activePaginated
                        ? "text-fg-muted"
                        : "text-fg-muted/50",
                    )}
                  >
                    {String(pos + 1).padStart(2, "0")}
                  </span>
                  {p.title}
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Code with its rendered result below — one card, no window chrome.
            On lg the container reserves the tallest step's height so the
            animating card resizes inside it without moving the page. */}
        {/* min-w-0: grid items floor at min-content, so the code would widen the
            column past the viewport instead of scrolling inside the card. */}
        <div
          className="min-w-0 lg:min-h-(--panel-max)"
          style={{ "--panel-max": panelMaxHeight } as React.CSSProperties}
        >
          {/* Title and dots stand in for the step rail, which is desktop-only.
              The play/pause button stays at both sizes, and sits outside the
              card: hovering the card is itself a pause, so a play button inside
              it flips to "play" as you reach for it. */}
          <div className="mb-3 flex items-center gap-1">
            <span className="truncate font-mono text-xs text-fg-muted lg:hidden">
              {current.title}
            </span>
            <StepDots player={player} className="ml-auto shrink-0 lg:hidden" />
            <PlayPauseButton
              player={player}
              withLabel
              // Pulled by the button's own padding, so the icon — not the hit
              // area — lines up with the card's left edge.
              className="shrink-0 lg:-ml-2.5"
            />
          </div>
          <div
            className="overflow-hidden rounded-xl border bg-card shadow-xs"
            {...pauseHandlers}
          >
            <div className="relative flex min-h-56 items-center justify-center p-6">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,black,transparent)] bg-[size:14px_14px]"
              />
              <div className="relative flex w-full justify-center">
                {current.preview}
              </div>
            </div>
            {/* The pane hugs its snippet between a floor and a ceiling; past the
                ceiling the code scrolls, faded at whichever edge still has
                code beyond it. Below lg, where the section stacks, it's pinned
                instead — the page can't move between steps. */}
            <div
              className="no-scrollbar scroll-fade-y overflow-x-hidden overflow-y-auto overscroll-contain border-t transition-[height] ease-in-out scroll-fade-6 motion-reduce:transition-none max-lg:max-h-62 max-lg:min-h-62 lg:max-h-86 lg:min-h-51"
              style={{
                height: codeHeight ?? "auto",
                transitionDuration: "500ms",
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
                    lineNumbers
                  />
                ) : (
                  // Carries the gutter too, so hydration doesn't shift the
                  // snippet sideways.
                  <pre className="whitespace-pre">
                    {current.code.split("\n").map((line, i) => (
                      <span key={i}>
                        <span className="opacity-30">
                          {`${String(i + 1).padStart(lineNumberWidth, " ")}  `}
                        </span>
                        {`${line}\n`}
                      </span>
                    ))}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
