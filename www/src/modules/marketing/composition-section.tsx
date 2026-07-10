import { cn } from '@/registry/lib/utils'
import { LinkButton } from '@/registry/ui/button'
import {
  CompositionCode,
  CompositionTransitionStyles,
  useCompositionPlayer,
} from '@/modules/docs/composition-animation'

const stats = [
  { value: '1', label: 'Button, every trigger' },
  { value: '1', label: 'Popover, every overlay' },
  { value: '0', label: 'parallel APIs' },
]

export function CompositionSection() {
  const {
    steps,
    step,
    goToStep,
    setPaused,
    mounted,
    containerRef,
    current,
    reducedMotion,
  } = useCompositionPlayer()

  return (
    <section className="container mt-24 md:mt-32">
      <CompositionTransitionStyles />
      <div
        ref={containerRef}
        className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Copy */}
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
          <div className="flex flex-wrap gap-2 pt-2 max-lg:justify-center">
            <LinkButton href="/docs/components" variant="primary">
              Explore components
            </LinkButton>
            <LinkButton href="/docs" variant="default">
              Read the docs
            </LinkButton>
          </div>
          <div className="mt-6 flex gap-10">
            {stats.map(({ value, label }) => (
              <div key={label} className="max-lg:text-center">
                <div className="text-xl font-semibold tracking-tight">
                  {value}
                </div>
                <div className="mt-0.5 text-xs text-fg-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Code window on a soft plate, preview as its result pane */}
        <div>
          <div className="relative rounded-2xl bg-linear-135 from-fg/6 via-fg/2 to-transparent p-3 sm:p-6">
            <div className="overflow-hidden rounded-xl border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b px-3.5 py-2.5">
                <div className="flex items-center gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span
                  aria-live="polite"
                  className="truncate font-mono text-xs text-fg-muted"
                >
                  {current.title}
                </span>
              </div>
              <div className="flex h-104 items-center overflow-hidden p-4 font-mono text-[0.8125rem] leading-normal [view-transition-name:cmp-code]">
                {mounted ? (
                  <CompositionCode
                    code={current.code}
                    reducedMotion={reducedMotion}
                  />
                ) : (
                  <pre className="whitespace-pre">{current.code}</pre>
                )}
              </div>
              <div className="relative flex min-h-48 items-center justify-center border-t p-6">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,black,transparent)] bg-[size:14px_14px]"
                />
                <div className="relative">{current.preview}</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center">
            {steps.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Step ${i + 1}: ${s.title}`}
                onClick={() => goToStep(i)}
                className="group flex h-8 cursor-pointer items-center px-1"
              >
                <span
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i === step
                      ? 'w-6 bg-fg'
                      : 'w-2.5 bg-border group-hover:bg-fg-muted',
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
