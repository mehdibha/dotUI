'use client'

import { useState } from 'react'
import { ArrowRightIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'

import { ChartPlayground } from './chart-playground'
import { ChartPreview } from './chart-preview'
import { CHART_FAMILIES, totalVariantCount, variantsFor } from './data'

export function ChartsPage() {
  const [family, setFamily] = useState<string>(CHART_FAMILIES[0].id)

  const selectFamily = (id: string) => {
    setFamily(id)
    document
      .getElementById('playground')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-28 sm:px-6">
      {/* Hero */}
      <section className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-28">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-64 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] [background:radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--chart-1)_18%,transparent),transparent_60%)]"
        />
        <span className="rounded-full border bg-card px-3 py-1 text-xs text-fg-muted">
          Built on Recharts · themed by your design system
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Charts that look like{' '}
          <span className="bg-gradient-to-r from-[var(--chart-1)] via-[var(--chart-4)] to-[var(--chart-2)] bg-clip-text text-transparent">
            your product
          </span>
        </h1>
        <p className="max-w-xl text-pretty text-fg-muted sm:text-lg">
          A complete set of accessible, copy-paste chart components. Every
          series follows your palette and adapts to light and dark — no config,
          no restyling.
        </p>
        <dl className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-2 text-sm">
          <Stat value={`${CHART_FAMILIES.length}`} label="families" />
          <Stat value={`${totalVariantCount()}`} label="variants" />
          <Stat value="A11y" label="built in" />
        </dl>
      </section>

      {/* Gallery */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">Gallery</h2>
          <p className="text-fg-muted">
            Six families, each a click away from a live playground.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CHART_FAMILIES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => selectFamily(f.id)}
              className={cn(
                'group flex flex-col overflow-hidden rounded-2xl border bg-card text-left transition-all',
                'hover:-translate-y-0.5 hover:border-border-hover hover:shadow-lg',
              )}
            >
              <div
                // Decorative inside the button: `inert` keeps the chart's
                // accessibilityLayer focus targets out of the tab order.
                inert
                aria-hidden="true"
                className="flex h-56 items-center justify-center overflow-hidden border-b bg-bg/40 p-5 [&_*]:pointer-events-none"
              >
                <ChartPreview demoKey={f.hero} className="max-h-full" />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="flex flex-col">
                  <span className="font-medium">{f.name} Chart</span>
                  <span className="text-sm text-fg-muted">{f.tagline}</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-fg-muted">
                  {variantsFor(f.id).length}
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Playground */}
      <section
        id="playground"
        className="flex scroll-mt-20 flex-col gap-6 pt-24"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">Playground</h2>
          <p className="text-fg-muted">
            Pick a chart, try a palette, copy the code.
          </p>
        </div>
        <ChartPlayground family={family} onFamilyChange={setFamily} />
      </section>
    </main>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="order-2 text-fg-muted">{label}</dt>
      <dd className="order-1 text-lg font-semibold">{value}</dd>
    </div>
  )
}
