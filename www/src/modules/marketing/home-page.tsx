import { LinkButton } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { Announcement } from '@/components/announcement'
import { BaseUiIcon } from '@/components/icons/base-ui'
import { BoltIcon } from '@/components/icons/bolt'
import { LovableIcon } from '@/components/icons/lovable'
import { ReactAriaIcon } from '@/components/icons/react-aria'
import { ReactJsIcon } from '@/components/icons/react-js'
import { ShadcnIcon } from '@/components/icons/shadcn'
import { TailwindWordmark } from '@/components/icons/tailwind-wordmark'
import { TypeScriptIcon } from '@/components/icons/typescript'
import { V0Icon } from '@/components/icons/v0'
import { Footer } from '@/components/layout/footer'
import {
  AnimatedHeadline,
  type RotatingTextItem,
} from '@/components/rotating-text'
import Cards from '@/modules/marketing/cards'

// dotUI's brand font (the "dotUI" wordmark uses Josefin Sans), loaded locally. Weight,
// letter-spacing and size come from the original headline classes on the <h1>.
const HEADLINE_STYLE = { fontFamily: 'var(--font-josefin)' }

// Shared connector for the tool / codebase frames. The trailing non-breaking space (the
// `\u00a0` escape, kept as ASCII source so a formatter or file move can't flatten it back to a
// normal space, which is how it was lost once) stops "to" butting against the logo, and lets
// the rotator size the connector slot from this exact text.
const TO = 'to\u00a0'

// Swappable destinations in the hero headline — "Ship it ___". The shared "to" lives in
// `connector`, not the lead, so it renders once in the lead's font and — because the
// rotator keys the connector slot by this string — stays put across the v0 / bolt.new /
// Lovable / your-code frames instead of re-animating; only the destination swaps.
// "anywhere" reads without a connector. v0 / bolt.new / Lovable are their official brand
// wordmarks (logo-only); the rest are text. Everything inherits the headline color
// (white); the Lovable heart keeps its brand gradient.
const EXPORT_TARGETS: RotatingTextItem[] = [
  {
    id: 'anywhere',
    text: 'anywhere',
    segments: [{ text: 'anywhere', className: 'font-bold italic' }],
  },
  {
    id: 'v0',
    text: 'to v0',
    connector: TO,
    segments: [{ icon: <V0Icon className="h-[0.58em] w-auto" /> }],
  },
  {
    id: 'bolt',
    text: 'to bolt.new',
    connector: TO,
    segments: [
      { icon: <BoltIcon className="h-[0.72em] w-auto translate-y-[0.09em]" /> },
    ],
  },
  {
    id: 'lovable',
    text: 'to Lovable',
    connector: TO,
    segments: [{ icon: <LovableIcon className="h-[0.72em] w-auto" /> }],
  },
  {
    id: 'codebase',
    text: 'to your code',
    connector: TO,
    segments: [{ text: 'your code', className: 'font-bold italic' }],
  },
]

export function HomePage() {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      {/* The <main> landmark lives in the shared _app layout; use a fragment here
          so we don't nest a second one. */}
      <>
        {/* Hero section */}
        <section className="container flex flex-col pt-6 sm:pt-8 md:pt-12">
          <div className="flex flex-col items-center gap-3 text-center md:gap-4">
            <Announcement />
            <h1
              aria-label="Build your design system. Ship it to v0, bolt.new, Lovable, your code, or anywhere."
              className="text-3xl leading-tight tracking-tighter text-balance max-lg:font-medium md:text-4xl lg:text-5xl"
            >
              <span aria-hidden="true">
                <AnimatedHeadline
                  lead="Build your design system. Ship it"
                  items={EXPORT_TARGETS}
                  trailing="."
                  wordStyle={HEADLINE_STYLE}
                />
              </span>
            </h1>
            <p className="max-w-2xl text-base text-balance text-fg-muted sm:text-lg">
              Beautiful components, accessibility out of the box, composition,
              and more.
              <br />
              Powered by{' '}
              <ReactAriaIcon className="inline-flex h-[0.85em] w-auto translate-y-[-0.08em]" />{' '}
              <span className="font-medium text-fg">React Aria</span> and{' '}
              <BaseUiIcon className="inline-flex h-[calc(0.85em+1px)] w-auto translate-y-[-0.08em]" />{' '}
              <span className="font-medium text-fg">Base&nbsp;UI</span>.
              {/* Install with <ShadcnIcon  className="inline-flex h-[calc(0.85em+1px)] w-auto translate-y-[-0.08em]" /> Shadcn CLI */}
            </p>
            <div className="flex w-full flex-col gap-2 pt-1 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <LinkButton href="/create" variant="primary" size="lg">
                Launch the editor
              </LinkButton>
              <LinkButton href="/docs/components" variant="default" size="lg">
                View components
              </LinkButton>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <Cards />
        </section>

        {/* Built on modern tools — pulled up to sit on the cards' bottom fade. The
				    masonry's tallest column leaves a tall, masked-to-black tail below the
				    other columns; without a big pull-up that reads as dead space. We pull
				    this row up to where the cards are nearly gone (~15% opacity) so it sits
				    right on the fade instead. The xl grid (4 columns) is shorter and denser
				    at the bottom, so it needs a slightly smaller pull than the 3-col layout. */}
        <section className="relative z-10 -mt-[380px] py-12 shadow-xs xl:-mt-[330px]">
          <div className="container flex flex-col items-center justify-center gap-5 lg:gap-10">
            <h2 className="font-mono text-sm tracking-wide text-pretty text-fg-muted xs:text-base lg:text-base">
              Built on modern tools
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {[
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
              ].map(({ icon, label, href }) => (
                <Tooltip key={href}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center opacity-60 grayscale-100 transition-opacity hover:opacity-100 hover:grayscale-0"
                    href={href}
                  >
                    {icon}
                  </a>
                  <TooltipContent placement="top">{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </section>
      </>
      <Footer />
    </div>
  )
}
