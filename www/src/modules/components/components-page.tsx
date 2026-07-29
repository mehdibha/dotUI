import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/page-hero'
import { DemoPreset } from '@/modules/docs/demo-preset'

import { CategoryNav } from './category-nav'
import { componentsData } from './components-data'
import { ComponentsGrid } from './components-grid'

// Charts have their own showcase at /charts, so the gallery skips that category.
const categories = componentsData.filter((c) => c.slug !== 'charts')

export function ComponentsPage() {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      {/* The <main> landmark lives in the shared _app layout; use a fragment here
          so we don't nest a second one. */}
      <>
        <PageHero
          eyebrow="Built on React Aria · themed by your design system"
          title="Components"
          description="Browse every component in the library — accessible, composable, and styled to match your design system."
        />

        <CategoryNav categories={categories} className="mt-8 sm:mt-12" />

        <div className="container mt-10 pb-16">
          <DemoPreset>
            <div className="mx-auto flex max-w-6xl flex-col gap-14">
              {categories.map(({ title, slug, components }) => (
                <section key={slug} id={slug} className="scroll-mt-32">
                  <h2 className="text-lg font-semibold tracking-tight">
                    {title}{' '}
                    <span className="font-normal text-fg-muted">
                      · {components.length}
                    </span>
                  </h2>
                  <div className="mt-6">
                    <ComponentsGrid category={slug} />
                  </div>
                </section>
              ))}
            </div>
          </DemoPreset>
        </div>
      </>
      <Footer />
    </div>
  )
}
