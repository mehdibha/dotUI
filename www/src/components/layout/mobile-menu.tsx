import React from "react"
import { Link as RouterLink, useLocation } from "@tanstack/react-router"
import type * as PageTree from "fumadocs-core/page-tree"
import {
  BookOpenIcon,
  HouseIcon,
  LayoutGridIcon,
  SwatchBookIcon,
} from "lucide-react"

import { navItems, siteConfig } from "@/config/site"
import { cn } from "@/registry/lib/utils"
import { Button, buttonStyles, LinkButton } from "@/registry/ui/button"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Drawer } from "@/registry/ui/drawer"
import { GitHubIcon } from "@/components/icons/github"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/theme-toggle"

const primaryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Docs: BookOpenIcon,
  Components: LayoutGridIcon,
  Studio: SwatchBookIcon,
}

const rowStyles =
  "flex items-center gap-4 rounded-xl px-3 text-fg transition-colors duration-100 active:bg-neutral"

/**
 * Claude-app-style sidebar for small screens: a left drawer the page slides
 * away from (see the DrawerIndent in routes/_app/route.tsx), listing the
 * primary navigation, the docs tree, and the studio CTA pinned at the bottom.
 */
export function MobileMenu({ items }: { items: PageTree.Node[] }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { pathname } = useLocation()

  // Close on navigation — links inside the menu route client-side, so the
  // drawer would otherwise stay open over the new page.
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const activeMatch = [...navItems]
    .sort((a, b) => b.match.length - a.match.length)
    .find(
      (item) =>
        pathname === item.match || pathname.startsWith(`${item.match}/`),
    )?.match

  return (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      {/* Linear-style two-bar menu icon; no hover/press fill — those states
          don't exist on touch. Bars sit at the center and shift apart when
          closed; on open they collapse back and rotate into an X (Linear's
          160ms ease-out-quad). order-last keeps it at the far edge past the
          slot's Export action on /studio. */}
      <Button
        variant="quiet"
        isIconOnly
        aria-label="Menu"
        className="order-last hover:bg-transparent lg:hidden pressed:bg-transparent"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden
          className="**:[rect]:origin-center **:[rect]:transition-transform **:[rect]:duration-160 **:[rect]:ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        >
          <rect
            x="1"
            y="7.5"
            width="14"
            height="1"
            rx="0.5"
            className="translate-y-[-3.5px] group-aria-expanded/button:translate-y-0 group-aria-expanded/button:rotate-45"
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
      {/* Same surface as the page it pushes aside: no border, radius or
          shadow — the pushed page is what gets dimmed and rounded. */}
      <Drawer
        placement="left"
        className="w-(--mobile-menu-width) rounded-none border-0 bg-bg shadow-none"
      >
        <DialogContent
          aria-label="Menu"
          className="h-full gap-0 overflow-hidden p-0!"
        >
          <div className="flex h-14 shrink-0 items-center gap-2.5 px-4">
            <Logo />
            <span className="font-heading text-lg font-medium">
              {siteConfig.name}
            </span>
          </div>
          <nav className="no-scrollbar min-h-0 flex-1 scroll-fade-y overflow-y-auto px-2 pt-2 pb-4 scroll-fade-6">
            <ul className="flex flex-col">
              <li>
                <MenuLink
                  to="/"
                  icon={HouseIcon}
                  isActive={pathname === "/"}
                  label="Home"
                />
              </li>
              {navItems.map((item) => (
                <li key={item.name}>
                  <MenuLink
                    to={item.to}
                    params={item.params}
                    icon={primaryIcons[item.name]}
                    isActive={item.match === activeMatch}
                    label={item.name}
                  />
                </li>
              ))}
            </ul>
            {items.map((group) => {
              if (group.type !== "folder") return null
              const pages = group.children.filter(
                (item): item is PageTree.Item => item.type === "page",
              )
              if (pages.length === 0) return null
              return (
                <section key={group.$id} className="mt-4">
                  <h3 className="px-3 pt-2 pb-1 text-sm font-normal text-fg-muted">
                    {group.name}
                  </h3>
                  <ul className="flex flex-col">
                    {pages.map((page) => (
                      <li key={page.url}>
                        <MenuLink
                          to="/docs/$"
                          params={{
                            _splat: page.url.replace(/^\/docs\/?/, ""),
                          }}
                          isActive={pathname === page.url}
                          label={page.name as string}
                          secondary
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </nav>
          <div className="flex shrink-0 items-center justify-between gap-2 px-3 pt-2 pb-[max(--spacing(3),env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-1">
              <a
                aria-label="GitHub"
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                data-icon-only=""
                className={buttonStyles({
                  variant: "quiet",
                  isIconOnly: true,
                })}
              >
                <GitHubIcon />
              </a>
              <ThemeToggle variant="quiet" isIconOnly />
            </div>
            <LinkButton
              href="/studio"
              variant="primary"
              className="rounded-full px-4"
            >
              Open studio
            </LinkButton>
          </div>
        </DialogContent>
      </Drawer>
    </Dialog>
  )
}

function MenuLink({
  to,
  params,
  icon: Icon,
  isActive,
  label,
  secondary = false,
}: {
  to: string
  params?: { _splat: string }
  icon?: React.ComponentType<{ className?: string }>
  isActive: boolean
  label: string
  secondary?: boolean
}) {
  return (
    <RouterLink
      to={to}
      params={params}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        rowStyles,
        secondary ? "py-2 text-[15px]" : "py-2.5 text-[17px] font-medium",
        isActive && "bg-neutral",
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center">
        {Icon ? (
          <Icon className="size-5" />
        ) : (
          <span
            className={cn(
              "size-1.5 rounded-full",
              isActive ? "bg-fg" : "bg-fg-muted/40",
            )}
          />
        )}
      </span>
      <span className="truncate">{label}</span>
    </RouterLink>
  )
}
