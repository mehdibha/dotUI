import { LinkButton } from "@/registry/ui/button"
import { Footer } from "@/components/layout/footer"
import Cards from "@/modules/marketing/cards"
import { CtaSection } from "@/modules/marketing/cta-section"
import { HeroWordSwap } from "@/modules/marketing/hero-word-swap"

function StackLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-fg-muted/40 underline-offset-3 hover:text-fg"
    >
      {children}
    </a>
  )
}

export function HomePage() {
  return (
    // One container for the whole landing; every section aligns to its 1440px
    // content box. Decorations that bleed past it (cards rails, full-bleed
    // washes) are clipped at the viewport by the root.
    <div className="overflow-x-clip">
      <div className="container">
        {/* Hero section */}
        <section className="flex flex-col pt-10 sm:pt-14 md:pt-20">
          <div className="flex flex-col items-center text-center">
            <h1 className="[font-feature-settings:'calt'_0,'rlig','ss11'] text-[clamp(1.75rem,calc((100vw-2rem)/8.5),3rem)] leading-[1.17] font-normal tracking-[-0.06em] text-balance antialiased sm:text-[3rem] sm:leading-[3.5rem] xl:text-6xl xl:leading-[4rem]">
              The Design System Studio <br className="max-sm:hidden" />
              <span className="text-fg-muted">
                for <HeroWordSwap />
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-balance text-fg-muted">
              Every design decision is yours. Create, tweak and refine your
              system live. Install it with shadcn CLI as code you own.
              {/* Once a non-web export ships: One foundation for all platforms. */}
            </p>
            <div className="mt-9 flex items-center gap-3">
              <LinkButton href="/studio" variant="primary" size="lg">
                Start building
              </LinkButton>
              <LinkButton href="/docs/components" variant="secondary" size="lg">
                View components
              </LinkButton>
            </div>
            <p className="mt-6 text-sm text-balance text-fg-muted">
              Currently in beta · Built on{" "}
              <StackLink href="https://react-spectrum.adobe.com/react-aria">
                React Aria
              </StackLink>
              , <StackLink href="https://base-ui.com">Base UI</StackLink> and{" "}
              <StackLink href="https://tailwindcss.com">Tailwind CSS</StackLink>
              .
            </p>
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
