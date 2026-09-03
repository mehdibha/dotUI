import {
  CalendarIcon,
  ChevronsUpDownIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  PlusIcon,
  SparklesIcon,
} from "@/registry/__generated__/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/ui/sidebar"

const platform = [
  { title: "Dashboard", icon: HomeIcon, isActive: true },
  { title: "Inbox", icon: InboxIcon, badge: "12" },
  { title: "Calendar", icon: CalendarIcon },
]

const projects = ["Design system", "Marketing site", "Mobile app"]

// Native size, anchored top-left and cropped by the card on the right and
// bottom. The sidebar is narrowed so the inset's collapse trigger stays visible.
export function SidebarDemo() {
  return (
    <div className="absolute inset-0 pt-4 pl-4">
      <SidebarProvider
        className="h-80 min-h-0 w-[26rem] overflow-hidden rounded-lg border"
        style={{ "--sidebar-width": "12.5rem" } as React.CSSProperties}
      >
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-fg-on-primary">
                    <SparklesIcon className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium text-fg">Acme Inc</span>
                    <span className="text-xs">Enterprise</span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarMenu>
                {platform.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.isActive}>
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
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add project">
                <PlusIcon />
              </SidebarGroupAction>
              <SidebarMenu>
                {projects.map((title) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton>
                      <FolderIcon />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
            <SidebarTrigger />
            <span className="text-sm font-medium">Dashboard</span>
          </header>
          <div className="flex-1 p-3">
            <div className="size-full rounded-lg bg-muted" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
