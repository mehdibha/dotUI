import { LinkButton } from '@/registry/ui/button'
import { Footer } from '@/components/layout/footer'

import { ChartShowcase } from './chart-showcase'
import { CHART_FAMILIES, totalVariantCount } from './data'

export function ChartsPage() {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      {/* The <main> landmark lives in the shared _app layout; use a fragment here
          so we don't nest a second one. */}
      <>
        {/* Hero — mirrors the landing page's centered, tracking-tight headline. */}
        <section className="container flex flex-col pt-6 sm:pt-8 md:pt-12">
          <div className="flex flex-col items-center gap-3 text-center md:gap-4">
            <span className="rounded-full border bg-card px-3 py-1 text-xs text-fg-muted">
              Built on Recharts · themed by your design system
            </span>
            <h1 className="max-w-3xl text-3xl leading-tight tracking-tighter text-balance max-lg:font-medium md:text-4xl lg:text-5xl">
              Charts that look like{' '}
              <span className="bg-gradient-to-r from-[var(--chart-1)] via-[var(--chart-4)] to-[var(--chart-2)] bg-clip-text text-transparent">
                your product
              </span>
              .
            </h1>
            <p className="max-w-2xl text-base text-balance text-fg-muted sm:text-lg">
              A complete set of accessible, copy-paste chart components. Every
              series follows your palette and adapts to light and dark —{' '}
              {totalVariantCount()} variants across {CHART_FAMILIES.length}{' '}
              families, no config, no restyling.
            </p>
            <div className="flex w-full flex-col gap-2 pt-1 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <LinkButton href="/create" variant="primary" size="lg">
                Launch the editor
              </LinkButton>
              <LinkButton
                href="/docs/components/chart"
                variant="default"
                size="lg"
              >
                View documentation
              </LinkButton>
            </div>
          </div>
        </section>

        {/* Showcase — the mini-editor playground over a tabbed grid of every
            variant; the charts re-theme live as the toolbar changes. */}
        <section className="container mt-12 sm:mt-16">
          <ChartShowcase />
        </section>
      </>
      <Footer />
    </div>
  )
}
