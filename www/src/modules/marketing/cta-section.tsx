import { CheckIcon, ChevronDownIcon, CopyIcon } from 'lucide-react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { Button, LinkButton } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import {
  buildInstallCommands,
  PACKAGE_MANAGERS,
  packageManagerStore,
} from '@/modules/docs/install-commands'
import type { PackageManager } from '@/modules/docs/install-commands'

/** Closing CTA: the whole pitch reduced to one headline and one command. */
export function CtaSection() {
  return (
    <section className="container mt-24 flex flex-col items-center text-center md:mt-36">
      <h2 className="[font-feature-settings:'calt'_0,'rlig','ss11'] text-3xl leading-tight font-normal tracking-[-0.05em] text-balance antialiased sm:text-5xl">
        Your design system, one command away.
      </h2>
      <div className="mt-8 flex max-w-full flex-wrap items-center justify-center gap-3">
        <LinkButton
          href="/create"
          variant="primary"
          size="lg"
          className="rounded-full"
        >
          Launch the editor
        </LinkButton>
        <InstallCommand />
      </div>
    </section>
  )
}

function InstallCommand() {
  const packageManager = packageManagerStore.useValue()
  const command = buildInstallCommands(['all'])[packageManager]
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div className="flex h-11 max-w-full items-center gap-1 rounded-full border bg-card px-1.5 shadow-xs">
      <Menu>
        <Button
          size="sm"
          variant="quiet"
          className="rounded-full font-mono text-xs text-fg-muted"
        >
          {packageManager}
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover placement="bottom start">
          <MenuContent
            aria-label="Package manager"
            selectionMode="single"
            selectedKeys={[packageManager]}
            onSelectionChange={(keys) => {
              if (keys === 'all') return
              const next = keys.values().next().value
              if (typeof next === 'string') {
                packageManagerStore.set(next as PackageManager)
              }
            }}
          >
            {PACKAGE_MANAGERS.map((pm) => (
              <MenuItem key={pm} id={pm} className="font-mono text-xs">
                {pm}
              </MenuItem>
            ))}
          </MenuContent>
        </Popover>
      </Menu>
      <div aria-hidden className="h-4 w-px shrink-0 bg-border" />
      <code className="no-scrollbar min-w-0 overflow-x-auto px-1.5 font-mono text-[0.8125rem] whitespace-nowrap">
        <span className="text-fg-muted select-none">$ </span>
        {command}
      </code>
      <Button
        size="sm"
        isIconOnly
        variant="quiet"
        aria-label="Copy install command"
        onPress={() => copyToClipboard(command)}
        className="rounded-full text-fg-muted"
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}
