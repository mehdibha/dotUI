import { CheckIcon, CopyIcon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { Button, LinkButton } from '@/registry/ui/button'
import { V0Icon } from '@/components/icons/v0'

const INIT_COMMAND = `npx shadcn init ${siteConfig.url}/r/init`
const ADD_COMMAND = 'npx shadcn add @dotui/button'

const V0_URL = `https://v0.dev/chat/api/open?url=${encodeURIComponent(`${siteConfig.url}/r/v0`)}`

const STEPS = [
  { title: 'Compose', detail: 'tune every axis in the editor' },
  { title: 'Preview', detail: 'every change live, on real components' },
  { title: 'Export', detail: 'into your codebase, or straight to v0' },
]

// What `shadcn add` actually lands in a consumer repo — real targets from the
// registry items, kept short.
const FILES = [
  'ui/button.tsx',
  'ui/menu.tsx',
  'ui/tooltip.tsx',
  'lib/utils.ts',
  'theme.css',
]

export function ExportSection() {
  return (
    // Width mirrors the composition section, so the two read as one system.
    <section className="mx-auto mt-24 w-full max-w-[calc(1500px+16rem)] px-4 sm:px-6 md:mt-32 lg:px-32">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* Copy + step list */}
        <div className="flex flex-col items-start gap-4">
          <p className="font-mono text-sm tracking-wide text-fg-muted">
            Export
          </p>
          <h2 className="text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
            Leave with code.
            <br />
            <span className="text-fg-muted">Not a dependency.</span>
          </h2>
          <p className="text-base text-fg-muted lg:max-w-md">
            One command scaffolds your design system into your repo — real
            files, styled your way, with no runtime dependency on us. Edit
            anything; it&rsquo;s yours.
          </p>
          <ol className="mt-2 flex flex-col">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-3 border-l py-1.5 pl-4 text-sm"
              >
                <span className="font-mono text-xs leading-5 text-fg-muted/50 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  {step.title}{' '}
                  <span className="text-fg-muted">— {step.detail}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2 pt-2">
            <LinkButton href="/create" variant="primary">
              Launch the editor
            </LinkButton>
            <LinkButton
              href={V0_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="default"
            >
              Open in <V0Icon className="h-3 w-auto" />
            </LinkButton>
          </div>
        </div>

        {/* Terminal card: the real commands, then what lands in the repo. */}
        <div className="min-w-0">
          <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
            <div className="flex flex-col gap-4 p-6">
              <CommandLine
                label="Initialize with your theme"
                command={INIT_COMMAND}
              />
              <CommandLine label="Add components" command={ADD_COMMAND} />
            </div>
            <div className="border-t p-6">
              <p className="font-mono text-xs text-fg-muted/70">
                {'//'} what lands in your repo
              </p>
              <ul className="mt-3 flex flex-col gap-1.5 font-mono text-[0.8125rem]">
                {FILES.map((file) => (
                  <li key={file} className="flex items-center gap-2">
                    <CheckIcon
                      aria-hidden
                      className="size-3.5 text-fg-muted/70"
                    />
                    {file}
                  </li>
                ))}
                <li className="text-fg-muted">…and every component you add.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CommandLine({ label, command }: { label: string; command: string }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div>
      <p className="mb-1.5 font-mono text-xs text-fg-muted/70">
        {'//'} {label}
      </p>
      <div className="flex items-center gap-2">
        <code className="no-scrollbar grow overflow-x-auto font-mono text-[0.8125rem] whitespace-nowrap">
          <span className="text-fg-muted select-none">$ </span>
          {command}
        </code>
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          className="shrink-0"
          onPress={() => copyToClipboard(command)}
          aria-label={isCopied ? 'Copied' : `Copy: ${command}`}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
    </div>
  )
}
