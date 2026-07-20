import { Link } from 'react-aria-components'

import { siteConfig } from '@/config/site'
import { LinkButton } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { Announcement } from '@/components/announcement'
import { BaseUiIcon } from '@/components/icons/base-ui'
import { GitHubIcon } from '@/components/icons/github'
import { ReactAriaIcon } from '@/components/icons/react-aria'
import { ReactJsIcon } from '@/components/icons/react-js'
import { ShadcnIcon } from '@/components/icons/shadcn'
import { TailwindWordmark } from '@/components/icons/tailwind-wordmark'
import { TypeScriptIcon } from '@/components/icons/typescript'
import { Footer } from '@/components/layout/footer'
import Cards from '@/modules/marketing/cards'
import { CompositionSection } from '@/modules/marketing/composition-section'
import { ExportSection } from '@/modules/marketing/export-section'

export function HomePage() {
  return (
    <div>
      {/* Hero section */}
      <section className="container flex flex-col pt-7.5 sm:pt-10 md:pt-15">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 sm:mb-8">
            <Announcement />
          </div>
          <h1 className="[font-feature-settings:'calt'_0,'rlig','ss11'] text-[clamp(1.75rem,calc((100vw-2rem)/10.3),3rem)] leading-[1.17] font-normal tracking-[-0.06em] text-balance antialiased sm:text-[3rem] sm:leading-[3.5rem] xl:text-6xl xl:leading-none">
            Build your design system,
            <br />
            not someone else&rsquo;s.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-balance text-fg-muted">
            Tune colors, typography, density, and component styles. Preview
            every choice live on accessible React components. Export it as code
            you own.
          </p>
          <div className="mt-9 flex items-center gap-3">
            <LinkButton href="/create" variant="primary" size="lg">
              Launch the editor
            </LinkButton>
            <LinkButton href="/docs/components" variant="default" size="lg">
              View components
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="mt-23">
        <Cards />
      </section>

      {/* Tools section. */}
      <section className="relative z-10 -mt-[20px] py-12 shadow-xs">
        <div className="container flex flex-col items-center justify-center gap-5 lg:gap-10">
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
                  className="flex items-center justify-center rounded-md opacity-60 focus-reset grayscale-100 transition-[opacity,filter] hover:opacity-100 hover:grayscale-0 focus-visible:focus-ring"
                  href={href}
                >
                  {icon}
                </Link>
                <TooltipContent placement="top">{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          <p className="max-w-xl text-center text-sm text-balance text-fg-muted">
            Keyboard, focus, and screen-reader behavior come from React Aria and
            Base UI — accessible by default, on every component.
          </p>
        </div>
      </section>

      <CompositionSection />

      <ExportSection />

      {/* Closing CTA */}
      <section className="container flex flex-col items-center py-24 text-center md:py-32">
        <h2 className="text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
          Start building your design system.
        </h2>
        <p className="mt-3 text-base text-balance text-fg-muted">
          Free and open source. Yours from the first component.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="/create" variant="primary" size="lg">
            Launch the editor
          </LinkButton>
          <LinkButton
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            size="lg"
          >
            <GitHubIcon className="size-4.5" />
            Star on GitHub
          </LinkButton>
        </div>
      </section>

      <Footer />
    </div>
  )
}

const tools = [
  {
    label: 'Shadcn CLI',
    icon: <ShadcnIcon className="size-7 sm:size-9" />,
    href: 'https://ui.shadcn.com/docs/cli',
  },
  {
    label: 'React 19',
    icon: <ReactJsIcon className="size-7 sm:size-9" />,
    href: 'https://react.dev',
  },
  {
    label: 'React Aria',
    icon: <ReactAriaIcon className="size-7 sm:size-9" />,
    href: 'https://react-spectrum.adobe.com/react-aria/index.html',
  },
  {
    label: 'Base UI',
    icon: <BaseUiIcon className="h-7 w-auto sm:h-9" />,
    href: 'https://base-ui.com',
  },
  {
    label: 'TypeScript 5',
    icon: <TypeScriptIcon className="size-7 sm:size-9" />,
    href: 'https://www.typescriptlang.org/',
  },
  {
    label: 'Tailwind CSS v4',
    icon: <TailwindWordmark className="h-5 sm:h-7" />,
    href: 'https://tailwindcss.com',
  },
]
