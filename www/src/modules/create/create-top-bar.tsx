'use client'

import { siteConfig } from '@/config/site'
import { buttonStyles } from '@/registry/ui/button'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

/**
 * Minimal builder top bar for the shipped `/create` (and `?lab`) variants. The
 * global site Header is suppressed on `/create` (see routes/_app/route.tsx), so
 * these variants own this bar instead — same `--header-height`, Logo (→ home),
 * GitHub, and ThemeToggle as the site header, minus the nav links + search that
 * don't belong inside the builder. The studio variant ships its own richer bar.
 */
export function CreateTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) w-full shrink-0 items-center justify-between gap-3 border-b bg-bg/80 px-4 backdrop-blur md:px-6">
      <Logo />
      <div className="flex items-center gap-2">
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
        <ThemeToggle isIconOnly variant="quiet" size="sm" />
      </div>
    </header>
  )
}
