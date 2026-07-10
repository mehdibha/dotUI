import { Link } from 'react-aria-components'

import { LinkButton } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
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
  PageActions,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/page-header'
import {
  AnimatedHeadline,
  type RotatingTextItem,
} from '@/components/rotating-text'
import Cards from '@/modules/marketing/cards'

export function HomePage() {
  return (
    <div>
      <PageHeader>
        <PageTitle aria-label="Build your design system. Ship it to v0, bolt.new, Lovable, your code, or anywhere.">
          <span aria-hidden="true">
            <AnimatedHeadline
              lead="Build your design system. Ship it"
              items={EXPORT_TARGETS}
              trailing="."
            />
          </span>
        </PageTitle>
        <PageDescription>
          Beautiful components, accessibility out of the box, composition, and
          more.
          <br />
          Powered by{' '}
          <ReactAriaIcon className="inline-flex h-[0.85em] w-auto translate-y-[-0.08em]" />{' '}
          <span className="font-medium text-fg">React Aria</span> and{' '}
          <BaseUiIcon className="inline-flex h-[calc(0.85em+1px)] w-auto translate-y-[-0.08em]" />{' '}
          <span className="font-medium text-fg">Base&nbsp;UI</span>.
          {/* Install with <ShadcnIcon  className="inline-flex h-[calc(0.85em+1px)] w-auto translate-y-[-0.08em]" /> Shadcn CLI */}
        </PageDescription>
        <PageActions>
          <LinkButton href="/create" variant="primary" size="lg">
            Launch the editor
          </LinkButton>
          <LinkButton href="/docs/components" variant="default" size="lg">
            View components
          </LinkButton>
        </PageActions>
      </PageHeader>

      <section className="mt-16">
        <Cards />
      </section>

      {/* Tools section. */}
      <section className="relative z-10 -mt-[20px] py-12 shadow-xs">
        <div className="container flex flex-col items-center justify-center gap-5 lg:gap-10">
          <h2 className="font-mono text-sm tracking-wide text-pretty text-fg-muted xs:text-base lg:text-base">
            Built on modern tools
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
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

const TO = 'to\u00A0'

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
    segments: [{ icon: <LovableIcon className="h-[0.66em] w-auto" /> }],
  },
  {
    id: 'codebase',
    text: 'to your code',
    connector: TO,
    segments: [{ text: 'your code', className: 'font-bold italic' }],
  },
]
