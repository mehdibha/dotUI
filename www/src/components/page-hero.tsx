import type * as React from 'react'

import { Eyebrow } from '@/components/eyebrow'

interface PageHeroProps {
  /** Optional pill above the headline (e.g. the /charts "Built on Recharts" note). */
  eyebrow?: React.ReactNode
  /** The headline. Rich markup is welcome (italic / bold spans). */
  title: React.ReactNode
  /** Supporting line under the headline. */
  description?: React.ReactNode
  /** Call-to-action row (buttons); laid out responsively. */
  children?: React.ReactNode
}

/**
 * The centered marketing hero shared by the landing-style pages (/charts): an
 * optional eyebrow pill, a tracking-tight headline, a muted supporting line,
 * and a responsive row of actions. Mirrors the landing page's hero so these
 * pages read as one family.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: PageHeroProps) {
  return (
    <section className="container flex flex-col pt-6 sm:pt-8 md:pt-12">
      <div className="flex flex-col items-center gap-3 text-center md:gap-4">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="text-3xl leading-tight tracking-tighter text-balance max-lg:font-medium md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-xl text-sm text-balance text-fg-muted sm:text-base">
            {description}
          </p>
        ) : null}
        {children ? (
          <div className="flex w-full flex-col gap-2 pt-1 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  )
}
