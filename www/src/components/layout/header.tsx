import { Link as RouterLink, useLocation } from "@tanstack/react-router"
import type * as PageTree from "fumadocs-core/page-tree"
import { SearchIcon } from "lucide-react"

import { navItems, siteConfig } from "@/config/site"
import { cn } from "@/registry/lib/utils"
import { Button, buttonStyles, LinkButton } from "@/registry/ui/button"
import { Separator } from "@/registry/ui/separator"
import { GitHubIcon } from "@/components/icons/github"
import { HeaderActionsSlot } from "@/components/layout/header-slot"
import { Logo } from "@/components/layout/logo"
import { ProgressiveBlur } from "@/components/progressive-blur"
import { SearchCommand } from "@/components/search-command"
import { ThemeToggle } from "@/components/theme-toggle"
import { DocsTocSelect } from "@/modules/docs/docs-toc-select"

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
        "sticky top-0 z-30 flex h-(--header-height) w-full items-center justify-between blur-reveal-fallback pr-3 pl-4 md:pr-4 md:pl-6",
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
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140%] blur-reveal"
      >
        <ProgressiveBlur />
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <Logo />
        {/* Small screens have no in-page TOC (the MiniTOC is md–xl); surface it
            here next to the logo instead. Renders null off docs pages. */}
        <DocsTocSelect className="md:hidden" />
        <nav
          aria-label="Main"
          className="flex items-center gap-3 text-sm max-lg:hidden"
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
                  "px-0.5 transition-colors hover:text-fg",
                  isActive ? "text-fg" : "text-fg-muted",
                )}
              >
                {item.name}
              </RouterLink>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center gap-0.5">
        {/* One dialog, two triggers: RAC's DialogTrigger reaches pressables via
            context, so the desktop search icon and the mobile menu button share
            the same search surface — its empty state already lists the full
            navigation, GitHub and the theme toggle, so mobile needs nothing else. */}
        <SearchCommand keyboardShortcut items={items}>
          <Button
            variant="quiet"
            isIconOnly
            aria-label="Search docs"
            className="max-lg:hidden"
          >
            <SearchIcon />
          </Button>
          {/* Linear-style two-bar menu icon; no hover/press fill — those
              states don't exist on touch. Bars sit at the center and shift
              apart when closed; on open they collapse back and rotate into an
              X (Linear's 160ms ease-out-quad). */}
          <Button
            variant="quiet"
            isIconOnly
            aria-label="Menu"
            className="hover:bg-transparent lg:hidden pressed:bg-transparent"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden
              className="**:[rect]:origin-center **:[rect]:transition-transform **:[rect]:duration-[160ms] **:[rect]:ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            >
              <rect
                x="1"
                y="7.5"
                width="14"
                height="1"
                rx="0.5"
                className="-translate-y-[3.5px] group-aria-expanded/button:translate-y-0 group-aria-expanded/button:rotate-45"
              />
              <rect
                x="1"
                y="7.5"
                width="14"
                height="1"
                rx="0.5"
                className="translate-y-[3.5px] group-aria-expanded/button:translate-y-0 group-aria-expanded/button:-rotate-45"
              />
            </svg>
          </Button>
        </SearchCommand>
        <a
          aria-label="GitHub"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          data-icon-only=""
          className={buttonStyles({
            variant: "quiet",
            isIconOnly: true,
            className: "max-lg:hidden",
          })}
        >
          <GitHubIcon />
        </a>
        <ThemeToggle variant="quiet" isIconOnly className="max-lg:hidden" />
        {/* Splits the icon cluster from the primary action — the studio CTA,
            or on /studio the Export action portaled into the slot below. */}
        <Separator
          orientation="vertical"
          className="mx-1.5 h-4 max-lg:hidden"
        />
        <HeaderActionsSlot />
        {/* On /studio the slot above carries studio-specific actions instead.
            Desktop-only: studio is a desktop tool, and mobile keeps the navbar
            to logo + menu — Studio stays reachable from the menu drawer. */}
        {pathname !== "/studio" && (
          <LinkButton
            href="/studio"
            variant="primary"
            size="sm"
            className="max-lg:hidden"
          >
            Open studio
          </LinkButton>
        )}
      </div>
    </header>
  )
}
