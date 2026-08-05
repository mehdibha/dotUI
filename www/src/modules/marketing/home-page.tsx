import { Link } from "react-aria-components"

import { LinkButton } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { BaseUiIcon } from "@/components/icons/base-ui"
import { ReactAriaIcon } from "@/components/icons/react-aria"
import { ReactJsIcon } from "@/components/icons/react-js"
import { ShadcnIcon } from "@/components/icons/shadcn"
import { TailwindWordmark } from "@/components/icons/tailwind-wordmark"
import { TypeScriptIcon } from "@/components/icons/typescript"
import { Footer } from "@/components/layout/footer"
import Cards from "@/modules/marketing/cards"
import { CompositionSection } from "@/modules/marketing/composition-section"
import { CtaSection } from "@/modules/marketing/cta-section"
import { ExportSection } from "@/modules/marketing/export-section"
import { HeroWordSwap } from "@/modules/marketing/hero-word-swap"

export function HomePage() {
  return (
    // One container for the whole landing; every section aligns to its 1440px
    // content box. Decorations that bleed past it (cards rails, full-bleed
    // washes, the CTA backlight) are clipped at the viewport by the root.
    <div className="overflow-x-clip">
      <div className="container">
        {/* Hero section */}
        <section className="flex flex-col pt-14 sm:pt-18 md:pt-26">
          <div className="flex flex-col items-center text-center">
            <h1 className="[font-feature-settings:'calt'_0,'rlig','ss11'] text-[clamp(1.75rem,calc((100vw-2rem)/10.3),3rem)] leading-[1.17] font-normal tracking-[-0.06em] text-balance antialiased sm:text-[3rem] sm:leading-[3.5rem] xl:text-6xl xl:leading-[4rem]">
              The Design System Studio
              <br />
              <span className="text-fg-muted dark:text-fg-muted/85">
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

        {/* Tools section. Hero, cards and tools read as one opening block, so
            they keep their own tight spacing instead of the section rhythm. */}
        <section className="relative z-10 -mt-[20px] pt-12">
          {/* The hairline spans the viewport, like the cards wash it sits over. */}
          <div
            aria-hidden
            className="absolute inset-x-[calc(50%-50vw)] inset-y-0 -z-10 shadow-xs"
          />
          <div className="flex flex-col items-center justify-center gap-5 lg:gap-10">
            <h2 className="font-mono text-sm tracking-wide text-pretty text-fg-muted xs:text-base lg:text-base">
              Built on modern tools
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {tools.map(({ icon, label, href }) => (
                <Tooltip key={href}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center opacity-60 grayscale-100 transition-opacity hover:opacity-100 hover:grayscale-0"
                    href={href}
                  >
                    {icon}
                  </Link>
                  <TooltipContent placement="top">{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </section>

        {/* Section rhythm lives here, not inside the sections: one gap between
            peers, one step up before the CTA so the page reads as ending. */}
        <div className="mt-24 md:mt-32">
          <CompositionSection />
        </div>

        {/* Tighter than the section gap: composition ends on a heavy code block
            and export opens on a small label, so equal space reads as more. */}
        <div className="mt-16 md:mt-24">
          <ExportSection />
        </div>

        <div className="mt-32 md:mt-44">
          <CtaSection />
        </div>

        <div className="mt-24 md:mt-32">
          <Footer />
        </div>
      </div>
    </div>
  )
}

const tools = [
  {
    label: "Shadcn CLI",
    icon: <ShadcnIcon className="size-7 sm:size-9" />,
    href: "https://ui.shadcn.com/docs/cli",
  },
  {
    label: "React 19",
    icon: <ReactJsIcon className="size-7 sm:size-9" />,
    href: "https://react.dev",
  },
  {
    label: "React Aria",
    icon: <ReactAriaIcon className="size-7 sm:size-9" />,
    href: "https://react-spectrum.adobe.com/react-aria/index.html",
  },
  {
    label: "Base UI",
    icon: <BaseUiIcon className="h-7 w-auto sm:h-9" />,
    href: "https://base-ui.com",
  },
  {
    label: "TypeScript 5",
    icon: <TypeScriptIcon className="size-7 sm:size-9" />,
    href: "https://www.typescriptlang.org/",
  },
  {
    label: "Tailwind CSS v4",
    icon: <TailwindWordmark className="h-5 sm:h-7" />,
    href: "https://tailwindcss.com",
  },
]
