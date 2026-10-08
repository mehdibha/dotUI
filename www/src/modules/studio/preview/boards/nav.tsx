"use client"

import { useEffect, useState } from "react"
import type { Key } from "react-aria-components"

import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarIcon,
  ExternalLinkIcon,
  FileTextIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  SparklesIcon,
  TableIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/registry/ui/breadcrumbs"
import { useStyles as useBreadcrumbsStyles } from "@/registry/ui/breadcrumbs/styles"
import { Button } from "@/registry/ui/button"
import { Link } from "@/registry/ui/link"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/ui/sidebar"
import { useStyles as useSidebarStyles } from "@/registry/ui/sidebar/styles"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"

import { Board, BoardSection, Specimen, StateRow, useBoardFocus } from "./board"

// Specimen links point nowhere: keep the board where it is.
const stay = (event: React.MouseEvent) => event.preventDefault()

/* ----------------------------------- Tabs ---------------------------------- */

const PROJECT_TABS = ["overview", "deployments", "analytics"]

/** Walks the selection across the tabs while the panel edits their motion. */
function useReplay() {
  const { axis } = useBoardFocus()
  const playing = axis === "navMotion"
  const [selected, setSelected] = useState<Key>("overview")
  useEffect(() => {
    if (!playing) return
    let step = 0
    const timer = setInterval(() => {
      step += 1
      setSelected(PROJECT_TABS[step % PROJECT_TABS.length] ?? "overview")
    }, 900)
    return () => {
      clearInterval(timer)
      setSelected("overview")
    }
  }, [playing])
  return [selected, setSelected] as const
}

function ProjectTabs({
  orientation = "horizontal",
}: {
  orientation?: "horizontal" | "vertical"
}) {
  const [selected, setSelected] = useReplay()
  return (
    <Tabs
      orientation={orientation}
      selectedKey={selected}
      onSelectionChange={setSelected}
    >
      <TabList aria-label="Project">
        <Tab id="overview">Overview</Tab>
        <Tab id="deployments">Deployments</Tab>
        <Tab id="analytics">Analytics</Tab>
        <Tab id="logs" isDisabled>
          Logs
        </Tab>
      </TabList>
    </Tabs>
  )
}

// Wide rows scroll at phone width, as they would in an app.
const SCROLLER =
  "max-w-full items-center-safe overflow-x-auto [scrollbar-width:none]"

const VARIANTS = [
  { variant: "segmented", label: "Segmented" },
  { variant: "line", label: "Line" },
  { variant: "pill", label: "Pill" },
] as const

function TabsSpecimens() {
  return (
    <>
      <div className="flex w-full flex-wrap items-start justify-center gap-x-16 gap-y-10">
        <Specimen label="Horizontal" className={SCROLLER}>
          <ProjectTabs />
        </Specimen>
        <Specimen label="Vertical">
          <ProjectTabs orientation="vertical" />
        </Specimen>
      </div>
      <div className="flex w-full flex-wrap items-start justify-evenly gap-x-12 gap-y-8 border-t pt-8">
        {VARIANTS.map(({ variant, label }) => (
          <Specimen key={variant} label={label}>
            <Tabs defaultSelectedKey="code">
              <TabList aria-label={label} variant={variant}>
                <Tab id="code">Code</Tab>
                <Tab id="preview">Preview</Tab>
                <Tab id="console" isDisabled>
                  Console
                </Tab>
              </TabList>
            </Tabs>
          </Specimen>
        ))}
      </div>
    </>
  )
}

/* --------------------------------- Sidebar --------------------------------- */

const WORKSPACE = [
  { title: "Home", icon: HomeIcon },
  { title: "Inbox", icon: InboxIcon, badge: "12" },
  { title: "Projects", icon: FolderIcon, current: true },
  { title: "Calendar", icon: CalendarIcon },
]

const FAVORITES = ["Website redesign", "Mobile app", "Brand refresh"]

const PROJECTS = [
  { name: "Website redesign", meta: "Updated 2h ago" },
  { name: "Mobile app", meta: "Updated yesterday" },
  { name: "Brand refresh", meta: "Updated 3d ago" },
  { name: "Q4 planning", meta: "Updated last week" },
]

