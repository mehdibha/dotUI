import { useEffect, useState } from 'react'
import { Link as RouterLink } from '@tanstack/react-router'
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

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

interface HeaderProps {
  className?: string
  items?: PageTree.Node[]
}

export function Header({ className, items = [] }: HeaderProps) {
  const scrolled = useScrolled(8)

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn(
        'group/header sticky top-0 z-30 flex h-(--header-height) w-full items-center justify-between px-6',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[180%] opacity-0 transition-opacity duration-300 ease-out group-data-[scrolled]/header:opacity-100"
      >
        {BLUR_LAYERS.map(({ blur, mask }) => (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, transparent 0%, color-mix(in oklab, var(--color-bg) 55%, transparent) 55%, color-mix(in oklab, var(--color-bg) 72%, transparent) 100%)',
          }}
        />
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <MobileNav items={items} />
        <Logo className="max-md:hidden" />
        <nav className="flex items-center gap-3 text-sm max-md:hidden">
          {navItems.map((item) => (
            <RouterLink
              key={item.name}
              to={item.to}
              className="px-0.5 text-fg-muted transition-colors hover:text-fg"
            >
              {item.name}
            </RouterLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <SearchCommand keyboardShortcut items={items}>
          <Button
            variant="default"
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
