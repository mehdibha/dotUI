import {
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  SettingsIcon,
} from "@/registry/__generated__/icons"
import { Badge } from "@/registry/ui/badge"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/registry/ui/breadcrumbs"
import { Link } from "@/registry/ui/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/ui/sidebar"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"

import { Cell, Sheet } from "./layout"

const TAB_VARIANTS = [
  undefined,
  "segmented",
  "line",
  "pill",
  "enclosed",
] as const

const NAV = [
  { title: "Home", icon: HomeIcon, isActive: true },
  { title: "Inbox", icon: InboxIcon },
  { title: "Projects", icon: FolderIcon },
  { title: "Calendar", icon: CalendarIcon },
  { title: "Settings", icon: SettingsIcon },
]

export function NavigationSheet() {
  return (
    <Sheet className="grid-cols-[1fr_600px]">
      <div className="flex flex-col gap-6">
        {TAB_VARIANTS.map((variant) => (
          <Cell
            key={variant ?? "default"}
            label={`tabs · ${variant ?? "preset default"}`}
          >
            <Tabs defaultSelectedKey="usage">
              <TabList variant={variant} aria-label="Sections">
                <Tab id="overview">Overview</Tab>
                <Tab id="usage">Usage</Tab>
                <Tab id="settings">Settings</Tab>
                <Tab id="billing" isDisabled>
                  Billing
                </Tab>
              </TabList>
            </Tabs>
          </Cell>
        ))}
        <Cell label="breadcrumbs">
          <Breadcrumbs>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Projects</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Design system</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumbs>
        </Cell>
        <Cell label="links in text">
          <p className="max-w-md text-sm text-fg-muted">
            Built on <Link href="#">React Aria Components</Link> and styled with{" "}
            <Link href="#">Tailwind CSS</Link>. Read the{" "}
            <Link href="#">getting started guide</Link> to learn more.
          </p>
        </Cell>
      </div>

      <Cell label="app shell · inset sidebar">
        <SidebarProvider className="h-[520px] min-h-0 w-full overflow-hidden rounded-(--studio-radius-container) border">
          <Sidebar variant="inset">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                  {NAV.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={item.isActive}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="flex h-12 items-center gap-2 border-b px-3">
              <SidebarTrigger />
              <span className="text-sm font-medium">Home</span>
              <Badge className="ml-auto" variant="accent">
                Beta
              </Badge>
            </header>
            <div className="grid flex-1 grid-cols-2 gap-3 p-3">
              <div className="rounded-(--studio-radius-card) bg-muted" />
              <div className="rounded-(--studio-radius-card) bg-muted" />
              <div className="col-span-2 rounded-(--studio-radius-card) bg-muted" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </Cell>
    </Sheet>
  )
}
