import {
  CalendarIcon,
  ChevronsUpDownIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
} from '@/registry/__generated__/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/registry/ui/sidebar'

const items = [
  { title: 'Dashboard', icon: HomeIcon, isActive: true },
  { title: 'Inbox', icon: InboxIcon, badge: '12' },
  { title: 'Calendar', icon: CalendarIcon },
  { title: 'Search', icon: SearchIcon },
  { title: 'Settings', icon: SettingsIcon },
]

export default function Demo() {
  return (
    <SidebarProvider className="h-[28rem] min-h-0 overflow-hidden rounded-lg border">
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Acme Inc">
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
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
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Mehdi">
                <Avatar className="size-8">
                  <AvatarImage
                    src="https://github.com/mehdibha.png"
                    alt="Mehdi"
                  />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium text-fg">Mehdi</span>
                  <span className="text-xs">m@example.com</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <div className="flex flex-1 flex-col gap-3 p-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-video rounded-lg bg-muted" />
            <div className="aspect-video rounded-lg bg-muted" />
            <div className="aspect-video rounded-lg bg-muted" />
          </div>
          <div className="flex-1 rounded-lg bg-muted" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
