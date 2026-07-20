import { Link as RouterLink } from '@tanstack/react-router'

import { navItems, siteConfig } from '@/config/site'
import { DiscordIcon } from '@/components/icons/discord'
import { GitHubIcon } from '@/components/icons/github'
import { TwitterIcon } from '@/components/icons/twitter'

const SOCIALS = [
  {
    label: 'GitHub',
    href: siteConfig.links.github,
    icon: <GitHubIcon className="size-4" />,
  },
  {
    label: 'X (Twitter)',
    href: siteConfig.links.twitter,
    icon: <TwitterIcon className="size-3.5" />,
  },
  {
    label: 'Discord',
    href: siteConfig.links.discord,
    icon: <DiscordIcon className="size-4" />,
  },
]

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <p className="text-sm text-fg-muted">
          Built with passion by{' '}
          <a
            href="https://x.com/mehdibha"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-fg"
          >
            @mehdibha
          </a>
          .
        </p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {navItems.map((item) => (
            <RouterLink
              key={item.name}
              to={item.to}
              params={item.params}
              className="text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {item.name}
            </RouterLink>
          ))}
          <span aria-hidden className="h-4 w-px bg-border" />
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-fg-muted transition-colors hover:text-fg"
            >
              {social.icon}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
