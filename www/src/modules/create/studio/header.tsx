import { ChevronDownIcon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { Button, buttonStyles } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { GitHubIcon } from '@/components/icons/github'
import { ThemeToggle } from '@/components/theme-toggle'

// Wayfinding for the focused builder. The global site nav is gone here, so the
// wordmark doubles as the way back into the rest of the site — keeping the
// "customize here, see it on real components there" loop one click away without
// cluttering the bar with nav links. Mirrors `navItems` (minus Create, the
// current page); literal `to`s keep the router-link types happy.
const destinations = [
  { label: 'Home', to: '/' },
  { label: 'Docs', to: '/docs/$', params: { _splat: '' } },
  { label: 'Components', to: '/docs/$', params: { _splat: 'components' } },
  { label: 'Charts', to: '/charts' },
  { label: 'Presets', to: '/presets' },
] as const

export function StudioHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center justify-between border-b bg-bg px-4 lg:px-6">
      {/* Left: brand + wayfinding menu (logo opens the way back to the site). */}
      <Menu>
        <Button
          variant="quiet"
          size="sm"
          aria-label="Site menu"
          className="-ml-2 gap-1.5 px-2"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="size-5"
          >
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              rx="12"
              ry="12"
              className="fill-[#381e1e] dark:fill-white"
            />
            <circle
              cx="75"
              cy="75"
              r="11"
              className="fill-white dark:fill-[#381e1e]"
            />
          </svg>
          <span className="font-josefin text-base leading-none font-bold tracking-tighter">
            {siteConfig.name}
          </span>
          <ChevronDownIcon data-icon-end="" className="text-fg-muted" />
        </Button>
        <Popover placement="bottom start" className="min-w-44">
          <MenuContent>
            {destinations.map((d) => (
              <MenuItem
                key={d.label}
                href={
                  'params' in d ? { to: d.to, params: d.params } : { to: d.to }
                }
              >
                {d.label}
              </MenuItem>
            ))}
          </MenuContent>
        </Popover>
      </Menu>

      {/* Right: continuity cluster, shared with the site header so the
          transition reads as the same product. Builder actions (⌘K command,
          undo/redo, share, export) join here as the panels that back them land. */}
      <div className="flex items-center gap-1">
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
        <ThemeToggle variant="quiet" size="sm" isIconOnly />
      </div>
    </header>
  )
}
