import { createFileRoute } from '@tanstack/react-router'

import { ProgressiveBlur } from '@/components/progressive-blur'

export const Route = createFileRoute('/internal/blur-reveal')({
  component: BlurRevealDemo,
})

// Internal demo of the blur-reveal utilities (styles.css) paired with
// ProgressiveBlur: the root-scroll driver on a page header, and the
// nearest-scroller driver with a custom range on a sticky bar inside an
// overflow-auto card.
function BlurRevealDemo() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Root-scroll driver — same anatomy as the app header: the utility rides
          the mask-free wrapper, the fallback rides the bar itself. */}
      <header className="sticky top-0 z-10 flex h-14 items-center blur-reveal-fallback px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140%] blur-reveal"
        >
          <ProgressiveBlur />
        </div>
        <span className="text-sm font-medium">
          blur-reveal — document scroll
        </span>
      </header>

      <div className="space-y-8 px-6 pb-24">
        <p className="max-w-md text-sm text-fg-muted">
          Scroll the page — the header's blur ramps in over the first header
          height of scroll, exactly like the app navbar.
        </p>

        {/* Colorful rows so the blur ramp is visible under the bars. */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className={
                ['bg-primary', 'bg-accent-muted', 'bg-muted'][i % 3] +
                ' h-28 rounded-lg'
              }
            />
          ))}
        </div>

        {/* Nearest-scroller driver — the sticky bar's timeline binds to the
            overflow-y-auto card, with a shortened 3rem reveal range. */}
        <div className="max-w-sm">
          <h2 className="mb-2 text-sm font-medium">
            blur-reveal-nearest — card scroller, 3rem range
          </h2>
          <div className="h-96 overflow-y-auto rounded-xl border">
            <div className="sticky top-0 z-10 flex h-12 items-center blur-reveal-fallback px-4">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140%] blur-reveal-nearest [--blur-reveal-range:3rem]"
              >
                <ProgressiveBlur />
              </div>
              <span className="text-sm font-medium">Card header</span>
            </div>
            <div className="space-y-3 p-4">
              {Array.from({ length: 24 }, (_, i) => (
                <div
                  key={i}
                  className={
                    (i % 4 === 0 ? 'bg-primary/60' : 'bg-muted') +
                    ' h-9 rounded-md'
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="h-[60vh]" />
      </div>
    </div>
  )
}
