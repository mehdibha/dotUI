"use client"

import { useIsMobile } from "@/registry/hooks/use-mobile"
import {
  CalendarIcon,
  FileTextIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  PlusIcon,
} from "@/registry/icons"
import { Button } from "@/registry/ui/button"
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
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import {
  Board,
  BoardSection,
  StateRow,
  useDriven,
  useLoop,
  useReplay,
} from "./board"

const WORKSPACE = [
  { title: "Home", icon: HomeIcon },
  { title: "Inbox", icon: InboxIcon, badge: "12" },
  { title: "Projects", icon: FolderIcon, current: true },
  { title: "Calendar", icon: CalendarIcon },
]

const FAVORITES = ["Team handbook", "Release notes"]

const PROJECTS = [
  { name: "Website redesign", meta: "Updated 2h ago" },
  { name: "Mobile app", meta: "Updated yesterday" },
  { name: "Brand refresh", meta: "Updated 3d ago" },
  { name: "Q4 planning", meta: "Updated last week" },
  { name: "Onboarding flow", meta: "Updated 2w ago" },
]

function SidebarItems() {
  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="group-data-[collapsible=icon]:p-0!"
            >
              <BrandMark className="size-8" />
              <span className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium text-fg">
                  <BrandName>Acme</BrandName>
                </span>
                <span className="text-xs font-normal">Pro plan</span>
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
    </>
  )
}

/** An app shell: the sidebar on its tone, the content panel inset in it; it collapses on a loop while the panel edits its motion. */
function AppShell() {
  const { running } = useReplay("sidebarMotion")
  const [isOpen, setOpen] = useDriven(
    running,
    useLoop(running, 1600, true),
    true,
  )
  // Phones get the sidebar as their sheet shows it: no shell, no collapse.
  if (useIsMobile()) {
    return (
      <SidebarProvider className="min-h-0">
        <Sidebar collapsible="none" className="w-full">
          <SidebarItems />
        </Sidebar>
      </SidebarProvider>
    )
  }
  return (
    <SidebarProvider
      isOpen={isOpen}
      onOpenChange={setOpen}
      className="h-96 min-h-0 overflow-hidden"
    >
      <Sidebar variant="inset" collapsible="icon">
        <SidebarItems />
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-5">
          <span className="truncate text-sm font-medium">Projects</span>
          <Button size="sm">
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
              <span className="shrink-0 text-xs text-fg-muted">{meta}</span>
            </li>
          ))}
        </ul>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function SidebarBoard() {
  const { menuButton } = useSidebarStyles()()
  return (
    <Board id="sidebar">
      <BoardSection
        title="In context"
        className="block overflow-hidden p-0 max-sm:p-0"
      >
        <AppShell />
      </BoardSection>
      <BoardSection title="States" className="bg-sidebar">
        <StateRow states={["rest", "hover", "pressed", "selected"]}>
          {(props, state) => (
            <span
              {...props}
              data-size="md"
              data-active={state === "selected" || undefined}
              className={menuButton({ className: "w-28" })}
            >
              <InboxIcon />
              <span>Inbox</span>
            </span>
          )}
        </StateRow>
      </BoardSection>
    </Board>
  )
}
