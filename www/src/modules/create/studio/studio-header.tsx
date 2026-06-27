'use client'

import { DicesIcon, DownloadIcon, SparklesIcon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { Button, buttonStyles } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Overlay } from '@/registry/ui/overlay'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { useReroll } from '../panel/macros'
import { useStudio } from './studio-context'

/**
 * The Studio top bar — the single, full-width chrome on /create?studio. The
 * global site Header is skipped on this route (see _app/route.tsx), so this bar
 * carries the continuity language itself: the site Logo (linking home, the exit
 * door), the shared --header-height and px-6 gutter, plus theme + GitHub on the
 * right. Between those bookends sit the builder's genuinely-primary controls —
 * editable name, surprise-me re-roll, Ask AI, and Export. Everything else stays
 * in the inspector. Moving site → Studio → site stays one continuous product.
 */
export function StudioHeader() {
  const { name, setName, setActiveSection } = useStudio()
  const reroll = useReroll()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-3 border-b bg-card px-6">
      {/* Logo links home — the two-way door back out to the site. */}
      <Logo />
      <div className="h-5 w-px shrink-0 bg-border" aria-hidden />

      {/* Editable system name */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Design system name"
        spellCheck={false}
        className="max-w-56 min-w-0 truncate rounded-md bg-transparent px-1.5 py-1 text-sm font-medium outline-none hover:bg-neutral/60 focus:bg-neutral focus:ring-2 focus:ring-border-focus"
      />

      <div className="ml-auto flex items-center gap-1.5">
        <Tooltip>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Re-roll"
            onPress={reroll}
          >
            <DicesIcon />
          </Button>
          <TooltipContent>Surprise me</TooltipContent>
        </Tooltip>

        <Button
          size="sm"
          variant="default"
          className="gap-1.5"
          onPress={() => setActiveSection('generate')}
        >
          <SparklesIcon className="size-3.5 text-fg-accent" />
          Ask AI
        </Button>

        <Dialog>
          <Button size="sm" variant="primary" className="gap-1.5">
            <DownloadIcon data-icon-start="" />
            Export
          </Button>
          <Overlay
            type="modal"
            mobileType="drawer"
            modalProps={{ className: 'w-[min(28rem,92vw)]' }}
          >
            <DialogContent showCloseButton aria-label="Export" className="p-5">
              <h2 className="text-base font-semibold">
                Export your design system
              </h2>
              <p className="mt-0.5 mb-4 text-sm text-fg-muted">
                Install via the shadcn CLI, or open it straight in v0.
              </p>
              <ExportFooter />
              <div className="mt-3 border-t pt-3">
                <CodeOptionsDialog />
              </div>
            </DialogContent>
          </Overlay>
        </Dialog>

        {/* Continuity with the site header: same theme + GitHub affordances. */}
        <div className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden />
        <a
          aria-label="GitHub"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          data-icon-only=""
          className={buttonStyles({ variant: 'quiet', size: 'sm' })}
        >
          <GitHubIcon />
        </a>
        <ThemeToggle isIconOnly />
      </div>
    </header>
  )
}