/** An app shell: the sidebar on its tone, the content panel inset in it. */
function AppShell() {
  return (
    <SidebarProvider className="h-104 min-h-0 overflow-hidden">
      {/* The inset variant's peer, so the panel and the frame take the shell's look. */}
      <div data-variant="inset" data-side="left" className="peer flex">
        <Sidebar collapsible="none" className="w-44 sm:w-60">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <span className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-fg-on-primary">
                    <SparklesIcon className="size-4" />
                  </span>
                  <span className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium text-fg">Acme</span>
                    <span className="text-xs">Pro plan</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarMenu>
                {WORKSPACE.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.current}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Favorites</SidebarGroupLabel>
              <SidebarMenu>
                {FAVORITES.map((title) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton>
                      <FileTextIcon />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-5">
          <span className="truncate text-sm font-medium">Projects</span>
          <Button size="sm" className="max-sm:hidden">
            <PlusIcon />
            New project
          </Button>
        </header>
        <ul className="flex flex-col px-5">
          {PROJECTS.map(({ name, meta }) => (
            <li
              key={name}
              className="flex items-center justify-between gap-4 border-b py-3.5 text-sm last:border-b-0"
            >
              <span className="truncate font-medium">{name}</span>
              <span className="shrink-0 text-xs text-fg-muted max-sm:hidden">
                {meta}
              </span>
            </li>
          ))}
        </ul>
      </SidebarInset>
    </SidebarProvider>
  )
}

/** The menu item frozen in each state, on the sidebar's tone. */
function SidebarStates() {
  const { menuButton } = useSidebarStyles()()
  return (
    <div className="border-t bg-sidebar px-5 py-8">
      <StateRow
        states={["rest", "hover", "pressed", "selected", "focus", "disabled"]}
      >
        {(props, state) => (
          <span
            {...props}
            data-size="md"
            data-active={state === "selected" || undefined}
            className={menuButton({ className: "w-32" })}
          >
            <InboxIcon />
            <span>Inbox</span>
          </span>
        )}
      </StateRow>
    </div>
  )
}

/* ------------------------------ Hosted members ----------------------------- */

function Segmented() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
      <SegmentedControl defaultSelectedKeys={["week"]} aria-label="Range">
        <SegmentedControlItem id="day">Day</SegmentedControlItem>
        <SegmentedControlItem id="week">Week</SegmentedControlItem>
        <SegmentedControlItem id="month">Month</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl defaultSelectedKeys={["grid"]} aria-label="View">
        <SegmentedControlItem id="grid">
          <LayoutGridIcon />
          Grid
        </SegmentedControlItem>
        <SegmentedControlItem id="list">
          <ListIcon />
          List
        </SegmentedControlItem>
        <SegmentedControlItem id="table">
          <TableIcon />
          Table
        </SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}

const PAGES = 12

function pageRange(current: number): (number | "gap")[] {
  const shown = [...new Set([1, current - 1, current, current + 1, PAGES])]
    .filter((page) => page >= 1 && page <= PAGES)
    .sort((a, b) => a - b)
  let previous = 0
  return shown.flatMap((page) => {
    const gap = page - previous > 1
    previous = page
    return gap ? ["gap" as const, page] : [page]
  })
}

function Pager() {
  const [page, setPage] = useState(4)
  return (
    <Pagination className="w-auto">
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious
            isDisabled={page === 1}
            onPress={() => setPage(page - 1)}
          />
        </PaginationItem>
        {pageRange(page).map((p, i) =>
          p === "gap" ? (
            <PaginationItem key={`gap-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem
              key={p}
              // Phones keep the first, current and last pages.
              className={cn(
                p !== page && p !== 1 && p !== PAGES && "max-sm:hidden",
              )}
            >
              <PaginationLink
                isActive={p === page}
                aria-label={`Page ${p}`}
                onPress={() => setPage(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            isDisabled={page === PAGES}
            onPress={() => setPage(page + 1)}
          />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  )
}

/* ---------------------------------- Links ---------------------------------- */

function LinkSpecimens() {
  const link = useLinkStyles()
  return (
    <>
      <div
        onClickCapture={stay}
        className="flex w-full flex-wrap items-start justify-center gap-x-16 gap-y-8"
      >
        <Specimen label="In text" className="max-w-sm items-stretch">
          <p className="text-sm/relaxed text-fg-muted">
            Your trial ends in 5 days. <Link href="#">Upgrade your plan</Link>{" "}
            to keep unlimited projects, or <Link href="#">compare plans</Link>{" "}
            first.
          </p>
        </Specimen>
        <Specimen label="Standalone" className="items-stretch">
          <div className="flex flex-col items-start gap-2.5 text-sm">
            <Link href="#">
              <BookOpenIcon className="size-4" />
              Read the docs
            </Link>
            <Link href="#">
              View changelog
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link href="#">
              Status page
              <ExternalLinkIcon className="size-3.5" />
            </Link>
          </div>
        </Specimen>
      </div>
      <div className="w-full border-t pt-8">
        <StateRow>
          {(props) => (
            <span {...props} className={link({ className: "text-sm" })}>
              View invoice
            </span>
          )}
        </StateRow>
      </div>
    </>
  )
}

/* ------------------------------- Breadcrumbs ------------------------------- */

const TRAIL = ["Acme", "Projects", "Website redesign", "Settings"]

function BreadcrumbSpecimens() {
  const { root, link } = useBreadcrumbsStyles()()
  return (
    <>
      <div
        onClickCapture={stay}
        className="flex w-full flex-col items-center gap-6"
      >
        <Breadcrumbs>
          {TRAIL.map((label, i) => (
            <BreadcrumbItem key={label}>
              {i < TRAIL.length - 1 ? (
                <>
                  <BreadcrumbLink href="#">{label}</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbLink>{label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
        <Breadcrumbs>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">
              <HomeIcon className="size-4" />
              My Drive
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">
              <FolderIcon className="size-4" />
              Design
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <FileTextIcon className="size-4" />
              Logo.svg
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="w-full border-t pt-8">
        <StateRow states={["rest", "hover", "focus"]}>
          {(props) => (
            <span className={root()}>
              <a {...props} className={link()}>
                Projects
              </a>
            </span>
          )}
        </StateRow>
      </div>
    </>
  )
}

/* ---------------------------------- Board ---------------------------------- */

const STACK = "flex-col flex-nowrap gap-8"

export default function NavBoard() {
  return (
    <Board id="nav">
      <BoardSection
        member="tabs"
        title="Tabs"
        axes={[
          "tabStyle",
          "tabsColor",
          "tabIndicator",
          "tabsPill",
          "navWeight",
          "navCase",
          "navMotion",
        ]}
        className={STACK}
      >
        <TabsSpecimens />
      </BoardSection>
      <BoardSection
        member="sidebar"
        title="Sidebar"
        axes={[
          "navMarker",
          "navItemWeight",
          "shellTone",
          "tabsColor",
          "navCase",
        ]}
        className="block overflow-hidden p-0 max-sm:p-0"
      >
        <AppShell />
        <SidebarStates />
      </BoardSection>
      <BoardSection
        member="segmented-control"
        title="Segmented control"
        axes={["segmentedSelected", "navWeight", "navCase"]}
      >
        <Segmented />
      </BoardSection>
      <BoardSection
        member="pagination"
        title="Pagination"
        axes={["paginationCurrent"]}
      >
        <div className={SCROLLER}>
          <Pager />
        </div>
      </BoardSection>
      <BoardSection
        member="link"
        title="Links"
        axes={["linkUnderline", "linkColor"]}
        className={STACK}
      >
        <LinkSpecimens />
      </BoardSection>
      <BoardSection
        member="breadcrumbs"
        title="Breadcrumbs"
        axes={["breadcrumbSeparator", "breadcrumbTone"]}
        className={STACK}
      >
        <BreadcrumbSpecimens />
      </BoardSection>
    </Board>
  )
}
