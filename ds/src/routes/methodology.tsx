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
        <h2>How the roster was chosen</h2>
        <p>
          Around 30 candidate systems were researched in parallel recon sessions
          (2026-07-03) under one ground rule: no scoring from memory or
          reputation. Every claim had to come from a docs page, a source file,
          npm metadata, or shipped CSS that was actually opened. Closed systems
          (Linear, Stripe) were probed specifically for what their shipped CSS
          exposes.
        </p>
        <p>
          Each candidate was scored 0–3 on five criteria, for the color/token
          dimension only: <strong>technical depth</strong> (real generation,
          layering, and contrast architecture vs a flat palette),{' '}
          <strong>originality</strong> (does studying it teach something the
          others don&apos;t?), <strong>inspectability</strong> (public repo down
          to effectively closed), <strong>docs quality</strong> (can facts be
          cited to stable URLs?), and <strong>influence</strong> as a
          tiebreaker. Quality over popularity — popular doesn&apos;t mean good.
        </p>
        <p>
          The result: 15 tier-1 systems, 8 on a watchlist, and 8 rejected with
          recorded reasons. The full scorecards and the machine-readable roster
          live in the open —{' '}
          <Link href="https://github.com/mehdibha/dotUI/tree/main/docs/research/2026-07-03-ds-roster-selection">
            selection report on GitHub
          </Link>
          .
        </p>

        <h2>The truth standard</h2>
        <p>
          Every published fact carries evidence: source URLs, a retrieval date,
          a verification date, and a method tag —{' '}
          <code className="font-mono text-sm">documented</code>,{' '}
          <code className="font-mono text-sm">source-read</code>, or{' '}
          <code className="font-mono text-sm">reverse-engineered</code>.
          Reverse-engineered facts (like CSS variables read from a shipped site)
          are first-class but always labeled as observed, never as official
          documentation. Facts without evidence fail the build.
        </p>
        <p>
          Selection recon is not held to that bar — scorecards were good enough
          to rank candidates. Everything published on a system profile or topic
          page is re-verified to the per-fact citation standard first.
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
