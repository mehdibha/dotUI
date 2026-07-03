import { createFileRoute } from '@tanstack/react-router'

import { Link } from '@/ui/link'

export const Route = createFileRoute('/methodology')({
  component: Methodology,
})

function Methodology() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Methodology</h1>

      <section className="mt-8 flex flex-col gap-4 text-fg-muted [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-fg">
        <h2>How the catalog was chosen</h2>
        <p>
          Nearly a hundred candidate systems were researched in parallel recon
          sessions (2026-07-03) under one ground rule: no scoring from memory or
          reputation. Every claim had to come from a docs page, a source file,
          npm metadata, or shipped CSS that was actually opened. Closed systems
          (Linear, Stripe) were probed specifically for what their shipped CSS
          exposes.
        </p>
        <p>
          The 77 that made the catalog were each scored across nine domains —
          color, typography, spacing, components, motion, icons, accessibility,
          docs, and openness — against fixed anchors, plus a holistic overall
          score. Those scores prioritize what gets researched first; they are
          recon-level evidence, not published verdicts. Quality over popularity
          — popular doesn&apos;t mean good.
        </p>
        <p>
          The full scorecards, the rubric, and the machine-readable catalog live
          in the open —{' '}
          <Link href="https://github.com/mehdibha/dotUI/tree/main/docs/research/2026-07-03-ds-catalog">
            catalog report on GitHub
          </Link>
          .
        </p>

        <h2>The truth standard</h2>
        <p>
          Every system page is built from structured data extracted from real
          sources — token source files, shipped CSS, first-party docs — and
          every section links the sources it came from. Closed systems studied
          through their shipped CSS are labeled reverse-engineered: that data is
          first-class but always presented as observed, never as official
          documentation. Measured numbers — like contrast ratios computed from
          shipped values — are marked measured, never conflated with published
          guarantees. Data without sources fails the build.
        </p>
        <p>
          Every system carries three dates: when its research was created, when
          the data last changed, and when a human last reviewed it against the
          sources. Staleness is shown, not hidden.
        </p>
        <p>
          Selection recon is not held to that bar — scorecards were good enough
          to rank candidates. Everything published on a system page is
          re-verified against its sources first.
        </p>

        <h2>Editorial line</h2>
        <p>
          Describe, don&apos;t rank. No leaderboards, no scored verdicts — the
          occasional light-hearted, evidence-backed award at most. And the
          direction of truth is fixed: findings here drive the dotUI builder;
          the builder&apos;s needs never bend the research.
        </p>
      </section>
    </div>
  )
}
