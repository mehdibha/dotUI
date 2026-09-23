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
import { DialogContent } from "@/registry/ui/dialog"
import { Drawer, DrawerIndent, DrawerProvider } from "@/registry/ui/drawer"
import { GitHubIcon } from "@/components/icons/github"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/theme-toggle"

const MobileMenuContext = React.createContext<{
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}>({ isOpen: false, setOpen: () => {} })

const primaryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Docs: BookOpenIcon,
  Components: LayoutGridIcon,
  Studio: SwatchBookIcon,
}

const primaryUrls = new Set(["/", ...navItems.map((item) => item.match)])

/**
 * Claude-app-style sidebar for small screens: a left drawer that pushes the
 * page aside. Only this drawer sits under the indent's provider — every other
 * drawer in the app is under the nested one, so none of them can push the page.
 */
export function MobileMenuLayout({
  items,
  children,
}: {
  items: PageTree.Node[]
  children: React.ReactNode
}) {
  const [isOpen, setOpen] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)")
    const onChange = () => query.matches && setOpen(false)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return (
    <MobileMenuContext.Provider value={{ isOpen, setOpen }}>
      <DrawerProvider>
        {/* Same surface as the page it pushes aside; the `mobile-menu` class
            is the hook styles.css uses to hide the backdrop. */}
        <Drawer
          isOpen={isOpen}
          onOpenChange={setOpen}
          placement="left"
          className="mobile-menu w-(--mobile-menu-width) rounded-none border-0 bg-bg shadow-none"
        >
          <MenuContent items={items} onNavigate={() => setOpen(false)} />
        </Drawer>
        {/* Clips the pushed page: horizontal overflow would make mobile
            browsers grow the layout viewport, and every fixed overlay with it. */}
        <div className="overflow-x-clip">
          {/* Only transform animates, and the swipe follows the finger 1:1
              (duration drops to 0 while swipe progress is non-zero). */}
          <DrawerIndent className="z-auto transition-transform duration-[calc(500ms*(1-clamp(0,calc(var(--drawer-swipe-progress,0)*100000),1)))] data-inactive:transform-none data-active:transform-[translate3d(calc(var(--mobile-menu-width)*(1-var(--drawer-swipe-progress,0))),0,0)] data-active:rounded-none">
            <PageFrame isOpen={isOpen} />
            <DrawerProvider>{children}</DrawerProvider>
          </DrawerIndent>
        </div>
      </DrawerProvider>
    </MobileMenuContext.Provider>
  )
}

/**
 * Rounds and outlines the visible part of the pushed page. Pinned to the
 * viewport, so the card reads the same at any scroll depth; the spread shadow
 * paints the page color outside the rounded corners.
 */
function PageFrame({ isOpen }: { isOpen: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none sticky top-0 z-50 h-0">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-dvh rounded-3xl border border-[color-mix(in_oklab,var(--color-fg)_25%,var(--color-bg))] opacity-0 shadow-[0_0_0_3rem_var(--color-bg)] transition-opacity duration-500 ease-fluid-out",
          isOpen && "opacity-100",
        )}
      />
    </div>
  )
}

export function MobileMenuButton() {
  const { isOpen, setOpen } = React.useContext(MobileMenuContext)
  return (
    // Linear-style two-bar icon that folds into an X; no hover/press fill,
    // those states don't exist on touch. The negative margin aligns the icon
    // with the header's content edge.
    <Button
      variant="quiet"
      isIconOnly
      aria-label="Menu"
      aria-expanded={isOpen}
      onPress={() => setOpen(true)}
      className="-ml-2 hover:bg-transparent lg:hidden pressed:bg-transparent"
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
  )
}

function MenuContent({
  items,
  onNavigate,
}: {
  items: PageTree.Node[]
  onNavigate: () => void
}) {
  const { pathname } = useLocation()
  const navRef = React.useRef<HTMLElement>(null)

  // Longest prefix wins: /docs/components/* lights Components, not Docs.
  const activeMatch = [...navItems]
    .sort((a, b) => b.match.length - a.match.length)
    .find(
      (item) =>
        pathname === item.match || pathname.startsWith(`${item.match}/`),
    )?.match

  // Mounts on open: center the current page in the long docs list.
  React.useLayoutEffect(() => {
    const nav = navRef.current
    const current = nav?.querySelector<HTMLElement>("[data-current]")
    if (!nav || !current) return
    nav.scrollTop =
      current.offsetTop - (nav.clientHeight - current.offsetHeight) / 2
  }, [])

  return (
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
      <nav
        ref={navRef}
        aria-label="Main"
        className="relative no-scrollbar min-h-0 flex-1 scroll-fade-y overflow-y-auto px-2 pt-2 pb-4 scroll-fade-6"
      >
        <ul className="flex flex-col">
          <li>
            <MenuLink
              to="/"
              icon={HouseIcon}
              isActive={pathname === "/"}
              label="Home"
              onNavigate={onNavigate}
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
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
        {items.map((group) => {
          if (group.type !== "folder") return null
          const pages = group.children.filter(
            (item): item is PageTree.Item =>
              item.type === "page" && !primaryUrls.has(item.url),
          )
          if (pages.length === 0) return null
          return (
            <section key={group.$id} className="mt-4">
              <h2 className="px-3 pt-2 pb-1 text-sm font-normal text-fg-muted">
                {group.name}
              </h2>
              <ul className="flex flex-col">
                {pages.map((page) => (
                  <li key={page.url}>
                    <MenuLink
                      to="/docs/$"
                      params={{ _splat: page.url.replace(/^\/docs\/?/, "") }}
                      isActive={pathname === page.url}
                      label={page.name as string}
                      onNavigate={onNavigate}
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
            className={buttonStyles({ variant: "quiet", isIconOnly: true })}
          >
            <GitHubIcon />
          </a>
          <ThemeToggle variant="quiet" isIconOnly />
        </div>
        {pathname !== "/studio" && (
          <LinkButton
            href="/studio"
            variant="primary"
            onPress={onNavigate}
            className="rounded-full px-4"
          >
            Open studio
          </LinkButton>
        )}
      </div>
    </DialogContent>
  )
}

function MenuLink({
  to,
  params,
  icon: Icon,
  isActive,
  label,
  onNavigate,
  secondary = false,
}: {
  to: string
  params?: { _splat: string }
  icon?: React.ComponentType<{ className?: string }>
  isActive: boolean
  label: string
  onNavigate: () => void
  secondary?: boolean
}) {
  return (
    <RouterLink
      to={to}
      params={params}
      // aria-current marks the literal page only; isActive also lights the
      // section row (Components on /docs/components/button).
      activeOptions={{ exact: true, includeSearch: false }}
      onClick={onNavigate}
      data-current={secondary && isActive ? "" : undefined}
      className={cn(
        "flex items-center gap-4 rounded-xl px-3 text-fg transition-colors duration-100 active:bg-neutral",
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
