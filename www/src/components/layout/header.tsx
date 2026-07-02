import { Link as RouterLink, useLocation } from '@tanstack/react-router'
import type * as PageTree from 'fumadocs-core/page-tree'
import { SearchIcon } from 'lucide-react'

import { navItems, siteConfig } from '@/config/site'
import { cn } from '@/registry/lib/utils'
import { Button, buttonStyles } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { MobileNav } from '@/components/layout/mobile-nav'
import { SearchCommand } from '@/components/search-command'
import { ThemeToggle } from '@/components/theme-toggle'

// iOS-style progressive blur: each layer adds a larger backdrop blur over an
// overlapping gradient window. Where the windows overlap the blurs compound,
// ramping smoothly from sharp (bottom edge) to heavily blurred (top). The
// `to top` direction puts the strongest blur under the nav content. The wrapper
// must stay mask-free — a mask there establishes a backdrop root and kills the
// cross-layer compounding that makes the ramp smooth.
const BLUR_LAYERS = [
  {
    blur: 0.5,
    mask: 'linear-gradient(to top, transparent 0%, #000 10%, #000 30%, transparent 40%)',
  },
  {
    blur: 1,
    mask: 'linear-gradient(to top, transparent 10%, #000 20%, #000 40%, transparent 50%)',
  },
  {
    blur: 2,
    mask: 'linear-gradient(to top, transparent 15%, #000 30%, #000 50%, transparent 60%)',
  },
  {
    blur: 4,
    mask: 'linear-gradient(to top, transparent 20%, #000 40%, #000 60%, transparent 70%)',
  },
  {
    blur: 8,
    mask: 'linear-gradient(to top, transparent 40%, #000 60%, #000 80%, transparent 90%)',
  },
  { blur: 16, mask: 'linear-gradient(to top, transparent 60%, #000 80%)' },
  { blur: 24, mask: 'linear-gradient(to top, transparent 70%, #000 100%)' },
]

interface HeaderProps {
  className?: string
  items?: PageTree.Node[]
}

export function Header({ className, items = [] }: HeaderProps) {
  const { pathname } = useLocation()
  // Longest-matching-prefix wins so "/docs/components" highlights Components (not
  // Docs) while "/docs/button" still highlights Docs.
  const activeMatch = [...navItems]
    .sort((a, b) => b.match.length - a.match.length)
    .find(
      (item) =>
        pathname === item.match || pathname.startsWith(`${item.match}/`),
    )?.match

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-(--header-height) w-full items-center justify-between header-blur-fallback px-6',
        className,
      )}
    >
      {/* Keyed by pathname: navigating to a page with no root overflow (/create
          fills the viewport exactly) turns the scroll timeline inactive, and a
          newly inactive timeline HOLDS the animation's last progress — arriving
          from a scrolled page would freeze the blur fully on. Remounting restarts
          the animation; on an inactive timeline its time is unresolved, so no fill
          applies and --blur-progress falls back to its initial 0. */}
      <div
        key={pathname}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[180%] header-blur-reveal"
      >
        {BLUR_LAYERS.map(({ blur, mask }) => (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(calc(var(--blur-progress, 0) * ${blur}px))`,
              WebkitBackdropFilter: `blur(calc(var(--blur-progress, 0) * ${blur}px))`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            // Darkness rides this element's opacity (0.9 at full scroll) — never the
            // backdrop-filter layers, which would form an opacity group and drop the
            // blur. The gradient peaks at full --color-bg at the top.
            opacity: 'calc(var(--blur-progress, 0) * 0.9)',
            background:
              'linear-gradient(to top, transparent 0%, color-mix(in oklab, var(--color-bg) 76%, transparent) 55%, var(--color-bg) 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 header-blur-dither"
          style={{
            opacity: 'calc(var(--blur-progress, 0) * 0.035)',
          }}
        />
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <MobileNav items={items} />
        <Logo />
        <nav
          aria-label="Main"
          className="flex items-center gap-3 text-sm max-md:hidden"
        >
          {navItems.map((item) => {
            // Color highlights the whole section (Docs stays lit on /docs/button)
            // via the longest-prefix match above. aria-current is left to Router
            // Link with `exact` matching so it marks only the literal current page
            // — otherwise Link's default fuzzy match lights aria-current on both
            // Docs and Components for any /docs/components/* page.
            const isActive = item.match === activeMatch
            return (
              <RouterLink
                key={item.name}
                to={item.to}
                params={item.params}
                activeOptions={{ exact: true }}
                className={cn(
                  'px-0.5 transition-colors hover:text-fg',
                  isActive ? 'text-fg' : 'text-fg-muted',
                )}
              >
                {item.name}
              </RouterLink>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <SearchCommand keyboardShortcut items={items}>
          <Button
            variant="default"
            aria-label="Search docs"
            className="max-md:size-8 max-md:px-0 md:text-fg-muted"
          >
            <SearchIcon className="md:hidden" />
            <span className="mr-6 flex-1 max-md:hidden">Search docs...</span>
            <Kbd className="max-md:hidden">⌘ K</Kbd>
          </Button>
        </SearchCommand>
        <a
          aria-label="GitHub"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          data-icon-only=""
          className={buttonStyles({ variant: 'default' })}
        >
          <GitHubIcon />
        </a>
        <ThemeToggle isIconOnly />
      </div>
    </header>
  )
}
