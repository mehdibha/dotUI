import { LinkButton } from '@/registry/ui/button'
import { Footer } from '@/components/layout/footer'
import {
  PageActions,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/page-header'

import { ChartShowcase } from './chart-showcase'
import { totalVariantCount } from './data'

export function ChartsPage() {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      {/* The <main> landmark lives in the shared _app layout; use a fragment here
          so we don't nest a second one. */}
      <>
        <PageHeader>
          <PageTitle>
            Charts that look like{' '}
            <span className="font-bold italic">your product</span>.
          </PageTitle>
          <PageDescription>
            {totalVariantCount()} copy-paste chart variants, themed by your
            design system.
          </PageDescription>
          <PageActions>
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
          </PageActions>
        </PageHeader>

        {/* Showcase — a tabbed grid of every variant, one family per tab. */}
        <section className="container mt-12 sm:mt-16">
          <ChartShowcase />
        </section>
      </>
      <Footer />
    </div>
  )
}
