import { LinkButton } from "@/registry/ui/button"
import { Footer } from "@/components/layout/footer"
import Cards from "@/modules/marketing/cards"
import { CtaSection } from "@/modules/marketing/cta-section"
import { HeroWordSwap } from "@/modules/marketing/hero-word-swap"

export function HomePage() {
  return (
    // One container for the whole landing; every section aligns to its 1440px
    // content box. Decorations that bleed past it (cards rails, full-bleed
    // washes) are clipped at the viewport by the root.
    <div className="overflow-x-clip">
      <div className="container">
        {/* Hero section */}
        <section className="flex flex-col pt-14 sm:pt-18 md:pt-26">
          <div className="flex flex-col items-center text-center">
            <h1 className="[font-feature-settings:'calt'_0,'rlig','ss11'] text-[clamp(1.75rem,calc((100vw-2rem)/10.3),3rem)] leading-[1.17] font-normal tracking-[-0.06em] text-balance antialiased sm:text-[3rem] sm:leading-[3.5rem] xl:text-6xl xl:leading-[4rem]">
              The Design System Studio
              <br />
              <span className="text-fg-muted">
                for <HeroWordSwap />
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-balance text-fg-muted">
              Every design decision is yours, previewed live on real components.
              Install with the shadcn CLI, or export straight to v0.
            </p>
            <div className="mt-9 flex items-center gap-3">
              <LinkButton href="/create" variant="primary" size="lg">
                Start building
              </LinkButton>
              <LinkButton href="/docs/components" variant="secondary" size="lg">
                View components
              </LinkButton>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <Cards />
        </section>

        <div className="mt-16 md:mt-20">
          <CtaSection />
        </div>

        <div className="mt-16 md:mt-20">
          <Footer />
        </div>
      </div>
    </div>
  )
}
